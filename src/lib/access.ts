/**
 * Preview grátis do Dia 1 — desligado de propósito.
 * Ligar exige decisão de negócio (conteúdo vazado vs. conversão de ads).
 */
export const TREINO_PREVIEW_GRATIS = false;

/** Todo o catálogo e o plano guiado exigem assinatura (modelo 100% pago). */
export function canAccessTreino(assinante: boolean, _treinoId?: string, _planoKey?: string | null) {
  if (TREINO_PREVIEW_GRATIS && _treinoId === "base-mobilidade" && !_planoKey) return true;
  return assinante;
}
