import { useEffect, useRef, useState } from "react";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  quotePlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { Code2, FileText } from "lucide-react";
import "@mdxeditor/editor/style.css";

type RichTextEditorProps = {
  markdown: string;
  htmlFallback: string;
  onMarkdownChange: (value: string) => void;
  onHtmlFallbackChange: (value: string) => void;
};

const RichTextEditor = ({
  markdown,
  htmlFallback,
  onMarkdownChange,
  onHtmlFallbackChange,
}: RichTextEditorProps) => {
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const [mode, setMode] = useState<"markdown" | "html">("markdown");

  useEffect(() => {
    if (mode !== "markdown") return;
    editorRef.current?.setMarkdown(markdown || "");
  }, [markdown, mode]);

  return (
    <div className="admin-editor-shell">
      <div className="admin-editor-topbar">
        <div>
          <p className="admin-kicker">Conteúdo</p>
          <h3 className="admin-editor-title">Editor markdown do post</h3>
        </div>
        <div className="admin-editor-mode-toggle">
          <button
            className={mode === "markdown" ? "admin-filter-button is-active" : "admin-filter-button"}
            type="button"
            onClick={() => setMode("markdown")}
          >
            <FileText className="h-4 w-4" />
            Markdown
          </button>
          <button
            className={mode === "html" ? "admin-filter-button is-active" : "admin-filter-button"}
            type="button"
            onClick={() => setMode("html")}
          >
            <Code2 className="h-4 w-4" />
            HTML legado
          </button>
        </div>
      </div>

      {mode === "markdown" ? (
        <div className="admin-mdx-editor">
          <MDXEditor
            ref={editorRef}
            markdown={markdown}
            onChange={onMarkdownChange}
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              linkPlugin(),
              markdownShortcutPlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BlockTypeSelect />
                    <BoldItalicUnderlineToggles />
                    <ListsToggle />
                    <CreateLink />
                  </>
                ),
              }),
            ]}
          />
        </div>
      ) : (
        <textarea
          className="admin-codearea"
          aria-label="Editor HTML legado do conteúdo do post"
          value={htmlFallback}
          onChange={(event) => onHtmlFallbackChange(event.target.value)}
          rows={16}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
