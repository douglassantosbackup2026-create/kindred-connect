# Nova página de vendas "Andromeda" em /pro

Uma segunda página de vendas, com a copy nova, na rota `/pro`. A home atual (`/`) continua exatamente como está — assim dá para rodar anúncio nas duas e comparar conversão.

## Identidade visual

Mesma identidade da home: mesmos tokens de cor, tipografia, cards arredondados, badges, barra de garantia no topo e componentes de checkout já existentes. Nada de nova paleta ou fonte.

## Estrutura da página (na ordem da copy)

1. Barra de garantia (14 dias) + topo com logo e botão de acesso
2. Hero — eyebrow "APP DE TREINO • 52 SEMANAS • ACESSO IMEDIATO", headline "Chegue no próximo jogo parecendo outro jogador.", subtítulo do sistema 10–20 min, prova social 2.469+ jogadores, 4 itens do "O que você recebe", CTA "QUERO COMEÇAR AGORA" + linha "A partir de R$16,42/mês • 14 dias de garantia"
3. "Você não é ruim. Você só treina sem sequência." — bloco de dor
4. "Conheça o Sistema 10×20" — o que aparece no app todo dia
5. Faixa de números — 2.469+ jogadores, 10–20 min, 52 semanas, acesso imediato
6. "Veja o que você vai treinar" — 5 cards (Controle de Bola 16', Explosão + Velocidade 12', Resistência de Jogo 22', Força de Pernas 20', Pré/Pós-Jogo 10') + CTA
7. Comparativo "Sem método" x "Com o Jogador PRO" (duas colunas)
8. "Tudo o que você desbloqueia" — lista de 11 itens com check
9. Depoimentos — seção completa atual (mensagens reais dos alunos, com o selo de autenticidade)
10. Bônus exclusivos — Desafio 30 Dias, Modo Rápido, Mapa da Evolução
11. Planos — Anual em destaque (De R$564 por R$197, 12x de R$16,42), Semestral R$147, Mensal R$47; mesmos preços e mesmo fluxo de checkout de hoje
12. Garantia de 14 dias
13. FAQ — as 6 perguntas da copy
14. Fechamento "Seu próximo treino já está pronto" + CTA final e linha "Acesso imediato • Pix ou cartão • 14 dias de garantia"
15. Rodapé igual ao da home

## Comportamento

- Todos os CTAs levam ao mesmo checkout da home, com o plano pré-selecionado (anual no CTA do plano anual, etc.).
- UTMs da URL são capturadas do mesmo jeito que na home.
- Eventos do Meta Pixel disparam igual, mas identificando a página como `landing_pro`, para separar o desempenho das duas páginas nos relatórios.
- Metadados próprios de título/descrição/compartilhamento para `/pro`.

## Detalhes técnicos

- Novo arquivo de copy `src/data/pro-copy.ts` (não altera `campanha-copy.ts`).
- Novo componente `src/components/ProLandingPage.tsx` com as seções acima, reaproveitando `TopBar`, `UrgencyBar`, `GarantiaBadge`, `DepoimentosSection`, `CheckoutOferta`/`PlanosTable` e os utilitários de checkout/UTM.
- Nova rota `src/routes/pro.tsx` com `validateSearch` igual à home, `head()` próprio e o mesmo redirect de usuário logado/assinante.
- Seções de planos: se `PlanosTable` precisar de dados diferentes dos de `CAMPANHA`, recebe os planos por prop em vez de ler o módulo direto (mesmos preços atuais).
- Sem mudanças em banco, funções de pagamento ou preços.

## Critério de pronto

- `/pro` renderiza a copy completa, com a mesma identidade visual da home.
- Checkout funciona a partir de qualquer CTA da nova página.
- Home `/` intacta. Typecheck e testes limpos.
