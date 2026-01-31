import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateWhatsAppLink, trackWhatsAppClick } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  idealFor: string;
  tags: readonly string[];
  image: string;
  className?: string;
}

const tagColors = [
  "chip-blue",
  "chip-green",
  "chip-yellow",
  "chip-lime",
];

export function CategoryCard({
  id,
  name,
  description,
  idealFor,
  tags,
  image,
  className,
}: CategoryCardProps) {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackWhatsAppClick(name, "Catálogo", "card");
    window.open(generateWhatsAppLink(name, "Catálogo", "card"), "_blank");
  };

  return (
    <div
      className={cn(
        "card-elevated group overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-foreground mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Ideal for */}
        <p className="text-xs text-muted-foreground mb-3">
          <span className="font-semibold text-foreground">Ideal para:</span>{" "}
          {idealFor}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={tag}
              className={cn("chip", tagColors[index % tagColors.length])}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col sm:flex-row gap-2">
          <Button
            variant="cta"
            size="sm"
            className="flex-1 gap-2"
            onClick={handleWhatsAppClick}
          >
            <Phone className="h-4 w-4" />
            Solicitar orçamento
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1 gap-2">
            <Link to={`/produtos/${id}`}>
              Ver detalhes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
