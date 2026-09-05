import { supabase } from "@/integrations/supabase/client";
import { getAnonymousExternalId } from "@/lib/meta-pixel";
import { getStoredUtm } from "@/lib/utm";

export const FUNNEL_STEPS = ["landing", "checkout", "signup", "pay_start", "purchase"] as const;
export type FunnelStep = (typeof FUNNEL_STEPS)[number];

const DEDUP_PREFIX = "jps:funnel:";

function clip(value: string | undefined, max: number): string | null {
  if (!value) return null;
  const t = value.trim();
  if (!t) return null;
  return t.slice(0, max);
}

function jaDisparouNaSessao(step: FunnelStep): boolean {
  if (typeof window === "undefined") return true;
  try {
    const key = `${DEDUP_PREFIX}${step}`;
    if (sessionStorage.getItem(key)) return true;
    sessionStorage.setItem(key, "1");
    return false;
  } catch {
    return false;
  }
}

/**
 * Grava uma etapa do funil (fire-and-forget). Landing/checkout/signup/pay_start
 * disparam no máximo uma vez por aba; purchase acompanha o Pixel (por pagamento).
 */
export function registrarFunnel(step: FunnelStep, extra?: { from?: string }) {
  if (typeof window === "undefined") return;
  if (step !== "purchase" && jaDisparouNaSessao(step)) return;

  const visitor_id = getAnonymousExternalId();
  if (visitor_id.length < 8) return;

  const utm = getStoredUtm();
  const from_page = clip(extra?.from ?? window.location.pathname, 80);
  const utm_source = clip(utm.utm_source, 120);
  const utm_campaign = clip(utm.utm_campaign, 120);

  void (async () => {
    const { data } = await supabase.auth.getSession();
    await supabase.from("funnel_events").insert({
      step,
      visitor_id,
      user_id: data.session?.user.id ?? null,
      from_page,
      utm_source,
      utm_campaign,
    });
  })().catch(() => {
    /* analytics: não trava a UI */
  });
}
