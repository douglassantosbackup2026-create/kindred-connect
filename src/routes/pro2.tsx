import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Pro2LandingPage } from "@/components/Pro2LandingPage";
import { validateLandingSearch, type LandingSearch } from "@/lib/checkout";
import { OG_IMAGE, siteUrl } from "@/lib/site";
import { usePlayer } from "@/lib/player-store";
import { RouteError, RouteNotFound } from "@/components/RouteBoundary";

export const Route = createFileRoute("/pro2")({
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
  validateSearch: (search: Record<string, unknown>): LandingSearch => validateLandingSearch(search),
  head: () => ({
    meta: [
      { title: "Treine em casa 10 a 20 min por dia e evolua no futebol — Jogador PRO" },
      {
        name: "description",
        content:
          "Mais velocidade, controle de bola e confiança em campo treinando 10 a 20 minutos por dia em casa. Jornada guiada de 12 meses, biblioteca completa e 14 dias de garantia.",
      },
      { property: "og:title", content: "Treine em casa 10 a 20 min por dia e evolua no futebol — Jogador PRO" },
      {
        property: "og:description",
        content:
          "Abra o app, veja o treino do dia e faça. Planos a partir de R$16,42/mês no anual. 14 dias de garantia.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/pro2") },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/pro2") }],
  }),
  component: Pro2Page,
});

function Pro2Page() {
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
      void navigate({ to: "/checkout", search: { from: "pro2", ...search }, replace: true });
      return;
    }
    if (search.checkout === "1") {
      void navigate({ to: "/checkout", search, replace: true });
    }
  }, [hydrated, logado, state.assinante, search, navigate]);

  return <Pro2LandingPage search={search} />;
}
