# Nova página de vendas em /pro3 (modelo "Kim da Moda")

Quarta versão de landing, com a estrutura de alta conversão do modelo enviado, mas com a copy e a identidade visual do Jogador PRO. A home (`/`), a `/pro` e a `/pro2` continuam intactas para teste A/B/C/D.

## Estrutura da página (na ordem do modelo)

1. **Barra topo fixa** — "QUASE ESGOTANDO · condição de lançamento" + contador + CTA "Garantir acesso".
2. **Hero** — selo "+2.469 jogadores já treinam", headline em bloco (estilo caixa do modelo): "TREINE EM CASA / EVOLUA COMO / JOGADOR PRO", subheadline com 10–20 min/dia, mockup do app (prints já existentes), CTA primário, micro-selos (acesso imediato · 14 dias de garantia · cancele quando quiser · 2.469+ alunos) e contador de oferta.
3. **01 / Problema** — headline "Cansado de treinar e sentir que não evolui?", parágrafo de intensificação e 7 bullets de dor (travar no drible, sem campo, YouTube sem plano, cansar rápido, ver outros evoluindo, treinar sem sequência, sem ninguém para guiar) + fecho "Marcou pelo menos 1?".
4. **Números de autoridade** — faixa com 4 métricas: 2.469+ jogadores, 52 semanas de jornada, 4 mesociclos, R$16,42/mês.
5. **02 / Comparativo (ancoragem)** — 3 colunas: Escolinha/time (R$150–300/mês, 1–2x por semana, depende de vaga e deslocamento) ❌ · Personal/preparador (R$100+ por sessão, agenda fixa) ❌ · Jogador PRO System (a partir de R$16,42/mês, treino todo dia, em casa, 10–20 min) ✅.
6. **03 / Processo** — 3 passos: 01 Garanta seu acesso · 02 Abra o treino do dia · 03 Evolua e acompanhe o progresso. CTA no fim.
7. **04 / Conteúdo** — cards do que está incluso, cada um com "valor" para somar a ancoragem: Jornada guiada de 12 meses, Biblioteca de treinos, Modo Rápido, Pré-partida e Pós-jogo, Guia de execução dos exercícios, Progresso gamificado (streak/XP/patentes), Acesso multi-dispositivo com nuvem. Fecho: "Separado, isso sairia por muito mais — hoje a partir de R$16,42/mês".
8. **05 / Card da oferta** — os 3 planos exatamente como já existem (Mensal R$47 · Semestral De R$282 por R$147, "Mais escolhido" · Anual De R$564 por R$197, "Melhor valor"), com os mesmos textos de parcelamento, inclusos e CTAs. Bloco "você recebe em qualquer plano" + garantia de 14 dias.
9. **06 / Resultados** — os 6 depoimentos reais já usados nas outras páginas (`DepoimentosSection`), com título "O que muda quando você treina com um plano" e rodapé "+2.469 jogadores".
10. **07 / FAQ** — accordion com as perguntas frequentes já validadas na `/pro2`, com JSON-LD de FAQPage.
11. **Ancoragem final** — "DUAS OPÇÕES. VOCÊ ESCOLHE." (continuar treinando sem rumo x começar hoje), lista de checks do que está incluso, contador, preço do plano em destaque, CTA final e selos de segurança (pagamento seguro · garantia 14 dias · acesso imediato).

## Decisões confirmadas

- URL: `/pro3`.
- Contador regressivo visível (no topo, na oferta e no bloco final), com contagem por sessão que reinicia a cada visita — sem estoque falso.
- Preços e textos dos planos exatamente como enviados.
- Resultados: reaproveitar os depoimentos reais já existentes.

## Detalhes técnicos

- `src/data/pro3-copy.ts` — nova constante `PRO3_COPY` com toda a copy (nada hardcoded no componente).
- `src/components/Pro3LandingPage.tsx` — componente da página, reutilizando `TopBar`, `AppShowcase`, `DepoimentosSection`, `SelosConfianca` e o accordion de FAQ; novas seções internas (números, comparativo 3 colunas, 3 passos, grid de conteúdo com valores, bloco de duas opções).
- `src/components/landing/CountdownOferta.tsx` — contador reutilizável (client-only, sem mismatch de hidratação), com deadline por sessão em `sessionStorage`.
- `src/routes/pro3.tsx` — rota com `validateLandingSearch`, `head()` próprio (title, description, og/twitter) e o mesmo redirecionamento de logado/assinante da `/pro2`.
- Checkout: CTAs reutilizam o fluxo atual (`/checkout` com `plano` + UTMs), sem mudança de backend.
- Rastreio: eventos `ViewContent` / `LandingView` / `InitiateCheckout` com rótulo `landing_pro3`.
