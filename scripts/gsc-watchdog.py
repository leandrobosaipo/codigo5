#!/usr/bin/env python3
"""External watchdog for the GSC worker; safe to run once per systemd timer tick."""

import fcntl
import json
import os
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path

ROOT = Path('/opt/cod5/codigo5-web/gsc')
ENV_FILE = ROOT / '.env'
HEARTBEAT = ROOT / 'heartbeat'
STATE_FILE = ROOT / 'watchdog-state.json'
LOCK_FILE = ROOT / 'watchdog.lock'
CONTAINER = 'codigo5-gsc-worker'
HEARTBEAT_MAX_AGE = 120
MAX_ATTEMPTS = 3
CALLBACK = 'https://codigo5.com.br/api/integrations/gsc/events'


def parse_env(path):
    values = {}
    for line in Path(path).read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
            value = value[1:-1]
        values[key.strip()] = value
    return values


def is_healthy(container_running, heartbeat_mtime, now=None):
    now = time.time() if now is None else now
    heartbeat_fresh = heartbeat_mtime is not None and 0 <= now - heartbeat_mtime < HEARTBEAT_MAX_AGE
    return bool(heartbeat_fresh and container_running is not False)


def load_state(path):
    try:
        state = json.loads(Path(path).read_text(encoding='utf-8'))
        if not isinstance(state, dict) or not isinstance(state.get('pending', []), list):
            raise ValueError('invalid watchdog state')
        return state
    except FileNotFoundError:
        return {'observed': None, 'pending': []}


def save_state(path, state):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd, temporary = tempfile.mkstemp(prefix='.watchdog-', dir=path.parent)
    try:
        os.fchmod(fd, 0o600)
        with os.fdopen(fd, 'w', encoding='utf-8') as output:
            json.dump(state, output, separators=(',', ':'))
            output.write('\n')
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, path)
    finally:
        try:
            os.unlink(temporary)
        except FileNotFoundError:
            pass


def record_observation(state, healthy):
    previous = state.get('observed')
    state['observed'] = healthy
    # Establish a quiet healthy baseline; report a failed first observation.
    if previous is None and healthy:
        return
    if previous is healthy:
        return
    status = 'recovered' if healthy else 'worker_down'
    state.setdefault('pending', []).append({
        'eventId': f"gsc-watchdog-{uuid.uuid4().hex}",
        'jobId': 'external-watchdog',
        'status': status,
        'attempts': 0,
    })


def post_event(url, token, event, timeout=10):
    payload = json.dumps({key: event[key] for key in ('eventId', 'jobId', 'status')}).encode('utf-8')
    request = urllib.request.Request(url, data=payload, method='POST', headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            if not 200 <= response.status < 300:
                return False
            ack = json.loads(response.read().decode('utf-8'))
            return isinstance(ack, dict) and ack.get('ok') is True and ack.get('state') == 'sent'
    except (urllib.error.URLError, TimeoutError, ValueError, OSError):
        return False


def container_running():
    try:
        result = subprocess.run(
            ['docker', 'inspect', '--format={{.State.Running}}', CONTAINER],
            capture_output=True, text=True, timeout=8, check=False,
        )
    except (FileNotFoundError, PermissionError, subprocess.TimeoutExpired):
        return None
    if result.returncode and any(message in result.stderr.lower() for message in (
        'cannot connect to the docker daemon', 'permission denied', 'docker.sock', 'is the docker daemon running',
    )):
        return None
    return result.returncode == 0 and result.stdout.strip() == 'true'


def run_once(root=ROOT, now=None, request=post_event, running_check=container_running):
    root = Path(root)
    env = parse_env(root / '.env')
    callback = env.get('COD5_GSC_CALLBACK_URL', CALLBACK)
    token = env.get('COD5_GSC_CALLBACK_TOKEN', '')
    if callback != CALLBACK or not token:
        raise ValueError('watchdog callback configuration invalid')
    with (root / 'watchdog.lock').open('a', encoding='utf-8') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        try:
            try:
                heartbeat_mtime = (root / 'heartbeat').stat().st_mtime
            except OSError:
                heartbeat_mtime = None
            healthy = is_healthy(running_check(), heartbeat_mtime, now)
            state_path = root / 'watchdog-state.json'
            state = load_state(state_path)
            record_observation(state, healthy)
            save_state(state_path, state)
            pending = state['pending']
            if not pending:
                return 'healthy' if healthy else 'worker_down'
            event = pending[0]
            if event['attempts'] >= MAX_ATTEMPTS:
                pending.pop(0)
                save_state(state_path, state)
                return 'retry_exhausted'
            event['attempts'] += 1
            save_state(state_path, state)
            delivered = request(callback, token, event)
            if delivered:
                pending.pop(0)
                save_state(state_path, state)
                return 'delivered'
            return 'retry_pending' if event['attempts'] < MAX_ATTEMPTS else 'retry_exhausted'
        finally:
            fcntl.flock(lock, fcntl.LOCK_UN)


if __name__ == '__main__':
    try:
        print(f'gsc-watchdog: {run_once()}')
    except BlockingIOError:
        print('gsc-watchdog: prior check still running')
    except Exception as error:
        # Exception messages from libraries can contain URLs or request details; log only class.
        print(f'gsc-watchdog: failed ({type(error).__name__})')
        raise SystemExit(1)
