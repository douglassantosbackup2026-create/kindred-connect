import { CreditCard, Lock, ShieldCheck, Star, Truck } from "lucide-react";
import { CountdownOferta } from "@/components/landing/CountdownOferta";
import { CAMPANHA } from "@/data/campanha-copy";

/** Barra fina de urgência no topo do checkout. */
export function UrgenciaCheckout() {
  return (
    <div className="border-b border-primary/25 bg-primary/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2 px-5 py-2 text-center text-xs font-bold text-foreground sm:px-8">
        <span>Sua oferta está reservada por</span>
        <CountdownOferta className="text-sm" />
      </div>
    </div>
  );
}

/** Faixa de compra segura logo abaixo do header. */
export function FaixaSegura() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2 px-5 py-2 sm:px-8">
        <ShieldCheck className="h-4 w-4" />
        <p className="text-xs font-black uppercase tracking-[0.18em]">Compra 100% segura</p>
      </div>
    </div>
  );
}

/** Avaliações + depoimentos curtos reaproveitados da landing. */
export function ProvaSocialCheckout({ className }: { className?: string }) {
  const itens = CAMPANHA.depoimentos.itens.slice(0, 3);
  return (
    <section className={className}>
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <div className="flex" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-sm font-black text-foreground">+2.469 alunos treinando</p>
        </div>
        <ul className="mt-4 space-y-3">
          {itens.map((d) => (
            <li key={d.nome} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                {d.inicial}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">{d.nome}</p>
                <p className="mt-0.5 line-clamp-3 text-xs text-muted-foreground">{d.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Bloco destacado da garantia de 14 dias. */
export function GarantiaBloco({ className }: { className?: string }) {
  return (
    <section className={className}>
      <div className="flex gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
        <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-black text-foreground">{CAMPANHA.garantia.titulo}</p>
          <p className="mt-1 text-xs text-muted-foreground">{CAMPANHA.garantia.body}</p>
        </div>
      </div>
    </section>
  );
}

const SELOS = [
  { icone: Lock, titulo: "Compra", destaque: "SEGURA" },
  { icone: Truck, titulo: "Acesso", destaque: "IMEDIATO" },
  { icone: ShieldCheck, titulo: "Dados", destaque: "PROTEGIDOS" },
] as const;

const BANDEIRAS = ["Pix", "Visa", "Mastercard", "Elo", "Hipercard", "Amex", "Boleto"];

/** Trio de selos + bandeiras aceitas, no rodapé do checkout. */
export function RodapeConfianca() {
  return (
    <footer className="mt-8 border-t border-border/60 pt-6">
      <ul className="grid grid-cols-3 gap-3">
        {SELOS.map(({ icone: Icone, titulo, destaque }) => (
          <li key={destaque} className="flex flex-col items-center gap-1 text-center">
            <Icone className="h-5 w-5 text-primary" />
            <p className="text-[11px] font-semibold text-muted-foreground">{titulo}</p>
            <p className="text-[11px] font-black text-foreground">{destaque}</p>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        {BANDEIRAS.map((b) => (
          <span
            key={b}
            className="rounded-md border border-border/60 bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
          >
            {b}
          </span>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">{CAMPANHA.pagamento}</p>
    </footer>
  );
}
