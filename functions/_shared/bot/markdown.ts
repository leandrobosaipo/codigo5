import { marked } from "marked";
import { trimText } from "./utils";

marked.setOptions({
  gfm: true,
  breaks: false,
});

const stripDangerousHtml = (html: string) =>
  html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s(href|src)\s*=\s*(['"])javascript:[^'"]*\2/gi, "");

const stripMarkdownSyntax = (markdown: string) =>
  markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\n{2,}/g, "\n")
    .trim();

const countWords = (value: string) => value.split(/\s+/).filter(Boolean).length;

export const renderMarkdownToHtml = (markdown: string) => {
  const rendered = marked.parse(markdown) as string;
  return stripDangerousHtml(rendered).trim();
};

export const excerptFromMarkdown = (markdown: string, max = 180) => {
  const plain = stripMarkdownSyntax(markdown).replace(/\s+/g, " ").trim();
  return trimText(plain, max);
};

export const readingMinutesFromMarkdown = (markdown: string) => {
  const plain = stripMarkdownSyntax(markdown);
  return Math.max(3, Math.ceil(countWords(plain) / 220));
};
