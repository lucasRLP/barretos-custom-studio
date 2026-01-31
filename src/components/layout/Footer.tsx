import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin } from "lucide-react";

const footerLinks = {
  produtos: [
    { name: "T-Shirts", href: "/produtos/t-shirt" },
    { name: "Camisas Polo", href: "/produtos/camisa-polo" },
    { name: "Moletons", href: "/produtos/moletom-canguru" },
    { name: "Uniformes", href: "/produtos/uniformes-profissionais" },
    { name: "Brindes", href: "/produtos/brindes" },
  ],
  tecnicas: [
    { name: "DTF", href: "/tecnicas#dtf" },
    { name: "Silk Screen", href: "/tecnicas#silk-screen" },
    { name: "Sublimação", href: "/tecnicas#sublimacao" },
    { name: "Bordado", href: "/tecnicas#bordado" },
    { name: "Transfer", href: "/tecnicas#transfer" },
  ],
  empresa: [
    { name: "Sobre", href: "/sobre" },
    { name: "Contato", href: "/contato" },
    { name: "Personalize", href: "/personalize" },
    { name: "Políticas de Privacidade", href: "/politicas" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Rainbow bar */}
      <div className="rainbow-bar" />
      
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-extrabold tracking-tight">BARRETOS</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm mb-6 max-w-sm">
              Mais de 30 anos produzindo personalizados e uniformes com qualidade de fábrica. 
              Atendimento consultivo e envio para todo o Brasil.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>São Paulo, SP - Brasil</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contato@barretosconfeccao.com.br</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Seg - Sex: 8h às 18h</span>
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div>
            <h3 className="font-semibold mb-4">Produtos</h3>
            <ul className="space-y-2">
              {footerLinks.produtos.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Técnicas */}
          <div>
            <h3 className="font-semibold mb-4">Técnicas</h3>
            <ul className="space-y-2">
              {footerLinks.tecnicas.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Barreto's Confecção. Todos os direitos reservados.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
