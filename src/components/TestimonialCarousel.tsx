import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { useEffect, useState } from "react";

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.id}
            className="w-full flex-shrink-0 px-4"
          >
            <div className="card-elevated p-6 md:p-8 max-w-2xl mx-auto text-center">
              <Quote className="h-8 w-8 text-secondary/30 mx-auto mb-4" />
              <p className="text-lg md:text-xl text-foreground mb-6 italic">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.company} • {testimonial.city}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-secondary w-6"
                : "bg-secondary/30 hover:bg-secondary/50"
            }`}
            aria-label={`Ver depoimento ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
