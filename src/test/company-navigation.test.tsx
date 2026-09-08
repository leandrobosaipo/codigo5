import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PortfolioPage from "@/pages/PortfolioPage";
import Navbar from "@/components/Navbar";
import { ServiceList } from "@/components/CompanySections";
import { capabilities } from "@/content/company";
afterEach(cleanup);
describe("company navigation", () => {
  it("opens the mobile menu, closes on Escape and after following a route", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(
      screen.getByRole("navigation", { name: "Navegação móvel" }),
    ).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.queryByRole("navigation", { name: "Navegação móvel" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    fireEvent.click(screen.getAllByRole("link", { name: "Serviços" })[1]);
    expect(
      screen.queryByRole("navigation", { name: "Navegação móvel" }),
    ).not.toBeInTheDocument();
  });
  it("gives every service a corresponding detail destination", () => {
    const { unmount } = render(
      <MemoryRouter>
        <ServiceList />
      </MemoryRouter>,
    );
    for (const service of capabilities)
      expect(
        screen.getByRole("link", { name: `Conhecer ${service.title}` }),
      ).toHaveAttribute("href", `/servicos#${service.id}`);
    unmount();
    render(
      <MemoryRouter>
        <ServiceList expanded />
      </MemoryRouter>,
    );
    for (const service of capabilities)
      expect(document.getElementById(service.id)).toHaveTextContent(
        service.detail,
      );
  });
});

describe("portfolio filtering", () => {
  it("filters projects by market and restores the complete collection", () => {
    render(<MemoryRouter><PortfolioPage /></MemoryRouter>);
    expect(document.querySelectorAll("#projetos .c5-work")).toHaveLength(33);
    fireEvent.click(screen.getByRole("button", { name: "Saúde", exact: true }));
    expect(document.querySelectorAll("#projetos .c5-work")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Saúde", exact: true })).toHaveAttribute("aria-pressed", "true");
    expect(document.getElementById("projetos")).not.toHaveTextContent("Roo Notícias");
    fireEvent.click(screen.getByRole("button", { name: "Todos", exact: true }));
    expect(document.querySelectorAll("#projetos .c5-work")).toHaveLength(33);
  });
});
