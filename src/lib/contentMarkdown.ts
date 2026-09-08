import TurndownService from "turndown";

const turndown = new TurndownService({
  codeBlockStyle: "fenced",
  headingStyle: "atx",
  bulletListMarker: "-",
});

turndown.addRule("keepLinks", {
  filter: "a",
  replacement(content, node) {
    const href = node.getAttribute("href");
    return href ? `[${content || href}](${href})` : content;
  },
});

export const htmlToMarkdown = (html?: string | null) => {
  if (!html?.trim()) return "";
  return turndown.turndown(html.trim());
};
