import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { generateWhatsAppLink, trackWhatsAppClick } from "@/lib/constants";
import { 
  Factory, 
  Users, 
  Award, 
  Truck, 
  Heart, 
  Target,
  Phone,
} from "lucide-react";

const values = [
  {
    icon: Factory,
    title: "Produção Própria",
    description: "Fábrica própria com controle total de qualidade em cada etapa do processo.",
  },
  {
    icon: Users,
    title: "Atendimento Consultivo",
    description: "Equipe especializada para indicar a melhor solução para seu projeto.",
  },
  {
    icon: Award,
    title: "Qualidade Garantida",
    description: "Mais de 30 anos de experiência e milhares de clientes satisfeitos.",
  },
  {
    icon: Truck,
    title: "Entrega Nacional",
    description: "Enviamos para todo o Brasil com segurança e prazo confiável.",
  },
  {
    icon: Heart,
    title: "Compromisso",
    description: "Tratamos cada projeto como se fosse nosso, com dedicação total.",
  },
  {
    icon: Target,
    title: "Foco no Cliente",
    description: "Sua satisfação é nossa prioridade. Buscamos sempre superar expectativas.",
  },
];

const timeline = [
  { year: "1990", event: "Fundação da empresa com foco em uniformes escolares" },
  { year: "2000", event: "Expansão para uniformes corporativos e eventos" },
  { year: "2010", event: "Modernização com novas técnicas de personalização" },
  { year: "2015", event: "Ampliação da capacidade produtiva e linha de brindes" },
  { year: "2020", event: "Digitalização e atendimento nacional" },
  { year: "Hoje", event: "Referência em personalizados com qualidade de fábrica" },
];

export default function Sobre() {
  const handleWhatsAppClick = () => {
    trackWhatsAppClick("Geral", "Sobre", "page-cta");
    window.open(generateWhatsAppLink("Geral", "Sobre", "page-cta"), "_blank");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Sobre a Barretos
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80">
              Há mais de 30 anos produzindo personalizados e uniformes com qualidade 
              de fábrica. Uma história construída com dedicação, inovação e compromisso 
              com cada cliente.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Nossa Missão
              </h2>
              <p className="text-muted-foreground mb-4">
                Transformar ideias em produtos de qualidade, oferecendo soluções 
                completas em personalizados e uniformes que fortalecem a identidade 
                visual de empresas, eventos e equipes.
              </p>
              <p className="text-muted-foreground mb-6">
                Combinamos tecnologia de ponta, profissionais especializados e 
                atendimento consultivo para entregar exatamente o que nossos clientes 
                precisam, sempre com o melhor custo-benefício.
              </p>
              <Button variant="cta" onClick={handleWhatsAppClick} className="gap-2">
                <Phone className="h-5 w-5" />
                Fale conosco
              </Button>
            </div>
            <div className="aspect-video rounded-2xl bg-muted overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Fábrica Barretos"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Nossos Valores
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card-elevated p-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Nossa Trajetória
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
              
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-secondary border-4 border-background md:-translate-x-1/2 z-10" />
                  
                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-2">
                      {item.year}
                    </span>
                    <p className="text-foreground">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-hero-gradient text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Faça parte da nossa história
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Junte-se aos milhares de clientes satisfeitos. Vamos transformar seu projeto em realidade.
          </p>
          <Button variant="hero" size="lg" onClick={handleWhatsAppClick} className="gap-2">
            <Phone className="h-5 w-5" />
            Solicitar orçamento
          </Button>
        </div>
      </section>
    </Layout>
  );
}
