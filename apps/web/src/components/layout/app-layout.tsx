import { Outlet } from "react-router-dom";

import { AssistantDialog } from "@/features/assistant/components/assistant-dialog";
import { useAssistantShortcut } from "@/features/assistant/use-assistant-shortcut";

import { AssistantFab } from "./assistant-fab";

/**
 * Casca de todas as telas autenticadas do painel.
 *
 * Cada página traz o próprio `PageBanner` (que já contém a navegação), porque a
 * faixa superior muda bastante entre o dashboard e as listas.
 */
export function AppLayout() {
  useAssistantShortcut();

  return (
    <div className="bg-background min-h-dvh">
      <Outlet />
      <AssistantFab />
      <AssistantDialog />
    </div>
  );
}
