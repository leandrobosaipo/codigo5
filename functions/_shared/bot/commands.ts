import type { BotResponse, DraftRecord, Env, TelegramMessage } from "./types";
import { archiveDraftAndPost, createDraft, getDraftById, getDraftByIdOrSlug, listRecentDrafts, publishDraftToPosts, updateDraftGeneratedContent, updateDraftImagePrompt, updateDraftImageUrl, updateDraftSource } from "./db";
import { generateDraftContent } from "./generator";
import { createImagePrompt } from "./image-prompt";
import { parseStructuredPrompt } from "./prompt-parser";
import { getSession, putSession } from "./session";
import { createId, inferSegment, inferServiceFocus, looksLikeUrl, nowIso, slugify, trimText } from "./utils";
import { downloadTelegramPhoto } from "./telegram-media";
import { buildSpacesKey, uploadImageToSpaces } from "./spaces";

const interactiveMenu = (env: Env): BotResponse["reply_markup"] => ({
  inline_keyboard: [
    ...(env.TELEGRAM_MINI_APP_URL
      ? [[{ text: "📲 Abrir painel", web_app: { url: env.TELEGRAM_MINI_APP_URL } }]]
      : []),
    [{ text: "✍️ Novo post", callback_data: "cmd_novo" }],
    [{ text: "📂 Rascunhos", callback_data: "cmd_rascunhos" }],
  ],
});

const draftSummary = (draft: DraftRecord) => [
  `📝 Rascunho criado`,
  "",
  `• ID: \`${draft.id}\``,
  `• Modo: ${draft.mode === "link" ? "link" : "ideia"}`,
  `• Segmento: ${draft.segment ?? "a definir"}`,
  `• Foco principal: ${draft.serviceFocus ?? "a definir"}`,
  draft.slug ? `• Slug sugerido: \`${draft.slug}\`` : null,
  "",
  "📌 Próximo passo:",
  `• \`/gerar ${draft.id}\``,
  `• \`/publicar ${draft.id}\` depois do preview`,
]
  .filter(Boolean)
  .join("\n");

const generatedSummary = (draft: DraftRecord) =>
  [
    "🧠 Preview gerado",
    "",
    `• ID: \`${draft.id}\``,
    draft.title ? `• Título: ${draft.title}` : null,
    draft.slug ? `• Slug: \`${draft.slug}\`` : null,
    draft.readingMinutes ? `• Leitura: ${draft.readingMinutes} min` : null,
    "",
    "➡️ Se estiver bom, publique com:",
    `• \`/publicar ${draft.id}\``,
  ]
    .filter(Boolean)
    .join("\n");

export const handleCommand = async (env: Env, message: TelegramMessage, userId: string): Promise<BotResponse> => {
  const text = (message.text ?? "").trim();

  if (text.startsWith("/start")) {
    await putSession(env, userId, { step: "idle", updatedAt: nowIso() });
    return {
      text: [
        "🤖 Código5 Bot Editorial ativo.",
        "",
        "Eu já consigo registrar pautas e rascunhos da operação editorial.",
        "",
        "Comandos disponíveis:",
        "• /novo",
        "• /gerar {draftId}",
        "• /publicar {draftId}",
        "• /imagem {draftId}",
        "• /excluir {draftId}",
        "• /rascunhos",
        "• /status",
        "• /help",
      ].join("\n"),
      reply_markup: interactiveMenu(env),
    };
  }

  if (text.startsWith("/help")) {
    return {
      text: [
        "📚 Como usar na fase 1",
        "",
        "• /novo para começar uma nova pauta",
        "• depois envie uma ideia ou um link",
        "• /gerar {draftId} para montar o preview",
        "• /publicar {draftId} para colocar o post no ar",
        "• /imagem {draftId} para gerar prompt de capa",
        "• envie uma foto com a legenda /capa {draftId}",
        "• /editar {draftId ou slug} | nova instrução",
        "• /excluir {draftId} para arquivar e redirecionar",
        "• /rascunhos para ver os últimos itens",
        "• /status para ver o estado atual da sessão",
      ].join("\n"),
      reply_markup: interactiveMenu(env),
    };
  }

  if (text.startsWith("/status")) {
    const session = await getSession(env, userId);
    return {
      text: [
        "📍 Estado atual",
        "",
        `• etapa: ${session.step}`,
        `• draft ativo: ${session.draftId ?? "nenhum"}`,
        `• atualizado em: ${session.updatedAt}`,
      ].join("\n"),
      reply_markup: interactiveMenu(env),
    };
  }

  if (text.startsWith("/rascunhos")) {
    const drafts = await listRecentDrafts(env, userId);
    if (!drafts.length) {
      return {
        text: "📭 Ainda não há rascunhos para este usuário.",
        reply_markup: interactiveMenu(env),
      };
    }

    return {
      text: [
        "📂 Últimos rascunhos",
        "",
        ...drafts.map(
          (draft) =>
            `• ${draft.id} — ${draft.status} — ${draft.title ?? draft.segment ?? "segmento livre"}`,
        ),
      ].join("\n"),
      reply_markup: interactiveMenu(env),
    };
  }

  if (text.startsWith("/gerar")) {
    const draftId = text.replace("/gerar", "").trim();
    if (!draftId) {
      return {
        text: "⚠️ Use /gerar {draftId}.",
        reply_markup: interactiveMenu(env),
      };
    }

    const draft = await getDraftById(env, draftId);
    if (!draft || draft.telegramUserId !== userId) {
      return {
        text: "⚠️ Não encontrei esse rascunho para o seu usuário.",
        reply_markup: interactiveMenu(env),
      };
    }

    const generated = await generateDraftContent(draft);
    const updated = await updateDraftGeneratedContent(env, draft.id, {
      title: generated.title,
      excerpt: generated.excerpt,
      slug: draft.slug || slugify(generated.title),
      seoTitle: generated.seoTitle,
      seoDescription: generated.seoDescription,
      contentMarkdown: generated.contentMarkdown,
      contentHtml: generated.contentHtml,
      categoriesJson: JSON.stringify(generated.categories),
      tagsJson: JSON.stringify(generated.tags),
      imageUrl: draft.imageUrl ?? generated.imageUrl,
      readingMinutes: generated.readingMinutes,
      updatedAt: nowIso(),
    });

    return {
      text: updated ? generatedSummary(updated) : "⚠️ Não consegui gerar o preview.",
      reply_markup: interactiveMenu(env),
    };
  }

  if (text.startsWith("/publicar")) {
    const draftId = text.replace("/publicar", "").trim();
    if (!draftId) {
      return {
        text: "⚠️ Use /publicar {draftId}.",
        reply_markup: interactiveMenu(env),
      };
    }

    const draft = await getDraftById(env, draftId);
    if (!draft || draft.telegramUserId !== userId) {
      return {
        text: "⚠️ Não encontrei esse rascunho para o seu usuário.",
        reply_markup: interactiveMenu(env),
      };
    }

    if (!draft.contentHtml || !draft.title || !draft.slug) {
      return {
        text: `⚠️ Esse rascunho ainda não tem preview. Rode primeiro /gerar ${draft.id}.`,
        reply_markup: interactiveMenu(env),
      };
    }

    const publishedAt = nowIso();
    await publishDraftToPosts(env, draft, userId, publishedAt);

    return {
      text: [
        "🚀 Post publicado",
        "",
        `• Título: ${draft.title}`,
        `• URL: https://codigo5.com.br/blog/${draft.slug}`,
      ].join("\n"),
      ...(draft.imageUrl ? { photo: draft.imageUrl } : {}),
      reply_markup: interactiveMenu(env),
    };
  }

  if (text.startsWith("/imagem")) {
    const draftId = text.replace("/imagem", "").trim();
    if (!draftId) {
      return {
        text: "⚠️ Use /imagem {draftId}.",
        reply_markup: interactiveMenu(env),
      };
    }

    const draft = await getDraftById(env, draftId);
    if (!draft || draft.telegramUserId !== userId) {
      return {
        text: "⚠️ Não encontrei esse rascunho para o seu usuário.",
        reply_markup: interactiveMenu(env),
      };
    }

    const imagePrompt = createImagePrompt(draft);
    await updateDraftImagePrompt(env, draft.id, imagePrompt, nowIso());

    return {
      text: ["🖼️ Prompt de imagem pronto", "", "```", imagePrompt, "```"].join("\n"),
      reply_markup: interactiveMenu(env),
    };
  }

  if (text.startsWith("/excluir")) {
    const draftId = text.replace("/excluir", "").trim();
    if (!draftId) {
      return {
        text: "⚠️ Use /excluir {draftId}.",
        reply_markup: interactiveMenu(env),
      };
    }

    const draft = await getDraftById(env, draftId);
    if (!draft || draft.telegramUserId !== userId) {
      return {
        text: "⚠️ Não encontrei esse item para o seu usuário.",
        reply_markup: interactiveMenu(env),
      };
    }

    await archiveDraftAndPost(env, draft, "/blog", userId, nowIso());

    return {
      text: [
        "🗑️ Item arquivado",
        "",
        draft.slug ? `• Redirect criado: /blog/${draft.slug} -> /blog` : "• Era apenas um rascunho",
      ].join("\n"),
      reply_markup: interactiveMenu(env),
    };
  }

  if (text.startsWith("/editar")) {
    const raw = text.replace("/editar", "").trim();
    if (!raw) {
      return {
        text: "⚠️ Use /editar {draftId ou slug} | nova instrução.",
        reply_markup: interactiveMenu(env),
      };
    }

    const [identifierPart, ...instructionParts] = raw.split("|");
    const identifier = identifierPart.trim();
    const instruction = instructionParts.join("|").trim();

    if (!identifier) {
      return {
        text: "⚠️ Informe o draftId ou slug que você quer editar.",
        reply_markup: interactiveMenu(env),
      };
    }

    if (!instruction) {
      await putSession(env, userId, {
        step: "awaiting_edit_instruction",
        editTarget: identifier,
        updatedAt: nowIso(),
      });

      return {
        text: [
          "✏️ Edição iniciada.",
          "",
          `Agora envie a nova instrução para \`${identifier}\`.`,
        ].join("\n"),
        reply_markup: interactiveMenu(env),
      };
    }

    return applyDraftEdit(env, userId, identifier, instruction);
  }

  if (text.startsWith("/novo")) {
    const inlineValue = text.replace("/novo", "").trim();
    if (inlineValue) {
      return createDraftFromSource(env, userId, inlineValue);
    }

    await putSession(env, userId, {
      step: "awaiting_new_post_input",
      updatedAt: nowIso(),
    });

    return {
      text: [
        "✍️ Envie agora uma ideia ou um link.",
        "",
        "Exemplos:",
        "• Quero um post para clínicas com foco em SEO local",
        "• https://exemplo.com/noticia",
      ].join("\n"),
      reply_markup: interactiveMenu(env),
    };
  }

  if (text.startsWith("/app")) {
    if (!env.TELEGRAM_MINI_APP_URL) {
      return {
        text: "⚠️ A Mini App ainda não está configurada no ambiente.",
        reply_markup: interactiveMenu(env),
      };
    }

    return {
      text: [
        "📲 Painel editorial pronto.",
        "",
        "Toque no botão abaixo para abrir a Mini App da Código5 dentro do Telegram.",
      ].join("\n"),
      reply_markup: {
        inline_keyboard: [[{ text: "🚀 Abrir Mini App", web_app: { url: env.TELEGRAM_MINI_APP_URL } }]],
      },
    };
  }

  return {
    text: "ℹ️ Comando não reconhecido. Use /help para ver o fluxo disponível.",
    reply_markup: interactiveMenu(env),
  };
};

export const handleFreeText = async (env: Env, message: TelegramMessage, userId: string): Promise<BotResponse> => {
  const text = (message.text ?? "").trim();
  const session = await getSession(env, userId);

  if (session.step === "awaiting_new_post_input") {
    return createDraftFromSource(env, userId, text);
  }

  if (session.step === "awaiting_edit_instruction" && session.editTarget) {
    return applyDraftEdit(env, userId, session.editTarget, text);
  }

  return {
    text: [
      "💬 Mensagem recebida.",
      "",
      "Na fase 1 eu só registro pauta e rascunho.",
      "Use /novo para começar um post novo.",
    ].join("\n"),
    reply_markup: interactiveMenu(env),
  };
};

export const handlePhotoMessage = async (
  env: Env,
  message: TelegramMessage,
  userId: string,
): Promise<BotResponse> => {
  const caption = (message.caption ?? "").trim();
  if (!caption.startsWith("/capa")) {
    return {
      text: "🖼️ Para usar a imagem como capa, envie a foto com a legenda `/capa draftId`.",
      reply_markup: interactiveMenu(env),
    };
  }

  const identifier = caption.replace("/capa", "").trim();
  if (!identifier) {
    return {
      text: "⚠️ Use a legenda `/capa draftId` na foto.",
      reply_markup: interactiveMenu(env),
    };
  }

  const draft = await getDraftByIdOrSlug(env, userId, identifier);
  if (!draft) {
    return {
      text: "⚠️ Não encontrei esse rascunho/post para associar a capa.",
      reply_markup: interactiveMenu(env),
    };
  }

  const photo = [...(message.photo ?? [])].sort((a, b) => (b.file_size ?? 0) - (a.file_size ?? 0))[0];
  if (!photo) {
    return {
      text: "⚠️ Não encontrei a foto no update do Telegram.",
      reply_markup: interactiveMenu(env),
    };
  }

  try {
    const downloaded = await downloadTelegramPhoto(env, photo.file_id);
    const imageKey = buildSpacesKey(
      env,
      `${draft.slug ?? draft.id}/${draft.slug ?? draft.id}-${Date.now()}.${downloaded.extension}`,
    );
    const imageUrl = await uploadImageToSpaces(env, imageKey, downloaded.body, downloaded.contentType);
    const updated = await updateDraftImageUrl(env, draft.id, imageUrl, nowIso());

    return {
      text: [
        "🖼️ Capa recebida e salva",
        "",
        `• Post: ${updated?.title ?? draft.title ?? draft.id}`,
        `• URL da imagem: ${imageUrl}`,
      ].join("\n"),
      reply_markup: interactiveMenu(env),
    };
  } catch (error) {
    return {
      text: error instanceof Error ? `⚠️ ${error.message}` : "⚠️ Falha ao salvar a imagem.",
      reply_markup: interactiveMenu(env),
    };
  }
};

const applyDraftEdit = async (
  env: Env,
  userId: string,
  identifier: string,
  instruction: string,
): Promise<BotResponse> => {
  const draft = await getDraftByIdOrSlug(env, userId, identifier);
  if (!draft) {
    return {
      text: "⚠️ Não encontrei esse rascunho/post para editar.",
      reply_markup: interactiveMenu(env),
    };
  }

  const parsed = parseStructuredPrompt(instruction);
  const seed = trimText(parsed?.title || instruction, 80);
  const updated = await updateDraftSource(env, draft.id, {
    sourceValue: instruction,
    title: trimText(parsed?.title || seed, 90),
    slug: draft.slug ?? parsed?.slug ?? slugify(seed),
    segment: parsed?.segment ?? inferSegment(instruction),
    serviceFocus: parsed?.serviceFocus ?? inferServiceFocus(instruction),
    updatedAt: nowIso(),
  });

  await putSession(env, userId, {
    step: "idle",
    draftId: updated?.id,
    updatedAt: nowIso(),
  });

  return {
    text: [
      "✏️ Base do post atualizada",
      "",
      `• ID: \`${updated?.id ?? draft.id}\``,
      `• Slug: \`${updated?.slug ?? draft.slug ?? "a definir"}\``,
      "",
      `➡️ Agora rode \`/gerar ${updated?.id ?? draft.id}\` e depois \`/publicar ${updated?.id ?? draft.id}\``,
    ].join("\n"),
    reply_markup: interactiveMenu(env),
  };
};

export const createDraftFromSource = async (env: Env, userId: string, sourceValue: string): Promise<BotResponse> => {
  const now = nowIso();
  const mode = looksLikeUrl(sourceValue) ? "link" : "idea";
  const parsed = parseStructuredPrompt(sourceValue);
  const segment = parsed?.segment ?? inferSegment(sourceValue);
  const serviceFocus = parsed?.serviceFocus ?? inferServiceFocus(sourceValue);
  const seed = trimText(parsed?.title || sourceValue, 80);
  const draft = await createDraft(env, {
    id: createId("draft"),
    telegramUserId: userId,
    mode,
    sourceType: mode,
    sourceValue,
    title: parsed?.title || (mode === "idea" ? trimText(seed, 90) : null),
    excerpt: parsed?.excerpt,
    slug: parsed?.slug || (mode === "idea" ? slugify(seed) : null),
    seoTitle: parsed?.seoTitle,
    seoDescription: parsed?.seoDescription,
    contentMarkdown: parsed?.contentMarkdown,
    contentHtml: parsed?.contentHtml,
    segment,
    serviceFocus,
    categoriesJson: parsed?.categoriesJson,
    tagsJson: parsed?.tagsJson,
    imageUrl: parsed?.imageUrl,
    imagePrompt: parsed?.imagePrompt,
    readingMinutes: parsed?.readingMinutes,
    notes: "Criado pelo bot na fase 1 do MVP.",
    createdAt: now,
    updatedAt: now,
  });

  await putSession(env, userId, {
    step: "idle",
    draftId: draft?.id,
    mode,
    updatedAt: now,
  });

  return {
    text: draft ? draftSummary(draft) : "⚠️ Não consegui criar o rascunho.",
    reply_markup: {
      inline_keyboard: [
        ...(env.TELEGRAM_MINI_APP_URL
          ? [[{ text: "📲 Abrir painel", web_app: { url: env.TELEGRAM_MINI_APP_URL } }]]
          : []),
        [{ text: "📂 Ver rascunhos", callback_data: "cmd_rascunhos" }],
        [{ text: "✍️ Novo post", callback_data: "cmd_novo" }],
      ],
    },
  };
};
