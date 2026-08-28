# Corrigir travamento ao trocar de plano no checkout

## O que eu confirmei

Reproduzi no navegador em `/checkout?from=pro3`: a página carrega normalmente, mas ao clicar em outro plano (ex.: Mensal) a aba congela — a partir daí nem screenshot nem uma avaliação simples de JavaScript respondem, ou seja, a thread principal fica presa em um laço de renderização infinito.

Causa identificada no código:

- `CheckoutPagamento` passa `onPlanoChange` como função inline, recriada a cada render.
- `CheckoutOferta` tem um efeito com dependência nessa função, então ele dispara a cada render e chama `onPlanoChange(escolhido)`.
- Esse callback chama `navigate({ to: "/checkout", search: { ...search, plano: id }, replace: true })`, criando um novo objeto de busca a cada chamada.
- O novo objeto de busca re-renderiza a rota, que recria o callback inline, que dispara o efeito de novo — laço fechado. O efeito de rastreamento (`ViewContent` / `CheckoutPageView`, dependente de `search`) também refaz disparos a cada volta, poluindo o Pixel.

## O que vou mudar

1. **Uma única fonte de verdade para o plano**
   O plano selecionado passa a ser controlado por um valor estável: a troca atualiza o estado imediatamente e a URL é sincronizada apenas quando o valor realmente muda, sem recriar o objeto de busca a cada render.

2. **Callbacks estáveis**
   `onPlanoChange` (e demais handlers passados ao `CheckoutOferta`) viram funções memorizadas, e o efeito que notifica a mudança de plano passa a depender só do identificador do plano — nunca da identidade da função.

3. **Rastreamento sem repetição**
   Os eventos `ViewContent` e `CheckoutPageView` passam a depender de valores primitivos (plano, origem, campanha) em vez do objeto de busca inteiro, disparando uma vez por mudança real.

4. **Checkout do Mercado Pago estável na troca**
   Ao trocar de plano, o Payment Brick é remontado de forma controlada uma única vez com o novo valor/parcelamento, em vez de reagir a renders repetidos.

## Validação

- Abrir `/checkout`, alternar Mensal → Anual → Semestral e confirmar que a página continua responsiva, que o resumo (valor, parcelas, cupom) muda corretamente e que o formulário de Pix/cartão reabre com o valor certo.
- Conferir o console sem erros e sem disparos repetidos de eventos do Pixel.
- Rodar os testes e a checagem de tipos.

## Escopo técnico

- Arquivos: `src/components/CheckoutPagamento.tsx` e `src/components/CheckoutOferta.tsx` (e, se necessário, a chave de remontagem em `src/components/MercadoPagoCheckout.tsx`).
- Sem mudanças em banco, RLS, preços, edge functions ou copy.
