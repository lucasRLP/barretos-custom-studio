import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PersonalizeApp } from "@/components/PersonalizeApp";
import { generateWhatsAppLink, trackWhatsAppClick } from "@/lib/constants";
import {
  ArrowRight,
  ClipboardList,
  Palette,
  Phone,
  Shirt,
  Sparkles,
  UserRound,
} from "lucide-react";

const steps = [
  {
    icon: Shirt,
    title: "Escolha o Produto",
    description: "Selecione camiseta, polo, bone, ecobag ou moletom para iniciar seu pedido.",
  },
  {
    icon: ClipboardList,
    title: "Detalhes do Pedido",
    description: "Defina quantidades por tamanho com total automatico por produto.",
  },
  {
    icon: Palette,
    title: "Personalizar",
    description: "Edite cor, logo, texto e local da estampa no editor visual.",
  },
  {
    icon: UserRound,
    title: "Seus Dados",
    description: "Finalize com seus dados e envie o pedido direto para o WhatsApp.",
  },
];

export default function Personalize() {
  const handleWhatsAppClick = () => {
    trackWhatsAppClick("Personalizador Online", "Personalize", "page-cta");
    window.open(
      generateWhatsAppLink("Personalizador Online - Duvidas", "Personalize", "page-cta"),
      "_blank",
    );
  };

  return (
    <Layout>
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Novo: fluxo completo de personalizacao
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white">
              Monte seu pedido
              <br />
              <span className="text-[hsl(47_93%_60%)]">do seu jeito e em poucos passos.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Escolha o produto, ajuste as quantidades por tamanho, personalize a arte e envie seus
              dados sem sair da pagina.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="hero"
                size="xl"
                className="gap-2"
                onClick={() => {
                  const appSlot = document.getElementById("personalize-app-slot");
                  if (appSlot) appSlot.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Sparkles className="h-5 w-5" />
                Abrir studio
              </Button>
              <Button variant="heroOutline" size="xl" onClick={handleWhatsAppClick} className="gap-2">
                <Phone className="h-5 w-5" />
                Preciso de ajuda
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
            Como funciona
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="card-elevated p-6 text-center h-full">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-7 w-7 text-secondary" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Monte seu pedido</h2>
            <p className="text-muted-foreground">
              Produto, detalhes, personalizacao e dados finais em um unico fluxo.
            </p>
          </div>
          <div id="personalize-app-slot">
            <PersonalizeApp />
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Duvidas frequentes</h2>

            <div className="space-y-4">
              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Posso personalizar qualquer quantidade?
                </h3>
                <p className="text-muted-foreground">
                  Sim. O fluxo aceita desde 1 unidade e calcula o total automaticamente conforme os
                  tamanhos escolhidos.
                </p>
              </div>

              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-2">Como envio minha arte?</h3>
                <p className="text-muted-foreground">
                  Na etapa "Personalizar" voce faz upload de logo/arte, ajusta o posicionamento e
                  depois envia o pedido no WhatsApp.
                </p>
              </div>

              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-2">Qual o prazo de entrega?</h3>
                <p className="text-muted-foreground">
                  O prazo depende de quantidade e destino. Em media, 7 a 15 dias uteis apos
                  aprovacao e confirmacao com o time comercial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
