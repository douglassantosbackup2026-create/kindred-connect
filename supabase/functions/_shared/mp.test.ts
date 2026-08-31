import { describe, expect, it } from "vitest";
import {
  buildIdempotencyKey,
  buildMpManifest,
  parseMpSignatureHeader,
  paymentBelongsToUser,
  pickMpPaymentFields,
  PLANOS,
  verifyMpWebhookSignature,
} from "./mp.ts";
import { escapeHtml } from "./html.ts";
import { hmacSha256Hex } from "./crypto.ts";
import { parseProcessPaymentBody } from "./payment-body.ts";

describe("process-payment contract helpers", () => {
  it("rejeita plano inválido", () => {
    expect(PLANOS["vip"]).toBeUndefined();
    expect(PLANOS.semestral.amount).toBe(147);
  });

  it("não espalha campos extras do Brick", () => {
    const picked = pickMpPaymentFields({
      token: "tok_1",
      payment_method_id: "visa",
      installments: 1,
      issuer_id: "24",
      capture: false,
      coupon_amount: 99,
      notification_url: "https://evil.example",
      payer: { email: "a@b.com", identification: { type: "CPF", number: "529.982.247-25" } },
    });
    expect(picked.capture).toBeUndefined();
    expect(picked.coupon_amount).toBeUndefined();
    expect(picked.notification_url).toBeUndefined();
    expect(picked.token).toBe("tok_1");
    expect((picked.payer as { identification: { number: string } }).identification.number).toBe("52998224725");
  });

  it("amarra idempotency ao user.id", async () => {
    const userA = "11111111-1111-1111-1111-111111111111";
    const userB = "22222222-2222-2222-2222-222222222222";
    const client = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
    const a = await buildIdempotencyKey(userA, client, "fallback");
    const b = await buildIdempotencyKey(userB, client, "fallback");
    expect(a).not.toBe(b);
    expect(a).toHaveLength(64);
  });

  it("recusa pagamento de outro usuário", () => {
    const payment = { external_reference: "user-a", metadata: { supabase_user_id: "user-a" } };
    expect(paymentBelongsToUser(payment, "user-a")).toBe(true);
    expect(paymentBelongsToUser(payment, "user-b")).toBe(false);
  });
});

describe("mercadopago-webhook signature", () => {
  it("parseia ts e v1", () => {
    expect(parseMpSignatureHeader("ts=123,v1=abc")).toEqual({ ts: "123", v1: "abc" });
  });

  it("aceita HMAC válido e rejeita inválido", async () => {
    const secret = "test-secret";
    const dataId = "123456";
    const requestId = "req-1";
    const ts = String(Date.now());
    const manifest = buildMpManifest(dataId, requestId, ts);
    const v1 = await hmacSha256Hex(secret, manifest);
    expect(
      await verifyMpWebhookSignature({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: requestId,
        dataId,
        secret,
      }),
    ).toBe(true);
    expect(
      await verifyMpWebhookSignature({
        xSignature: `ts=${ts},v1=deadbeef`,
        xRequestId: requestId,
        dataId,
        secret,
      }),
    ).toBe(false);
    expect(
      await verifyMpWebhookSignature({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: requestId,
        dataId,
        secret: "",
      }),
    ).toBe(false);
  });

  it("HMAC válido é o contrato 200 skip (topic != payment)", async () => {
    const secret = "qa-webhook-secret";
    const ts = String(Date.now());
    const dataId = "";
    const requestId = "qa-req";
    const v1 = await hmacSha256Hex(secret, buildMpManifest(dataId, requestId, ts));
    expect(
      await verifyMpWebhookSignature({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: requestId,
        dataId,
        secret,
      }),
    ).toBe(true);
  });
});

describe("escapeHtml", () => {
  it("escapa nome em e-mail", () => {
    expect(escapeHtml(`<img src=x onerror=alert(1)>`)).not.toContain("<img");
  });
});

describe("process-payment body contract", () => {
  it("rejeita plano inválido no parser", () => {
    const parsed = parseProcessPaymentBody({ plano: "vip", formData: { token: "t" } });
    expect(parsed).toEqual({ error: "invalid_plano" });
  });

  it("normaliza cupom e ignora chaves extras", () => {
    const parsed = parseProcessPaymentBody({
      plano: "semestral",
      coupon_code: "  promo10 ",
      capture: false,
      notification_url: "https://evil.example",
      utm: { utm_source: "meta", extra: "drop" },
      formData: { token: "tok", installments: 12, coupon_amount: 1 },
    });
    expect("error" in parsed).toBe(false);
    if ("error" in parsed) return;
    expect(parsed.coupon_code).toBe("PROMO10");
    expect(parsed.plano).toBe("semestral");
    expect(parsed.utm.utm_source).toBe("meta");
    expect((parsed.utm as { extra?: string }).extra).toBeUndefined();
  });

  it("limita parcelas ao teto do plano", () => {
    const semestral = pickMpPaymentFields({ installments: 12, payment_method_id: "visa" }, PLANOS.semestral.maxInstallments);
    expect(semestral.installments).toBe(6);
    const anual = pickMpPaymentFields({ installments: 24, payment_method_id: "visa" }, PLANOS.anual.maxInstallments);
    expect(anual.installments).toBe(12);
    const mensal = pickMpPaymentFields({ installments: 6, payment_method_id: "visa" }, PLANOS.mensal.maxInstallments);
    expect(mensal.installments).toBe(1);
  });
});
