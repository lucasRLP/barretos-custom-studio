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
    description: "Fábrica em Vila Isabel (RJ) com controle total de qualidade em cada etapa — do corte à finalização.",
  },
  {
    icon: Users,
    title: "Atendimento Consultivo",
    description: "Equipe especializada indica a melhor técnica e acabamento para o seu projeto, sem enrolação.",
  },
  {
    icon: Award,
    title: "Qualidade Garantida",
    description: "Mais de 30 anos estampando e confeccionando para escolas, indústrias e grandes marcas.",
  },
  {
    icon: Truck,
    title: "Entrega Nacional",
    description: "Envio para todo o Brasil via transportadora ou Correios, com prazo confiável.",
  },
  {
    icon: Heart,
    title: "Negócio de Família",
    description: "Tradição que passa de geração para geração. Cada pedido é tratado com o mesmo cuidado de sempre.",
  },
  {
    icon: Target,
    title: "Da Ideia à Entrega",
    description: "Silk, DTF, sublimação, bordado e private label — solução completa em um só lugar.",
  },
];

const timeline = [
  { year: "Anos 90", event: "Fundação da Barreto's com foco em uniformes escolares e serigrafia." },
  { year: "2000", event: "Expansão para uniformes corporativos, eventos e linha de brindes." },
  { year: "2010", event: "Modernização do parque fabril com novas técnicas de personalização." },
  { year: "2020", event: "Digitalização, atendimento nacional e clientes como NESTLÉ, Rio International School e RJDI." },
  { year: "Hoje", event: "Referência em personalizados B2B — 30+ anos estampando e confeccionando." },
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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
              Sobre a Barreto's
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80">
              Há mais de 30 anos estampando e confeccionando uniformes e personalizados
              com qualidade de fábrica — uma história de família construída no Rio de Janeiro,
              com dedicação, inovação e compromisso em cada peça entregue.
            </p>
          </div>
        </div>
      </section>

      {/* Mission + Foto familiar */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs uppercase tracking-wider font-semibold text-secondary mb-3">
                Nossa história
              </span>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Uma confecção feita de gente, para gente
              </h2>
              <p className="text-muted-foreground mb-4">
                A Barreto's nasceu com a missão de transformar ideias em produtos de
                qualidade — oferecendo soluções completas em personalizados e uniformes
                que fortalecem a identidade visual de empresas, escolas, eventos e equipes.
              </p>
              <p className="text-muted-foreground mb-4">
                Somos um negócio de família. Da escolha do tecido à finalização da estampa,
                tudo passa pelas mãos de quem conhece o ofício e se orgulha dele. Essa é a
                nossa diferença: tratamos cada pedido como se fosse para a nossa própria casa.
              </p>
              <p className="text-muted-foreground mb-6">
                Combinamos tecnologia de ponta (DTF, sublimação, silk, bordado) com
                atendimento consultivo para entregar exatamente o que o cliente precisa —
                sempre com o melhor custo-benefício e prazo de 5 dias úteis.
              </p>
              <Button variant="cta" onClick={handleWhatsAppClick} className="gap-2">
                <Phone className="h-5 w-5" />
                Fale conosco
              </Button>
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border bg-muted">
              <img
                src="/about/familia-barretos.jpg"
                alt="Família Barreto's — tradição de 30 anos em confecção"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Por que a Barreto's?
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Mais de três décadas atendendo desde o primeiro pedido de 1 peça até produções
            em escala para grandes marcas e instituições.
          </p>
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
            Nossa trajetória
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-secondary border-4 border-background md:-translate-x-1/2 z-10" />

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
            Junte-se aos clientes que já confiam na Barreto's. Vamos transformar seu projeto em realidade.
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
