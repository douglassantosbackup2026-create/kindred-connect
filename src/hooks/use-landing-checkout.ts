import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { captureUtmFromSearch } from "@/lib/utm";
import { searchCheckout, type LandingSearch } from "@/lib/checkout";
import { trackMetaCustom, trackMetaDedup } from "@/lib/meta-pixel";
import { whatsappSupportHref } from "@/lib/product-config";

/**
 * UTM + Pixel + navegação para /checkout. As 3 landings PRO compartilham isto;
 * as URLs /pro /pro2 /pro3 permanecem distintas via `from`.
 */
export function useLandingCheckout(from: string, search: LandingSearch, defaultPlano: string) {
  const navigate = useNavigate();
  const [planoAtivo, setPlanoAtivo] = useState<string>(search.plano ?? defaultPlano);
  const zap = whatsappSupportHref("Oi! Quero tirar uma dúvida sobre o Jogador PRO.");

  useEffect(() => {
    captureUtmFromSearch(search);
    trackMetaDedup("ViewContent", {
      content_name: `landing_${from}`,
      content_category: search.utm_campaign ?? "organic",
    });
    trackMetaCustom("LandingView", {
      pagina: from,
      utm_source: search.utm_source ?? "",
      utm_campaign: search.utm_campaign ?? "",
    });
  }, [from, search]);

  const irParaCheckout = useCallback(
    (plano?: string) => {
      const alvo = plano ?? planoAtivo ?? defaultPlano;
      setPlanoAtivo(alvo);
      trackMetaDedup("InitiateCheckout", {
        content_name: alvo,
        currency: "BRL",
        num_items: 1,
      });
      void navigate({
        to: "/checkout",
        search: searchCheckout({
          from,
          plano: alvo,
          ref: search.ref,
          teaser: search.teaser,
          utm_source: search.utm_source,
          utm_medium: search.utm_medium,
          utm_campaign: search.utm_campaign,
          utm_content: search.utm_content,
          utm_term: search.utm_term,
        }),
      });
    },
    [defaultPlano, from, navigate, planoAtivo, search],
  );

  return { planoAtivo, setPlanoAtivo, irParaCheckout, zap };
}
