import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, ".env.telegram.cod5");

const parseEnv = (raw) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .reduce((acc, line) => {
      const index = line.indexOf("=");
      if (index === -1) return acc;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      acc[key] = value;
      return acc;
    }, {});

const envFile = fs.existsSync(envPath) ? parseEnv(fs.readFileSync(envPath, "utf8")) : {};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || envFile.TELEGRAM_BOT_TOKEN;
const TELEGRAM_SECRET_TOKEN = process.env.TELEGRAM_SECRET_TOKEN || envFile.TELEGRAM_SECRET_TOKEN;
const TELEGRAM_ALLOWED_USER_IDS =
  process.env.TELEGRAM_ALLOWED_USER_IDS || envFile.TELEGRAM_ALLOWED_USER_IDS || "";
const MINI_APP_URL = process.env.TELEGRAM_MINI_APP_URL || "https://codigo5.com.br/telegram-mini-app";
const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL || "https://codigo5.com.br/api/telegram/webhook";

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_SECRET_TOKEN) {
  console.error("Preencha TELEGRAM_BOT_TOKEN e TELEGRAM_SECRET_TOKEN em .env.telegram.cod5 antes de rodar.");
  process.exit(1);
}

const api = async (method, payload) => {
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok || !json.ok) {
    throw new Error(`${method} falhou: ${JSON.stringify(json)}`);
  }
  return json;
};

const run = async () => {
  console.log("Configurando webhook...");
  await api("setWebhook", {
    url: WEBHOOK_URL,
    secret_token: TELEGRAM_SECRET_TOKEN,
    allowed_updates: ["message", "edited_message"],
  });

  console.log("Configurando comandos...");
  await api("setMyCommands", {
    commands: [
      { command: "start", description: "Abrir o bot editorial" },
      { command: "app", description: "Abrir o painel visual" },
      { command: "novo", description: "Criar um novo rascunho" },
      { command: "rascunhos", description: "Ver os últimos rascunhos" },
      { command: "status", description: "Ver o estado atual da sessão" },
      { command: "help", description: "Ver ajuda rápida" },
    ],
  });

  console.log("Configurando botão de menu...");
  await api("setChatMenuButton", {
    menu_button: {
      type: "web_app",
      text: "Abrir painel",
      web_app: {
        url: MINI_APP_URL,
      },
    },
  });

  console.log("Configurando descrição curta...");
  await api("setMyShortDescription", {
    short_description: "Bot editorial da Código5 para criar pautas, rascunhos e posts.",
  });

  console.log("");
  console.log("Tudo certo.");
  console.log(`Mini App: ${MINI_APP_URL}`);
  console.log(`Webhook: ${WEBHOOK_URL}`);
  console.log(`Usuários autorizados: ${TELEGRAM_ALLOWED_USER_IDS || "defina no Cloudflare/Pages"}`);
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
