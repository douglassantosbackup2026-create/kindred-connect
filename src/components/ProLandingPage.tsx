import { Check, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRO_COPY } from "@/data/pro-copy";
import { type LandingSearch } from "@/lib/checkout";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/lib/player-store";
import { TopBar } from "@/components/landing/TopBar";
import { DepoimentosSection } from "@/components/landing/DepoimentosSection";
import { SelosConfianca } from "@/components/landing/SelosConfianca";
import { AppShowcase } from "@/components/landing/AppShowcase";
import {
  Eyebrow,
  LandingFaq,
  LandingFooter,
  Section,
  StickyCta,
} from "@/components/landing/LandingShell";
import { useLandingCheckout } from "@/hooks/use-landing-checkout";

function rolarParaPlanos() {
  document.getElementById("planos-pro")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ProLandingPage({ search }: { search: LandingSearch }) {
  const { logado } = usePlayer();
  const { planoAtivo, irParaCheckout, zap } = useLandingCheckout(
    "pro",
    search,
    PRO_COPY.heroCtaPlano,
  );


  const precoAtivo =
    PRO_COPY.planos.itens.find((p) => p.id === planoAtivo)?.preco ?? PRO_COPY.planos.itens[0]!.preco;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background pb-24 text-foreground md:pb-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_50%_-10%,_oklch(0.78_0.2_141_/_0.18),_transparent_55%)]" />

      <TopBar logado={logado} onAssinar={() => irParaCheckout(planoAtivo)} />

      <div className="relative mt-14">
        <div className="relative border-b border-border/60 bg-primary/10 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-5 py-2 text-center">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground sm:text-xs">
              {PRO_COPY.barra.prefixo}
            </p>
            <p className="w-full text-[10px] text-muted-foreground sm:w-auto sm:text-[11px]">
              {PRO_COPY.barra.sufixo}
            </p>
          </div>
        </div>
        <div className="border-b border-border/60 bg-card/80 shadow-soft backdrop-blur">
          <p className="mx-auto max-w-6xl px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
            {PRO_COPY.faixaTopo}
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-12 sm:px-8 md:pb-16 md:pt-16">
        <div className="animate-in fade-in slide-in-from-bottom-4 max-w-3xl duration-700">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary sm:text-sm">
            {PRO_COPY.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {PRO_COPY.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{PRO_COPY.sub}</p>
          <p className="mt-4 max-w-2xl text-sm font-bold text-foreground">{PRO_COPY.socialProofHero}</p>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {PRO_COPY.recebeLabel}
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {PRO_COPY.recebe.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground sm:text-base">
                <Check className="h-4 w-4 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              size="lg"
              className="h-14 w-full px-8 text-base font-extrabold sm:w-auto sm:min-w-[260px]"
              onClick={() => irParaCheckout(planoAtivo)}
            >
              {PRO_COPY.heroCta}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full px-8 text-base font-extrabold sm:w-auto sm:min-w-[200px]"
              onClick={rolarParaPlanos}
            >
              {PRO_COPY.heroCtaSecundario}
            </Button>
          </div>
          <p className="mt-4 text-sm font-bold text-foreground">{PRO_COPY.heroHint}</p>
          <div className="mt-4">
            <SelosConfianca />
          </div>
        </div>
      </section>

      {/* Problema */}
      <Section tone="card">
        <Eyebrow>{PRO_COPY.problema.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-3xl">
          {PRO_COPY.problema.title}
        </h2>
        <div className="mt-6 max-w-2xl space-y-2">
          {PRO_COPY.problema.linhas.map((l) => (
            <p key={l} className="text-sm text-muted-foreground sm:text-base">
              {l}
            </p>
          ))}
        </div>
        <div className="mt-8 border-l-2 border-primary pl-5">
          <p className="text-xl font-black text-foreground sm:text-2xl">{PRO_COPY.problema.quebraTitulo}</p>
          <p className="mt-1 text-lg font-semibold text-primary sm:text-xl">{PRO_COPY.problema.quebraBody}</p>
        </div>
        <div className="mt-8 space-y-1">
          {PRO_COPY.problema.fecho.map((l) => (
            <p key={l} className="text-sm font-semibold text-foreground sm:text-base">
              {l}
            </p>
          ))}
        </div>
      </Section>

      {/* Sistema 10x20 */}
      <Section>
        <Eyebrow>{PRO_COPY.sistema.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-2xl font-extrabold tracking-tight sm:text-3xl">
          {PRO_COPY.sistema.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO_COPY.sistema.body}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRO_COPY.sistema.itens.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-2xl border border-border/60 bg-card/70 p-5 text-sm font-semibold text-foreground shadow-soft"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm font-bold text-primary sm:text-base">{PRO_COPY.sistema.fecho}</p>
      </Section>

      {/* Números */}
      <Section tone="card">
        <Eyebrow>{PRO_COPY.numeros.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-2xl font-extrabold tracking-tight sm:text-3xl">
          {PRO_COPY.numeros.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO_COPY.numeros.body}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRO_COPY.numeros.itens.map((n) => (
            <div key={n.label} className="rounded-2xl border border-border/60 bg-background/60 p-5 shadow-soft">
              <p className="text-2xl font-black text-primary">{n.valor}</p>
              <p className="mt-1 text-sm text-muted-foreground">{n.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Treinos */}
      <Section>
        <Eyebrow>{PRO_COPY.treinos.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO_COPY.treinos.title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRO_COPY.treinos.itens.map((t) => (
            <div key={t.nome} className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{t.tempo}</p>
              <p className="mt-2 text-lg font-extrabold text-foreground">{t.nome}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
        <Button
          size="lg"
          className="mt-8 h-14 w-full text-base font-extrabold sm:w-auto sm:min-w-[280px]"
          onClick={() => irParaCheckout(planoAtivo)}
        >
          {PRO_COPY.treinos.cta}
        </Button>
      </Section>

      {/* Dentro do app */}
      <Section tone="card">
        <Eyebrow>Veja por dentro</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
          É isto que você abre todo dia.
        </h2>
        <AppShowcase />
      </Section>

      {/* Comparativo */}
      <Section>
        <Eyebrow>{PRO_COPY.comparativo.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {PRO_COPY.comparativo.title}
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-border/60 bg-card/70 p-6 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-muted-foreground">
              {PRO_COPY.comparativo.sem.titulo}
            </p>
            <ul className="mt-4 space-y-3">
              {PRO_COPY.comparativo.sem.itens.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-primary/40 bg-primary/5 p-6 shadow-soft ring-1 ring-primary/20">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">
              {PRO_COPY.comparativo.com.titulo}
            </p>
            <ul className="mt-4 space-y-3">
              {PRO_COPY.comparativo.com.itens.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-semibold text-foreground sm:text-base">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Tudo o que desbloqueia */}
      <Section tone="card">
        <Eyebrow>{PRO_COPY.desbloqueia.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {PRO_COPY.desbloqueia.title}
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRO_COPY.desbloqueia.itens.map((i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-medium text-foreground sm:text-base">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {i}
            </li>
          ))}
        </ul>
      </Section>

      {/* Depoimentos */}
      <Section>
        <Eyebrow>{PRO_COPY.depoimentos.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {PRO_COPY.depoimentos.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {PRO_COPY.depoimentos.body}
        </p>
        <DepoimentosSection onCta={() => irParaCheckout(planoAtivo)} />
      </Section>

      {/* Bônus */}
      <Section tone="card">
        <Eyebrow>{PRO_COPY.bonus.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO_COPY.bonus.title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PRO_COPY.bonus.itens.map((b) => (
            <div key={b.titulo} className="rounded-2xl border border-border/60 bg-background/60 p-5 shadow-soft">
              <p className="text-base font-extrabold text-foreground">{b.titulo}</p>
              <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Planos */}
      <Section id="planos-pro">
        <Eyebrow>{PRO_COPY.planos.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO_COPY.planos.title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO_COPY.planos.body}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PRO_COPY.planos.itens.map((plano) => {
            const destaque = plano.id === "anual";
            const selecionado = planoAtivo === plano.id;
            return (
              <div
                key={plano.id}
                className={cn(
                  "relative flex flex-col rounded-[1.5rem] border bg-card/70 p-6 shadow-soft transition-all",
                  destaque ? "border-primary ring-1 ring-primary/40" : "border-border/60",
                  selecionado && "bg-primary/5 ring-2 ring-primary",
                )}
              >
                {plano.badge ? (
                  <span
                    className={cn(
                      "absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                      destaque
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {plano.badge}
                  </span>
                ) : null}

                <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">{plano.nome}</p>
                {plano.de ? (
                  <p className="mt-3 text-xs text-muted-foreground line-through">{plano.de}</p>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">Sem fidelidade</p>
                )}
                <p className="mt-1 text-4xl font-black tracking-tight text-foreground">{plano.preco}</p>
                <p className="text-sm text-muted-foreground">{plano.periodo}</p>
                <p className="mt-1 text-sm font-bold text-primary">{plano.parcelas}</p>

                {plano.recebeLabel ? (
                  <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
                    {plano.recebeLabel}
                  </p>
                ) : null}
                <ul className="mt-3 flex-1 space-y-2">
                  {plano.inclui.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  variant={destaque ? "default" : "outline"}
                  className="mt-6 h-12 w-full text-sm font-extrabold"
                  onClick={() => irParaCheckout(plano.id)}
                >
                  {plano.cta}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <SelosConfianca />
        </div>
      </Section>

      {/* Garantia */}
      <Section tone="card">
        <div className="flex max-w-3xl items-start gap-3 rounded-[1.25rem] border border-primary/30 bg-primary/5 p-6 shadow-soft">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-lg font-extrabold text-foreground">{PRO_COPY.garantia.titulo}</p>
            <p className="mt-2 text-sm text-muted-foreground">{PRO_COPY.garantia.body}</p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <LandingFaq
          eyebrow={PRO_COPY.faq.eyebrow}
          title={PRO_COPY.faq.title}
          itens={PRO_COPY.faq.itens}
        />
      </Section>

      {/* Fechamento */}
      <Section tone="card">
        <h2 className="max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">{PRO_COPY.final.title}</h2>
        <div className="mt-4 max-w-2xl space-y-2">
          {PRO_COPY.final.linhas.map((l) => (
            <p key={l} className="text-sm text-muted-foreground sm:text-base">
              {l}
            </p>
          ))}
        </div>
        <Button
          size="lg"
          className="mt-8 h-14 w-full text-base font-extrabold sm:w-auto sm:min-w-[280px]"
          onClick={() => irParaCheckout(planoAtivo)}
        >
          {PRO_COPY.final.cta}
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">{PRO_COPY.final.hint}</p>
      </Section>

      <LandingFooter brand={PRO_COPY.brand} tagline={PRO_COPY.footerTagline} zap={zap} />

      <StickyCta
        label={`${PRO_COPY.heroCta} · ${precoAtivo}`}
        hint={PRO_COPY.garantia.curta}
        onClick={() => irParaCheckout(planoAtivo)}
      />
    </main>
  );
}
