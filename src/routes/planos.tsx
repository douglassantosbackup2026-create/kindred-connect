import { createFileRoute, redirect } from "@tanstack/react-router";
import { validateLandingSearch } from "@/lib/checkout";
import { RouteError, RouteNotFound } from "@/components/RouteBoundary";

export const Route = createFileRoute("/planos")({
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
  validateSearch: (search: Record<string, unknown>) => validateLandingSearch(search),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/", search, hash: "oferta", replace: true });
  },
  component: () => null,
});
