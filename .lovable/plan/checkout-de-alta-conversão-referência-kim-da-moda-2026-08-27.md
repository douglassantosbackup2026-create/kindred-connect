# Checkout de alta conversão (referência Kim da Moda)

O que a página de referência faz bem e o nosso checkout ainda não tem:
barra de urgência com contador, selo de compra segura no topo, resumo do produto com preço parcelado em destaque, prova social forte (antes/depois + avaliações) logo acima do formulário, garantia explícita e faixa de meios de pagamento no rodapé.

## Problemas atuais encontrados

1. Título fixo "Liberar o plano de 12 meses" mesmo quando o plano escolhido é mensal ou semestral — quebra a confiança logo no topo.
2. Preço mostrado só como valor cheio; o parcelado (ex.: "12x de R$ 16,42") não aparece em destaque, só numa linha pequena.
3. Nenhuma urgência no checkout (a home tem contador, o checkout não).
4. Prova social (depoimentos/avaliações) não existe nessa página — o usuário sai da landing e perde todos os gatilhos.
5. Selos de confiança ficam no fim da coluna lateral; no mobile aparecem só depois de rolar tudo.
6. Cupom existe mas sem chamada visível ("tenho um cupom de desconto").
7. Garantia aparece em texto pequeno de 11px, sem destaque de bloco.

## O que será feito

**Topo**
- Barra fina de urgência no topo do checkout com contador por sessão (mesmo componente já usado na home), texto "Sua oferta está reservada".
- Faixa verde "COMPRA 100% SEGURA" logo abaixo do header.
- Título dinâmico conforme o plano selecionado (mensal / semestral / anual), com subtítulo de valor equivalente.

**Resumo do pedido**
- Card do produto com nome, mockup pequeno, preço parcelado em destaque ("12x de R$ 16,42") e "à vista R$ 197" abaixo.
- Link "Tenho um cupom de desconto" abrindo o campo já existente.

**Prova social**
- Bloco de avaliações ("+2.469 alunos" com 5 estrelas) e 2–3 depoimentos curtos reaproveitados da landing, posicionados acima do formulário no mobile e na coluna lateral no desktop.

**Confiança e fechamento**
- Bloco de garantia de 14 dias com ícone, destacado.
- Trio de selos (Compra segura / Produto revisado / Dados protegidos) e faixa de bandeiras (Pix, Visa, Master, Elo, etc.) no rodapé do checkout.
- Suporte por WhatsApp mais visível junto da garantia.

## Detalhes técnicos

- Alterações concentradas em `src/components/CheckoutPagamento.tsx` (layout/ordem das seções) e novos componentes em `src/components/checkout/` (UrgenciaCheckout, ResumoProduto, ProvaSocialCheckout, GarantiaBloco, BandeirasPagamento).
- Reuso de `CountdownOferta`, `SelosConfianca`, dados de depoimentos e `CAMPANHA`/`PLANOS_ASSINATURA`; cálculo de parcelas a partir de `precoCentavos` e `maxParcelas`.
- Nenhuma mudança na lógica de pagamento (`MercadoPagoCheckout`, `process-payment`) nem nos preços.
- Mobile: ordem urgência → selo seguro → resumo → prova social → dados → pagamento; CTA fixo inferior mantido.
