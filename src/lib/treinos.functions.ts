import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getTreino, PLANO_FLAT } from "@/data/training";
import { acessoProAtivo } from "@/lib/acesso";
import { planoKeyLiberada, treinouPlanoHoje } from "@/lib/liberacao";

const PLANO_KEY_RE = /^(c-[a-z0-9-]+-\d+|m-\d+|retorno-\d{4}-\d{2}-\d{2})$/;

function hojeBR() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

function planoKeyValido(key: string) {
  if (PLANO_FLAT.some((p) => p.key === key)) return true;
  return PLANO_KEY_RE.test(key);
}

const concluirSchema = z.object({
  treinoId: z.string().min(1).max(80),
  planoKey: z
    .string()
    .max(60)
    .nullable()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null))
    .refine((v) => v == null || planoKeyValido(v), "planoKey inválido"),
});

/**
 * Registra a conclusão de um treino no servidor.
 * Toda validação (assinatura, treino existente, minutos e idempotência diária)
 * acontece aqui — o cliente nunca escolhe os minutos nem burla o paywall.
 */
export const concluirTreinoServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => concluirSchema.parse(input))
  .handler(async ({ data, context }) => {
    const treino = getTreino(data.treinoId);
    if (!treino) throw new Error("Treino não encontrado");

    const { supabase, userId } = context;

    const { data: perfil, error: perfilErr } = await supabase
      .from("profiles")
      .select("assinante, paused_until, assinante_until")
      .eq("id", userId)
      .maybeSingle();
    if (perfilErr) throw new Error(perfilErr.message);

    const acessoAtivo = acessoProAtivo(
      Boolean(perfil?.assinante),
      perfil?.assinante_until,
      perfil?.paused_until,
    );
    if (!acessoAtivo) {
      throw new Error("Assinatura ativa necessária para registrar treinos");
    }

    const dataHoje = hojeBR();
    const minutos = treino.duracaoMin;

    // Liberação por data: 1 dia do plano por dia de calendário, sem pular a ordem.
    if (data.planoKey) {
      const { data: hist, error: histErr } = await supabase
        .from("sessoes")
        .select("data, plano_key")
        .eq("user_id", userId);
      if (histErr) throw new Error(histErr.message);
      const sessoes = (hist ?? []).map((s) => ({ data: s.data, planoKey: s.plano_key }));
      if (!planoKeyLiberada(data.planoKey, sessoes, dataHoje)) {
        throw new Error(
          treinouPlanoHoje(sessoes, dataHoje)
            ? "Você já concluiu o treino do plano hoje. O próximo dia libera à meia-noite."
            : "Este dia do plano ainda não foi liberado. Conclua os anteriores, um por dia.",
        );
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { recalcularLiga } = await import("@/lib/liga.server");

    // Idempotência: um registro por treino por dia (também garantida por UNIQUE no banco)
    const { data: existente } = await supabaseAdmin
      .from("sessoes")
      .select("id")
      .eq("user_id", userId)
      .eq("treino_id", treino.id)
      .eq("data", dataHoje)
      .maybeSingle();

    let duplicado = Boolean(existente);

    if (!existente) {
      const { error } = await supabaseAdmin.from("sessoes").insert({
        user_id: userId,
        treino_id: treino.id,
        plano_key: data.planoKey,
        data: dataHoje,
        minutos,
      });
      // 23505 = violação do UNIQUE (corrida entre dois cliques)
      if (error && error.code !== "23505") throw new Error(error.message);
      if (error) duplicado = true;
    }

    await recalcularLiga(supabaseAdmin, userId);

    return { ok: true as const, duplicado, data: dataHoje, minutos };
  });
