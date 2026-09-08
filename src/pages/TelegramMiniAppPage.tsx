import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { useTelegramWebApp } from "@/hooks/use-telegram-webapp";
import { htmlToMarkdown } from "@/lib/contentMarkdown";

type DraftPreview = {
  id: string;
  status: "draft" | "approved" | "published" | "archived";
  title: string | null;
  excerpt?: string | null;
  slug: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  contentMarkdown?: string | null;
  contentHtml?: string | null;
  segment: string | null;
  serviceFocus: string | null;
  sourceValue: string;
  imageUrl?: string | null;
  imagePrompt?: string | null;
  readingMinutes?: number | null;
  updatedAt: string;
};

type DraftEditorState = {
  draftId: string;
  sourceValue: string;
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  contentMarkdown: string;
  contentHtml: string;
  segment: string;
  serviceFocus: string;
  imageUrl: string;
  redirectTo: string;
};

type ValidatedSession = {
  authorized: boolean;
  user: {
    id?: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  } | null;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));

const TelegramMiniAppPage = () => {
  const { isLoaded, isTelegram, user, webApp } = useTelegramWebApp();
  const [searchParams] = useSearchParams();
  const [source, setSource] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState(
    "Envie uma ideia ou cole um link para criar um rascunho.",
  );
  const [drafts, setDrafts] = useState<DraftPreview[]>([]);
  const [session, setSession] = useState<ValidatedSession | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [editor, setEditor] = useState<DraftEditorState | null>(null);

  const userId = useMemo(() => {
    return String(
      session?.user?.id ??
        user?.id ??
        searchParams.get("userId") ??
        "telegram-demo",
    );
  }, [searchParams, session?.user?.id, user?.id]);
  const firstName = session?.user?.first_name ?? user?.first_name ?? "editor";
  const initData = webApp?.initData ?? "";
  const withTelegramInitHeader = useCallback(
    (headers: Record<string, string> = {}) => {
      if (!initData) return headers;
      return {
        ...headers,
        "X-Telegram-Init-Data": initData,
      };
    },
    [initData],
  );

  const loadDrafts = useCallback(async () => {
    const response = await fetch(
      `/api/bot/drafts?userId=${encodeURIComponent(userId)}`,
      {
        headers: withTelegramInitHeader(),
      },
    );
    const payload = (await response.json()) as {
      ok: boolean;
      drafts?: DraftPreview[];
    };
    if (payload.ok) {
      setDrafts(payload.drafts ?? []);
    }
  }, [userId, withTelegramInitHeader]);

  useEffect(() => {
    const bootstrapSession = async () => {
      if (!isTelegram || !webApp?.initData) {
        setSessionReady(true);
        return;
      }

      try {
        const response = await fetch("/api/telegram/session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ initData: webApp.initData }),
        });
        const payload = (await response.json()) as {
          ok: boolean;
          authorized?: boolean;
          user?: ValidatedSession["user"];
        };

        if (response.ok && payload.ok) {
          setSession({
            authorized: Boolean(payload.authorized),
            user: payload.user ?? null,
          });
        } else {
          setStatusText(
            "Não consegui validar sua sessão do Telegram. O painel continua em modo de teste.",
          );
        }
      } catch {
        setStatusText(
          "Falha ao validar a sessão do Telegram. O painel continua em modo de teste.",
        );
      } finally {
        setSessionReady(true);
      }
    };

    void bootstrapSession();
  }, [isTelegram, webApp]);

  const submitDraft = useCallback(async () => {
    const trimmed = source.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setStatusText("Criando rascunho editorial...");
    webApp?.MainButton.showProgress();
    webApp?.MainButton.disable();

    try {
      const response = await fetch("/api/bot/drafts", {
        method: "POST",
        headers: withTelegramInitHeader({ "content-type": "application/json" }),
        body: JSON.stringify({ userId, source: trimmed }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        result?: { text: string };
      };
      if (!response.ok || !payload.ok) {
        throw new Error("Não consegui criar o rascunho.");
      }

      setStatusText(payload.result?.text ?? "Rascunho criado.");
      setSource("");
      await loadDrafts();
      webApp?.HapticFeedback?.notificationOccurred("success");
    } catch (error) {
      setStatusText(
        error instanceof Error ? error.message : "Erro ao criar rascunho.",
      );
      webApp?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setIsSubmitting(false);
      webApp?.MainButton.hideProgress();
      webApp?.MainButton.enable();
    }
  }, [loadDrafts, source, userId, webApp, withTelegramInitHeader]);

  const runDraftAction = async (
    draftId: string,
    action: "generate" | "publish" | "image" | "delete",
  ) => {
    setActiveDraftId(draftId);
    setStatusText(
      action === "generate"
        ? "Gerando preview editorial..."
        : action === "publish"
          ? "Publicando post no site..."
          : action === "image"
            ? "Gerando prompt de imagem..."
            : "Arquivando item e criando redirect...",
    );

    try {
      const endpoint =
        action === "generate"
          ? "/api/bot/generate"
          : action === "publish"
            ? "/api/bot/publish"
            : action === "image"
              ? "/api/bot/image-prompt"
              : "/api/bot/delete";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: withTelegramInitHeader({ "content-type": "application/json" }),
        body: JSON.stringify(
          action === "generate" || action === "image"
            ? { draftId, userId }
            : action === "publish"
              ? { draftId, userId }
              : { draftId, userId, redirectTo: "/blog" },
        ),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        url?: string;
        imagePrompt?: string;
        redirectFrom?: string | null;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Não consegui concluir a ação.");
      }

      setStatusText(
        action === "generate"
          ? "Preview pronto. Agora você já pode publicar esse post."
          : action === "publish"
            ? payload.url
              ? `Post publicado: ${payload.url}`
              : "Post publicado com sucesso."
            : action === "image"
              ? payload.imagePrompt
                ? `Prompt de imagem pronto:\n\n${payload.imagePrompt}`
                : "Prompt de imagem gerado."
              : payload.redirectFrom
                ? `Item arquivado. Redirect criado de ${payload.redirectFrom} para /blog`
                : "Item arquivado com sucesso.",
      );

      await loadDrafts();
      webApp?.HapticFeedback?.notificationOccurred("success");
    } catch (error) {
      setStatusText(
        error instanceof Error ? error.message : "Erro ao executar a ação.",
      );
      webApp?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setActiveDraftId(null);
    }
  };

  const openEditor = (draft: DraftPreview) => {
    setEditor({
      draftId: draft.id,
      sourceValue: draft.sourceValue,
      title: draft.title ?? "",
      slug: draft.slug ?? "",
      excerpt: draft.excerpt ?? "",
      seoTitle: draft.seoTitle ?? "",
      seoDescription: draft.seoDescription ?? "",
      contentMarkdown:
        draft.contentMarkdown ?? htmlToMarkdown(draft.contentHtml),
      contentHtml: draft.contentHtml ?? "",
      segment: draft.segment ?? "",
      serviceFocus: draft.serviceFocus ?? "",
      imageUrl: draft.imageUrl ?? "",
      redirectTo: "",
    });
    setStatusText(`Editor aberto para ${draft.title ?? draft.id}.`);
  };

  const updateEditor = (field: keyof DraftEditorState, value: string) => {
    setEditor((current) =>
      current ? { ...current, [field]: value } : current,
    );
  };

  const saveEditor = async () => {
    if (!editor) return;

    setActiveDraftId(editor.draftId);
    setStatusText("Salvando ajustes editoriais...");

    try {
      const response = await fetch("/api/bot/edit", {
        method: "POST",
        headers: withTelegramInitHeader({ "content-type": "application/json" }),
        body: JSON.stringify({ ...editor, userId }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        draft?: DraftPreview;
      };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Não consegui salvar os ajustes.");
      }

      setStatusText(
        "Ajustes salvos. Você já pode gerar preview de novo ou publicar.",
      );
      setEditor(null);
      await loadDrafts();
      webApp?.HapticFeedback?.notificationOccurred("success");
    } catch (error) {
      setStatusText(
        error instanceof Error ? error.message : "Erro ao salvar ajustes.",
      );
      webApp?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setActiveDraftId(null);
    }
  };

  const uploadEditorImage = async (file: File) => {
    if (!editor) return;

    setActiveDraftId(editor.draftId);
    setStatusText("Enviando capa para o Spaces...");

    try {
      const formData = new FormData();
      formData.append("draftId", editor.draftId);
      formData.append("userId", userId);
      formData.append("file", file);

      const response = await fetch("/api/bot/upload-image", {
        method: "POST",
        headers: withTelegramInitHeader(),
        body: formData,
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        imageUrl?: string;
      };
      if (!response.ok || !payload.ok || !payload.imageUrl) {
        throw new Error(payload.error ?? "Não consegui enviar a imagem.");
      }

      setEditor((current) =>
        current
          ? { ...current, imageUrl: payload.imageUrl ?? current.imageUrl }
          : current,
      );
      setStatusText(`Capa enviada com sucesso: ${payload.imageUrl}`);
      await loadDrafts();
      webApp?.HapticFeedback?.notificationOccurred("success");
    } catch (error) {
      setStatusText(
        error instanceof Error ? error.message : "Erro ao enviar imagem.",
      );
      webApp?.HapticFeedback?.notificationOccurred("error");
    } finally {
      setActiveDraftId(null);
    }
  };

  useEffect(() => {
    if (!sessionReady) return;
    void loadDrafts();
  }, [loadDrafts, sessionReady]);

  useEffect(() => {
    if (!webApp) return;

    const handler = () => {
      void submitDraft();
    };

    if (source.trim() && (session?.authorized ?? true)) {
      webApp.MainButton.setText("Criar rascunho");
      webApp.MainButton.show();
      webApp.MainButton.onClick(handler);
    } else {
      webApp.MainButton.hide();
    }

    return () => {
      webApp.MainButton.offClick(handler);
      webApp.MainButton.hide();
    };
  }, [session?.authorized, source, submitDraft, webApp]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await submitDraft();
  };

  return (
    <>
      <Seo
        title="Mini App Editorial da Código5"
        description="Painel interno do bot editorial da Código5 para criar pautas e rascunhos."
        path="/telegram-mini-app"
        robots="noindex,nofollow"
      />

      <main className="telegram-mini-app min-h-screen px-4 py-5 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-3xl flex-col gap-4">
          <section className="panel-dark overflow-hidden p-5 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-kicker text-white/70">Mini App</p>
                <h1 className="mt-3 text-3xl font-display font-bold leading-tight sm:text-4xl">
                  Painel editorial da Código5
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                  Um fluxo simples para transformar ideia ou link em rascunho
                  sem sair do Telegram.
                </p>
              </div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                {isTelegram ? "No Telegram" : "Modo web"}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <article className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                  Usuário
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {firstName}
                </p>
              </article>
              <article className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                  Identificador
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {userId}
                </p>
              </article>
              <article className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                  Sessão
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {session?.authorized
                    ? "autorizada"
                    : sessionReady
                      ? "teste/local"
                      : isLoaded
                        ? "validando"
                        : "carregando"}
                </p>
              </article>
            </div>
          </section>

          <section className="panel-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="section-kicker">Nova pauta</p>
                <h2 className="section-heading text-3xl sm:text-4xl">
                  Cole uma ideia ou um link
                </h2>
                <p className="section-lead max-w-2xl text-base leading-7">
                  O backend já identifica se a entrada é uma ideia livre ou uma
                  URL e sugere segmento, foco comercial e slug.
                </p>
              </div>
              <div className="telegram-status-badge">
                {session?.authorized
                  ? "Usuário validado"
                  : isTelegram
                    ? "Telegram pronto"
                    : "Teste direto no navegador"}
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <textarea
                className="telegram-textarea"
                placeholder="Ex.: Quero um post para clínicas com foco em SEO local ou cole aqui a URL de uma notícia"
                value={source}
                onChange={(event) => setSource(event.target.value)}
                disabled={Boolean(
                  isTelegram && sessionReady && !session?.authorized,
                )}
                rows={6}
              />

              <div className="flex flex-wrap gap-3">
                <button
                  className="telegram-primary-button"
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !source.trim() ||
                    Boolean(isTelegram && sessionReady && !session?.authorized)
                  }
                >
                  {isSubmitting ? "Criando..." : "Criar rascunho"}
                </button>
                <button
                  className="telegram-secondary-button"
                  type="button"
                  onClick={() => setSource("https://exemplo.com/noticia")}
                >
                  Testar com link
                </button>
              </div>
            </form>

            <div className="telegram-status-panel mt-5 whitespace-pre-line">
              {statusText}
            </div>
          </section>

          {editor ? (
            <section className="panel-soft p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="section-kicker">Edição visual</p>
                  <h2 className="section-heading text-3xl sm:text-4xl">
                    Ajuste antes de publicar
                  </h2>
                  <p className="section-lead max-w-2xl text-base leading-7">
                    Refine título, slug, resumo, SEO e capa sem sair da Mini
                    App.
                  </p>
                </div>
                <button
                  className="telegram-secondary-button"
                  type="button"
                  onClick={() => setEditor(null)}
                >
                  Fechar
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <label className="telegram-field">
                  <span className="telegram-field-label">Ideia base</span>
                  <textarea
                    className="telegram-input min-h-[120px]"
                    value={editor.sourceValue}
                    onChange={(event) =>
                      updateEditor("sourceValue", event.target.value)
                    }
                    rows={4}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="telegram-field">
                    <span className="telegram-field-label">Título</span>
                    <input
                      className="telegram-input"
                      value={editor.title}
                      onChange={(event) =>
                        updateEditor("title", event.target.value)
                      }
                    />
                  </label>
                  <label className="telegram-field">
                    <span className="telegram-field-label">Slug</span>
                    <input
                      className="telegram-input"
                      value={editor.slug}
                      onChange={(event) =>
                        updateEditor("slug", event.target.value)
                      }
                    />
                  </label>
                </div>

                <label className="telegram-field">
                  <span className="telegram-field-label">Resumo</span>
                  <textarea
                    className="telegram-input min-h-[96px]"
                    value={editor.excerpt}
                    onChange={(event) =>
                      updateEditor("excerpt", event.target.value)
                    }
                    rows={3}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="telegram-field">
                    <span className="telegram-field-label">SEO title</span>
                    <input
                      className="telegram-input"
                      value={editor.seoTitle}
                      onChange={(event) =>
                        updateEditor("seoTitle", event.target.value)
                      }
                    />
                  </label>
                  <label className="telegram-field">
                    <span className="telegram-field-label">
                      SEO description
                    </span>
                    <textarea
                      className="telegram-input min-h-[96px]"
                      value={editor.seoDescription}
                      onChange={(event) =>
                        updateEditor("seoDescription", event.target.value)
                      }
                      rows={3}
                    />
                  </label>
                </div>

                <label className="telegram-field">
                  <span className="telegram-field-label">
                    Conteúdo do post (Markdown)
                  </span>
                  <textarea
                    className="telegram-input min-h-[320px] font-mono text-xs leading-6"
                    value={editor.contentMarkdown}
                    onChange={(event) =>
                      updateEditor("contentMarkdown", event.target.value)
                    }
                    rows={12}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="telegram-field">
                    <span className="telegram-field-label">Segmento</span>
                    <input
                      className="telegram-input"
                      value={editor.segment}
                      onChange={(event) =>
                        updateEditor("segment", event.target.value)
                      }
                    />
                  </label>
                  <label className="telegram-field">
                    <span className="telegram-field-label">Foco principal</span>
                    <input
                      className="telegram-input"
                      value={editor.serviceFocus}
                      onChange={(event) =>
                        updateEditor("serviceFocus", event.target.value)
                      }
                    />
                  </label>
                  <label className="telegram-field">
                    <span className="telegram-field-label">URL da capa</span>
                    <input
                      className="telegram-input"
                      value={editor.imageUrl}
                      onChange={(event) =>
                        updateEditor("imageUrl", event.target.value)
                      }
                      placeholder="https://..."
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="telegram-field">
                    <span className="telegram-field-label">
                      Redirect da slug antiga
                    </span>
                    <input
                      className="telegram-input"
                      value={editor.redirectTo}
                      onChange={(event) =>
                        updateEditor("redirectTo", event.target.value)
                      }
                      placeholder="/blog/nova-slug"
                    />
                  </label>
                  <label className="telegram-field">
                    <span className="telegram-field-label">
                      Enviar capa na Mini App
                    </span>
                    <input
                      className="telegram-input file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const selected = event.target.files?.[0];
                        if (selected) {
                          void uploadEditorImage(selected);
                        }
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="telegram-primary-button"
                    type="button"
                    disabled={activeDraftId === editor.draftId}
                    onClick={() => void saveEditor()}
                  >
                    {activeDraftId === editor.draftId
                      ? "Salvando..."
                      : "Salvar ajustes"}
                  </button>
                  <button
                    className="telegram-secondary-button"
                    type="button"
                    disabled={activeDraftId === editor.draftId}
                    onClick={() =>
                      void runDraftAction(editor.draftId, "generate")
                    }
                  >
                    Regenerar preview
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
            <article className="panel-soft p-5">
              <p className="section-kicker">Rascunhos</p>
              <h2 className="section-heading text-3xl sm:text-4xl">
                Últimos itens
              </h2>
              <div className="mt-6 space-y-3">
                {drafts.length ? (
                  drafts.map((draft) => (
                    <div key={draft.id} className="telegram-draft-card">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="telegram-pill">
                              {draft.status}
                            </span>
                            <span className="telegram-pill">
                              {draft.segment ?? "Segmento livre"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-foreground">
                            {draft.title ?? draft.segment ?? "Segmento livre"}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {draft.serviceFocus ?? "Foco em definição"}
                          </p>
                        </div>
                        <span className="telegram-pill">
                          {formatDate(draft.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {draft.excerpt ?? draft.sourceValue}
                      </p>
                      {draft.slug ? (
                        <p className="mt-3 text-xs font-semibold text-primary">
                          /{draft.slug}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {draft.readingMinutes
                          ? `${draft.readingMinutes} min de leitura`
                          : "Preview ainda não gerado"}
                      </p>
                      {draft.imageUrl ? (
                        <div className="mt-4 overflow-hidden rounded-[20px] border border-border/70 bg-white/75">
                          <img
                            src={draft.imageUrl}
                            alt={draft.title ?? draft.id}
                            className="h-36 w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="telegram-secondary-button"
                          type="button"
                          onClick={() => openEditor(draft)}
                        >
                          Editar
                        </button>
                        <button
                          className="telegram-secondary-button"
                          type="button"
                          disabled={activeDraftId === draft.id}
                          onClick={() =>
                            void runDraftAction(draft.id, "generate")
                          }
                        >
                          {activeDraftId === draft.id
                            ? "Processando..."
                            : "Gerar preview"}
                        </button>
                        <button
                          className="telegram-primary-button"
                          type="button"
                          disabled={activeDraftId === draft.id || !draft.slug}
                          onClick={() =>
                            void runDraftAction(draft.id, "publish")
                          }
                        >
                          {activeDraftId === draft.id
                            ? "Processando..."
                            : "Publicar"}
                        </button>
                        <button
                          className="telegram-secondary-button"
                          type="button"
                          disabled={activeDraftId === draft.id}
                          onClick={() => void runDraftAction(draft.id, "image")}
                        >
                          {activeDraftId === draft.id
                            ? "Processando..."
                            : "Prompt de imagem"}
                        </button>
                        <button
                          className="telegram-secondary-button"
                          type="button"
                          disabled={activeDraftId === draft.id}
                          onClick={() =>
                            void runDraftAction(draft.id, "delete")
                          }
                        >
                          {activeDraftId === draft.id
                            ? "Processando..."
                            : "Arquivar"}
                        </button>
                        {draft.status === "published" && draft.slug ? (
                          <a
                            className="telegram-secondary-button"
                            href={`/blog/${draft.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ver post
                          </a>
                        ) : null}
                      </div>
                      {draft.imagePrompt ? (
                        <div className="mt-4 rounded-[18px] border border-border/70 bg-white/70 p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            Prompt de imagem
                          </p>
                          <p className="mt-2 text-xs leading-6 text-muted-foreground">
                            {draft.imagePrompt}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="telegram-empty-state">
                    Nenhum rascunho ainda para este usuário.
                  </div>
                )}
              </div>
            </article>

            <article className="panel-soft p-5">
              <p className="section-kicker">Como usar</p>
              <h2 className="section-heading text-3xl sm:text-4xl">
                Fluxo simples
              </h2>
              <div className="mt-6 space-y-3">
                <div className="telegram-step-card">
                  <strong>1.</strong> Abra o painel pelo bot
                </div>
                <div className="telegram-step-card">
                  <strong>2.</strong> Cole uma ideia ou URL
                </div>
                <div className="telegram-step-card">
                  <strong>3.</strong> Crie o rascunho com um toque
                </div>
                <div className="telegram-step-card">
                  <strong>4.</strong> Gere o preview do post
                </div>
                <div className="telegram-step-card">
                  <strong>5.</strong> Publique e abra no site
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>
    </>
  );
};

export default TelegramMiniAppPage;
