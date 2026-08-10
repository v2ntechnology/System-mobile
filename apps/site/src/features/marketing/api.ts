/**
 * Única fronteira que as páginas de marketing enxergam.
 *
 * Hoje aponta para `src/mocks/marketing.ts`; na integração só o corpo destas
 * funções muda — nenhuma página é tocada.
 */
export {
  fetchModules,
  fetchMetrics,
  fetchSteps,
  fetchTestimonials,
  fetchFaqs,
} from "@/mocks/marketing";

export type { ProductModule, Metric, Step, Testimonial, Faq } from "@/mocks/marketing";
