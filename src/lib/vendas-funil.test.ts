import { describe, expect, it } from "vitest";
import { montarVendasFunil } from "./vendas-funil";

describe("montarVendasFunil", () => {
  it("conta visitantes distintos e usa fallback histórico em checkout e compra", () => {
    const funil = montarVendasFunil({
      dias: 7,
      funnel: [
        { step: "landing", visitor_id: "v1" },
        { step: "landing", visitor_id: "v1" },
        { step: "landing", visitor_id: "v2" },
        { step: "checkout", visitor_id: "v1" },
        { step: "signup", visitor_id: "v1" },
        { step: "pay_start", visitor_id: "v1" },
        { step: "purchase", visitor_id: "v1" },
      ],
      intentUserIds: ["u-hist", "u-hist", "u-novo"],
      payments: [
        { event_type: "payment.approved", user_id: "u-hist" },
        { event_type: "payment.rejected", user_id: "u-x" },
        { event_type: "payment.pending", user_id: "u-pix" },
        { event_type: "payment.cancelled", user_id: "u-y" },
      ],
    });

    const byStep = (step: string) => funil.etapas.find((e) => e.step === step);
    expect(byStep("landing")?.volume).toBe(2);
    expect(byStep("checkout")?.volume).toBe(2);
    expect(byStep("signup")?.volume).toBe(1);
    expect(byStep("pay_start")?.volume).toBe(1);
    expect(byStep("purchase")?.volume).toBe(1);

    expect(funil.aprovacao).toEqual({
      aprovados: 1,
      recusados: 2,
      pendentes: 1,
      taxa: 33,
    });
    expect(byStep("checkout")?.pctLanding).toBe(100);
    expect(byStep("signup")?.pctAnterior).toBe(50);
  });

  it("exclui Pix pendente da taxa de aprovação", () => {
    const funil = montarVendasFunil({
      dias: 30,
      funnel: [],
      intentUserIds: [],
      payments: [
        { event_type: "payment.approved", user_id: "a" },
        { event_type: "payment.approved", user_id: "b" },
        { event_type: "payment.in_process", user_id: "c" },
      ],
    });
    expect(funil.aprovacao.taxa).toBe(100);
    expect(funil.aprovacao.pendentes).toBe(1);
  });
});
