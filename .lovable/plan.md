# Nova página de vendas em /pro2

Terceira versão de landing (copy "Mesclada e Otimizada"), com a mesma identidade visual das páginas atuais. A home (`/`) e a `/pro` continuam intactas, permitindo teste A/B/C.

## Estrutura da página

1. Hero — selo, headline (velocidade + controle + confiança em 10–20 min em casa), subheadline, CTA primário "Quero ser Jogador PRO" + secundário "Ver planos", linha de preço, comparação com escolinha, selos (garantia / cancelamento / acesso imediato) e nota de idade.
2. Prova rápida — faixa fina com "+2.469 jogadores já treinam com o sistema".
3. Dor — headline, corpo com o gancho do YouTube, 4 bullets e fechamento.
4. Para quem é / não é — duas colunas (check verde x X neutro).
5. O app por dentro — 4 telas (Treino de hoje, Jornada, Biblioteca, Progresso) usando os mockups já existentes, mais o callout anti-"curso de perna de pau".
6. Treinos — tabela escaneável (treino, nível, duração, exercícios) com CTA.
7. O que você recebe — lista de 11 itens com check + fecho "Um sistema. Um plano. Um treino por vez."
8. Prova social — os 6 depoimentos exatamente como escritos, com o número de alunos e CTA "Quero treinar como eles".
9. Bônus — os 5 bônus.
10. Oferta — 3 planos (Mensal R$47, Semestral de R$282 por R$147, Anual de R$564 por R$197), bloco "você recebe em qualquer plano", faixa de urgência de tempo limitado e CTA com o preço do plano selecionado.
11. Garantia + FAQ — texto de garantia e as 12 perguntas em accordion.
12. CTA final — headline, corpo, CTAs, selos e P.S.

## Decisões confirmadas

- Número de alunos: 2.469+ (mesmo da /pro).
- FAQ completo, mantendo as duas perguntas pendentes com respostas conservadoras:
  - "Funciona para goleiro?" → os treinos de força, explosão, resistência e mobilidade servem para qualquer posição; não há trilha exclusiva de goleiro.
  - "O que acontece depois dos 12 meses?" → o acesso continua enquanto a assinatura estiver ativa; sem fidelidade.
  Revise esses dois textos antes de publicar — ajusto se estiverem incorretos.
- Urgência: faixa de "condição de lançamento por tempo limitado" na seção de oferta, sem contador regressivo e sem estoque falso (evita problema com a política da Meta e o CDC).

## Detalhes técnicos

- `src/data/pro2-copy.ts` — nova constante `PRO2_COPY` com toda a copy (nenhum texto fica hardcoded no componente).
- `src/components/Pro2LandingPage.tsx` — componente da página, espelhando os padrões de `ProLandingPage.tsx`: `TopBar`, `AppShowcase`, `DepoimentosSection`, `SelosConfianca`, cards de plano, accordion de FAQ e JSON-LD de FAQPage.
- `src/routes/pro2.tsx` — rota nova com `validateLandingSearch`, `head()` próprio (title, description, og/twitter) e o mesmo redirecionamento de usuário logado/assinante usado em `/pro`.
- Checkout: os CTAs reutilizam o fluxo atual (`/checkout` com `plano` + UTMs), sem mudança de backend.
- Rastreio: eventos `ViewContent` / `LandingView` / `InitiateCheckout` com rótulo `landing_pro2`, para separar a performance no Meta.
