# Worker do Google Search Console

O worker usa uma fila SQLite compartilhada com o portal, um perfil Chromium persistente dedicado e notificações por callback. Nunca reutilize nem copie um perfil pessoal ou sessão do navegador.

## Configuração

- Banco editorial compartilhado: `/opt/cod5/codigo5-web/data/editorial.sqlite`.
- Configuração privada do worker: `/opt/cod5/codigo5-web/gsc/.env`.
- Perfil dedicado, lock e heartbeat: `/opt/cod5/codigo5-web/gsc/`.

Copie `deploy/gsc.env.example` para a configuração privada e substitua os placeholders. Cadastre as mesmas variáveis `COD5_GSC_*` no ambiente do stack 231 no Portainer, além de `COD5_GSC_IMAGE` com uma tag local imutável. O token de callback deve coincidir nos dois lugares. Configure `COD5_GSC_NOTIFY_TELEGRAM_USER_ID` com um destinatário já autorizado no bot. O arquivo `.env` no host atende ao login guiado e ao watchdog; o Portainer não lê caminhos absolutos do host como `env_file`. Nunca salve valores reais no Git.

Prepare o diretório persistente do perfil com UID `1000` por meio do setup autorizado de Docker/Portainer ou pelo administrador do host. O usuário SSH `codigo5` não tem `sudo` sem senha. Preserve o arquivo de ambiente com permissão `600`, `HOME=/gsc` para o Chromium em filesystem de leitura e `/data` compartilhado com o portal.

## Login e MFA

Pare o worker antes de abrir o perfil no Chromium. Execute o navegador de login em um container temporário com o mesmo volume `/gsc` e a mesma tag de imagem:

```sh
docker stop codigo5-gsc-worker
docker run --rm -it --env-file /opt/cod5/codigo5-web/gsc/.env -p 127.0.0.1:5909:5900 -v /opt/cod5/codigo5-web/gsc:/gsc codigo5-gsc-worker:TAG node /app/server/gsc-login.mjs
```

Do seu computador, abra o túnel SSH e conecte o visualizador VNC a `127.0.0.1:5909`:

```sh
ssh -N -L 5909:127.0.0.1:5909 codigo5@servidor
```

Conclua login/MFA na janela e encerre com `Ctrl+C`. O mapeamento VNC deve permanecer em loopback; não publique a porta na internet. Depois, reinicie o serviço pelo Portainer ou com `docker start codigo5-gsc-worker`.

## Operação

```sh
docker start codigo5-gsc-worker
docker stop codigo5-gsc-worker
docker restart codigo5-gsc-worker
```

Enfileire uma URL canônica de artigo já publicado e veja os estados recentes:

```sh
docker exec codigo5-gsc-worker node /app/server/gsc-worker.mjs enqueue https://codigo5.com.br/blog/slug-do-artigo
docker exec codigo5-gsc-worker node /app/server/gsc-worker.mjs status
docker exec codigo5-gsc-worker node -e 'const {DatabaseSync}=require("node:sqlite");const db=new DatabaseSync(process.env.COD5_DATABASE_FILE);console.log(db.prepare("SELECT state,count(*) AS total FROM gsc_events GROUP BY state").all());db.close()'
```

O callback precisa de autenticação e ACK. A página, sitemap e `robots.txt` passam por preflight. `delivery_unknown` indica que o pedido pode ter sido enviado sem confirmação: não tente novamente automaticamente; confira a URL no Search Console e faça a revisão manual. Claims interrompidos só são recuperados quando o worker inicia com o lock exclusivo.

## Deploy e rollback

No checkout do release no Mac Mini, construa a imagem com uma tag de commit única:

```sh
docker build -f Dockerfile.gsc-worker -t codigo5-gsc-worker:COMMIT .
```

No Portainer, atualize o stack `231` (`/data/compose/231`): defina as variáveis `COD5_GSC_*` e `COD5_GSC_IMAGE` e aplique com `PullImage: false`. Para rollback, restaure o arquivo do stack e o ambiente salvos antes da mudança e aplique novamente com `PullImage: false`. Preserve o banco e o perfil nos dois casos.

Uma segunda instância precisa de banco, perfil, portal e configuração próprios. Nunca copie credenciais, cookies ou perfil autenticado entre instâncias.
