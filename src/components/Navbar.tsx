import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contact } from "@/content/siteContent";

const navLinks = [
  { label: "Início", href: "#hero" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Clientes", href: "#clientes" },
  { label: "Casos de Uso", href: "#casos" },
  { label: "Blog", href: "#blog" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="container flex min-h-[4.5rem] items-center justify-between gap-6 py-3">
        <a href="#hero" className="flex items-center gap-3">
          <img
            src="/assets/codigo5/logos/logo-dark.webp"
            alt="Codigo5 Web"
            className="h-10 w-auto"
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <Button asChild size="sm" className="min-w-[190px]">
            <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
              Falar no WhatsApp
            </a>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border pb-4">
          <div className="container flex flex-col gap-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground py-1"
              >
                {l.label}
              </a>
            ))}
            <Button asChild size="sm" className="w-fit">
              <a href={contact.whatsappHref} target="_blank" rel="noreferrer">
                Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
