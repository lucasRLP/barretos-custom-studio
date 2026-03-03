import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CATEGORIES, WHATSAPP_NUMBER, trackWhatsAppClick } from "@/lib/constants";
import { getProductImage } from "@/lib/productImages";
import {
  Sparkles,
  Upload,
  User,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  ImageIcon,
} from "lucide-react";

type Step = "product" | "customize" | "contact" | "confirm";

interface OrderData {
  categoryId: string;
  categoryName: string;
  quantity: string;
  color: string;
  size: string;
  hasArt: boolean;
  artDescription: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
}

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "product", label: "Produto", icon: Sparkles },
  { id: "customize", label: "Personalizar", icon: ImageIcon },
  { id: "contact", label: "Seus Dados", icon: User },
  { id: "confirm", label: "Confirmar", icon: Check },
];

const SIZES = ["PP", "P", "M", "G", "GG", "XGG"];

export function PersonalizeApp() {
  const [currentStep, setCurrentStep] = useState<Step>("product");
  const [order, setOrder] = useState<OrderData>({
    categoryId: "",
    categoryName: "",
    quantity: "1",
    color: "",
    size: "",
    hasArt: false,
    artDescription: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    notes: "",
  });

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const updateOrder = (fields: Partial<OrderData>) => {
    setOrder((prev) => ({ ...prev, ...fields }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "product":
        return !!order.categoryId;
      case "customize":
        return !!order.quantity && !!order.size;
      case "contact":
        return !!order.name && !!order.phone && !!order.city;
      case "confirm":
        return true;
    }
  };

  const nextStep = () => {
    const idx = currentStepIndex;
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1].id);
  };

  const prevStep = () => {
    const idx = currentStepIndex;
    if (idx > 0) setCurrentStep(STEPS[idx - 1].id);
  };

  const generateOrderMessage = () => {
    return `Olá! Vim pelo Personalizador Online da BARRETOS e quero fazer um pedido.

📦 *Produto:* ${order.categoryName}
📏 *Tamanho:* ${order.size}
🎨 *Cor preferida:* ${order.color || "A definir"}
🔢 *Quantidade:* ${order.quantity}
🖼️ *Tenho arte:* ${order.hasArt ? "Sim" : "Não"}
${order.artDescription ? `📝 *Descrição da arte:* ${order.artDescription}` : ""}

👤 *Nome:* ${order.name}
📱 *Telefone:* ${order.phone}
📧 *Email:* ${order.email || "Não informado"}
📍 *Cidade/UF:* ${order.city}
${order.notes ? `💬 *Observações:* ${order.notes}` : ""}

Origem: Personalizador Online`;
  };

  const handleSendToWhatsApp = () => {
    trackWhatsAppClick(order.categoryName, "Personalizador", "order-submit");
    const message = encodeURIComponent(generateOrderMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-xl)" }}>
      {/* Step indicator */}
      <div className="bg-muted/50 p-4 border-b border-border">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-1">
              <button
                onClick={() => idx < currentStepIndex && setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  idx === currentStepIndex
                    ? "bg-secondary text-secondary-foreground"
                    : idx < currentStepIndex
                    ? "bg-secondary/20 text-secondary cursor-pointer"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 min-h-[400px]">
        {/* Step 1: Choose Product */}
        {currentStep === "product" && (
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Escolha o Produto</h3>
            <p className="text-sm text-muted-foreground mb-6">Selecione a categoria do produto que deseja personalizar.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const img = getProductImage(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => updateOrder({ categoryId: cat.id, categoryName: cat.name })}
                    className={`relative rounded-xl border-2 p-3 text-center transition-all hover:scale-[1.02] ${
                      order.categoryId === cat.id
                        ? "border-secondary bg-secondary/5 ring-2 ring-secondary/20"
                        : "border-border hover:border-secondary/40"
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                      <img src={img} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{cat.name}</span>
                    {order.categoryId === cat.id && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Customize */}
        {currentStep === "customize" && (
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Personalize seu Pedido</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Defina as especificações do seu <strong>{order.categoryName}</strong>.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Tamanho *</label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => updateOrder({ size })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          order.size === size
                            ? "bg-secondary text-secondary-foreground border-secondary"
                            : "border-border text-foreground hover:border-secondary/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Quantidade *</label>
                  <input
                    type="number"
                    min="1"
                    value={order.quantity}
                    onChange={(e) => updateOrder({ quantity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Cor preferida</label>
                  <input
                    type="text"
                    placeholder="Ex: Azul marinho, Preto..."
                    value={order.color}
                    onChange={(e) => updateOrder({ color: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Você tem arte pronta?</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateOrder({ hasArt: true })}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        order.hasArt
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "border-border text-foreground hover:border-secondary/50"
                      }`}
                    >
                      <Upload className="h-4 w-4 inline mr-2" />
                      Sim, tenho arte
                    </button>
                    <button
                      onClick={() => updateOrder({ hasArt: false })}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        !order.hasArt
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "border-border text-foreground hover:border-secondary/50"
                      }`}
                    >
                      Não, preciso criar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {order.hasArt ? "Descreva sua arte" : "O que você quer na estampa?"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={order.hasArt ? "Descreva sua arte (enviaremos detalhes via WhatsApp)" : "Descreva sua ideia..."}
                    value={order.artDescription}
                    onChange={(e) => updateOrder({ artDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {currentStep === "contact" && (
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Seus Dados</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Preencha seus dados para enviarmos o orçamento.
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Nome completo *</label>
                <input
                  type="text"
                  value={order.name}
                  onChange={(e) => updateOrder({ name: e.target.value })}
                  placeholder="Seu nome"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">WhatsApp / Telefone *</label>
                <input
                  type="tel"
                  value={order.phone}
                  onChange={(e) => updateOrder({ phone: e.target.value })}
                  placeholder="(21) 99999-9999"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">E-mail</label>
                <input
                  type="email"
                  value={order.email}
                  onChange={(e) => updateOrder({ email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Cidade/UF *</label>
                <input
                  type="text"
                  value={order.city}
                  onChange={(e) => updateOrder({ city: e.target.value })}
                  placeholder="Rio de Janeiro, RJ"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Observações</label>
                <textarea
                  rows={2}
                  value={order.notes}
                  onChange={(e) => updateOrder({ notes: e.target.value })}
                  placeholder="Prazo desejado, outras especificações..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {currentStep === "confirm" && (
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Confirmar Pedido</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Revise seu pedido e envie para nosso WhatsApp.
            </p>
            <div className="max-w-2xl bg-muted/50 rounded-xl p-6 space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Produto</p>
                  <p className="text-sm font-semibold text-foreground">{order.categoryName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tamanho</p>
                  <p className="text-sm font-semibold text-foreground">{order.size}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantidade</p>
                  <p className="text-sm font-semibold text-foreground">{order.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cor</p>
                  <p className="text-sm font-semibold text-foreground">{order.color || "A definir"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Arte</p>
                  <p className="text-sm font-semibold text-foreground">{order.hasArt ? "Sim, tenho arte" : "Preciso criar"}</p>
                </div>
                {order.artDescription && (
                  <div>
                    <p className="text-xs text-muted-foreground">Descrição</p>
                    <p className="text-sm text-foreground">{order.artDescription}</p>
                  </div>
                )}
              </div>
              <hr className="border-border" />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Nome</p>
                  <p className="text-sm font-semibold text-foreground">{order.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <p className="text-sm font-semibold text-foreground">{order.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cidade/UF</p>
                  <p className="text-sm font-semibold text-foreground">{order.city}</p>
                </div>
                {order.email && (
                  <div>
                    <p className="text-xs text-muted-foreground">E-mail</p>
                    <p className="text-sm text-foreground">{order.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
              <Button variant="cta" size="lg" onClick={handleSendToWhatsApp} className="gap-2 w-full sm:w-auto">
                <MessageCircle className="h-5 w-5" />
                Enviar pedido pelo WhatsApp
              </Button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-secondary hover:underline"
              >
                <Phone className="h-4 w-4" />
                Abrir WhatsApp da Barretos
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 md:px-8 pb-6 flex justify-between items-center">
        {currentStepIndex > 0 ? (
          <Button variant="outline" onClick={prevStep} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
        ) : (
          <div />
        )}
        {currentStep !== "confirm" && (
          <Button
            variant="cta"
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-2"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
