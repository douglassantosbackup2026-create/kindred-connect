# Treinar sem vídeo próprio: guia de execução como padrão

Hoje cada exercício cai num clipe genérico de banco de imagens (5 vídeos repetidos por categoria). Quem entra agora vê um vídeo que não corresponde ao movimento. A troca: um guia de execução escrito e claro em cada exercício, e o vídeo oficial assume o lugar automaticamente assim que você subir a filmagem daquele exercício no admin.

## O que muda para o jogador

- No player do treino, no lugar do clipe genérico: um card de execução com a animação atual mais
  - **Como fazer** — 3 a 4 passos curtos e diretos
  - **Foco** — o ponto técnico que faz o exercício funcionar
  - **Erro comum** — o que evitar
  - **Sem espaço? / adaptação** — quando o movimento pede área ou bola
- Selo discreto "Demonstração em vídeo em breve" — honesto, sem parecer produto incompleto.
- Assim que existir vídeo cadastrado para aquele exercício (upload ou link no admin), o player mostra o vídeo e o guia vira um bloco recolhível abaixo. Nenhuma outra mudança necessária de sua parte.

## Conteúdo

Escrevo o guia de todos os exercícios de todos os treinos do plano, no tom do produto (direto, linguagem de jogador). Os exercícios repetidos entre treinos compartilham o mesmo guia, então a manutenção fica num único lugar.

## Detalhes técnicos

- Novo `src/data/exercise-guides.ts`: mapa `nome do exercício -> { passos, foco, erro, adaptacao }`, com uma cobertura de fallback por categoria (`mobilidade`, `forca`, `cardio`, `core`, `bola`) para qualquer exercício sem entrada própria.
- `src/data/training.ts`: o helper `ex()` deixa de preencher `videoUrl` com `DEMO_VIDEOS`. `videoUrl` passa a ser só filmagem oficial de verdade. `DEMO_VIDEOS` continua existindo para a landing/campanha (a página de vendas não muda).
- Novo `src/components/ExerciseGuide.tsx` com o card de execução.
- `src/components/ExerciseDemo.tsx`: quando não há `videoUrl`, renderiza a animação + `ExerciseGuide` em vez do aviso "Vídeo em breve"; quando há vídeo, mantém o player e mostra o guia recolhido embaixo. O estado de falha de carregamento também cai no guia.
- `src/routes/treino.$treinoId.tsx`: continua priorizando `videosCadastrados[nome]` (admin) sobre o dado estático — nada muda na lógica de acesso, cronômetro ou conclusão.
- A prévia de treinos na landing (`PreviewTreinos`) e o teaser da campanha seguem com os vídeos atuais.

## Fora de escopo

Sem mudanças em banco, RLS, pagamentos ou no fluxo do admin de vídeos — o upload continua funcionando exatamente como está e passa a ser o gatilho automático da troca.
