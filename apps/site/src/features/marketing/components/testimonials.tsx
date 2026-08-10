import { Quotes } from "@phosphor-icons/react/ssr";

import { LightCard } from "@/components/ui/light-card";
import { fetchTestimonials } from "@/features/marketing/api";

export async function Testimonials() {
  const testimonials = await fetchTestimonials();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {testimonials.map((item) => (
        /*
         * Bloco claro sobre o grafite — a mesma inversão do dashboard. Todo texto
         * aqui usa `on-light-*`: `on-surface-variant` sumiria (regra 2b).
         */
        <LightCard key={item.author} className="reveal gap-4">
          <Quotes size={28} weight="fill" className="text-primary-on-light" aria-hidden="true" />

          <blockquote className="text-body-lg text-on-light flex-1 text-pretty">
            {item.quote}
          </blockquote>

          <footer className="border-light-outline border-t pt-4">
            <p className="text-body-md text-on-light font-medium">{item.author}</p>
            <p className="text-label-md text-on-light-muted">
              {item.role} · {item.company}
            </p>
          </footer>
        </LightCard>
      ))}
    </div>
  );
}
