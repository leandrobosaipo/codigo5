import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminEditorialPage from "@/pages/AdminEditorialPage";
vi.mock("@/hooks/use-telegram-webapp", () => ({ useTelegramWebApp: () => ({ isTelegram: false, webApp: null }) }));
vi.mock("@/components/RichTextEditor", () => ({ default: () => <div>Editor de teste</div> }));
vi.mock("@/content/blog", () => ({ blogPosts: [] }));
const item = { id:"draft_test",status:"draft",title:"Título inicial",slug:"titulo-inicial",sourceValue:"Uma pauta",contentMarkdown:"Texto revisado",contentHtml:"<p>Texto revisado</p>",segment:null,serviceFocus:null,updatedAt:"2026-09-09T00:00:00Z" };
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
async function openEditor(saveOk: boolean) {
  const calls: Array<{ url: string; body?: Record<string, unknown> }> = [];
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
    calls.push({url, body});
    const payload = url.endsWith("/auth/session") ? {ok:true,authenticated:true,session:{email:"editor@example.test",source:"magic-link"}}
      : url.endsWith("posts-save") ? (saveOk ? {ok:true,item:{...item,...body}} : {ok:false,error:"Banco indisponível"})
      : url.endsWith("posts-publish") ? {ok:true,url:"https://codigo5.com.br/blog/titulo-inicial"}
      : {ok:true,items:[item]};
    return Response.json(payload, {status:url.endsWith("posts-save") && !saveOk ? 503 : 200});
  }));
  render(<MemoryRouter><AdminEditorialPage /></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", {name:"Abrir"}));
  fireEvent.change(screen.getByLabelText("Título", {exact:true}), {target:{value:"Título revisado"}});
  return calls;
}
it("saves the current editor before publishing", async () => {
  const calls = await openEditor(true);
  fireEvent.click(screen.getByRole("button", {name:"Salvar e publicar"}));
  await waitFor(() => expect(calls.some(call => call.url.endsWith("posts-publish"))).toBe(true));
  const save = calls.findIndex(call => call.url.endsWith("posts-save"));
  const publish = calls.findIndex(call => call.url.endsWith("posts-publish"));
  expect(save).toBeLessThan(publish);
  expect(calls[save].body?.title).toBe("Título revisado");
});
it("does not publish or discard edits when saving fails", async () => {
  const calls = await openEditor(false);
  fireEvent.click(screen.getByRole("button", {name:"Salvar e publicar"}));
  await screen.findByText("Banco indisponível");
  expect(calls.some(call => call.url.endsWith("posts-publish"))).toBe(false);
  expect(screen.getByLabelText("Título", {exact:true})).toHaveValue("Título revisado");
});
