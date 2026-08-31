import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePlayer } from "@/lib/player-store";
import { treinoRapido } from "@/lib/recommendations";

export function useModoRapido(excluirId?: string | null) {
  const { state } = usePlayer();
  const navigate = useNavigate();

  const escolherTreinoRapido = useCallback(
    () => treinoRapido(state.objetivo, state.posicao, excluirId ?? state.ultimoTreinoId),
    [excluirId, state.objetivo, state.posicao, state.ultimoTreinoId],
  );

  const irModoRapido = useCallback(
    (from = "home") => {
      if (!state.assinante) {
        void navigate({
          to: "/checkout",
          search: { from, teaser: "Modo rápido disponível no PRO" },
        });
        return;
      }
      const escolhido = escolherTreinoRapido();
      void navigate({ to: "/treino/$treinoId", params: { treinoId: escolhido.id } });
    },
    [escolherTreinoRapido, navigate, state.assinante],
  );

  return { irModoRapido, escolherTreinoRapido };
}
