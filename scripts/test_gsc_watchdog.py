import json
import os
import tempfile
import unittest
from pathlib import Path
import importlib.util
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('gsc_watchdog', Path(__file__).with_name('gsc-watchdog.py'))
watchdog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(watchdog)


class WatchdogTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / '.env').write_text(
            'COD5_GSC_CALLBACK_URL=https://codigo5.com.br/api/integrations/gsc/events\n'
            'COD5_GSC_CALLBACK_TOKEN=not-a-real-secret\n', encoding='utf-8')
        self.heartbeat(1000)

    def tearDown(self):
        self.temp.cleanup()

    def heartbeat(self, mtime):
        path = self.root / 'heartbeat'
        path.touch()
        os.utime(path, (mtime, mtime))

    def test_transition_retry_uses_stable_event_and_ack_drains_queue(self):
        calls = []
        def request(url, token, event):
            calls.append((url, token, dict(event)))
            return len(calls) == 2

        self.assertEqual(watchdog.run_once(self.root, 1000, request, lambda: True), 'healthy')
        self.heartbeat(800)
        self.assertEqual(watchdog.run_once(self.root, 1000, request, lambda: True), 'retry_pending')
        self.assertEqual(watchdog.run_once(self.root, 1001, request, lambda: True), 'delivered')
        self.assertEqual(calls[0][2]['eventId'], calls[1][2]['eventId'])
        self.assertEqual(calls[0][2]['status'], 'worker_down')
        self.assertNotIn('url', calls[0][2])
        self.assertNotEqual(calls[0][1], '')
        state = json.loads((self.root / 'watchdog-state.json').read_text())
        self.assertEqual(state['pending'], [])

    def test_retry_is_limited_to_three_attempts(self):
        calls = []
        def failed(*args):
            calls.append(args)
            return False
        self.heartbeat(800)
        results = [watchdog.run_once(self.root, 1000 + i, failed, lambda: True) for i in range(5)]
        self.assertEqual(results, ['retry_pending', 'retry_pending', 'retry_exhausted', 'retry_exhausted', 'worker_down'])
        self.assertEqual(len(calls), 3)

    def test_http_200_is_not_delivery_without_endpoint_json_ack(self):
        class Response:
            status = 200
            def __enter__(self): return self
            def __exit__(self, *_): pass
            def read(self): return b'{"ok":true,"state":"sending"}'
        with patch.object(watchdog.urllib.request, 'urlopen', return_value=Response()):
            self.assertFalse(watchdog.post_event(watchdog.CALLBACK, 'secret', {'eventId':'e','jobId':'j','status':'worker_down'}))

    def test_missing_docker_cli_uses_fresh_heartbeat_only(self):
        with patch.object(watchdog.subprocess, 'run', side_effect=FileNotFoundError):
            self.assertIsNone(watchdog.container_running())
        self.assertTrue(watchdog.is_healthy(None, 1000, 1001))
        self.assertFalse(watchdog.is_healthy(None, 800, 1001))


if __name__ == '__main__':
    unittest.main()
