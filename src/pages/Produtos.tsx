import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { 
  CATEGORIES, 
  CATALOG_FILTERS, 
  CATEGORY_FILTERS,
  generateWhatsAppLink,
  trackWhatsAppClick,
} from "@/lib/constants";
import { Filter, X, Phone } from "lucide-react";

export default function Produtos() {
  const [intentionFilters, setIntentionFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleIntention = (id: string) => {
    setIntentionFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleType = (id: string) => {
    setTypeFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setIntentionFilters([]);
    setTypeFilters([]);
  };

  const filteredCategories = CATEGORIES.filter((category) => {
    const filters = CATEGORY_FILTERS[category.id];
    if (!filters) return true;

    const matchesIntention =
      intentionFilters.length === 0 ||
      intentionFilters.some((f) => filters.intentions.includes(f));
    const matchesType =
      typeFilters.length === 0 || typeFilters.includes(filters.type);

    return matchesIntention && matchesType;
  });

  const hasActiveFilters = intentionFilters.length > 0 || typeFilters.length > 0;

  const handleWhatsAppClick = () => {
    trackWhatsAppClick("Catálogo Geral", "Produtos", "page-cta");
    window.open(generateWhatsAppLink("Catálogo Geral", "Produtos", "page-cta"), "_blank");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Catálogo de Produtos
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mb-6">
            Mais de 13 categorias de personalizados para sua empresa, evento ou equipe.
            Produção própria com qualidade garantida.
          </p>
          <Button variant="hero" onClick={handleWhatsAppClick} className="gap-2">
            <Phone className="h-5 w-5" />
            Solicitar orçamento
          </Button>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center">
                  {intentionFilters.length + typeFilters.length}
                </span>
              )}
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block w-full lg:w-64 flex-shrink-0`}
            >
              <div className="card-elevated p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-foreground">Filtros</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-secondary hover:underline"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Intention Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Por intenção
                  </h4>
                  <div className="space-y-2">
                    {CATALOG_FILTERS.intention.map((filter) => (
                      <label
                        key={filter.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={intentionFilters.includes(filter.id)}
                          onChange={() => toggleIntention(filter.id)}
                          className="rounded border-border text-secondary focus:ring-secondary"
                        />
                        <span className="text-sm text-foreground/80">
                          {filter.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Por tipo
                  </h4>
                  <div className="space-y-2">
                    {CATALOG_FILTERS.type.map((filter) => (
                      <label
                        key={filter.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={typeFilters.includes(filter.id)}
                          onChange={() => toggleType(filter.id)}
                          className="rounded border-border text-secondary focus:ring-secondary"
                        />
                        <span className="text-sm text-foreground/80">
                          {filter.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Active filters tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {intentionFilters.map((f) => {
                    const filter = CATALOG_FILTERS.intention.find(
                      (i) => i.id === f
                    );
                    return (
                      <button
                        key={f}
                        onClick={() => toggleIntention(f)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm"
                      >
                        {filter?.label}
                        <X className="h-3 w-3" />
                      </button>
                    );
                  })}
                  {typeFilters.map((f) => {
                    const filter = CATALOG_FILTERS.type.find((i) => i.id === f);
                    return (
                      <button
                        key={f}
                        onClick={() => toggleType(f)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm"
                      >
                        {filter?.label}
                        <X className="h-3 w-3" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Results count */}
              <p className="text-sm text-muted-foreground mb-6">
                Mostrando {filteredCategories.length} de {CATEGORIES.length}{" "}
                categorias
              </p>

              {/* Grid */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <CategoryCard key={category.id} {...category} />
                ))}
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Nenhum produto encontrado com os filtros selecionados.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
