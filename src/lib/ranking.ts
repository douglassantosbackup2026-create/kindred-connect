import { supabase } from "@/integrations/supabase/client";
import type { RankingRow } from "@/components/RankingLista";

export async function fetchRankingSemanal(weekStart: string, limit = 20): Promise<RankingRow[]> {
  const { data: entries, error } = await supabase
    .from("league_entries")
    .select("user_id, treinos, minutos, streak_peak")
    .eq("week_start", weekStart)
    .order("treinos", { ascending: false })
    .order("minutos", { ascending: false })
    .limit(limit);
  if (error) throw error;
  const rows = entries ?? [];
  const ids = [...new Set(rows.map((r) => r.user_id))];
  const nomes = new Map<string, string>();
  if (ids.length) {
    const { data: perfis } = await supabase.from("profiles").select("id, nome").in("id", ids);
    for (const p of perfis ?? []) nomes.set(p.id, p.nome ?? "Jogador");
  }
  return rows.map((r, i) => ({
    userId: r.user_id,
    nome: nomes.get(r.user_id) ?? "Jogador",
    treinos: r.treinos,
    minutos: r.minutos,
    streak_peak: r.streak_peak,
    posicao: i + 1,
  }));
}
