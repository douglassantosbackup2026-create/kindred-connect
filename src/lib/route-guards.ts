import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { acessoProAtivo } from "@/lib/acesso";
import { canAccessTreino } from "@/lib/access";

/** Paywall de rota: visitante não entra no player — vai para o checkout. */
export async function requireAssinanteBeforeLoad(opts: {
  from: string;
  teaser: string;
  treinoId?: string | undefined;
  planoKey?: string | null | undefined;
}) {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw redirect({ to: "/checkout", search: { from: opts.from, teaser: opts.teaser } });
  }
  const { data: perfil } = await supabase
    .from("profiles")
    .select("assinante, assinante_until, paused_until")
    .eq("id", sessionData.session.user.id)
    .maybeSingle();
  const ativo = acessoProAtivo(
    Boolean(perfil?.assinante),
    perfil?.assinante_until,
    perfil?.paused_until,
  );
  if (ativo) return;
  if (opts.treinoId && canAccessTreino(false, opts.treinoId, opts.planoKey)) return;
  throw redirect({ to: "/checkout", search: { from: opts.from, teaser: opts.teaser } });
}
