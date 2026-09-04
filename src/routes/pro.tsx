import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ProLandingPage } from "@/components/ProLandingPage";
import { validateLandingSearch, type LandingSearch } from "@/lib/checkout";
import { OG_IMAGE, siteUrl } from "@/lib/site";
import { usePlayer } from "@/lib/player-store";
import { RouteError, RouteNotFound } from "@/components/RouteBoundary";

export const Route = createFileRoute("/pro")({
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
  validateSearch: (search: Record<string, unknown>): LandingSearch => validateLandingSearch(search),
  head: () => ({
    meta: [
      { title: "Chegue no próximo jogo parecendo outro jogador — Jogador PRO" },
      {
        name: "description",
        content:
          "Sistema de microtreinos de 10 a 20 minutos por dia: jornada de 52 semanas, biblioteca completa e progresso guiado. Treine em casa e evolua no jogo.",
      },
      { property: "og:title", content: "Chegue no próximo jogo parecendo outro jogador — Jogador PRO" },
      {
        property: "og:description",
        content: "Microtreinos de 10–20 minutos. Plano anual R$197 (12x de R$16,42). 14 dias de garantia.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/pro") },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/pro") }],
  }),
  component: ProPage,
});

function ProPage() {
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
      void navigate({ to: "/checkout", search: { from: "pro", ...search }, replace: true });
      return;
    }
    if (search.checkout === "1") {
      void navigate({ to: "/checkout", search, replace: true });
    }
  }, [hydrated, logado, state.assinante, search, navigate]);

  return <ProLandingPage search={search} />;
}
