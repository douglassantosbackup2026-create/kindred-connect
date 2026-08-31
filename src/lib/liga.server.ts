import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { inicioSemanaBR } from "@/lib/date";

function diffDias(a: string, b: string) {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86400000);
}

function streakPeak(datas: string[]) {
  const unicas = [...new Set(datas)].sort();
  let melhor = 0;
  let atual = 0;
  for (let i = 0; i < unicas.length; i++) {
    atual = i > 0 && diffDias(unicas[i]!, unicas[i - 1]!) === 1 ? atual + 1 : 1;
    if (atual > melhor) melhor = atual;
  }
  return melhor;
}

/**
 * Recalcula a linha da liga semanal do usuário a partir das sessões reais.
 * Só o servidor escreve em league_entries.
 */
export async function recalcularLiga(
  admin: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  const weekStart = inicioSemanaBR();

  const { data: sessoes } = await admin
    .from("sessoes")
    .select("data, minutos")
    .eq("user_id", userId)
    .order("data", { ascending: true });

  const todas = sessoes ?? [];
  const daSemana = todas.filter((s) => s.data >= weekStart);

  await admin.from("league_entries").upsert(
    {
      user_id: userId,
      week_start: weekStart,
      treinos: daSemana.length,
      minutos: daSemana.reduce((acc, s) => acc + (s.minutos ?? 0), 0),
      streak_peak: streakPeak(todas.map((s) => s.data)),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,week_start" },
  );
}
