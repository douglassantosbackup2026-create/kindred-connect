# Plano: Carousel automático nos mockups da `/pro3`

## Objetivo
Trocar a exibição estática dos 3 mockups do app na hero da `/pro3` por um carousel automático com transição suave (deslize), mostrando um mockup por vez.

## Escopo
- Apenas a seção de mockups da landing `/pro3`.
- Manter as legendas de cada tela abaixo do respectivo mockup.
- Não alterar copy, preços ou outros elementos da página.

## Passos

1. **Adicionar dependência de autoplay**
   - Instalar `embla-carousel-autoplay` para permitir rotação automática no carousel.

2. **Criar componente de carousel de mockups**
   - Em `src/components/landing/AppShowcase.tsx`, substituir o grid estático por um carousel usando o componente `Carousel` existente (`src/components/ui/carousel.tsx`) + plugin `Autoplay`.
   - Configurar loop infinito e transição suave (`duration` ajustada).
   - Cada `CarouselItem` renderiza um `Phone` com imagem, alt e legenda.
   - Adicionar indicadores de paginação (bolinhas) para mostrar qual dos 3 mockups está ativo.

3. **Ajustar estilos para centralização e responsividade**
   - Garantir que o mockup ocupe no máximo ~280px de largura no mobile e ~320px no desktop.
   - Centralizar o carousel dentro da coluna da hero.
   - Manter espaçamento consistente com os bullets e CTAs ao redor.

4. **Verificar SSR/hidratação**
   - Como o carousel usa `useEffect` e plugins do Embla, garantir que o primeiro render do servidor e do cliente sejam idênticos (estrutura estática inicial, autoplay só inicia no cliente).

5. **Validar**
   - Rodar `bunx tsc --noEmit`.
   - Verificar visualmente no preview se o carousel troca automaticamente a cada ~4 segundos com deslize suave.

## Arquivos envolvidos
- `src/components/landing/AppShowcase.tsx` (principal)
- `src/components/ui/carousel.tsx` (reutilizado, sem alteração)
- `src/components/Pro3LandingPage.tsx` (possível ajuste de espaçamento, se necessário)

## Resultado esperado
Hero da `/pro3` exibe os 3 mockups como um slider automático: um celular visível por vez, deslizando suavemente para o próximo, com bolinhas indicadoras abaixo.