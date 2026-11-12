import { createRemoteJWKSet, jwtVerify } from "jose";
import { adminEmail, allowed, cookie, errorResponse, issueSession, origin, readCookie } from "./admin-auth";
import type { Env } from "./bot/types";

const keys = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const stateCookie = "__Host-codigo5_login";
const callback = origin + "/api/admin/auth/google/callback";
const ttl = 600;

export async function login(env: Env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !allowed(env, adminEmail))
    return errorResponse("Login indisponível.", 503);
  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();
  await env.BOT_SESSIONS.put("google-state:" + state, nonce, { expirationTtl: ttl });
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, redirect_uri: callback,
    response_type: "code", scope: "openid email", state, nonce, login_hint: adminEmail }).toString();
  return new Response(null, { status: 302, headers: { location: url.href, "set-cookie": cookie(stateCookie, state, ttl) } });
}

export async function finishLogin(request: Request, env: Env) {
  const params = new URL(request.url).searchParams;
  const state = params.get("state");
  if (!state || state !== readCookie(request, stateCookie)) return errorResponse("Login inválido ou expirado.", 400);
  // SQLite consumes the challenge atomically, including when two callbacks arrive together.
  const challenge = await env.BOT_DB.prepare("DELETE FROM runtime_kv WHERE key=? AND expires_at>unixepoch() RETURNING value")
    .bind("google-state:" + state).first<{ value: string }>();
  const code = params.get("code");
  if (!challenge || !code || !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET)
    return errorResponse("Inicie o login novamente.", 400);
  const exchange = await fetch("https://oauth2.googleapis.com/token", { method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: callback,
      client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET }), signal: AbortSignal.timeout(10000) });
  if (!exchange.ok) return errorResponse("O Google não confirmou o login.", 401);
  const { id_token } = await exchange.json() as { id_token?: string };
  if (!id_token) return errorResponse("Resposta de login inválida.", 401);
  let identity;
  try {
    const verified = await jwtVerify(id_token, keys, { algorithms: ["RS256"], audience: env.GOOGLE_CLIENT_ID,
      issuer: ["accounts.google.com", "https://accounts.google.com"], requiredClaims: ["exp", "iat", "sub", "nonce"] });
    identity = verified.payload;
  } catch { return errorResponse("Identidade Google inválida.", 401); }
  if (identity.nonce !== challenge.value || !identity.sub || identity.email_verified !== true ||
      (identity.azp !== undefined && identity.azp !== env.GOOGLE_CLIENT_ID) || !allowed(env, identity.email))
    return errorResponse("Esta conta não tem acesso ao editorial.", 403);
  const headers = new Headers({ location: origin + "/admin/editorial", "referrer-policy": "no-referrer" });
  headers.append("set-cookie", cookie(stateCookie, "", 0));
  headers.append("set-cookie", await issueSession(env, adminEmail, identity.sub));
  return new Response(null, { status: 303, headers });
}
