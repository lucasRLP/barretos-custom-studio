import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { generateWhatsAppLink, trackWhatsAppClick } from "@/lib/constants";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Endereço",
    content: "São Paulo, SP - Brasil",
    subtitle: "(Atendemos todo o território nacional)",
  },
  {
    icon: Phone,
    title: "Telefone",
    content: "(11) 99999-9999",
    subtitle: "WhatsApp disponível",
  },
  {
    icon: Mail,
    title: "E-mail",
    content: "contato@barretosconfeccao.com.br",
    subtitle: "Respondemos em até 24h",
  },
  {
    icon: Clock,
    title: "Horário",
    content: "Segunda a Sexta: 8h às 18h",
    subtitle: "Sábado: 8h às 12h",
  },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function Contato() {
  const handleWhatsAppClick = () => {
    trackWhatsAppClick("Geral", "Contato", "page-cta");
    window.open(generateWhatsAppLink("Geral", "Contato", "page-cta"), "_blank");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Fale Conosco
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Estamos prontos para atender você. Entre em contato por WhatsApp para 
            um atendimento rápido e personalizado.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Informações de Contato
              </h2>
              
              <div className="space-y-6 mb-10">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{info.title}</h3>
                      <p className="text-foreground">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Redes Sociais
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div>
              <div className="card-elevated p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-10 w-10 text-[#25D366]" />
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Atendimento via WhatsApp
                </h2>
                <p className="text-muted-foreground mb-6">
                  A forma mais rápida de entrar em contato. Nossa equipe está 
                  pronta para ajudar com seu orçamento.
                </p>
                
                <Button
                  variant="whatsapp"
                  size="xl"
                  onClick={handleWhatsAppClick}
                  className="w-full gap-3"
                >
                  <MessageCircle className="h-6 w-6" />
                  Iniciar conversa no WhatsApp
                </Button>

                <p className="text-sm text-muted-foreground mt-4">
                  Respondemos em minutos durante o horário comercial
                </p>
              </div>

              {/* Additional info */}
              <div className="mt-6 p-6 rounded-xl bg-muted/50">
                <h3 className="font-semibold text-foreground mb-3">
                  Dicas para um orçamento mais rápido:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    Tenha uma estimativa de quantidade em mente
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    Se possível, envie referências ou sua arte
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    Informe o prazo desejado para entrega
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary">•</span>
                    Mencione sua cidade para calcularmos o frete
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="h-80 bg-muted">
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Mapa será inserido aqui</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
