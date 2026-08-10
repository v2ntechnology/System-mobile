import { useEffect, useState } from "react";

/**
 * Reflete `:root.no-blur` (FE-07) em tempo real.
 *
 * O menu de aparência liga e desliga o modo alto desempenho em runtime, então não
 * basta ler a classe na montagem — daí o observer.
 */
export function useNoBlur(): boolean {
  const [noBlur, setNoBlur] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("no-blur"),
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setNoBlur(root.classList.contains("no-blur")));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    setNoBlur(root.classList.contains("no-blur"));
    return () => observer.disconnect();
  }, []);

  return noBlur;
}
