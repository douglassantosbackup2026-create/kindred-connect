# Auditoria final dos parâmetros da Conversions API

Comparei a lista da documentação com o que o app envia hoje (`supabase/functions/_shared/capi.ts`, `meta-capi`, `process-payment`, `mercadopago-webhook`, `src/lib/meta-pixel.ts`).

## Já implementado e correto

- Obrigatórios web: `client_user_agent`, `action_source: "website"`, `event_source_url`.
- Evento: `event_name`, `event_time` (hora real da aprovação no Pix/boleto), `event_id` deduplicado com o Pixel, `referrer_url`, `opt_out`, `customer_segmentation`, `data_processing_options: []`, `test_event_code`.
- Cliente: `em`, `ph` (E.164 BR), `fn`, `ln`, `country`, `external_id` (hash), `client_ip_address` (preferindo IPv6), `fbp`, `fbc` (com fallback de `fbclid`), `subscription_id` na compra.
- `original_event_data` com `event_name` + `event_time` do InitiateCheckout no Purchase confirmado por webhook.

## Lacunas que valem corrigir

1. **`custom_data` incompleto nas compras** — falta `content_ids`, `content_type: "product"`, `contents` e `num_items`. A Meta usa esses campos para catálogo/otimização; hoje só vai `content_name`.
2. **`order_id` ausente** — nem em `custom_data` nem em `original_event_data`. É o principal parâmetro de desduplicação de compras atrasadas e de conciliação de reembolso.
3. **`original_event_data.event_id` ausente** — enviamos só nome e hora; incluir o `event_id` do InitiateCheckout torna o vínculo exato.
4. **`data_processing_options_country` / `_state` não enviados** — com LDU desligado, o correto é omitir de fato ou enviar `0`/`0` de forma consistente; hoje só o array vazio vai.
5. **`lead_id`** — os leads de escolinha não enviam identificador de lead; sem isso a otimização de lead não fecha o ciclo.

## O que será feito

- `supabase/functions/_shared/capi.ts`: aceitar `orderId` e repassar `order_id` em `custom_data`; permitir `event_id` e `order_id` dentro de `original_event_data`; enviar `data_processing_options_country: 0` e `data_processing_options_state: 0` junto do array vazio.
- `process-payment` e `mercadopago-webhook`: no Purchase, enviar `order_id` = ID do pagamento do Mercado Pago, `content_ids: [plano]`, `content_type: "product"`, `contents: [{ id: plano, quantity: 1, item_price: valor }]`, `num_items: 1`; no webhook, incluir `event_id` do InitiateCheckout em `original_event_data` (gravado nos metadados do pagamento pelo `process-payment`).
- `supabase/functions/meta-capi/index.ts`: aceitar `order_id` e `original_event_data.event_id`/`order_id` vindos do cliente, com as mesmas validações de tempo já existentes.
- `src/lib/meta-pixel.ts` e `src/components/MercadoPagoCheckout.tsx`: propagar o `event_id` do InitiateCheckout nos metadados do pagamento para o webhook reaproveitar.

## Fora de escopo (deliberado)

- `ct`, `st`, `zp`, `db`, `ge`: o app não coleta esses dados; enviar vazio não melhora matching.
- Parâmetros de app (`madid`, `anon_id`, `extinfo`, `vendor_id`) — não há app nativo.
- `page_id`, `ctwa_clid`, `ig_sid`, `fb_login_id` — não há Messenger/WhatsApp/Login do Facebook.
- LDU (`data_processing_options: ["LDU"]`) — só se aplica aos EUA; o público é Brasil.

## Verificação

`tsgo` limpo, testes de `capi.test.ts` e `meta-pixel.test.ts`, e conferência no Gerenciador de Eventos com `META_TEST_EVENT_CODE` (uma compra de teste deve mostrar `order_id`, `contents` e nota de correspondência mantida ou maior).
