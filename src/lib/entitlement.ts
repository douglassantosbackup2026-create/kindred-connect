import type { SupabaseClient } from "@supabase/supabase-js";
import { extenderAcesso } from "@/lib/acesso";

export type GrantProOpts = {
  userId: string;
  plano: string;
  paymentId: string;
  payerId?: string | null;
  referredBy?: string | null;
  untilAtual?: string | null;
  extendUntil?: boolean;
};

export function payloadGrantPro(opts: GrantProOpts) {
  return {
    assinante: true as const,
    plano: opts.plano,
    ...(opts.extendUntil === false
      ? {}
      : { assinante_until: extenderAcesso(opts.untilAtual, opts.plano) }),
    mp_payment_id: opts.paymentId,
    mp_payer_id: opts.payerId ?? null,
    ...(opts.referredBy ? { referred_by: opts.referredBy } : {}),
    paused_until: null,
    pause_reason: null,
    pause_used_at: null,
    cancelled_at: null,
    cancel_reason: null,
  };
}

export async function grantProAccess(
  admin: SupabaseClient,
  opts: GrantProOpts,
) {
  await admin.from("profiles").update(payloadGrantPro(opts)).eq("id", opts.userId);
  await admin
    .from("checkout_intents")
    .update({ purchased_at: new Date().toISOString(), plano: opts.plano })
    .eq("user_id", opts.userId);
}
