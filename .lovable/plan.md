# Melhorar a cobertura de parâmetros do PageView (diagnóstico da Meta)

O painel aponta quatro pontos no PageView: `fbc` ausente, telefone ausente, identificação externa ausente e IP enviado em IPv4 pela CAPI enquanto o Pixel envia IPv6.

## O que o código faz hoje (verificado)

- O Pixel é inicializado no `__root.tsx` com `fbq('init', PIXEL_ID)` **sem nenhum dado de correspondência**.
- `applyAdvancedMatching` só reinicializa o Pixel quando há e-mail ou telefone (`if (!ident.email && !ident.phone) return`), então `external_id` nunca chega ao evento do navegador.
- O PageView server-side (`trackMetaDedup`) já envia `external_id`, `fbp`, `fbc` (quando existe) e telefone (quando há sessão) — mas dispara no primeiro `useEffect`, podendo rodar antes de o `fbevents.js` gravar `_fbc`.
- O IP da CAPI vem dos cabeçalhos recebidos pela função (`pickClientIpFromRequest`); quando o proxy chega por IPv4, é IPv4 que vai para a Meta.
- E-mail só existe para quem está logado — daí os 4,76%.

Como o relatório soma Pixel + CAPI, os PageViews do navegador (a maioria, de visitantes anônimos) puxam a cobertura de `fbc`/`external_id` para baixo.

## O que será feito

### 1. `external_id` em todo PageView do navegador
Gerar o ID anônimo estável (já existe, `jps:meta-eid`) **antes** do `fbq('init')` e passá-lo direto na inicialização do Pixel, junto com `country: 'br'`. Como é a primeira e única `init` com dados, não aparece "Duplicate Pixel ID". `applyAdvancedMatching` passa a poder reinicializar também quando só há `external_id` novo (troca de anônimo para usuário logado).

### 2. `fbc` presente em mais eventos
- Ler o `fbclid` e gravar o `_fbc` no script inline do `<head>`, antes do Pixel carregar — hoje isso só acontece depois da hidratação do React.
- No PageView server-side, esperar o cookie `_fbc`/`_fbp` aparecer (curta espera com re-tentativa, até ~1,5 s) antes de enviar o evento à CAPI, para não mandar o evento sem os identificadores do navegador.

### 3. IPv6 na Conversions API
O navegador passa a descobrir o próprio IP público (preferindo IPv6) uma vez por sessão e enviar em `client_ip_address`; a função `meta-capi` já aceita esse campo e prioriza IPv6 sobre IPv4. Se a consulta falhar, continua valendo o IP dos cabeçalhos. Inclui liberar o endpoint de consulta no `connect-src` da CSP.

### 4. Telefone e e-mail com mais cobertura
- Guardar e-mail (e nome) do usuário localmente após cadastro/login para que o Pixel continue enviando correspondência avançada em visitas seguintes, mesmo antes de a sessão hidratar.
- Telefone continua vindo apenas do perfil do usuário autenticado (não será gravado no navegador, mantendo a decisão atual de privacidade); a cobertura sobe naturalmente nas páginas logadas.

## Detalhes técnicos

- `src/routes/__root.tsx`: script inline passa a capturar `fbclid` → cookie `_fbc`, ler/gerar o `external_id` em `localStorage` e chamar `fbq('init', ID, { external_id, country: 'br', em?, fn?, ln? })`.
- `src/lib/meta-pixel.ts`: `applyAdvancedMatching` aceita `external_id` sozinho com guarda de chave para não reinicializar à toa; novo helper de espera por `_fbp`/`_fbc`; novo helper de IP público com cache em `sessionStorage`; persistência de e-mail/nome.
- `src/lib/security-headers.ts` (+ teste): host de consulta de IP no `connect-src`.
- Sem mudanças de banco, de pagamento ou de UI.

## Verificação

- No console, conferir que o PageView do Pixel sai com `external_id` e que a chamada `meta-capi` leva `fbc`, `external_id` e um `client_ip_address` IPv6.
- Testar com `?fbclid=teste` e confirmar o cookie `_fbc` já no primeiro carregamento.
- Acompanhar o diagnóstico da Meta nas 24–48 h seguintes.
