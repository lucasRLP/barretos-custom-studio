import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { PersonalizeApp } from "@/components/PersonalizeApp";
import { generateWhatsAppLink, trackWhatsAppClick } from "@/lib/constants";
import { 
  Sparkles, 
  Palette, 
  CreditCard, 
  Truck, 
  ArrowRight,
  Phone,
} from "lucide-react";

const steps = [
  {
    icon: Palette,
    title: "Escolha o Produto",
    description: "Selecione entre camisetas, polos, moletons e muito mais. Defina cor, tamanho e quantidade.",
  },
  {
    icon: Sparkles,
    title: "Personalize",
    description: "Envie sua arte ou crie do zero. Use nosso editor para posicionar e visualizar o resultado.",
  },
  {
    icon: CreditCard,
    title: "Pague Online",
    description: "Finalize com pagamento seguro via PIX, boleto ou cartão de crédito.",
  },
  {
    icon: Truck,
    title: "Receba em Casa",
    description: "Produzimos com carinho e enviamos para qualquer lugar do Brasil.",
  },
];

export default function Personalize() {
  const handleWhatsAppClick = () => {
    trackWhatsAppClick("Personalizador Online", "Personalize", "page-cta");
    window.open(
      generateWhatsAppLink("Personalizador Online - Dúvidas", "Personalize", "page-cta"),
      "_blank"
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Novo: Personalizador Online
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white">
              Personalize, pague e receba:
              <br />
              <span className="text-[hsl(47_93%_60%)]">do jeito certo e do seu jeito.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Escolha o produto, envie sua arte ou crie do zero, pague online 
              e receba em casa. Simples assim.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl" 
                className="gap-2"
                onClick={() => {
                  const appSlot = document.getElementById("personalize-app-slot");
                  if (appSlot) {
                    appSlot.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <Sparkles className="h-5 w-5" />
                Abrir personalizador
              </Button>
              <Button 
                variant="heroOutline" 
                size="xl" 
                onClick={handleWhatsAppClick}
                className="gap-2"
              >
                <Phone className="h-5 w-5" />
                Preciso de ajuda
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
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

      {/* App Slot */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Monte seu pedido
            </h2>
            <p className="text-muted-foreground">
              Escolha, personalize e envie seu pedido em poucos passos.
            </p>
          </div>
          <div id="personalize-app-slot">
            <PersonalizeApp />
          </div>
        </div>
      </section>

      {/* FAQ/Info */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Dúvidas Frequentes
            </h2>
            
            <div className="space-y-4">
              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Posso personalizar qualquer quantidade?
                </h3>
                <p className="text-muted-foreground">
                  Sim! No personalizador online você pode fazer pedidos a partir de 1 unidade. 
                  Para grandes quantidades, recomendamos solicitar orçamento via WhatsApp para 
                  condições especiais.
                </p>
              </div>
              
              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Como envio minha arte?
                </h3>
                <p className="text-muted-foreground">
                  Após preencher o personalizador, você será redirecionado ao nosso WhatsApp onde pode 
                  enviar sua arte diretamente. Aceitamos PNG, JPG e PDF em alta resolução.
                </p>
              </div>
              
              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Qual o prazo de entrega?
                </h3>
                <p className="text-muted-foreground">
                  O prazo varia de acordo com a quantidade e destino. Em média, 
                  7 a 15 dias úteis após a aprovação do pagamento. O prazo exato 
                  será informado durante a finalização do pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
