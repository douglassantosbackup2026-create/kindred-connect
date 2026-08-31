import { useQuery } from "@tanstack/react-query";
import { inicioSemanaBR } from "@/lib/date";
import { fetchRankingSemanal } from "@/lib/ranking";

export function useRankingSemanal(enabled: boolean, limit = 20) {
  const week = inicioSemanaBR();
  const query = useQuery({
    queryKey: ["ranking-semanal", week, limit],
    queryFn: () => fetchRankingSemanal(week, limit),
    enabled,
    staleTime: 60_000,
  });
  return { week, ...query, rows: query.data ?? [] };
}
