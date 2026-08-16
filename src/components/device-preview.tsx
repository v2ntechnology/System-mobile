import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/** No aparelho não existe moldura: o conteúdo ocupa a tela nativa normalmente. */
export function DevicePreview({ children }: Props) {
  return <>{children}</>;
}
