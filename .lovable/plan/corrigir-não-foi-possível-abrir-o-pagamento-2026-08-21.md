# Corrigir "Não foi possível abrir o pagamento"

## Causa confirmada

O componente de checkout busca no servidor a chave pública do Mercado Pago antes de abrir o formulário de pagamento. No projeto novo essa chave (`MERCADOPAGO_PUBLIC_KEY`) não existe: o servidor devolve vazio e a tela mostra o erro "Não foi possível abrir o pagamento".

Verificado: o token privado (`MERCADOPAGO_ACCESS_TOKEN`) está salvo, mas a chave pública não.

## O que fazer

1. Abrir o formulário seguro para você colar `MERCADOPAGO_PUBLIC_KEY`.
   - Onde achar: painel do Mercado Pago → Suas integrações → sua aplicação → Credenciais.
   - Importante: use a **Public Key do mesmo aplicativo e do mesmo modo** (produção ou teste) do Access Token já salvo. Chaves misturadas causam "Invalid credentials" no pagamento.
2. Depois de salva, recarregar o checkout e conferir que o formulário de Pix/cartão abre normalmente.
3. Se ainda falhar, checar os logs da função de pagamento para ver a resposta real do Mercado Pago.

## Detalhes técnicos

- `src/lib/mercadopago.functions.ts` lê `process.env["MERCADOPAGO_PUBLIC_KEY"]`.
- `src/components/MercadoPagoCheckout.tsx` mostra a mensagem de erro quando `publicKey` vem nulo.
- Nenhuma mudança de código é necessária; é só configuração do segredo.
