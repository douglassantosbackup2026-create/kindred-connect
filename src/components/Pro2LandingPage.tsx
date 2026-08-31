import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, ShieldCheck, Sparkles, Timer, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PRO2_COPY } from "@/data/pro2-copy";
import { captureUtmFromSearch } from "@/lib/utm";
import { searchCheckout, type LandingSearch } from "@/lib/checkout";
import { trackMetaCustom, trackMetaDedup } from "@/lib/meta-pixel";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/lib/player-store";
import { TopBar } from "@/components/landing/TopBar";
import { DepoimentosSection } from "@/components/landing/DepoimentosSection";
import { SelosConfianca } from "@/components/landing/SelosConfianca";
import { AppShowcase } from "@/components/landing/AppShowcase";
import { whatsappSupportHref } from "@/lib/product-config";

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRO2_COPY.faq.itens.map((f) => ({
    "@type": "Question",
    name: f.pergunta,
    acceptedAnswer: { "@type": "Answer", text: f.resposta },
  })),
});

function rolarParaPlanos() {
  document.getElementById("planos-pro2")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Pro2LandingPage({ search }: { search: LandingSearch }) {
  const { logado } = usePlayer();
  const navigate = useNavigate();
  const [planoAtivo, setPlanoAtivo] = useState<string>(search.plano ?? PRO2_COPY.heroCtaPlano);
  const zap = whatsappSupportHref("Oi! Quero tirar uma dúvida sobre o Jogador PRO.");

  useEffect(() => {
    captureUtmFromSearch(search);
    trackMetaDedup("ViewContent", {
      content_name: "landing_pro2",
      content_category: search.utm_campaign ?? "organic",
    });
    trackMetaCustom("LandingView", {
      pagina: "pro2",
      utm_source: search.utm_source ?? "",
      utm_campaign: search.utm_campaign ?? "",
    });
  }, [search]);

  const irParaCheckout = useCallback(
    (plano?: string) => {
      const alvo = plano ?? planoAtivo ?? PRO2_COPY.heroCtaPlano;
      setPlanoAtivo(alvo);
      trackMetaDedup("InitiateCheckout", {
        content_name: alvo,
        currency: "BRL",
        num_items: 1,
      });
      void navigate({
        to: "/checkout",
        search: searchCheckout({
          from: "pro2",
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
    PRO2_COPY.oferta.itens.find((p) => p.id === planoAtivo)?.preco ?? PRO2_COPY.oferta.itens[2]!.preco;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background pb-24 text-foreground md:pb-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_50%_-10%,_oklch(0.78_0.2_141_/_0.18),_transparent_55%)]" />

      <TopBar logado={logado} onAssinar={() => irParaCheckout(planoAtivo)} />

      <div className="relative mt-14">
        <div className="relative border-b border-border/60 bg-primary/10 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-5 py-2 text-center">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground sm:text-xs">
              {PRO2_COPY.barra.prefixo}
            </p>
            <p className="w-full text-[10px] text-muted-foreground sm:w-auto sm:text-[11px]">
              {PRO2_COPY.barra.sufixo}
            </p>
          </div>
        </div>
        <div className="border-b border-border/60 bg-card/80 shadow-soft backdrop-blur">
          <p className="mx-auto max-w-6xl px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
            {PRO2_COPY.faixaTopo}
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-12 sm:px-8 md:pb-16 md:pt-16">
        <div className="animate-in fade-in slide-in-from-bottom-4 max-w-3xl duration-700">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary sm:text-sm">
            {PRO2_COPY.selo}
          </p>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {PRO2_COPY.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">{PRO2_COPY.sub}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              size="lg"
              className="h-14 w-full px-8 text-base font-extrabold sm:w-auto sm:min-w-[260px]"
              onClick={() => irParaCheckout(planoAtivo)}
            >
              {PRO2_COPY.heroCta}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full px-8 text-base font-extrabold sm:w-auto sm:min-w-[200px]"
              onClick={rolarParaPlanos}
            >
              {PRO2_COPY.heroCtaSecundario}
            </Button>
          </div>

          <p className="mt-4 text-sm font-bold text-foreground">{PRO2_COPY.linhaPreco}</p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{PRO2_COPY.comparacao}</p>
          <div className="mt-4">
            <SelosConfianca />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{PRO2_COPY.notaIdade}</p>
        </div>
      </section>

      {/* Prova rápida */}
      <div className="relative border-y border-border/50 bg-card/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-5 py-4 text-center sm:px-8">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm font-black text-primary sm:text-base">{PRO2_COPY.provaRapida.destaque}</p>
          <p className="text-sm text-muted-foreground sm:text-base">{PRO2_COPY.provaRapida.texto}</p>
        </div>
      </div>

      {/* Dor */}
      <Section>
        <Eyebrow>{PRO2_COPY.dor.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-3xl">
          {PRO2_COPY.dor.title}
        </h2>
        <div className="mt-6 max-w-2xl space-y-3">
          {PRO2_COPY.dor.linhas.map((l) => (
            <p key={l} className="text-sm text-muted-foreground sm:text-base">
              {l}
            </p>
          ))}
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {PRO2_COPY.dor.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 text-sm text-foreground shadow-soft sm:text-base"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                <X className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-8 border-l-2 border-primary pl-5">
          <p className="text-lg font-black text-foreground sm:text-xl">{PRO2_COPY.dor.fecho}</p>
        </div>
      </Section>

      {/* Para quem é / não é */}
      <Section tone="card">
        <Eyebrow>{PRO2_COPY.publico.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO2_COPY.publico.title}</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-primary/40 bg-primary/5 p-6 shadow-soft ring-1 ring-primary/20">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">
              {PRO2_COPY.publico.sim.titulo}
            </p>
            <ul className="mt-4 space-y-3">
              {PRO2_COPY.publico.sim.itens.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-semibold text-foreground sm:text-base">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-border/60 bg-background/60 p-6 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-muted-foreground">
              {PRO2_COPY.publico.nao.titulo}
            </p>
            <ul className="mt-4 space-y-3">
              {PRO2_COPY.publico.nao.itens.map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* O app por dentro */}
      <Section>
        <Eyebrow>{PRO2_COPY.app.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO2_COPY.app.title}</h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO2_COPY.app.sub}</p>
        <AppShowcase />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRO2_COPY.app.telas.map((t, i) => (
            <div key={t.nome} className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Tela {i + 1}</p>
              <p className="mt-2 text-base font-extrabold text-foreground">{t.nome}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl rounded-[1.25rem] border border-primary/30 bg-primary/5 p-5 text-sm text-foreground shadow-soft sm:text-base">
          {PRO2_COPY.app.callout}
        </p>
      </Section>

      {/* Treinos */}
      <Section tone="card">
        <Eyebrow>{PRO2_COPY.treinos.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO2_COPY.treinos.title}</h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO2_COPY.treinos.sub}</p>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-border/60 bg-background/60 shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/80">
              <tr>
                {PRO2_COPY.treinos.colunas.map((c, i) => (
                  <th
                    key={c}
                    className={cn(
                      "px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-primary",
                      i > 0 && "hidden sm:table-cell",
                    )}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRO2_COPY.treinos.itens.map((t) => (
                <tr key={t.nome} className="border-t border-border/50">
                  <td className="px-4 py-3 font-bold text-foreground">
                    {t.nome}
                    <span className="mt-0.5 block text-xs font-medium text-muted-foreground sm:hidden">
                      {t.nivel} · {t.duracao} · {t.exercicios} exercícios
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{t.nivel}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{t.duracao}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{t.exercicios}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button
          size="lg"
          className="mt-8 h-14 w-full text-base font-extrabold sm:w-auto sm:min-w-[280px]"
          onClick={() => irParaCheckout(planoAtivo)}
        >
          {PRO2_COPY.treinos.cta}
        </Button>
      </Section>

      {/* O que você recebe */}
      <Section>
        <Eyebrow>{PRO2_COPY.recebe.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO2_COPY.recebe.title}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRO2_COPY.recebe.itens.map((i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-medium text-foreground sm:text-base">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {i}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-lg font-black text-primary sm:text-xl">{PRO2_COPY.recebe.fecho}</p>
      </Section>

      {/* Prova social */}
      <Section tone="card">
        <Eyebrow>{PRO2_COPY.provaSocial.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {PRO2_COPY.provaSocial.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {PRO2_COPY.provaSocial.sub}
        </p>
        <DepoimentosSection onCta={() => irParaCheckout(planoAtivo)} />
        <p className="mt-4 text-sm font-bold text-foreground">{PRO2_COPY.provaSocial.rodape}</p>
      </Section>

      {/* Bônus */}
      <Section>
        <Eyebrow>{PRO2_COPY.bonus.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO2_COPY.bonus.title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRO2_COPY.bonus.itens.map((b) => (
            <div key={b.titulo} className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-soft">
              <p className="text-base font-extrabold text-foreground">{b.titulo}</p>
              <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Oferta */}
      <Section id="planos-pro2" tone="card">
        <Eyebrow>{PRO2_COPY.oferta.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO2_COPY.oferta.title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{PRO2_COPY.oferta.sub}</p>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {PRO2_COPY.oferta.recebeLabel}
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {PRO2_COPY.oferta.recebe.map((i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground sm:text-base">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {i}
            </li>
          ))}
        </ul>

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-foreground sm:text-sm">
          <Timer className="h-4 w-4 shrink-0 text-primary" />
          {PRO2_COPY.oferta.urgencia}
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PRO2_COPY.oferta.itens.map((plano) => {
            const destaque = plano.id === "semestral";
            const selecionado = planoAtivo === plano.id;
            return (
              <div
                key={plano.id}
                className={cn(
                  "relative flex flex-col rounded-[1.5rem] border bg-background/60 p-6 shadow-soft transition-all",
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

        <div className="mt-8">
          <SelosConfianca />
        </div>
      </Section>

      {/* Garantia */}
      <Section>
        <div className="flex max-w-3xl items-start gap-3 rounded-[1.25rem] border border-primary/30 bg-primary/5 p-6 shadow-soft">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-lg font-extrabold text-foreground">{PRO2_COPY.garantia.titulo}</p>
            <p className="mt-2 text-sm text-muted-foreground">{PRO2_COPY.garantia.body}</p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="card">
        <Eyebrow>{PRO2_COPY.faq.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{PRO2_COPY.faq.title}</h2>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
        <Accordion
          type="single"
          collapsible
          className="mt-8 w-full max-w-3xl"
          onValueChange={(v) => {
            if (v) trackMetaCustom("FaqOpen", { pergunta: v });
          }}
        >
          {PRO2_COPY.faq.itens.map((f) => (
            <AccordionItem key={f.pergunta} value={f.pergunta}>
              <AccordionTrigger className="text-left text-sm font-bold sm:text-base">
                {f.pergunta}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.resposta}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* CTA final */}
      <Section>
        <h2 className="max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">{PRO2_COPY.final.title}</h2>
        <div className="mt-4 max-w-2xl space-y-2">
          {PRO2_COPY.final.linhas.map((l) => (
            <p key={l} className="text-sm text-muted-foreground sm:text-base">
              {l}
            </p>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            size="lg"
            className="h-14 w-full px-8 text-base font-extrabold sm:w-auto sm:min-w-[280px]"
            onClick={() => irParaCheckout(planoAtivo)}
          >
            {PRO2_COPY.final.cta}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-full px-8 text-base font-extrabold sm:w-auto sm:min-w-[200px]"
            onClick={rolarParaPlanos}
          >
            {PRO2_COPY.final.ctaSecundario}
          </Button>
        </div>
        <p className="mt-4 text-sm font-bold text-foreground">{PRO2_COPY.final.hint}</p>
        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">{PRO2_COPY.final.ps}</p>
      </Section>

      <footer className="relative border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
        <p>
          {PRO2_COPY.brand} — {PRO2_COPY.footerTagline}
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
            {PRO2_COPY.heroCta} · {precoAtivo}
          </Button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">{PRO2_COPY.garantia.curta}</p>
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
