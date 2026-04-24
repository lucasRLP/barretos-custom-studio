import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { TESTIMONIALS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || TESTIMONIALS.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="w-full flex-shrink-0 px-4">
              <div className="card-elevated max-w-4xl mx-auto p-6 md:p-8 grid md:grid-cols-[200px_1fr] gap-6 md:gap-8 items-center">
                {/* WhatsApp screenshot thumbnail */}
                {t.proof && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="relative aspect-[9/16] w-full max-w-[180px] mx-auto md:mx-0 overflow-hidden rounded-xl border border-border shadow-sm transition-transform hover:scale-[1.03] hover:shadow-md cursor-zoom-in"
                        aria-label={`Ver depoimento original de ${t.name}`}
                      >
                        <img
                          src={t.proof}
                          alt={`Depoimento de ${t.name} via WhatsApp`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-green-600 text-white">
                          WhatsApp
                        </span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Depoimento de {t.name} • {t.company}
                        </DialogTitle>
                      </DialogHeader>
                      <img
                        src={t.proof}
                        alt={`Depoimento completo de ${t.name}`}
                        className="w-full rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {/* Text block */}
                <div>
                  <Quote className="h-7 w-7 text-secondary/40 mb-3" />
                  {t.highlight && (
                    <p className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-snug">
                      "{t.highlight}"
                    </p>
                  )}
                  <p className="text-sm md:text-base text-muted-foreground italic mb-4 leading-relaxed">
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.company} • {t.city}
                      </p>
                    </div>
                    {t.productTag && (
                      <span className="ml-auto hidden sm:inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                        {t.productTag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {TESTIMONIALS.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-secondary w-8"
                  : "bg-secondary/30 hover:bg-secondary/50 w-2"
              }`}
              aria-label={`Ver depoimento ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
