import { validateTelegramInitData } from "./bot/init-data";
import { readAllowedUserIds } from "./bot/auth";
import { sendTelegramMessage } from "./bot/telegram";
import type { Env } from "./bot/types";

const SESSION_COOKIE = "codigo5_admin_session";
const LINK_PREFIX = "admin-link";
const SESSION_PREFIX = "admin-session";

const parseCookies = (request: Request) =>
  Object.fromEntries(
    (request.headers.get("cookie") ?? "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...value] = part.split("=");
        return [key, decodeURIComponent(value.join("="))];
      }),
  );

const buildCookie = (token: string, maxAge: number) =>
  `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

export const clearAdminCookie = () =>
  `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

const readAllowedAdminEmails = (env: Env) =>
  new Set(
    (env.ADMIN_ALLOWED_EMAILS ?? "leandro@codigo5.com.br")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );

const createToken = () =>
  `${crypto.randomUUID().replace(/-/g, "")}${Date.now().toString(36)}`;

export const getAdminSession = async (request: Request, env: Env) => {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return null;
  const raw = await env.BOT_SESSIONS.get(`${SESSION_PREFIX}:${token}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as {
      email: string;
      telegramUserId: string | null;
      source: "telegram" | "magic-link";
      createdAt: string;
    };
  } catch {
    return null;
  }
};

export const requireAdminSession = async (request: Request, env: Env) => {
  const session = await getAdminSession(request, env);
  if (!session) {
    return {
      ok: false as const,
      response: Response.json({ ok: false, error: "Sessão admin inválida." }, { status: 401 }),
    };
  }

  return {
    ok: true as const,
    session,
  };
};

export const createAdminSession = async (
  env: Env,
  payload: {
    email: string;
    telegramUserId: string | null;
    source: "telegram" | "magic-link";
  },
) => {
  const token = createToken();
  await env.BOT_SESSIONS.put(
    `${SESSION_PREFIX}:${token}`,
    JSON.stringify({
      ...payload,
      createdAt: new Date().toISOString(),
    }),
    { expirationTtl: 60 * 60 * 24 * 30 },
  );

  return token;
};

export const requestAdminMagicLink = async (env: Env, email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const allowedEmails = readAllowedAdminEmails(env);
  if (!allowedEmails.has(normalizedEmail)) {
    return { ok: false as const, error: "Email não autorizado para o painel." };
  }

  const telegramUserId = Array.from(readAllowedUserIds(env))[0];
  if (!telegramUserId) {
    return { ok: false as const, error: "Nenhum usuário do Telegram autorizado configurado." };
  }

  const token = createToken();
  await env.BOT_SESSIONS.put(
    `${LINK_PREFIX}:${token}`,
    JSON.stringify({
      email: normalizedEmail,
      telegramUserId,
      createdAt: new Date().toISOString(),
    }),
    { expirationTtl: 60 * 15 },
  );

  const url = `${env.ADMIN_PANEL_URL ?? "https://codigo5.com.br/admin/editorial"}?token=${encodeURIComponent(token)}`;
  const telegramResult = await sendTelegramMessage(env, Number(telegramUserId), {
    text: [
      "🔐 Link de acesso ao painel admin da Código5",
      "",
      `• Email: ${normalizedEmail}`,
      "",
      "Toque no botão abaixo para entrar.",
    ].join("\n"),
    reply_markup: {
      inline_keyboard: [[{ text: "🚪 Abrir painel admin", url }]],
    },
  });

  if (!telegramResult.ok) {
    return { ok: false as const, error: "Não consegui entregar o link pelo Telegram." };
  }

  return { ok: true as const };
};

export const consumeAdminMagicLink = async (env: Env, token: string) => {
  const raw = await env.BOT_SESSIONS.get(`${LINK_PREFIX}:${token}`);
  if (!raw) {
    return { ok: false as const, error: "Link expirado ou inválido." };
  }

  await env.BOT_SESSIONS.delete(`${LINK_PREFIX}:${token}`);

  try {
    return {
      ok: true as const,
      payload: JSON.parse(raw) as { email: string; telegramUserId: string | null },
    };
  } catch {
    return { ok: false as const, error: "Link inválido." };
  }
};

export const getAdminCookieHeader = (token: string) => buildCookie(token, 60 * 60 * 24 * 30);

export const createTelegramAdminSession = async (env: Env, initData: string) => {
  const validation = await validateTelegramInitData(initData, env);
  if (!validation.ok) {
    return { ok: false as const, error: validation.error, status: validation.status };
  }

  const userId = String(validation.user?.id ?? "");
  const allowedUsers = readAllowedUserIds(env);
  if (!allowedUsers.has(userId)) {
    return { ok: false as const, error: "Usuário do Telegram não autorizado.", status: 403 };
  }

  const email = Array.from(readAllowedAdminEmails(env))[0] ?? "leandro@codigo5.com.br";
  return {
    ok: true as const,
    email,
    telegramUserId: userId,
  };
};
