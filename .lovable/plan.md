# Adicionar bullets de resultado na hero da /pro3

## Objetivo
Inserir os bullets "Mais domínio. Mais dribles. Mais passes certos. Mais confiança para fazer gols." na seção Hero da página `/pro3`, logo abaixo do subheadline, com estilo de bolas simples.

## Alterações

1. **Copy (`src/data/pro3-copy.ts`)**
   - Adicionar `hero.bullets: string[]` com os 4 itens.

2. **Componente (`src/components/Pro3LandingPage.tsx`)**
   - Renderizar a nova lista entre o parágrafo `hero.sub` e o grupo de botões CTA.
   - Usar estilo de bolas simples (`list-disc` ou `•` inline), mantendo a identidade visual atual — sem ícones de check.
   - Garantir responsividade e espaçamento consistente com o restante da hero.

3. **Verificação**
   - Rodar typecheck para garantir que o novo campo do copy não quebre tipagens.
   - Validar visualmente no preview que os bullets aparecem abaixo do subheadline e antes dos botões.

## Fora de escopo
- Não alterar outras seções da página.
- Não modificar rotas, SEO, pixels ou checkout.
