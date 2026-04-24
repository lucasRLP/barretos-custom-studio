import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Phone,
  MessageCircle,
  Sparkles,
  Factory,
  Truck,
  Palette,
  ArrowRight,
  Send,
  CheckCircle2,
  FileCheck,
  Package,
  ChevronDown,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/CategoryCard";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { TechniqueCard } from "@/components/TechniqueCard";
import { CaseCard } from "@/components/CaseCard";
import {
  CATEGORIES,
  FEATURED_CATEGORIES,
  TECHNIQUES,
  CLIENT_LOGOS,
  FAQS,
  CASES,
  NOTABLE_CLIENTS,
  generateWhatsAppLink,
  trackWhatsAppClick,
} from "@/lib/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const proofChips = [
  { icon: Sparkles, text: "30+ anos" },
  { icon: Factory, text: "Produção própria" },
  { icon: Truck, text: "Envio Brasil" },
  { icon: Clock, text: "5 dias úteis" },
  { icon: Palette, text: "Com ou sem arte pronta" },
  { icon: ShieldCheck, text: "Sem pedido mínimo" },
];

const howItWorks = [
  { step: 1, icon: Send, title: "Envie sua demanda", description: "Conte sobre seu projeto e quantidade pelo WhatsApp" },
  { step: 2, icon: CheckCircle2, title: "Indicamos produto + técnica", description: "Consultoria gratuita para a melhor solução" },
  { step: 3, icon: FileCheck, title: "Você aprova o layout", description: "Amostra virtual (mockup) gratuita em todo pedido" },
  { step: 4, icon: Package, title: "Produção e entrega", description: "5 dias úteis após aprovação. Entregamos em todo Brasil" },
];

export default function Index() {
  const featuredCategories = CATEGORIES.filter((cat) =>
    FEATURED_CATEGORIES.includes(cat.id)
  );

  // Hero photo rotation
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    if (CASES.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % CASES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleMainCTA = () => {
    trackWhatsAppClick("Geral", "Home", "hero-primary");
    window.open(generateWhatsAppLink("Geral", "Home", "hero-primary"), "_blank");
  };

  const handleWhatsAppCTA = () => {
    trackWhatsAppClick("Geral", "Home", "hero-whatsapp");
    window.open(generateWhatsAppLink("Geral", "Home", "hero-whatsapp"), "_blank");
  };

  const handleQuickCTA = () => {
    trackWhatsAppClick("Geral", "Home", "quick-cta");
    window.open(generateWhatsAppLink("Geral", "Home", "quick-cta"), "_blank");
  };

  return (
    <Layout>
      {/* Hero Section — Split com carrossel de cases */}
      <section className="relative bg-hero-gradient text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container-custom py-16 md:py-24 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-slide-up text-white">
                Personalizados e uniformes com{" "}
                <span className="text-[hsl(47_93%_60%)]">padrão de fábrica.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 animate-slide-up delay-100">
                Produção própria no Rio de Janeiro. Prazo de 5 dias úteis, sem pedido mínimo. Envio para todo o Brasil.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up delay-200">
                <Button variant="hero" size="lg" onClick={handleMainCTA} className="gap-2">
                  <Phone className="h-5 w-5" />
                  Solicitar orçamento
                </Button>
                <Button variant="heroOutline" size="lg" onClick={handleWhatsAppCTA} className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Falar no WhatsApp
                </Button>
              </div>

              <Link
                to="/personalize"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors animate-slide-up delay-300"
              >
                <Sparkles className="h-4 w-4" />
                Personalize e compre online
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Proof Chips */}
              <div className="flex flex-wrap gap-2 mt-8 animate-slide-up delay-400">
                {proofChips.map((chip) => (
                  <div
                    key={chip.text}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-xs md:text-sm text-primary-foreground/90"
                  >
                    <chip.icon className="h-3.5 w-3.5" />
                    {chip.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Photo carousel */}
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none lg:ml-auto rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              {CASES.map((c, i) => (
                <img
                  key={c.id}
                  src={c.image}
                  alt={`${c.title} — ${c.subtitle}`}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
                  style={{ opacity: i === heroIndex ? 1 : 0 }}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                <span className="inline-block mb-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm !text-white">
                  {CASES[heroIndex].tag}
                </span>
                <h3 className="text-lg md:text-xl font-bold leading-tight !text-white">{CASES[heroIndex].title}</h3>
                <p className="text-xs md:text-sm !text-white/90">{CASES[heroIndex].subtitle}</p>
              </div>
              {/* Dots */}
              <div className="absolute top-4 right-4 flex gap-1.5 pointer-events-auto">
                {CASES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === heroIndex ? "bg-white w-6" : "bg-white/40 w-1.5 hover:bg-white/70"
                    }`}
                    aria-label={`Ver case ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-5 w-5 text-primary-foreground/40" />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos Produtos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mais de 13 categorias de personalizados para sua empresa, evento ou equipe.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="cta" size="lg" asChild className="gap-2">
              <Link to="/produtos">
                Ver catálogo completo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-lg text-muted-foreground">
              Depoimentos reais, enviados por clientes no WhatsApp. Clique para ver o print original.
            </p>
          </div>

          <TestimonialCarousel />

          {/* Client Logos */}
          <div className="mt-16">
            <p className="text-center text-sm text-muted-foreground mb-8">
              Empresas e instituições que confiam na Barreto's
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
              {CLIENT_LOGOS.map((client) => (
                <img
                  key={client.name}
                  src={client.logo}
                  alt={client.name}
                  className="h-12 md:h-16 w-auto opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cases Reais — nova seção */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Marcas que vestem Barreto's
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cases reais de clientes usando nossos produtos em eventos, uniformes corporativos e ações especiais.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* First case takes 2 cols + 2 rows on large screens */}
            <CaseCard item={CASES[0]} className="col-span-2 row-span-2 aspect-square lg:aspect-auto" />
            {CASES.slice(1).map((c) => (
              <CaseCard key={c.id} item={c} className="aspect-square" />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="ctaOutline" size="lg" onClick={handleQuickCTA} className="gap-2">
              <MessageCircle className="h-5 w-5" />
              Quero um case como esses
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-muted-foreground">
              Do orçamento à entrega em 4 passos simples.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="card-elevated p-6 text-center h-full">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-secondary" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="cta" size="lg" onClick={handleQuickCTA} className="gap-2 text-white">
              <Phone className="h-5 w-5" />
              Orçamento rápido e fácil
            </Button>
          </div>
        </div>
      </section>

      {/* Techniques Teaser */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Técnicas de Personalização
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha a técnica ideal para seu projeto. Nossa equipe ajuda você a decidir.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TECHNIQUES.map((technique) => (
              <TechniqueCard key={technique.id} technique={technique} compact />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="ctaOutline" size="lg" asChild className="gap-2">
              <Link to="/tecnicas">
                Ver detalhes de cada técnica
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick CTA Section */}
      <section className="py-16 bg-hero-gradient text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Orçamento rápido e fácil
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Envie sua demanda agora e receba uma proposta personalizada em horas úteis.
          </p>
          <Button variant="hero" size="xl" onClick={handleMainCTA} className="gap-2">
            <MessageCircle className="h-6 w-6" />
            Falar com especialista
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Tire suas dúvidas sobre nossos produtos e serviços.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {FAQS.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="card-elevated px-6"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-10">
              <p className="text-muted-foreground mb-4">Ainda tem dúvidas?</p>
              <Button variant="cta" onClick={handleWhatsAppCTA} className="gap-2">
                <MessageCircle className="h-5 w-5" />
                Fale com a gente
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
