import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateWhatsAppLink, trackWhatsAppClick } from "@/lib/constants";
import logoBarretos from "@/assets/logo-barretos.png";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Produtos", href: "/produtos" },
  { name: "Técnicas", href: "/tecnicas" },
  { name: "Personalize", href: "/personalize" },
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleWhatsAppClick = () => {
    trackWhatsAppClick("Geral", "Header", "header-cta");
    window.open(generateWhatsAppLink("Geral", "Header", "header-cta"), "_blank");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(32_60%_95%)]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(32_60%_95%)]/80 border-b border-border">
      {/* Rainbow bar */}
      <div className="rainbow-bar" />
      
      <nav className="container-custom flex items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoBarretos} alt="Barretos Design Têxtil & Confecção" className="h-14 md:h-18 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary",
                location.pathname === item.href
                  ? "text-secondary"
                  : "text-foreground/80"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Button
            variant="cta"
            size="default"
            onClick={handleWhatsAppClick}
            className="gap-2"
          >
            <Phone className="h-4 w-4" />
            Solicitar Orçamento
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="container-custom py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block py-2 text-base font-medium transition-colors",
                  location.pathname === item.href
                    ? "text-secondary"
                    : "text-foreground/80"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              variant="cta"
              className="w-full gap-2 mt-4"
              onClick={() => {
                handleWhatsAppClick();
                setMobileMenuOpen(false);
              }}
            >
              <Phone className="h-4 w-4" />
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
