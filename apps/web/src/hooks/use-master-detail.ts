import { useEffect, useState } from "react";

/**
 * Seleção do painel de detalhe nas telas master-detail.
 *
 * Mantém sempre um item aberto: painel de detalhe vazio ao lado de uma lista
 * cheia não ajuda ninguém, e obriga um clique a mais para ver qualquer coisa.
 *
 * Se o item selecionado sai da lista — porque o filtro mudou — cai para o
 * primeiro visível em vez de deixar o painel órfão.
 */
export function useMasterDetail<T>(items: T[], getId: (item: T) => string) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !items.some((item) => getId(item) === selectedId)) {
      setSelectedId(getId(items[0]!));
    }
  }, [items, selectedId, getId]);

  const selected = items.find((item) => getId(item) === selectedId) ?? null;

  return { selectedId, setSelectedId, selected };
}
