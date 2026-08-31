import { createFileRoute, redirect } from "@tanstack/react-router";
import { RouteError, RouteNotFound } from "@/components/RouteBoundary";

/** D0 passou a ser /bem-vindo-pro — esta rota não compete mais com o onboarding curto. */
export const Route = createFileRoute("/onboarding")({
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
  beforeLoad: () => {
    throw redirect({ to: "/bem-vindo-pro", replace: true });
  },
  component: () => null,
});
