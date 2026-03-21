import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  CATEGORIES, 
  TECHNIQUES,
  generateWhatsAppLink, 
  trackWhatsAppClick 
} from "@/lib/constants";
import { Phone, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";

const tagColors = ["chip-blue", "chip-green", "chip-yellow", "chip-lime"];

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const category = CATEGORIES.find((c) => c.id === categoryId);
  
  if (!category) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Categoria não encontrada
          </h1>
          <Button variant="cta" asChild>
            <Link to="/produtos">Ver catálogo</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const currentIndex = CATEGORIES.findIndex((c) => c.id === categoryId);
  const prevCategory = currentIndex > 0 ? CATEGORIES[currentIndex - 1] : null;
  const nextCategory = currentIndex < CATEGORIES.length - 1 ? CATEGORIES[currentIndex + 1] : null;

  const handleWhatsAppClick = (position: string) => {
    trackWhatsAppClick(category.name, `Categoria - ${category.name}`, position);
    window.open(
      generateWhatsAppLink(category.name, `Categoria - ${category.name}`, position),
      "_blank"
    );
  };

  const categoryImage = getProductImage(category.id);
  const imageSrc = categoryImage !== "/placeholder.svg" ? categoryImage : category.image;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-primary-foreground/60 mb-6">
                <Link to="/" className="hover:text-primary-foreground">Home</Link>
                <span>/</span>
                <Link to="/produtos" className="hover:text-primary-foreground">Produtos</Link>
                <span>/</span>
                <span className="text-primary-foreground">{category.name}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                {category.name}
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-4">
                {category.description}
              </p>
              <p className="text-primary-foreground/70 mb-6">
                <span className="font-semibold text-primary-foreground">Ideal para:</span>{" "}
                {category.idealFor}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {category.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={cn(
                      "chip",
                      tagColors[index % tagColors.length],
                      "bg-primary-foreground/10 text-primary-foreground"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => handleWhatsAppClick("hero")}
                  className="gap-2"
                >
                  <Phone className="h-5 w-5" />
                  Solicitar orçamento
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-primary-foreground/10">
                <img
                  src={imageSrc}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Detalhes do Produto
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Características
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
                    Produção própria com controle de qualidade
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
                    Diversas opções de cores e tamanhos
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
                    Personalização com múltiplas técnicas
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
                    Entrega para todo o Brasil
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Técnicas Recomendadas
                </h3>
                <div className="space-y-3">
                  {TECHNIQUES.slice(0, 3).map((technique) => (
                    <Link
                      key={technique.id}
                      to={`/tecnicas#${technique.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <span className="text-secondary font-bold text-sm">
                          {technique.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {technique.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {technique.idealFor}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="card-elevated p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Pronto para começar?
              </h3>
              <p className="text-muted-foreground mb-6">
                Envie sua demanda e receba um orçamento personalizado.
              </p>
              <Button
                variant="cta"
                size="lg"
                onClick={() => handleWhatsAppClick("details-cta")}
                className="gap-2"
              >
                <Phone className="h-5 w-5" />
                Solicitar orçamento para {category.name}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 bg-muted/50 border-t border-border">
        <div className="container-custom">
          <div className="flex justify-between items-center">
            {prevCategory ? (
              <Link
                to={`/produtos/${prevCategory.id}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">{prevCategory.name}</span>
              </Link>
            ) : (
              <div />
            )}
            <Link
              to="/produtos"
              className="text-sm text-secondary hover:underline"
            >
              Ver todos os produtos
            </Link>
            {nextCategory ? (
              <Link
                to={`/produtos/${nextCategory.id}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="text-sm">{nextCategory.name}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border lg:hidden z-40">
        <Button
          variant="cta"
          className="w-full gap-2"
          onClick={() => handleWhatsAppClick("sticky")}
        >
          <Phone className="h-5 w-5" />
          Solicitar orçamento
        </Button>
      </div>
    </Layout>
  );
}
