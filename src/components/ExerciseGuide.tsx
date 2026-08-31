import { useState } from "react";
import { ChevronDown, AlertTriangle, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { guiaDoExercicio, type GuiaCategoria } from "@/data/exercise-guides";

function Conteudo({ nome, demo }: { nome: string; demo: GuiaCategoria }) {
  const guia = guiaDoExercicio(nome, demo);
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Como fazer</p>
        <ol className="mt-2 space-y-1.5">
          {guia.passos.map((p, i) => (
            <li key={p} className="flex gap-2 text-sm text-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-extrabold text-primary">
                {i + 1}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
            <Target className="h-3.5 w-3.5" /> Foco
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{guia.foco}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5" /> Erro comum
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{guia.erro}</p>
        </div>
      </div>

      {guia.adaptacao ? (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>{guia.adaptacao}</span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * Guia de execução escrito. Padrão enquanto não há filmagem oficial;
 * quando existe vídeo, aparece recolhido logo abaixo do player.
 */
export function ExerciseGuide({
  nome,
  demo = "cardio",
  variante = "aberto",
}: {
  nome: string;
  demo?: GuiaCategoria;
  variante?: "aberto" | "recolhido";
}) {
  const [aberto, setAberto] = useState(false);

  if (variante === "recolhido") {
    return (
      <div className="mt-3 overflow-hidden rounded-3xl border border-border bg-secondary/60">
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-foreground">
            Guia de execução
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              aberto && "rotate-180",
            )}
          />
        </button>
        {aberto ? (
          <div className="px-4 pb-4">
            <Conteudo nome={nome} demo={demo} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-3xl border border-border bg-secondary/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-extrabold uppercase tracking-widest text-foreground">
          Guia de execução
        </p>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          Demonstração ilustrada
        </span>
      </div>
      <Conteudo nome={nome} demo={demo} />
    </div>
  );
}
