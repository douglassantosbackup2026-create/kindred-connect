import { createFileRoute, redirect } from "@tanstack/react-router";
import { validateLandingSearch, type LandingSearch } from "@/lib/checkout";
import { RouteError, RouteNotFound } from "@/components/RouteBoundary";

export type CampanhaSearch = LandingSearch;

export const Route = createFileRoute("/campanha")({
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
  validateSearch: (search: Record<string, unknown>): CampanhaSearch => validateLandingSearch(search),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/", search, replace: true });
  },
  component: () => null,
});
