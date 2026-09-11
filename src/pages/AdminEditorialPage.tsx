import { FormEvent, useEffect, useMemo, useState } from "react";
import { ExternalLink, Sparkles, X } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { htmlToMarkdown } from "@/lib/contentMarkdown";
import { useNavigate, useSearchParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { blogPosts } from "@/content/blog";
import { useTelegramWebApp } from "@/hooks/use-telegram-webapp";

type AdminSession = {
  email: string;
  telegramUserId: string | null;
  source: "telegram" | "magic-link";
  createdAt: string;
};

type AdminItem = {
  id: string;
  status: "draft" | "approved" | "published" | "archived";
  title: string | null;
  excerpt?: string | null;
  slug: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  contentMarkdown?: string | null;
  contentHtml?: string | null;
  categoriesJson?: string | null;
  segment: string | null;
  serviceFocus: string | null;
  sourceValue: string;
  imageUrl?: string | null;
  updatedAt: string;
  tagsJson?: string | null;
};

type EditorState = {
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

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));

const parseCategoryName = (value?: string | null) => {
  if (!value) return "Sem categoria";
  try {
    const parsed = JSON.parse(value) as Array<{ name?: string; slug?: string }>;
    return parsed.find((item) => item.slug !== "blog")?.name ?? parsed[0]?.name ?? "Sem categoria";
  } catch {
    return "Sem categoria";
  }
};

const statusLabel = (status: AdminItem["status"]) =>
  status === "draft"
    ? "Rascunho"
    : status === "published"
      ? "Publicado"
      : status === "archived"
        ? "Arquivado"
        : "Aprovado";

const AdminEditorialPage = () => {
  const { isTelegram, webApp } = useTelegramWebApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [email, setEmail] = useState("leandro@codigo5.com.br");
  const [newSource, setNewSource] = useState("");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [statusText, setStatusText] = useState("Entre no painel para criar, editar e publicar posts.");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const currentToken = searchParams.get("token");

  const loadSession = async () => {
    const response = await fetch("/api/admin/auth/session");
    const payload = (await response.json()) as {
      ok: boolean;
      authenticated?: boolean;
      session?: AdminSession;
    };
    if (payload.ok && payload.authenticated && payload.session) {
      setSession(payload.session);
    } else {
      setSession(null);
    }
  };

  const loadItems = async () => {
    const response = await fetch("/api/admin/posts");
    if (!response.ok) {
      setStatusText("Não foi possível carregar os posts do banco. Os artigos do acervo continuam listados; tente novamente mais tarde.");
      return;
    }
    const payload = (await response.json()) as { ok: boolean; items?: AdminItem[] };
    if (payload.ok) {
      setItems(payload.items ?? []);
    }
  };

  const staticPublishedItems = useMemo<AdminItem[]>(
    () =>
      blogPosts.map((post) => ({
        id: `static:${post.slug}`,
        status: "published",
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        contentHtml: post.contentHtml,
        categoriesJson: JSON.stringify(post.categories),
        tagsJson: JSON.stringify(post.tags),
        segment: null,
        serviceFocus: null,
        sourceValue: post.excerpt || post.title,
        imageUrl: post.image,
        updatedAt: post.modified || post.date,
      })),
    [],
  );

  const mergedItems = useMemo(() => {
    const map = new Map<string, AdminItem>();

    staticPublishedItems.forEach((item) => {
      map.set(item.slug || item.id, item);
    });

    items.forEach((item) => {
      map.set(item.slug || item.id, item);
    });

    return [...map.values()].sort(
      (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    );
  }, [items, staticPublishedItems]);

  useEffect(() => {
    void loadSession();
  }, []);

  useEffect(() => {
    if (!session) return;
    void loadItems();
  }, [session]);

  useEffect(() => {
    if (!editor) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditor(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [editor]);

  useEffect(() => {
    if (!currentToken) return;

    const consume = async () => {
      setStatusText("Validando o link de acesso...");
      const response = await fetch("/api/admin/auth/consume", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: currentToken }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        setStatusText(payload.error ?? "Não consegui validar o link.");
        return;
      }

      setStatusText("Acesso confirmado. Carregando o painel...");
      await loadSession();
      searchParams.delete("token");
      setSearchParams(searchParams, { replace: true });
      navigate(`/admin/editorial${searchParams.toString() ? `?${searchParams}` : ""}`, { replace: true });
    };

    void consume();
  }, [currentToken, navigate, searchParams, setSearchParams]);

  const openEditor = (item: AdminItem) => {
    setEditor({
      draftId: item.id,
      sourceValue: item.sourceValue,
      title: item.title ?? "",
      slug: item.slug ?? "",
      excerpt: item.excerpt ?? "",
      seoTitle: item.seoTitle ?? "",
      seoDescription: item.seoDescription ?? "",
      contentMarkdown: item.contentMarkdown ?? htmlToMarkdown(item.contentHtml),
      contentHtml: item.contentHtml ?? "",
      segment: item.segment ?? "",
      serviceFocus: item.serviceFocus ?? "",
      imageUrl: item.imageUrl ?? "",
      redirectTo: "",
    });
    setStatusText(`Editor aberto para ${item.title ?? item.id}.`);
  };

  useEffect(() => {
    if (!session || !items.length) return;
    const requestedDraft = searchParams.get("draft");
    if (!requestedDraft) return;
    const item = items.find((item) => item.id === requestedDraft);
    if (!item) { setStatusText("A matéria deste link não foi encontrada. Confira a lista de rascunhos."); return; }
    openEditor(item);
    // Consume only the selection; closing the editor must not immediately reopen it.
    searchParams.delete("draft");
    setSearchParams(searchParams, { replace: true });
  }, [session, items, searchParams, setSearchParams]);

  const importStaticItem = async (item: AdminItem) => {
    const response = await fetch("/api/admin/posts-import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sourceValue: item.sourceValue,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        contentMarkdown: item.contentMarkdown,
        contentHtml: item.contentHtml,
        categoriesJson: item.categoriesJson,
        tagsJson: item.tagsJson,
        imageUrl: item.imageUrl,
        updatedAt: item.updatedAt,
      }),
    });
    const payload = (await response.json()) as { ok: boolean; error?: string; item?: AdminItem };
    if (!response.ok || !payload.ok || !payload.item) {
      throw new Error(payload.error ?? "Não consegui importar o post publicado.");
    }
    await loadItems();
    openEditor(payload.item);
    setStatusText("Post publicado importado para edição no painel.");
  };

  const handleOpenItem = async (item: AdminItem) => {
    if (item.id.startsWith("static:")) {
      await run("Importando post publicado para edição...", async () => {
        await importStaticItem(item);
      }).catch((error) => setStatusText(error instanceof Error ? error.message : "Falha ao abrir post publicado."));
      return;
    }

    openEditor(item);
  };

  const updateEditor = (field: keyof EditorState, value: string) => {
    setEditor((current) => (current ? { ...current, [field]: value } : current));
  };

  const run = async (label: string, task: () => Promise<void>) => {
    setBusy(true);
    setStatusText(label);
    try {
      await task();
    } finally {
      setBusy(false);
    }
  };

  const requestMagicLink = async (event: FormEvent) => {
    event.preventDefault();
    await run("Enviando link de acesso no Telegram...", async () => {
      const response = await fetch("/api/admin/auth/request-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string; message?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Não consegui enviar o link.");
      }
      setStatusText(payload.message ?? "Link enviado.");
    }).catch((error) => setStatusText(error instanceof Error ? error.message : "Falha ao enviar link."));
  };

  const loginWithTelegram = async () => {
    if (!webApp?.initData) {
      setStatusText("Abra o painel dentro do Telegram para usar esse login.");
      return;
    }

    await run("Validando sessão do Telegram...", async () => {
      const response = await fetch("/api/admin/auth/telegram", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ initData: webApp.initData }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Não consegui validar o Telegram.");
      }
      await loadSession();
      await loadItems();
      setStatusText("Acesso admin liberado pelo Telegram.");
    }).catch((error) => setStatusText(error instanceof Error ? error.message : "Falha no login."));
  };

  const createItem = async () => {
    if (!newSource.trim()) return;
    await run("Criando novo rascunho...", async () => {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source: newSource }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string; item?: AdminItem };
      if (!response.ok || !payload.ok || !payload.item) {
        throw new Error(payload.error ?? "Não consegui criar o rascunho.");
      }
      setNewSource("");
      await loadItems();
      openEditor(payload.item);
      setStatusText("Rascunho criado no painel.");
    }).catch((error) => setStatusText(error instanceof Error ? error.message : "Falha ao criar rascunho."));
  };

  const persistEditor = async (value: EditorState) => {
    const response = await fetch("/api/admin/posts-save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    const payload = (await response.json()) as { ok: boolean; error?: string; item?: AdminItem };
    if (!response.ok || !payload.ok || !payload.item) {
      throw new Error(payload.error ?? "Não foi possível salvar. Seu texto continua no editor; tente novamente.");
    }
    return payload.item;
  };

  const saveEditor = async () => {
    if (!editor) return;
    await run("Salvando o post...", async () => {
      await persistEditor(editor);
      await loadItems();
      setStatusText("Alterações salvas. Você pode continuar escrevendo.");
    }).catch((error) => setStatusText(error instanceof Error ? error.message : "Falha ao salvar."));
  };

  const generateItem = async () => {
    if (!editor) return;
    await run("Salvando a ideia e preparando o texto...", async () => {
      await persistEditor(editor);
      const response = await fetch("/api/admin/posts-generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ draftId: editor.draftId }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string; item?: AdminItem };
      if (!response.ok || !payload.ok || !payload.item) {
        throw new Error(payload.error ?? "Não consegui gerar o preview.");
      }
      await loadItems();
      openEditor(payload.item);
      setStatusText("Preview regenerado.");
    }).catch((error) => setStatusText(error instanceof Error ? error.message : "Falha ao gerar."));
  };

  const publishItem = async () => {
    if (!editor) return;
    await run("Salvando e publicando o post...", async () => {
      await persistEditor(editor);
      const response = await fetch("/api/admin/posts-publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ draftId: editor.draftId }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string; url?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Não consegui publicar.");
      }
      await loadItems();
      setStatusText(payload.url ? `Post publicado: ${payload.url}` : "Post publicado.");
    }).catch((error) => setStatusText(error instanceof Error ? error.message : "Falha ao publicar."));
  };

  const deleteItem = async (draftId: string) => {
    await run("Arquivando o item...", async () => {
      const response = await fetch("/api/admin/posts-delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ draftId, redirectTo: "/blog" }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Não consegui arquivar.");
      }
      if (editor?.draftId === draftId) {
        setEditor(null);
      }
      await loadItems();
      setStatusText("Item arquivado.");
    }).catch((error) => setStatusText(error instanceof Error ? error.message : "Falha ao arquivar."));
  };

  const uploadImage = async (file: File) => {
    if (!editor) return;
    await run("Salvando o texto e enviando a capa...", async () => {
      await persistEditor(editor);
      const formData = new FormData();
      formData.append("draftId", editor.draftId);
      formData.append("file", file);

      const response = await fetch("/api/admin/posts-upload-image", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as { ok: boolean; error?: string; imageUrl?: string; item?: AdminItem };
      if (!response.ok || !payload.ok || !payload.item) {
        throw new Error(payload.error ?? "Não consegui enviar a imagem.");
      }
      await loadItems();
      openEditor(payload.item);
      setStatusText(payload.imageUrl ? `Capa enviada: ${payload.imageUrl}` : "Capa enviada.");
    }).catch((error) => setStatusText(error instanceof Error ? error.message : "Falha ao enviar capa."));
  };

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setSession(null);
    setEditor(null);
    setItems([]);
    setStatusText("Sessão encerrada.");
  };

  const grouped = useMemo(() => {
    const drafts = mergedItems.filter((item) => item.status !== "published");
    const published = mergedItems.filter((item) => item.status === "published");
    return { drafts, published };
  }, [mergedItems]);

  const filteredItems = useMemo(() => {
    return mergedItems.filter((item) => {
      const statusMatch = filter === "all" ? true : item.status === filter;
      const needle = query.trim().toLowerCase();
      const searchMatch = !needle
        ? true
        : [item.title, item.slug, item.segment, item.serviceFocus, parseCategoryName(item.categoriesJson)]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(needle));
      return statusMatch && searchMatch;
    });
  }, [filter, mergedItems, query]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);
  const selectedItem = editor ? mergedItems.find((item) => item.id === editor.draftId) ?? null : null;

  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  return (
    <>
      <Seo
        title="Admin Editorial da Código5"
        description="Painel administrativo para criar, editar, publicar e arquivar posts da Código5."
        path="/admin/editorial"
        robots="noindex,nofollow"
      />

      <main className="admin-editorial min-h-screen px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <section className="admin-hero">
            <div>
              <p className="admin-kicker">Blog da Código5</p>
              <h1 className="admin-title">Escreva, revise e publique.</h1>
              <p className="admin-subtitle">
                Atualize os artigos do site por aqui. Título, texto e imagem, sem precisar mexer no código.
              </p>
            </div>
            <div className="admin-hero-chip">
              {session ? `Sessão ativa · ${session.email}` : "Acesso protegido"}
            </div>
          </section>

          {!editor && <div className="admin-panel admin-status-panel" role="status">{statusText}</div>}
          {!session ? (
            <section className="admin-auth-grid">
              <article className="admin-panel admin-auth-card">
                <p className="admin-kicker">Acesso pelo Telegram</p>
                <h2 className="admin-section-title">Receber meu link de acesso</h2>
                <p className="admin-section-copy">
                  Informe o email autorizado e eu entrego o acesso diretamente no seu Telegram.
                </p>
                <form className="mt-6 space-y-4" onSubmit={requestMagicLink}>
                  <input
                    className="admin-input"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="leandro@codigo5.com.br"
                  />
                  <button className="admin-primary-button" type="submit" disabled={busy}>
                    {busy ? "Enviando..." : "Enviar link no Telegram"}
                  </button>
                </form>
              </article>

              <article className="admin-panel admin-auth-card admin-auth-dark">
                <p className="admin-kicker text-white/70">Já está no Telegram?</p>
                <h2 className="admin-section-title text-white">Entrar de dentro do Telegram</h2>
                <p className="admin-section-copy text-white/72">
                  Se você abrir este painel pelo próprio Telegram, dá para autenticar com um toque.
                </p>
                <button className="admin-secondary-button mt-6" type="button" onClick={loginWithTelegram} disabled={!isTelegram || busy}>
                  {isTelegram ? "Entrar com a sessão do Telegram" : "Abra dentro do Telegram"}
                </button>
              </article>
            </section>
          ) : (
            <section className="admin-shell">
              <aside className="admin-sidebar">
                <div className="admin-panel">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="admin-kicker">Sessão</p>
                      <h2 className="admin-section-title">Operação ativa</h2>
                    </div>
                    <button className="admin-ghost-button" type="button" onClick={logout}>
                      Sair
                    </button>
                  </div>
                  <div className="admin-metric-grid mt-6">
                    <div className="admin-metric">
                      <span>Rascunhos</span>
                      <strong>{grouped.drafts.length}</strong>
                    </div>
                    <div className="admin-metric">
                      <span>Publicados</span>
                      <strong>{grouped.published.length}</strong>
                    </div>
                  </div>
                  <p className="admin-section-copy mt-5">
                    {session.source === "telegram"
                      ? "Acesso liberado pela sessão do Telegram."
                      : "Acesso liberado por link mágico enviado no Telegram."}
                  </p>
                </div>

                <div className="admin-panel">
                  <p className="admin-kicker">Novo post</p>
                  <h2 className="admin-section-title">Criar pauta</h2>
                  <textarea
                    className="admin-textarea"
                    value={newSource}
                    onChange={(event) => setNewSource(event.target.value)}
                    placeholder="Cole uma ideia, briefing ou link para criar um rascunho"
                    rows={5}
                  />
                  <button className="admin-primary-button mt-4" type="button" disabled={busy || !newSource.trim()} onClick={createItem}>
                    Criar rascunho
                  </button>
                </div>

                <div className="admin-panel">
                  <p className="admin-kicker">Fila editorial</p>
                  <h2 className="admin-section-title">Acesso rápido</h2>
                  <p className="admin-section-copy">
                    Atalhos para continuar de onde parou sem procurar na tabela.
                  </p>
                  <div className="admin-list mt-5">
                    {mergedItems.slice(0, 6).map((item) => (
                      <button
                        key={item.id}
                        className={
                          editor?.draftId === item.id
                            ? "admin-list-item admin-list-item-active"
                            : "admin-list-item"
                        }
                        type="button"
                        onClick={() => void handleOpenItem(item)}
                      >
                        <span className="admin-list-meta">{item.status}</span>
                        <strong>{item.title ?? item.slug ?? item.id}</strong>
                        <small>{formatDate(item.updatedAt)}</small>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-panel admin-panel-dark">
                  <p className="admin-kicker text-white/70">Pipeline</p>
                  <h2 className="admin-section-title text-white">Fluxo editorial</h2>
                  <div className="mt-5 grid gap-3">
                    {[
                      "Criar pauta ou importar post publicado.",
                      "Refinar texto, SEO, capa e estrutura do conteúdo.",
                      "Preparar texto com IA, publicar e manter o acervo vivo.",
                    ].map((item, index) => (
                      <div key={item} className="admin-dark-step">
                        <span>0{index + 1}</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <section className="admin-main">

                <div className="admin-glance-grid">
                  <div className="admin-panel">
                    <p className="admin-kicker">Visao geral</p>
                    <h2 className="admin-section-title">Radar editorial</h2>
                    <div className="admin-metric-grid mt-6">
                      <div className="admin-metric">
                        <span>Filtrados</span>
                        <strong>{filteredItems.length}</strong>
                      </div>
                      <div className="admin-metric">
                        <span>Pagina atual</span>
                        <strong>{page}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel admin-panel-dark">
                    <p className="admin-kicker text-white/70">C5</p>
                    <h2 className="admin-section-title text-white">Admin alinhado à nova identidade</h2>
                    <p className="admin-section-copy text-white/72">
                      Menos cara de CMS genérico, mais sensação de cockpit editorial conectado com a camada pública.
                    </p>
                  </div>
                </div>

                <div className="admin-panel">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="admin-kicker">Tabela editorial</p>
                        <h2 className="admin-section-title">Publicados e rascunhos</h2>
                        <p className="admin-section-copy">Encontre um artigo pelo título ou filtre os rascunhos e publicados.</p>
                      </div>
                    <div className="admin-toolbar">
                      <input
                        className="admin-input admin-search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar por título, slug, categoria..."
                      />
                      <div className="admin-filter-group">
                        {(["all", "draft", "published", "archived"] as const).map((status) => (
                          <button
                            key={status}
                            className={filter === status ? "admin-filter-button is-active" : "admin-filter-button"}
                            type="button"
                            onClick={() => setFilter(status)}
                          >
                            {status === "all" ? "Todos" : status === "draft" ? "Rascunhos" : status === "published" ? "Publicadas" : "Arquivadas"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="admin-table-wrap mt-6" role="region" aria-label="Tabela editorial" tabIndex={0}>
                    <table className="admin-table">
                      <caption className="sr-only">
                        Lista de posts publicados, rascunhos e arquivados com categoria, data e status.
                      </caption>
                      <thead>
                        <tr>
                          <th>Capa</th>
                          <th>Título</th>
                          <th>Categoria</th>
                          <th>Data</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedItems.map((item) => (
                          <tr
                            key={item.id}
                            className={editor?.draftId === item.id ? "admin-table-row is-selected" : "admin-table-row"}
                          >
                            <td>
                              <button className="admin-thumb" type="button" onClick={() => void handleOpenItem(item)}>
                                {item.imageUrl ? <img src={item.imageUrl} alt={item.title ?? item.id} /> : <span>Sem capa</span>}
                              </button>
                            </td>
                            <td>
                              <strong>{item.title ?? item.slug ?? item.id}</strong>
                              <small>{item.slug ? `/${item.slug}` : item.segment ?? "Sem slug"}</small>
                            </td>
                            <td>{parseCategoryName(item.categoriesJson)}</td>
                            <td>{formatDate(item.updatedAt)}</td>
                            <td><span className={`admin-status-pill status-${item.status}`}>{statusLabel(item.status)}</span></td>
                            <td>
                              <div className="flex flex-wrap gap-2">
                                <button className="admin-ghost-button" type="button" onClick={() => void handleOpenItem(item)}>
                                  {item.id.startsWith("static:") ? "Importar" : "Abrir"}
                                </button>
                                {item.slug ? <a className="admin-ghost-button" href={`/blog/${item.slug}`} target="_blank" rel="noreferrer">Ver</a> : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-pagination mt-5">
                    <span>Página {page} de {pageCount}</span>
                    <div className="flex gap-2">
                      <button className="admin-ghost-button" type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Anterior</button>
                      <button className="admin-ghost-button" type="button" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Próxima</button>
                    </div>
                  </div>
                </div>

                {!editor ? (
                  <div className="admin-panel admin-empty-panel">
                    <p className="admin-kicker">Seleção</p>
                    <h2 className="admin-section-title">Abra um item para editar</h2>
                    <p className="admin-section-copy">
                      Escolha uma publicação ou rascunho na tabela para abrir o editor em painel lateral.
                    </p>
                  </div>
                ) : null}
              </section>
            </section>
          )}
        </div>
      </main>

      {editor ? (
        <div className="admin-drawer-shell">
          <button className="admin-drawer-backdrop" type="button" aria-label="Fechar editor" onClick={() => setEditor(null)} />
          <aside className="admin-drawer" role="dialog" aria-modal="true" aria-label="Editor de post">
            <div className="admin-drawer-header">
              <div className="admin-drawer-hero">
                <div>
                  <p className="admin-kicker">Editor de post</p>
                  <h2 className="admin-section-title">Escrever e publicar</h2>
                  <p className="admin-section-copy">
                    Um editor mais direto para escrever, revisar e publicar sem se perder na grade.
                  </p>
                </div>
                <div className="admin-drawer-meta">
                  <span className={`admin-status-pill status-${selectedItem?.status ?? "draft"}`}>
                    {statusLabel(selectedItem?.status ?? "draft")}
                  </span>
                  <div className="admin-drawer-meta-card">
                    <span>Endereço do artigo</span>
                    <strong>{editor.slug || "Ainda sem slug"}</strong>
                  </div>
                  <div className="admin-drawer-meta-card">
                    <span>Atualizado</span>
                    <strong>{selectedItem ? formatDate(selectedItem.updatedAt) : "Agora"}</strong>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {editor.slug ? (
                  <a className="admin-ghost-button" href={`/blog/${editor.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Ver post
                  </a>
                ) : null}
                <button className="admin-ghost-button" type="button" onClick={() => setEditor(null)}>
                  <X className="h-4 w-4" />
                  Fechar
                </button>
              </div>
            </div>

            <div className="admin-drawer-body">
              <div className="admin-panel admin-status-panel" role="status">{statusText}</div>
              <div className="admin-panel">
                <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="admin-kicker">Detalhes</p>
                        <h2 className="admin-section-title">Editor do post</h2>
                        <p className="admin-section-copy">Revise o título, o texto e a imagem. Publicar salva suas alterações antes de colocar o artigo no ar.</p>
                        {selectedItem?.status === "published" && <p className="admin-section-copy">Este artigo já está no ar. Salvar alterações também atualiza a versão pública.</p>}
                      </div>
                      <div className="admin-action-cluster">
                        <button className="admin-ghost-button" type="button" onClick={generateItem} disabled={busy}>
                          <Sparkles className="h-4 w-4" />
                          Preparar texto com IA
                        </button>
                        <button className="admin-primary-button" type="button" onClick={publishItem} disabled={busy}>
                          Salvar e publicar
                        </button>
                        <button className="admin-danger-button" type="button" onClick={() => deleteItem(editor.draftId)} disabled={busy}>
                          Arquivar
                        </button>
                      </div>
                </div>

                <div className="admin-form-grid mt-8">

                      <label className="admin-field">
                        <span>Título</span>
                        <input className="admin-input" value={editor.title} onChange={(event) => updateEditor("title", event.target.value)} />
                      </label>

                      <label className="admin-field admin-field-full">
                        <span>Resumo</span>
                        <textarea className="admin-textarea" value={editor.excerpt} onChange={(event) => updateEditor("excerpt", event.target.value)} rows={3} />
                      </label>






                      <label className="admin-field">
                        <span>Escolher imagem</span>
                        <input
                          className="admin-input file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
                          type="file"
                          disabled={busy}
                          accept="image/*"
                          onChange={(event) => {
                            const selected = event.target.files?.[0];
                            if (selected) {
                              void uploadImage(selected);
                            }
                            event.currentTarget.value = "";
                          }}
                        />
                      </label>
                      <label className="admin-field">
                        <span>Imagem de destaque</span>
                        <div className="admin-image-actions">
                          {editor.imageUrl ? (
                            <>
                              <img className="admin-editor-thumb" src={editor.imageUrl} alt={editor.title || editor.draftId} />
                              <button className="admin-danger-button" type="button" onClick={() => updateEditor("imageUrl", "")}>
                                Remover capa
                              </button>
                            </>
                          ) : (
                            <div className="admin-empty-thumb">Sem imagem destaque</div>
                          )}
                        </div>
                      </label>
                      <label className="admin-field admin-field-full">
                        <span>Texto do artigo</span>
                        <RichTextEditor
                          markdown={editor.contentMarkdown}
                          htmlFallback={editor.contentHtml}
                          onMarkdownChange={(value) => updateEditor("contentMarkdown", value)}
                          onHtmlFallbackChange={(value) => updateEditor("contentHtml", value)}
                        />
                      </label>
                </div>

                <details className="admin-panel mt-6">
                  <summary className="cursor-pointer font-semibold">Ajustes opcionais: fonte, endereço e busca</summary>
                  <p className="admin-section-copy mt-3">Para o dia a dia, basta revisar o título, o texto e a capa. Abra estas opções quando precisar ajustar a fonte ou a apresentação nas buscas.</p>
                  <div className="admin-form-grid mt-6">
                      <label className="admin-field admin-field-full">
                        <span>Ideia base</span>
                        <textarea className="admin-textarea" value={editor.sourceValue} onChange={(event) => updateEditor("sourceValue", event.target.value)} rows={4} />
                      </label>
                      <label className="admin-field">
                        <span>Endereço do artigo</span>
                        <input className="admin-input" value={editor.slug} onChange={(event) => updateEditor("slug", event.target.value)} />
                      </label>
                      <label className="admin-field">
                        <span>Título nas buscas</span>
                        <input className="admin-input" value={editor.seoTitle} onChange={(event) => updateEditor("seoTitle", event.target.value)} />
                      </label>
                      <label className="admin-field">
                        <span>Descrição nas buscas</span>
                        <textarea className="admin-textarea" value={editor.seoDescription} onChange={(event) => updateEditor("seoDescription", event.target.value)} rows={3} />
                      </label>
                      <label className="admin-field">
                        <span>Segmento</span>
                        <input className="admin-input" value={editor.segment} onChange={(event) => updateEditor("segment", event.target.value)} />
                      </label>
                      <label className="admin-field">
                        <span>Foco principal</span>
                        <input className="admin-input" value={editor.serviceFocus} onChange={(event) => updateEditor("serviceFocus", event.target.value)} />
                      </label>
                      <label className="admin-field">
                        <span>Redirecionar o endereço anterior</span>
                        <input className="admin-input" value={editor.redirectTo} onChange={(event) => updateEditor("redirectTo", event.target.value)} placeholder="/blog/nova-slug ou /blog" />
                      </label>
                      <label className="admin-field">
                        <span>Link da imagem (opcional)</span>
                        <input className="admin-input" value={editor.imageUrl} onChange={(event) => updateEditor("imageUrl", event.target.value)} />
                      </label>
                  </div>
                </details>

                <div className="mt-6 flex flex-wrap gap-3">
                      <button className="admin-primary-button" type="button" onClick={saveEditor} disabled={busy}>
                        Salvar alterações
                      </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
};

export default AdminEditorialPage;
