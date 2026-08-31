import { describe, expect, it } from "vitest";
import { payloadGrantPro } from "./entitlement";

describe("grantProAccess payload (idempotência)", () => {
  it("soma período no primeiro pagamento aprovado", () => {
    const payload = payloadGrantPro({
      userId: "u1",
      plano: "semestral",
      paymentId: "pay-1",
      untilAtual: null,
    });
    expect(payload.assinante).toBe(true);
    expect(payload.plano).toBe("semestral");
    expect(payload.mp_payment_id).toBe("pay-1");
    expect(payload.assinante_until).toBeTruthy();
  });

  it("não estende until no mesmo pagamento (webhook replay)", () => {
    const payload = payloadGrantPro({
      userId: "u1",
      plano: "semestral",
      paymentId: "pay-1",
      untilAtual: "2027-01-01T00:00:00.000Z",
      extendUntil: false,
    });
    expect("assinante_until" in payload).toBe(false);
    expect(payload.mp_payment_id).toBe("pay-1");
    expect(payload.paused_until).toBeNull();
  });
});
