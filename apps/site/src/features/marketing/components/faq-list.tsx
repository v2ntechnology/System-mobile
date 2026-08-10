import { CaretRight } from "@phosphor-icons/react/ssr";

import { fetchFaqs } from "@/features/marketing/api";

/**
 * `<details>` nativo em vez de um accordion do Radix.
 *
 * O conteúdo fica no HTML mesmo fechado — o buscador indexa a resposta, que é
 * metade do motivo de existir um FAQ — e não custa um componente cliente.
 */
export async function FaqList() {
  const faqs = await fetchFaqs();

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="reveal border-outline-variant bg-surface-low/60 open:bg-surface-low group rounded-lg border px-6"
        >
          <summary className="text-body-lg text-on-surface flex cursor-pointer list-none items-center justify-between gap-4 py-5 marker:hidden">
            {faq.question}
            <CaretRight
              size={18}
              weight="bold"
              aria-hidden="true"
              className="text-on-surface-muted shrink-0 transition-transform duration-200 group-open:rotate-90"
            />
          </summary>
          <p className="text-body-md text-on-surface-variant pb-5">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
