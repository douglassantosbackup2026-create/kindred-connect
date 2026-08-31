import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Crown, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageFrame } from "@/components/PageFrame";
import { PLANO, getTreino } from "@/data/training";
import { usePlayer } from "@/lib/player-store";
import { trackMetaCustom } from "@/lib/meta-pixel";
import { cn } from "@/lib/utils";
import { RouteError, RouteNotFound } from "@/components/RouteBoundary";

export const Route = createFileRoute("/bem-vindo-pro")({
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
  head: () => ({
    meta: [
      { title: "PRO liberado — Jogador PRO System" },
      { name: "description", content: "Sua assinatura está ativa. Comece o Dia 1 agora." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BemVindoProPage,
});

const OBJETIVOS = [
  { id: "base", label: "Construir base física" },
  { id: "controle", label: "Melhorar controle de bola" },
  { id: "explosao", label: "Ganhar explosão" },
  { id: "jogo", label: "Aguentar 90 minutos" },
];

const DISPONIBILIDADE = [
  { id: "10", label: "Até 10 min" },
  { id: "20", label: "10–20 min" },
  { id: "30", label: "20+ min" },
];

const semana1 = PLANO.find((s) => s.semana === 1);
const primeiro = semana1?.dias[0];
const primeiroTreino = primeiro ? getTreino(primeiro.treinoId) : null;

function BemVindoProPage() {
  const { state, hydrated, completeOnboarding } = usePlayer();
  const navigate = useNavigate();
  const [objetivo, setObjetivo] = useState(state.objetivo ?? "base");
  const [disponibilidade, setDisponibilidade] = useState(state.disponibilidade ?? "20");

  useEffect(() => {
    if (!hydrated) return;
    if (!state.assinante) {
      void navigate({
        to: "/checkout",
        search: { from: "bem-vindo-pro", teaser: "Assine para começar o Dia 1" },
        replace: true,
      });
    }
  }, [hydrated, state.assinante, navigate]);

  const comecar = (destino: "treino" | "home" = "treino") => {
    if (destino === "treino" && (!primeiroTreino || !primeiro)) return;
    if (!state.onboardingDone) {
      completeOnboarding({
        nome: state.nome,
        objetivo,
        disponibilidade,
        posicao: state.posicao ?? "qualquer",
      });
      trackMetaCustom("CompleteOnboarding", { objetivo, disponibilidade, origem: "bem-vindo-pro" });
    }
    if (destino === "home") {
      void navigate({ to: "/app" });
      return;
    }
    void navigate({
      to: "/treino/$treinoId",
      params: { treinoId: primeiroTreino!.id },
      search: { plano: "1-1" },
    });
  };

  if (!hydrated || !state.assinante) {
    return (
      <PageFrame max="sm" className="justify-center">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </PageFrame>
    );
  }

  return (
    <PageFrame max="sm" className="justify-center">
      <div className="w-full rounded-[1.75rem] border border-border/60 bg-card p-6 text-center shadow-soft-lg sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Crown className="h-8 w-8" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Acesso PRO
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
          {state.nome !== "Jogador" ? `${state.nome}, você é PRO` : "Você é PRO"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {state.onboardingDone
            ? "Plano liberado. Faça o treino do Dia 1 hoje — ativação é o que gera resultado."
            : "Dois toques e você entra no Dia 1. O resto personaliza depois."}
        </p>

        {!state.onboardingDone ? (
          <div className="mt-6 space-y-4 text-left">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Seu foco
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {OBJETIVOS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setObjetivo(o.id)}
                    className={cn(
                      "rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold",
                      objetivo === o.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Tempo hoje
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {DISPONIBILIDADE.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDisponibilidade(d.id)}
                    className={cn(
                      "rounded-2xl border px-3 py-2.5 text-center text-sm font-semibold",
                      disponibilidade === d.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {primeiroTreino ? (
          <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/10 p-4 text-left">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Semana 1 · Dia 1
                </p>
                <p className="mt-1 text-base font-extrabold text-foreground">
                  {primeiroTreino.nome}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {semana1?.foco} · {primeiroTreino.duracaoMin} min
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="mt-4 h-12 w-full font-extrabold"
              onClick={() => comecar("treino")}
            >
              <Play className="h-4 w-4" /> Começar meu 1º treino agora
            </Button>
          </div>
        ) : null}

        <Button
          variant="ghost"
          className="mt-1 w-full text-muted-foreground"
          onClick={() => comecar("home")}
        >
          Ir para a home
        </Button>
      </div>
    </PageFrame>
  );
}
