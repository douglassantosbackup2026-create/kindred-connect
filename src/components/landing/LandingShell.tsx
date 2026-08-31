import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { trackMetaCustom } from "@/lib/meta-pixel";
import { cn } from "@/lib/utils";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{children}</p>;
}

export function Section({
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

export type FaqItem = { pergunta: string; resposta: string };

/**
 * FAQ das landings. O JSON-LD usa só copy estática dos arquivos *copy.ts —
 * nunca HTML digitado pelo usuário.
 */
export function LandingFaq({
  eyebrow,
  title,
  sub,
  itens,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  itens: readonly FaqItem[];
}) {
  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: itens.map((f) => ({
      "@type": "Question",
      name: f.pergunta,
      acceptedAnswer: { "@type": "Answer", text: f.resposta },
    })),
  });

  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      {sub ? <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{sub}</p> : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <Accordion
        type="single"
        collapsible
        className="mt-8 w-full max-w-3xl"
        onValueChange={(v) => {
          if (v) trackMetaCustom("FaqOpen", { pergunta: v });
        }}
      >
        {itens.map((f) => (
          <AccordionItem key={f.pergunta} value={f.pergunta}>
            <AccordionTrigger className="text-left text-sm font-bold sm:text-base">
              {f.pergunta}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{f.resposta}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

export function LandingFooter({
  brand,
  tagline,
  zap,
}: {
  brand: string;
  tagline: string;
  zap: string | null;
}) {
  return (
    <footer className="relative border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
      <p>
        {brand} — {tagline}
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
  );
}

export function StickyCta({
  label,
  hint,
  onClick,
}: {
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <div className="animate-in slide-in-from-bottom-4 fixed inset-x-0 bottom-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] duration-500 md:hidden">
      <div className="rounded-[1.5rem] border border-border/60 bg-card/95 p-3 shadow-soft-lg backdrop-blur">
        <Button size="lg" className="h-12 w-full text-sm font-extrabold" onClick={onClick}>
          {label}
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
