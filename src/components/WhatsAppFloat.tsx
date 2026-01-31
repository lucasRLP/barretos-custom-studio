import { MessageCircle } from "lucide-react";
import { generateWhatsAppLink, trackWhatsAppClick } from "@/lib/constants";

export function WhatsAppFloat() {
  const handleClick = () => {
    trackWhatsAppClick("Geral", "Floating Button", "float");
    window.open(generateWhatsAppLink("Geral", "Floating Button", "float"), "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="whatsapp-float group"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Fale conosco
      </span>
    </button>
  );
}
