# Guia simples do Telegram da Código5

## O que você vai precisar

- Telegram instalado no celular
- conversar com o `@BotFather`
- copiar 3 valores:
  - token do bot
  - secret token
  - seu user id do Telegram

## Passo 1 — criar o bot

1. abra o Telegram
2. procure por `@BotFather`
3. toque em **Start**
4. envie:

```text
/newbot
```

5. dê um nome visível, por exemplo:

```text
Código5 Editorial
```

6. depois dê um username terminado em `bot`, por exemplo:

```text
codigo5_editorial_bot
```

7. o BotFather vai devolver um texto com o token

## Passo 2 — copiar o token

O token se parece com isso:

```text
1234567890:AAExampleTokenAqui
```

Cole esse valor em:

```text
/Users/leandrobosaipo/.openclaw/codigo5-github/.env.telegram.cod5
```

na linha:

```text
TELEGRAM_BOT_TOKEN=COLE_AQUI
```

## Passo 3 — criar o secret token

Você pode usar qualquer texto difícil de adivinhar. Exemplo:

```text
gere-um-secret-longo-e-unico
```

Cole em:

```text
TELEGRAM_SECRET_TOKEN=
```

## Passo 4 — descobrir seu user id

No Telegram, procure por um bot como:

```text
@userinfobot
```

ou

```text
@RawDataBot
```

Toque em **Start** e copie o seu número de usuário.

Cole em:

```text
TELEGRAM_ALLOWED_USER_IDS=SEU_ID_AQUI
```

Se quiser liberar mais de um usuário:

```text
TELEGRAM_ALLOWED_USER_IDS=12345,67890
```

## Passo 5 — salvar o arquivo

O arquivo final fica assim:

```text
TELEGRAM_BOT_TOKEN=
TELEGRAM_SECRET_TOKEN=
TELEGRAM_ALLOWED_USER_IDS=123456789
```

## Passo 6 — configurar o bot

No terminal, dentro do projeto:

```bash
cd /Users/leandrobosaipo/.openclaw/codigo5-github
node scripts/setup-telegram-bot.mjs
```

Esse script vai:

- ligar o webhook
- cadastrar os comandos
- configurar o botão da Mini App

## Passo 7 — subir as variáveis no Cloudflare

Se eu já estiver aqui com você, posso fazer isso.

Se quiser fazer manualmente, use estes comandos e cole os valores quando o terminal pedir:

```bash
cd /Users/leandrobosaipo/.openclaw/codigo5-github
npx wrangler pages secret put TELEGRAM_BOT_TOKEN --project-name codigo5-web
npx wrangler pages secret put TELEGRAM_SECRET_TOKEN --project-name codigo5-web
npx wrangler pages secret put TELEGRAM_ALLOWED_USER_IDS --project-name codigo5-web
```

## Passo 8 — testar

1. abra o seu bot no Telegram
2. toque em **Start**
3. envie:

```text
/app
```

4. toque em **Abrir painel**
5. dentro da Mini App, cole uma ideia ou URL
6. toque em **Criar rascunho**

## URLs prontas

- Mini App:
  - `https://codigo5.com.br/telegram-mini-app`
- Health:
  - `https://codigo5.com.br/api/telegram/health`
- Webhook:
  - `https://codigo5.com.br/api/telegram/webhook`
