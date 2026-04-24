import { useEffect, useState } from "react";
import { INFO_STRIPS } from "@/lib/constants";

export function InfoStrip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (INFO_STRIPS.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % INFO_STRIPS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-primary text-white text-[11px] md:text-xs">
      <div className="container-custom py-1.5 flex items-center justify-between gap-4">
        <div className="flex-1 overflow-hidden">
          {/* Mobile: rotating single message */}
          <p className="md:hidden text-center truncate" key={index}>
            {INFO_STRIPS[index]}
          </p>
          {/* Desktop: all messages separated */}
          <ul className="hidden md:flex items-center gap-6 justify-center">
            {INFO_STRIPS.map((msg) => (
              <li key={msg} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-brand-yellow" />
                {msg}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
