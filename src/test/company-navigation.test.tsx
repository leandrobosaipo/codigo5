import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
