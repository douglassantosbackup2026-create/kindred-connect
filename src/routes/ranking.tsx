import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RankingLista } from "@/components/RankingLista";
import { Button } from "@/components/ui/button";
import { useRankingSemanal } from "@/hooks/use-ranking-semanal";
import { useAuth } from "@/lib/use-auth";
import { usePlayer } from "@/lib/player-store";
import { RouteError, RouteNotFound } from "@/components/RouteBoundary";

export const Route = createFileRoute("/ranking")({
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
  head: () => ({
    meta: [{ title: "Ranking semanal — Jogador PRO System" }],
  }),
  component: RankingPage,
});

function RankingPage() {
  const { state, treinoDeHoje, proximoPlano } = usePlayer();
  const { user } = useAuth();
  const {
    rows,
    isError,
    isLoading,
  } = useRankingSemanal(state.assinante);

  if (!state.assinante) {
    return (
      <AppShell title="Ranking" subtitle="Liga semanal PRO">
        <div className="rounded-[1.5rem] border border-border/60 bg-card p-6 text-center shadow-soft">
          <Trophy className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Ranking disponível para assinantes.</p>
          <Button asChild className="mt-4 w-full font-extrabold">
            <Link
              to="/checkout"
              search={{ from: "ranking", teaser: "Entre na liga semanal dos assinantes PRO" }}
            >
              Assinar
            </Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const minha = rows.find((r) => (user?.id ? r.userId === user.id : r.nome === state.nome));

  return (
    <AppShell title="Ranking da semana" subtitle="Consistência entre assinantes PRO">
      {minha ? (
        <div className="mb-4 rounded-[1.5rem] border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm font-extrabold text-foreground">Você está em #{minha.posicao}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {minha.treinos} treinos · {minha.minutos} min esta semana
          </p>
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando a liga…</p>
      ) : isError ? (
        <p className="rounded-2xl border border-destructive/30 bg-card p-6 text-center text-sm text-destructive">
          Não deu para carregar o ranking. Tente de novo em instantes.
        </p>
      ) : (
        <RankingLista
          rows={rows}
          meuNome={state.nome}
          meuUserId={user?.id}
          emptyCta={
            treinoDeHoje
              ? {
                  to: "/treino/$treinoId",
                  params: { treinoId: treinoDeHoje.id },
                  search: { plano: proximoPlano?.key ?? "" },
                  label: "Fazer o treino de hoje",
                }
              : null
          }
        />
      )}

      {rows.length > 0 && treinoDeHoje ? (
        <Button asChild className="mt-4 h-12 w-full font-extrabold">
          <Link
            to="/treino/$treinoId"
            params={{ treinoId: treinoDeHoje.id }}
            search={{ plano: proximoPlano?.key ?? "" }}
          >
            Treinar para subir
          </Link>
        </Button>
      ) : null}
    </AppShell>
  );
}
