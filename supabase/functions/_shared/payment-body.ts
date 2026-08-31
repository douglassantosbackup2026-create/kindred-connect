import { PLANOS } from "./mp.ts";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const META_KEYS = [
  "fbp",
  "fbc",
  "event_source_url",
  "client_user_agent",
  "client_ip",
  "referrer_url",
  "checkout_time",
  "checkout_event_id",
] as const;

export type ProcessPaymentBody = {
  plano: string;
  coupon_code: string;
  affiliate_ref: string | null;
  idempotency_key: string;
  device_id: string;
  utm: Record<string, string | undefined>;
  meta: Record<string, string | undefined>;
  formRaw: Record<string, unknown>;
};

function strMap(raw: unknown, keys: readonly string[]): Record<string, string | undefined> {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out: Record<string, string | undefined> = {};
  for (const k of keys) {
    const v = src[k];
    if (typeof v === "string" && v) out[k] = v;
  }
  return out;
}

/** Contrato do body de process-payment — rejeita plano inválido e ignora chaves extras. */
export function parseProcessPaymentBody(raw: unknown): ProcessPaymentBody | { error: string } {
  if (!raw || typeof raw !== "object") return { error: "invalid_body" };
  const body = raw as Record<string, unknown>;
  const plano = typeof body.plano === "string" && body.plano ? body.plano : "semestral";
  if (!PLANOS[plano]) return { error: "invalid_plano" };

  const coupon_code =
    typeof body.coupon_code === "string" ? body.coupon_code.trim().toUpperCase() : "";
  const affiliate_ref = typeof body.affiliate_ref === "string" && body.affiliate_ref ? body.affiliate_ref : null;
  const idempotency_key = typeof body.idempotency_key === "string" ? body.idempotency_key : "";
  const device_id = typeof body.device_id === "string" ? body.device_id : "";
  const formRaw =
    body.formData && typeof body.formData === "object"
      ? (body.formData as Record<string, unknown>)
      : body;

  return {
    plano,
    coupon_code,
    affiliate_ref,
    idempotency_key,
    device_id,
    utm: strMap(body.utm, UTM_KEYS),
    meta: strMap(body.meta, META_KEYS),
    formRaw,
  };
}
