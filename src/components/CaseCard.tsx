import { CASES } from "@/lib/constants";

type Case = typeof CASES[number];

interface CaseCardProps {
  item: Case;
  className?: string;
}

export function CaseCard({ item, className = "" }: CaseCardProps) {
  return (
    <figure
      className={
        "group relative overflow-hidden rounded-2xl bg-primary shadow-md transition-transform hover:-translate-y-1 " +
        className
      }
    >
      <img
        src={item.image}
        alt={`${item.title} — ${item.subtitle}`}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
        {item.tag && (
          <span className="inline-block mb-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white">
            {item.tag}
          </span>
        )}
        <h3 className="text-base md:text-lg font-bold leading-tight text-white">{item.title}</h3>
        <p className="text-xs md:text-sm text-white/90">{item.subtitle}</p>
      </figcaption>
    </figure>
  );
}
