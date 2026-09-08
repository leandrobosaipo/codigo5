import type { BotSession, Env } from "./types";
import { nowIso } from "./utils";

const defaultSession = (): BotSession => ({
  step: "idle",
  updatedAt: nowIso(),
});

export const getSession = async (env: Env, userId: string): Promise<BotSession> => {
  const raw = await env.BOT_SESSIONS.get(`session:${userId}`);
  if (!raw) return defaultSession();
  try {
    return JSON.parse(raw) as BotSession;
  } catch {
    return defaultSession();
  }
};

export const putSession = async (env: Env, userId: string, session: BotSession) => {
  await env.BOT_SESSIONS.put(
    `session:${userId}`,
    JSON.stringify({
      ...session,
      updatedAt: nowIso(),
    }),
    { expirationTtl: 60 * 60 * 24 * 7 },
  );
};
