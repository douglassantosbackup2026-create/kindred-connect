import { useCallback, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminResource } from "@/hooks/use-admin-table";
import { fetchVendasFunil } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

function fmtPct(n: number | null | undefined) {
  return n == null ? "—" : `${n}%`;
}

export function FunilVendas() {
  const [dias, setDias] = useState<7 | 30>(7);
  const loader = useCallback(() => fetchVendasFunil({ data: { dias } }), [dias]);
  const { data, loading, erro } = useAdminResource(loader, "Falha ao carregar o funil");

  const maxVol = Math.max(1, ...(data?.etapas.map((e) => e.volume) ?? [0]));
  const payStart = data?.etapas.find((e) => e.step === "pay_start");
  const compra = data?.etapas.find((e) => e.step === "purchase");
  const aprov = data?.aprovacao;

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <div>
            <h2 className="text-sm font-bold text-foreground">Funil de vendas ({dias} dias)</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Visitantes únicos por etapa. Landing só entra depois deste deploy.
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {([7, 30] as const).map((d) => (
            <Button
              key={d}
              type="button"
              size="sm"
              variant={dias === d ? "default" : "outline"}
              onClick={() => setDias(d)}
            >
              {d} dias
            </Button>
          ))}
        </div>
      </div>

      {erro ? <p className="mt-3 text-sm text-destructive">{erro}</p> : null}

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <ol className="space-y-3">
          {(data?.etapas ?? []).map((e) => (
            <li key={e.step}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                <span className="font-bold text-foreground">{e.label}</span>
                <span className="text-muted-foreground">
                  <span className="font-black text-foreground">{e.volume}</span>
                  {e.pctAnterior != null ? (
                    <>
                      {" "}
                      · {fmtPct(e.pctAnterior)} da etapa ant.
                    </>
                  ) : null}
                  {e.step !== "landing" ? <> · {fmtPct(e.pctLanding)} da landing</> : null}
                </span>
              </div>
              <div className="h-7 overflow-hidden rounded-lg bg-muted">
                <div
                  className={cn("h-full rounded-lg bg-primary transition-[width] duration-300", loading && "opacity-50")}
                  style={{ width: `${Math.max(e.volume ? 4 : 0, (e.volume / maxVol) * 100)}%` }}
                />
              </div>
            </li>
          ))}
          {loading && !data ? (
            <li className="text-sm text-muted-foreground">Carregando funil…</li>
          ) : null}
        </ol>

        <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
          <h3 className="text-sm font-bold text-foreground">Taxa de aprovação</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Mercado Pago no mesmo período. Pendente não entra no denominador.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Aprovados</dt>
              <dd className="text-lg font-black text-foreground">{aprov?.aprovados ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Recusados</dt>
              <dd className="text-lg font-black text-foreground">{aprov?.recusados ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Pix pendente</dt>
              <dd className="text-lg font-black text-foreground">{aprov?.pendentes ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Taxa</dt>
              <dd className="text-lg font-black text-primary">{fmtPct(aprov?.taxa)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Pagamento → Compra (abriu o Brick e concluiu):{" "}
            <span className="font-bold text-foreground">{fmtPct(compra?.pctAnterior)}</span>
            {payStart && payStart.volume === 0 ? (
              <span className="block mt-1">A etapa Pagamento só preenche com eventos novos.</span>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  );
}
