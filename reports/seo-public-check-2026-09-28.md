# Relatório simples: teste das páginas recentes do blog

Data: 28/09/2026

## O que queríamos descobrir

Ver se as páginas públicas do blog dizem ao Google:

> “Pode entrar, ler e seguir os links.”

Isso significa `index, follow`.

## Como o teste funciona

O auditor lê o sitemap público e visita cada URL, uma por vez. Para cada página, ele confere:

- respondeu `200`;
- entregou HTML;
- não mandou `noindex` no cabeçalho HTTP;
- mandou `index` e `follow` no cabeçalho HTTP;
- contém `index,follow` na meta robots;
- canonical aponta para a própria URL;
- existe exatamente um H1;
- há conteúdo editorial suficiente.

## Resultado desta execução

O teste local do auditor passou. A auditoria pública parou na primeira URL:

```text
https://codigo5.com.br/: missing index header
```

Isso significa que o site público ainda não está entregando o novo cabeçalho `X-Robots-Tag: index, follow`. O HTML atual continua mostrando `index,follow`, mas a publicação do código que adiciona o cabeçalho ainda não foi comprovada no ambiente público.

## O que foi provado

- O auditor verifica o HTML original, não o HTML depois do JavaScript.
- Ele rejeita `noindex` no HTML ou no cabeçalho HTTP.
- Ele rejeita ausência de `index` ou `follow` no cabeçalho HTTP.
- Ele verifica canonical, H1, conteúdo e status HTTP.
- Os testes específicos do auditor passaram: 2/2.

## O que ainda não foi provado

- Todas as URLs públicas passaram no ambiente de produção.
- O cabeçalho novo já foi publicado no runtime `macmini-sqlite`.
- O Google já indexou as páginas.

## Próximo passo

Publicar o commit que contém a garantia `X-Robots-Tag: index, follow`. Depois repetir:

```bash
npm run check:public-seo -- https://codigo5.com.br/sitemap.xml
```

O resultado esperado é:

```text
OK: N URL(s) públicas passaram no teste.
Cada URL respondeu 200, tem index/follow, canonical próprio, H1 e conteúdo.
```

Só depois disso vale conferir as URLs na inspeção do Google Search Console. `index,follow` abre a porta; não prova que o Google já entrou.
