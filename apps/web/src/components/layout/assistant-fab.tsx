import logoMark from "@imgs/logoOfficialBranca.svg";

import { useAssistantStore } from "@/features/assistant/store";

/**
 * Atalho flutuante do "Pergunte à sua frota" (RF-033), no canto inferior direito
 * conforme o Figma. Ctrl+R e Ctrl+K abrem o mesmo painel.
 */
export function AssistantFab() {
  const openAssistant = useAssistantStore((state) => state.openAssistant);
  const open = useAssistantStore((state) => state.open);

  return (
    <button
      type="button"
      onClick={openAssistant}
      aria-label="Abrir o assistente — Pergunte à sua frota"
      aria-haspopup="dialog"
      aria-expanded={open}
      title="Pergunte à sua frota (Ctrl+R)"
      className="bg-primary-strong focus-visible:ring-secondary focus-visible:ring-offset-background fixed bottom-5 right-5 z-30 flex size-14 items-center justify-center rounded-lg shadow-[0_12px_32px_-8px_rgba(99,102,241,0.7)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:bottom-8 sm:right-8"
    >
      <img src={logoMark} alt="" aria-hidden="true" className="h-7 w-auto" />
    </button>
  );
}
