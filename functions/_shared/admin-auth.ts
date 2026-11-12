import type { Env } from "./bot/types";

export const adminEmail = "leandro@codigo5.com.br";
export const origin = "https://codigo5.com.br";
export const sessionCookie = "__Host-codigo5_editorial";
const sessionTtl = 30 * 24 * 3600;

export const cookie = (name: string, value: string, ttl: number) =>
  `${name}=${value}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${ttl}`;
export const readCookie = (request: Request, name: string) =>
  (request.headers.get("cookie") ?? "").split(";").map(part => part.trim())
    .find(part => part.startsWith(name + "="))?.slice(name.length + 1);
export const errorResponse = (message: string, status: number) =>
  Response.json({ ok: false, error: message }, { status, headers: { "cache-control": "no-store" } });

type Session = { email: string; sub: string; csrf: string; source: "google"; createdAt: string };
export const allowed = (env: Env, email: unknown) =>
  env.ADMIN_ALLOWED_EMAILS === adminEmail && typeof email === "string" && email.toLowerCase() === adminEmail;

export async function issueSession(env: Env, email: string, sub: string) {
  if (!allowed(env, email) || !sub) throw new Error("Unauthorized identity");
  const token = crypto.randomUUID();
  const session: Session = { email: adminEmail, sub, csrf: crypto.randomUUID(), source: "google", createdAt: new Date().toISOString() };
  await env.BOT_SESSIONS.put("google-session:" + token, JSON.stringify(session), { expirationTtl: sessionTtl });
  return cookie(sessionCookie, token, sessionTtl);
}
export async function getAdminSession(request: Request, env: Env): Promise<Session | null> {
  const token = readCookie(request, sessionCookie);
  if (!token) return null;
  const raw = await env.BOT_SESSIONS.get("google-session:" + token);
  if (!raw) return null;
  const session: Session = JSON.parse(raw);
  return session.source === "google" && allowed(env, session.email) && session.sub && session.csrf ? session : null;
}
export async function requireAdminSession(request: Request, env: Env) {
  const session = await getAdminSession(request, env);
  if (!session) return { ok: false as const, response: errorResponse("Sessão admin inválida.", 401) };
  if (!["GET", "HEAD"].includes(request.method) &&
      (request.headers.get("origin") !== origin || request.headers.get("x-csrf-token") !== session.csrf))
    return { ok: false as const, response: errorResponse("Origem ou token de segurança inválido.", 403) };
  return { ok: true as const, session };
}
