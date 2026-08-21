# Melhorar a cobertura de parâmetros em todos os eventos (diagnóstico da Meta)

O painel aponta quatro pontos no PageView: `fbc` ausente, telefone ausente, identificação externa ausente e IP enviado em IPv4 pela CAPI enquanto o Pixel envia IPv6. As causas são as mesmas para os demais eventos (ViewContent, InitiateCheckout, Lead, CompleteRegistration, Purchase, Subscribe e os eventos personalizados), então a correção é feita na camada compartilhada — vale para todo evento do site, atual e futuro.

## O que o código faz hoje (verificado)

- O Pixel é inicializado no `__root.tsx` com `fbq('init', PIXEL_ID)` **sem nenhum dado de correspondência**.
- `applyAdvancedMatching` só reinicializa o Pixel quando há e-mail ou telefone (`if (!ident.email && !ident.phone) return`), então `external_id` nunca chega ao evento do navegador.
- O PageView server-side (`trackMetaDedup`) já envia `external_id`, `fbp`, `fbc` (quando existe) e telefone (quando há sessão) — mas dispara no primeiro `useEffect`, podendo rodar antes de o `fbevents.js` gravar `_fbc`.
- O IP da CAPI vem dos cabeçalhos recebidos pela função (`pickClientIpFromRequest`); quando o proxy chega por IPv4, é IPv4 que vai para a Meta.
- E-mail só existe para quem está logado — daí os 4,76%.

Como o relatório soma Pixel + CAPI, os PageViews do navegador (a maioria, de visitantes anônimos) puxam a cobertura de `fbc`/`external_id` para baixo.

## O que será feito

Tudo é feito na inicialização do Pixel e em `trackMetaDedup`/`meta-capi`, por onde passam **todos** os eventos.

### 1. `external_id` em todo evento do navegador
Gerar o ID anônimo estável (já existe, `jps:meta-eid`) **antes** do `fbq('init')` e passá-lo direto na inicialização do Pixel, junto com `country: 'br'`. Como é a primeira e única `init` com dados, não aparece "Duplicate Pixel ID". A partir daí todo evento do Pixel (PageView, ViewContent, InitiateCheckout, Purchase, personalizados) sai com identificação externa; `applyAdvancedMatching` passa a reinicializar também quando só o `external_id` muda (anônimo → usuário logado).

### 2. `fbc` presente em mais eventos
- Ler o `fbclid` e gravar o `_fbc` no script inline do `<head>`, antes do Pixel carregar — hoje isso só acontece depois da hidratação do React, então os primeiros eventos da visita saem sem `fbc`.
- Em `trackMetaDedup` (usado por todos os eventos), esperar o cookie `_fbc`/`_fbp` aparecer (curta espera com re-tentativa, até ~1,5 s) antes de enviar à CAPI.
- Os eventos server-side de compra (`process-payment` e webhook do Mercado Pago) continuam usando o `fbc`/`fbp` persistido no checkout, agora com o fallback derivado do `fbclid`.

### 3. IPv6 na Conversions API
O navegador descobre o próprio IP público (preferindo IPv6) uma vez por sessão e envia em `client_ip_address` em **todos** os eventos da CAPI; `meta-capi` já aceita o campo e prioriza IPv6 sobre IPv4. O mesmo IP é persistido junto com os dados de atribuição do checkout, para o `Purchase` do webhook também sair com IPv6. Se a consulta falhar, continua valendo o IP dos cabeçalhos. Inclui liberar o endpoint de consulta no `connect-src` da CSP.

### 4. Telefone e e-mail com mais cobertura
- Guardar e-mail e nome do usuário localmente após cadastro/login/checkout, para que Pixel e CAPI enviem correspondência avançada em todos os eventos seguintes, inclusive antes de a sessão hidratar e nas páginas públicas.
- Telefone: quando o visitante digita o telefone no checkout, ele passa a alimentar os eventos daquela sessão (memória, sem gravar no navegador — mantendo a decisão atual de privacidade); para usuários logados continua vindo do perfil.
- `fn`/`ln`/`country` continuam sendo enviados em todos os eventos (já implementado no servidor).

## Detalhes técnicos

- `src/routes/__root.tsx`: script inline passa a capturar `fbclid` → cookie `_fbc`, ler/gerar o `external_id` em `localStorage` e chamar `fbq('init', ID, { external_id, country: 'br', em?, fn?, ln? })`.
- `src/lib/meta-pixel.ts`: `applyAdvancedMatching` aceita `external_id` sozinho com guarda de chave para não reinicializar à toa; novo helper de espera por `_fbp`/`_fbc`; novo helper de IP público com cache em `sessionStorage`; persistência de e-mail/nome.
- `src/lib/security-headers.ts` (+ teste): host de consulta de IP no `connect-src`.
- `src/components/MercadoPagoCheckout.tsx` / `supabase/functions/process-payment` e `mercadopago-webhook`: passar e persistir também o `client_ip_address` (IPv6) junto dos demais dados de atribuição já enviados.
- Sem mudanças de banco, de fluxo de pagamento ou de UI.

## Verificação

- No console, conferir que PageView, ViewContent, InitiateCheckout e Purchase saem do Pixel com `external_id` e que cada chamada `meta-capi` leva `fbc`, `external_id`, telefone (quando houver) e `client_ip_address` IPv6.
- Testar com `?fbclid=teste` e confirmar o cookie `_fbc` já no primeiro carregamento.
- Acompanhar o diagnóstico da Meta nas 24–48 h seguintes.
