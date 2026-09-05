export const FUNIL_ETAPAS = [
  { step: "landing", label: "Landing" },
  { step: "checkout", label: "Checkout" },
  { step: "signup", label: "Cadastro" },
  { step: "pay_start", label: "Pagamento" },
  { step: "purchase", label: "Compra" },
] as const;

export type FunilEtapaId = (typeof FUNIL_ETAPAS)[number]["step"];

export type FunilEtapa = {
  step: FunilEtapaId;
  label: string;
  volume: number;
  pctAnterior: number | null;
  pctLanding: number | null;
};

export type VendasFunil = {
  dias: 7 | 30;
  etapas: FunilEtapa[];
  aprovacao: {
    aprovados: number;
    recusados: number;
    pendentes: number;
    taxa: number | null;
  };
};

function pct(n: number, d: number): number | null {
  if (!d) return null;
  return Math.round((n / d) * 100);
}

function statusPagamento(eventType: string): "approved" | "rejected" | "pending" | "other" {
  const t = eventType.toLowerCase();
  if (t.includes("approved")) return "approved";
  if (t.includes("rejected") || t.includes("cancelled") || t.includes("canceled")) return "rejected";
  if (t.includes("pending") || t.includes("in_process")) return "pending";
  return "other";
}

export function montarVendasFunil(opts: {
  dias: 7 | 30;
  funnel: { step: string; visitor_id: string }[];
  intentUserIds: string[];
  payments: { event_type: string; user_id: string | null }[];
}): VendasFunil {
  const visitors: Record<FunilEtapaId, Set<string>> = {
    landing: new Set(),
    checkout: new Set(),
    signup: new Set(),
    pay_start: new Set(),
    purchase: new Set(),
  };

  for (const row of opts.funnel) {
    if (row.step in visitors && row.visitor_id) {
      visitors[row.step as FunilEtapaId].add(row.visitor_id);
    }
  }

  let aprovados = 0;
  let recusados = 0;
  let pendentes = 0;
  const approvedUsers = new Set<string>();
  for (const p of opts.payments) {
    const st = statusPagamento(String(p.event_type ?? ""));
    if (st === "approved") {
      aprovados += 1;
      if (p.user_id) approvedUsers.add(p.user_id);
    } else if (st === "rejected") {
      recusados += 1;
    } else if (st === "pending") {
      pendentes += 1;
    }
  }

  const intentUsers = new Set(opts.intentUserIds.filter(Boolean));
  const volumes: Record<FunilEtapaId, number> = {
    landing: visitors.landing.size,
    checkout: Math.max(visitors.checkout.size, intentUsers.size),
    signup: visitors.signup.size,
    pay_start: visitors.pay_start.size,
    purchase: Math.max(visitors.purchase.size, approvedUsers.size),
  };

  const etapas: FunilEtapa[] = FUNIL_ETAPAS.map((meta, i) => {
    const volume = volumes[meta.step];
    const prev = i === 0 ? null : volumes[FUNIL_ETAPAS[i - 1]!.step];
    return {
      step: meta.step,
      label: meta.label,
      volume,
      pctAnterior: prev === null ? null : pct(volume, prev),
      pctLanding: pct(volume, volumes.landing),
    };
  });

  return {
    dias: opts.dias,
    etapas,
    aprovacao: {
      aprovados,
      recusados,
      pendentes,
      taxa: pct(aprovados, aprovados + recusados),
    },
  };
}
