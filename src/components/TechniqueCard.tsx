import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateWhatsAppLink, trackWhatsAppClick, TECHNIQUES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TechniqueCardProps {
  technique: typeof TECHNIQUES[number];
  compact?: boolean;
}

export function TechniqueCard({ technique, compact = false }: TechniqueCardProps) {
  const handleWhatsAppClick = () => {
    trackWhatsAppClick(technique.name, "Técnicas", "card");
    window.open(
      generateWhatsAppLink(`${technique.name} (${technique.fullName})`, "Técnicas", "card"),
      "_blank"
    );
  };

  if (compact) {
    return (
      <div className="card-elevated overflow-hidden flex flex-col h-full">
        {technique.image && (
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={technique.image}
              alt={`Técnica ${technique.fullName}`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-foreground mb-1">{technique.name}</h3>
          <p className="text-xs text-secondary font-medium mb-2">{technique.fullName}</p>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {technique.idealFor}
          </p>
          <Button variant="ctaOutline" size="sm" asChild className="mt-auto">
            <Link to={`/tecnicas#${technique.id}`}>
              Saiba mais
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6 md:p-8" id={technique.id}>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {technique.image && (
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg mb-4 bg-muted">
              <img
                src={technique.image}
                alt={`Técnica ${technique.fullName}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <h3 className="text-2xl font-bold text-foreground mb-1">{technique.name}</h3>
          <p className="text-secondary font-medium mb-4">{technique.fullName}</p>
          <p className="text-muted-foreground mb-4">{technique.description}</p>

          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground mb-1">Ideal para:</p>
            <p className="text-sm text-muted-foreground">{technique.idealFor}</p>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground mb-2">Pontos fortes:</p>
            <ul className="space-y-1">
              {technique.pros.map((pro) => (
                <li key={pro} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground mb-2">Limitações:</p>
            <ul className="space-y-1">
              {technique.cons.map((con) => (
                <li key={con} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-foreground mb-2">Checklist da arte:</p>
            <ul className="space-y-1">
              {technique.artChecklist.map((item) => (
                <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button variant="cta" className="gap-2" onClick={handleWhatsAppClick}>
            <Phone className="h-4 w-4" />
            Orçamento com {technique.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
