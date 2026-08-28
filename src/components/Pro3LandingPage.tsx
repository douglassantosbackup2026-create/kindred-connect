import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, ShieldCheck, Timer, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PRO3_COPY } from "@/data/pro3-copy";
import { captureUtmFromSearch } from "@/lib/utm";
import { searchCheckout, type LandingSearch } from "@/lib/checkout";
import { trackMetaCustom, trackMetaDedup } from "@/lib/meta-pixel";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/lib/player-store";
import { TopBar } from "@/components/landing/TopBar";
import { DepoimentosSection } from "@/components/landing/DepoimentosSection";
import { AppShowcaseCarousel } from "@/components/landing/AppShowcaseCarousel";
import { CountdownOferta } from "@/components/landing/CountdownOferta";
import { whatsappSupportHref } from "@/lib/product-config";

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRO3_COPY.faq.itens.map((f) => ({
    "@type": "Question",
    name: f.pergunta,
    acceptedAnswer: { "@type": "Answer", text: f.resposta },
  })),
});

function rolarParaPlanos() {
  document.getElementById("planos-pro3")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Pro3LandingPage({ search }: { search: LandingSearch }) {
  const { logado } = usePlayer();
  const navigate = useNavigate();
  const [planoAtivo, setPlanoAtivo] = useState<string>(search.plano ?? PRO3_COPY.hero.ctaPlano);
  const zap = whatsappSupportHref("Oi! Quero tirar uma dúvida sobre o Jogador PRO.");

  useEffect(() => {
    captureUtmFromSearch(search);
    trackMetaDedup("ViewContent", {
      content_name: "landing_pro3",
      content_category: search.utm_campaign ?? "organic",
    });
    trackMetaCustom("LandingView", {
      pagina: "pro3",
      utm_source: search.utm_source ?? "",
      utm_campaign: search.utm_campaign ?? "",
    });
  }, [search]);

  const irParaCheckout = useCallback(
    (plano?: string) => {
      const alvo = plano ?? planoAtivo ?? PRO3_COPY.hero.ctaPlano;
      setPlanoAtivo(alvo);
      trackMetaDedup("InitiateCheckout", {
        content_name: alvo,
        currency: "BRL",
        num_items: 1,
      });
      void navigate({
        to: "/checkout",
        search: searchCheckout({
          from: "landing",
          plano: alvo,
          ref: search.ref,
          teaser: search.teaser,
          utm_source: search.utm_source,
          utm_medium: search.utm_medium,
          utm_campaign: search.utm_campaign,
          utm_content: search.utm_content,
          utm_term: search.utm_term,
        }),
      });
    },
    [navigate, search, planoAtivo],
  );

  const precoAtivo =
    PRO3_COPY.oferta.itens.find((p) => p.id === planoAtivo)?.preco ?? PRO3_COPY.oferta.itens[2]!.preco;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background pb-24 text-foreground md:pb-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_50%_-10%,_oklch(0.78_0.2_141_/_0.18),_transparent_55%)]" />

      <TopBar logado={logado} onAssinar={() => irParaCheckout(planoAtivo)} />

      {/* Barra de oferta + contador */}
      <div className="relative mt-14 border-b border-border/60 bg-primary/10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2.5 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary sm:text-xs">
            {PRO3_COPY.topo.destaque}
          </p>
          <p className="text-[11px] text-muted-foreground sm:text-xs">{PRO3_COPY.topo.texto}</p>
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-foreground sm:text-xs">
            <Timer className="h-3.5 w-3.5 text-primary" />
            {PRO3_COPY.topo.countdownLabel} <CountdownOferta className="text-sm" />
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="relative mx-auto w-full max-w-4xl px-5 pb-12 pt-12 sm:px-8 md:pb-16 md:pt-16">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary sm:text-sm">
            {PRO3_COPY.hero.selo}
          </p>

          <h1 className="mx-auto mt-6 inline-block border-2 border-foreground px-5 py-4 text-3xl font-black uppercase leading-[1.03] tracking-tight sm:px-7 sm:py-6 sm:text-5xl lg:text-6xl">
            {PRO3_COPY.hero.headline.map((linha, i) => (
              <span key={linha} className={cn("block", i === 2 && "text-primary")}>
                {linha}
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">{PRO3_COPY.hero.sub}</p>

          <div className="mx-auto mt-8 max-w-3xl">
            <AppShowcaseCarousel />
          </div>

          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-foreground sm:text-base">
            {PRO3_COPY.hero.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:items-center">
            <Button
              size="lg"
              className="h-14 w-full px-8 text-base font-extrabold sm:w-auto sm:min-w-[280px]"
              onClick={() => irParaCheckout(planoAtivo)}
            >
              {PRO3_COPY.hero.cta} →
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full px-8 text-base font-extrabold sm:w-auto sm:min-w-[180px]"
              onClick={rolarParaPlanos}
            >
              {PRO3_COPY.hero.ctaSecundario}
            </Button>
          </div>

          <ul className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {PRO3_COPY.hero.selos.map((s) => (
              <li key={s} className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-muted-foreground sm:text-xs">
                <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
                {s}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-4 max-w-2xl text-xs text-muted-foreground">{PRO3_COPY.hero.notaIdade}</p>
        </div>
      </section>

      {/* O que você vai treinar */}
      <Section tone="card">
        <Eyebrow>{PRO3_COPY.habilidades.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-4xl">
          {PRO3_COPY.habilidades.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO3_COPY.habilidades.sub}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRO3_COPY.habilidades.itens.map((h) => (
            <div key={h.titulo} className="rounded-2xl border border-border/60 bg-background/60 p-5 shadow-soft">
              <span className="text-2xl" aria-hidden="true">
                {h.icone}
              </span>
              <p className="mt-3 text-base font-black uppercase tracking-[0.12em] text-primary">{h.titulo}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
            </div>
          ))}
        </div>
        <Button
          size="lg"
          className="mt-8 h-14 w-full text-base font-extrabold sm:w-auto sm:min-w-[300px]"
          onClick={() => irParaCheckout(planoAtivo)}
        >
          {PRO3_COPY.hero.cta} →
        </Button>
      </Section>

      {/* Problema */}
      <Section>

        <Eyebrow>{PRO3_COPY.problema.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-4xl">
          {PRO3_COPY.problema.title}
        </h2>
        <p className="mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO3_COPY.problema.body}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {PRO3_COPY.problema.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-foreground shadow-soft sm:text-base"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                <X className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-8 border-l-2 border-primary pl-5">
          <p className="text-lg font-black text-foreground sm:text-xl">{PRO3_COPY.problema.fecho}</p>
        </div>
      </Section>

      {/* Números de autoridade */}
      <div className="relative border-b border-border/50 bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 sm:px-8 lg:grid-cols-4">
          {PRO3_COPY.numeros.map((n) => (
            <div key={n.label} className="text-center">
              <p className="text-3xl font-black tracking-tight text-primary sm:text-4xl">{n.valor}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
                {n.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 02 Comparativo */}
      <Section tone="card">
        <Eyebrow>{PRO3_COPY.comparativo.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-2xl font-extrabold tracking-tight sm:text-3xl">
          {PRO3_COPY.comparativo.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO3_COPY.comparativo.sub}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PRO3_COPY.comparativo.itens.map((c) => (
            <div
              key={c.nome}
              className={cn(
                "flex flex-col rounded-[1.5rem] border p-6 shadow-soft",
                c.ok
                  ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                  : "border-border/60 bg-background/60",
              )}
            >
              <p
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.16em]",
                  c.ok ? "text-primary" : "text-muted-foreground",
                )}
              >
                {c.tag}
              </p>
              <span className="mt-4 text-3xl" aria-hidden="true">
                {c.icone}
              </span>
              <p className="mt-3 text-base font-extrabold uppercase tracking-tight text-foreground">{c.nome}</p>
              <p className={cn("mt-2 text-lg font-black", c.ok ? "text-primary" : "text-foreground")}>
                {c.preco}
              </p>
              <ul className="mt-3 flex-1 space-y-1.5">
                {c.linhas.map((l) => (
                  <li key={l} className="text-sm text-muted-foreground">
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xl" aria-hidden="true">
                {c.ok ? "✅" : "❌"}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 Processo */}
      <Section>
        <Eyebrow>{PRO3_COPY.processo.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO3_COPY.processo.title}</h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO3_COPY.processo.sub}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PRO3_COPY.processo.passos.map((p) => (
            <div key={p.n} className="rounded-[1.5rem] border border-border/60 bg-card/70 p-6 shadow-soft">
              <p className="text-4xl font-black tracking-tight text-primary">{p.n}</p>
              <p className="mt-3 text-base font-extrabold uppercase tracking-tight text-foreground">{p.titulo}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
        <Button
          size="lg"
          className="mt-8 h-14 w-full text-base font-extrabold sm:w-auto sm:min-w-[300px]"
          onClick={() => irParaCheckout(planoAtivo)}
        >
          {PRO3_COPY.processo.cta} →
        </Button>
      </Section>

      {/* 04 Conteúdo */}
      <Section tone="card">
        <Eyebrow>{PRO3_COPY.conteudo.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-2xl font-extrabold tracking-tight sm:text-3xl">
          {PRO3_COPY.conteudo.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO3_COPY.conteudo.sub}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRO3_COPY.conteudo.itens.map((i) => (
            <div key={i.titulo} className="rounded-2xl border border-border/60 bg-background/60 p-5 shadow-soft">
              <span className="text-2xl" aria-hidden="true">
                {i.icone}
              </span>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-primary">{i.tag}</p>
              <p className="mt-1 text-base font-extrabold text-foreground">{i.titulo}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[1.5rem] border border-primary/30 bg-primary/5 p-6 text-center shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {PRO3_COPY.conteudo.fecho}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {PRO3_COPY.conteudo.precoLinha}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{PRO3_COPY.conteudo.precoSub}</p>
          <Button
            size="lg"
            className="mt-6 h-14 w-full text-base font-extrabold sm:w-auto sm:min-w-[300px]"
            onClick={rolarParaPlanos}
          >
            {PRO3_COPY.conteudo.cta} →
          </Button>
        </div>
      </Section>

      {/* 05 Oferta */}
      <Section id="planos-pro3">
        <Eyebrow>{PRO3_COPY.oferta.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO3_COPY.oferta.title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO3_COPY.oferta.sub}</p>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {PRO3_COPY.oferta.recebeLabel}
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {PRO3_COPY.oferta.recebe.map((i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground sm:text-base">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {i}
            </li>
          ))}
        </ul>

        <p className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-foreground sm:text-sm">
          <Timer className="h-4 w-4 shrink-0 text-primary" />
          {PRO3_COPY.oferta.urgencia}
          <CountdownOferta />
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PRO3_COPY.oferta.itens.map((plano) => {
            const destaque = plano.id === "semestral";
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

                <ul className="mt-5 flex-1 space-y-2">
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

        <div className="mt-8 flex max-w-3xl items-start gap-3 rounded-[1.25rem] border border-primary/30 bg-primary/5 p-6 shadow-soft">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-lg font-extrabold text-foreground">{PRO3_COPY.garantia.titulo}</p>
            <p className="mt-2 text-sm text-muted-foreground">{PRO3_COPY.garantia.body}</p>
          </div>
        </div>
      </Section>

      {/* 06 Resultados */}
      <Section tone="card">
        <Eyebrow>{PRO3_COPY.resultados.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO3_COPY.resultados.title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO3_COPY.resultados.sub}</p>
        <DepoimentosSection onCta={() => irParaCheckout(planoAtivo)} />
        <p className="mt-4 text-sm font-bold text-foreground">{PRO3_COPY.resultados.rodape}</p>
      </Section>

      {/* 07 FAQ */}
      <Section>
        <Eyebrow>{PRO3_COPY.faq.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO3_COPY.faq.title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO3_COPY.faq.sub}</p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
        <Accordion
          type="single"
          collapsible
          className="mt-8 w-full max-w-3xl"
          onValueChange={(v) => {
            if (v) trackMetaCustom("FaqOpen", { pergunta: v });
          }}
        >
          {PRO3_COPY.faq.itens.map((f) => (
            <AccordionItem key={f.pergunta} value={f.pergunta}>
              <AccordionTrigger className="text-left text-sm font-bold sm:text-base">
                {f.pergunta}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.resposta}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* Ancoragem final */}
      <Section tone="card">
        <p className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
          <Timer className="h-4 w-4" />
          {PRO3_COPY.final.countdownLabel} <CountdownOferta className="text-base" />
        </p>
        <h2 className="mt-4 text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl">
          {PRO3_COPY.final.title.map((l, i) => (
            <span key={l} className={cn("block", i === 1 && "text-primary")}>
              {l}
            </span>
          ))}
        </h2>
        <div className="mt-6 max-w-2xl space-y-3">
          {PRO3_COPY.final.opcoes.map((o) => (
            <p key={o} className="text-sm text-muted-foreground sm:text-base">
              {o}
            </p>
          ))}
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
          {PRO3_COPY.final.checks.map((c) => (
            <li key={c} className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Check className="h-4 w-4 text-primary" strokeWidth={3} />
              {c}
            </li>
          ))}
        </ul>

        <div className="mt-8 max-w-xl rounded-[1.5rem] border border-primary/40 bg-background/70 p-6 text-center shadow-soft ring-1 ring-primary/20">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground line-through">
            {PRO3_COPY.final.valorLabel}
          </p>
          <p className="mt-2 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            {PRO3_COPY.final.precoLinha}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{PRO3_COPY.final.precoSub}</p>
          <Button
            size="lg"
            className="mt-6 h-14 w-full text-base font-extrabold"
            onClick={() => irParaCheckout(planoAtivo)}
          >
            {PRO3_COPY.final.cta} →
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="mt-3 h-12 w-full text-sm font-extrabold"
            onClick={rolarParaPlanos}
          >
            {PRO3_COPY.final.ctaSecundario}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">{PRO3_COPY.final.seguranca}</p>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
          {PRO3_COPY.final.selos.map((s) => (
            <li key={s} className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <footer className="relative border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
        <p>
          {PRO3_COPY.brand} — {PRO3_COPY.footerTagline}
        </p>
        <p className="mt-2">
          <Link to="/escolinhas" className="font-semibold text-primary underline-offset-4 hover:underline">
            Treina uma escolinha? Fale com a gente
          </Link>
          {zap ? (
            <>
              {" · "}
              <a
                href={zap}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                WhatsApp
              </a>
            </>
          ) : null}
        </p>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="animate-in slide-in-from-bottom-4 fixed inset-x-0 bottom-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] duration-500 md:hidden">
        <div className="rounded-[1.5rem] border border-border/60 bg-card/95 p-3 shadow-soft-lg backdrop-blur">
          <Button
            size="lg"
            className="h-12 w-full text-sm font-extrabold"
            onClick={() => irParaCheckout(planoAtivo)}
          >
            {PRO3_COPY.hero.cta} · {precoAtivo}
          </Button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">{PRO3_COPY.garantia.curta}</p>
        </div>
      </div>
    </main>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

function Section({
  children,
  tone = "default",
  id,
}: {
  children: ReactNode;
  tone?: "default" | "card";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative", tone === "card" && "border-y border-border/50 bg-card/70")}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">{children}</div>
    </section>
  );
}
