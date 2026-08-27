import { useState, useCallback, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CAMPANHA } from "@/data/campanha-copy";
import { Phone } from "./AppShowcase";
import planoAsset from "@/assets/app-plano.png.asset.json";
import dashboardAsset from "@/assets/app-dashboard.png.asset.json";
import treinosAsset from "@/assets/app-treinos.png.asset.json";

const slides = [
  {
    src: planoAsset.url,
    alt: "Tela Meu plano do app, com a jornada guiada de 12 meses",
    legenda: CAMPANHA.showcase.plano,
  },
  {
    src: dashboardAsset.url,
    alt: "Dashboard do app com meta da semana, patente e treino de hoje",
    legenda: CAMPANHA.showcase.dashboard,
  },
  {
    src: treinosAsset.url,
    alt: "Biblioteca de treinos do app com filtros por categoria",
    legenda: CAMPANHA.showcase.treino,
  },
];

/**
 * Carousel automático dos 3 mockups do app.
 * Usado na hero da /pro3 para mostrar um mockup por vez com deslize suave.
 */
export function AppShowcaseCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [atual, setAtual] = useState(0);

  const onSelect = useCallback((apiInstance: CarouselApi) => {
    if (!apiInstance) return;
    setAtual(apiInstance.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", () => onSelect(api));
    api.on("reInit", () => onSelect(api));
    return () => {
      api.off("select", () => onSelect(api));
      api.off("reInit", () => onSelect(api));
    };
  }, [api, onSelect]);

  return (
    <div className="mx-auto w-full max-w-[18rem] sm:max-w-[20rem]">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          duration: 35,
          align: "center",
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.src} className="basis-full pl-0">
              <Phone src={slide.src} alt={slide.alt} legenda={slide.legenda} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 flex justify-center gap-2" aria-label="Indicadores do carousel">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className="h-2 w-2 rounded-full transition-colors"
            style={{
              backgroundColor: i === atual ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
