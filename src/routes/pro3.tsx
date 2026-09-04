import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Pro3LandingPage } from "@/components/Pro3LandingPage";
import { validateLandingSearch, type LandingSearch } from "@/lib/checkout";
import { OG_IMAGE, siteUrl } from "@/lib/site";
import { usePlayer } from "@/lib/player-store";
import { RouteError, RouteNotFound } from "@/components/RouteBoundary";

export const Route = createFileRoute("/pro3")({
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
  validateSearch: (search: Record<string, unknown>): LandingSearch => validateLandingSearch(search),
  head: () => ({
    meta: [
      { title: "Treine em casa e evolua como Jogador PRO — a partir de R$16,42/mês" },
      {
        name: "description",
        content:
          "Jornada guiada de 12 meses para treinar em casa em 10 a 20 minutos por dia. +2.469 jogadores, biblioteca completa, progresso na nuvem e 14 dias de garantia.",
      },
      { property: "og:title", content: "Treine em casa e evolua como Jogador PRO" },
      {
        property: "og:description",
        content:
          "Plano pronto, treino do dia no app e evolução acompanhada. A partir de R$16,42/mês no plano anual, com 14 dias de garantia.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/pro3") },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/pro3") }],
  }),
  component: Pro3Page,
});

function Pro3Page() {
  const search = Route.useSearch();
  const { logado, state, hydrated } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (logado && state.assinante) {
      void navigate({ to: "/app", replace: true });
      return;
    }
    if (logado && !state.assinante) {
      void navigate({ to: "/checkout", search: { from: "pro3", ...search }, replace: true });
      return;
    }
    if (search.checkout === "1") {
      void navigate({ to: "/checkout", search, replace: true });
    }
  }, [hydrated, logado, state.assinante, search, navigate]);

  return <Pro3LandingPage search={search} />;
}
