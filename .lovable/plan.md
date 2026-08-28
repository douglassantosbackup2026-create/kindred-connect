# Por que o cartão está sendo recusado

## O que os dados mostram

A última tentativa (28/08, 00:38) voltou do Mercado Pago assim:

- `status: rejected`
- `status_detail: cc_rejected_high_risk`
- `amount: 1` (modo teste de R$1)

Ou seja: **não é erro do código nem da integração**. O pagamento chegou ao Mercado Pago, foi processado e a análise antifraude dele recusou. `cc_rejected_high_risk` significa "recusado por risco" — o MP considerou a transação suspeita.

## Por que isso acontece com R$1

Cobranças de valor mínimo (R$1) em conta de produção são um padrão clássico de teste de cartão roubado. O antifraude do Mercado Pago costuma marcar exatamente esse cenário como alto risco, ainda mais somado a:

- CPF/nome do pagador que não batem com o titular do cartão
- e-mail claramente de teste (`teste1-2@teste.com`)
- várias tentativas seguidas do mesmo dispositivo/IP
- ausência do device fingerprint do MP na página

Pix não passa por esse antifraude — por isso ele tende a aprovar normalmente mesmo em R$1.

## Como validar a compra por cartão

1. **Testar com Pix** enquanto estiver em R$1 — confirma que o fluxo completo (pagamento → webhook → liberação de acesso) funciona.
2. **Para testar cartão de verdade**, usar dados reais e coerentes: e-mail real, CPF do próprio titular do cartão, nome como está no cartão.
3. **Testar no valor real** (R$47 / R$147 / R$197). Valor de R$1 é justamente o que dispara o alerta de risco.
4. **Alternativa sem risco**: usar as credenciais de **teste** do Mercado Pago (usuário de teste + cartões de teste da documentação), que não passam pelo antifraude de produção.

## O que posso implementar (se você quiser)

- **Device fingerprint do Mercado Pago** (script `security.js` no checkout): melhora bastante a taxa de aprovação em produção, é recomendação oficial do MP.
- **Mensagem específica para `cc_rejected_high_risk`**: hoje o texto genérico diz "confira os dados ou tente Pix". O ideal é "Seu banco/o Mercado Pago recusou por segurança. Tente Pix ou outro cartão."
- **Restaurar os preços reais** quando você terminar os testes.

## Detalhes técnicos

- Resposta do MP registrada em `supabase/functions/process-payment/index.ts`; o status volta ao cliente e é gravado em `payment_events`.
- Preços de teste em `supabase/functions/_shared/mp.ts` (`PLANOS`, todos com `amount: 1`) e em `src/data/training.ts`.
- Tradução de erros em `src/lib/checkout.ts` (`traduzErroPagamento`) — é onde entraria a mensagem específica de alto risco.
