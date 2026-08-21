/**
 * Guias de execução escritos por exercício.
 *
 * Enquanto não existe filmagem oficial, o player mostra este guia no lugar do
 * vídeo. Assim que um vídeo é cadastrado no admin (upload ou link), o vídeo
 * assume o lugar e o guia vira um bloco recolhível abaixo.
 */

export type ExerciseGuide = {
  /** 3 a 4 passos curtos de execução. */
  passos: string[];
  /** O ponto técnico que faz o exercício funcionar. */
  foco: string;
  /** O erro mais comum. */
  erro: string;
  /** Adaptação para pouco espaço / sem bola. */
  adaptacao?: string;
};

export type GuiaCategoria = "mobilidade" | "forca" | "cardio" | "core" | "bola";

const g = (
  passos: string[],
  foco: string,
  erro: string,
  adaptacao?: string,
): ExerciseGuide => ({ passos, foco, erro, ...(adaptacao ? { adaptacao } : {}) });

/** Fallback por tipo de movimento — cobre qualquer exercício sem entrada própria. */
export const GUIAS_POR_CATEGORIA: Record<GuiaCategoria, ExerciseGuide> = {
  mobilidade: g(
    [
      "Comece devagar e vá aumentando a amplitude a cada repetição.",
      "Respire pelo nariz, solte o ar no ponto de maior alongamento.",
      "Mantenha o movimento contínuo, sem travar em nenhum ponto.",
    ],
    "Amplitude com controle — mobilidade é ganhar alcance, não forçar dor.",
    "Acelerar e usar embalo. Se está balançando o corpo, reduza a velocidade.",
    "Precisa de menos de 1 m² — dá para fazer em qualquer canto.",
  ),
  forca: g(
    [
      "Pés firmes no chão, peso distribuído entre calcanhar e planta.",
      "Desça controlado (2 segundos) e suba com força.",
      "Mantenha o tronco firme e o olhar à frente do começo ao fim.",
    ],
    "Controle na descida — é ali que o músculo cresce.",
    "Descer rápido e usar impulso: perde estímulo e sobrecarrega a articulação.",
    "Sem peso? Aumente o tempo de descida para 4 segundos.",
  ),
  cardio: g(
    [
      "Aterrisse na parte da frente do pé, joelhos levemente flexionados.",
      "Braços acompanhando o ritmo das pernas, ombros soltos.",
      "Mantenha um ritmo que você consiga sustentar até o fim do tempo.",
    ],
    "Ritmo constante — melhor terminar forte do que explodir nos 20 primeiros segundos.",
    "Aterrissar de calcanhar e travar os joelhos. Pisada leve e barulho baixo.",
    "Em espaço apertado, faça no lugar: o estímulo é o mesmo.",
  ),
  core: g(
    [
      "Abdômen contraído como se fosse levar um soco na barriga.",
      "Glúteo apertado e quadril alinhado com ombros e calcanhares.",
      "Respire normalmente — não prenda o ar.",
    ],
    "Alinhamento acima de tempo. 20 segundos perfeitos valem mais que 60 tortos.",
    "Quadril subindo ou caindo, e prender a respiração.",
    "Muito difícil? Apoie os joelhos e mantenha o resto igual.",
  ),
  bola: g(
    [
      "Bola perto do corpo, dentro do alcance de um passo.",
      "Cabeça alternando entre a bola e o que está à frente.",
      "Toques curtos e frequentes, com a bola sempre sob controle.",
    ],
    "Primeiro toque: se a bola morre no pé, a jogada seguinte fica fácil.",
    "Olhar fixo na bola o tempo todo — no jogo, isso custa a jogada.",
    "Sem bola? Faça o mesmo padrão de pés com uma bola imaginária ou uma meia enrolada.",
  ),
};

export const GUIAS: Record<string, ExerciseGuide> = {
  // ---------- Mobilidade / preparação ----------
  "Aquecimento dinâmico": g(
    [
      "Comece com corrida leve no lugar por 20 segundos.",
      "Some giros de braço, elevação de joelho e calcanhar no glúteo.",
      "Aumente a intensidade progressivamente até sentir o corpo quente.",
    ],
    "Subir a temperatura e a frequência cardíaca antes de exigir força.",
    "Alongar parado antes de aquecer — alongamento estático fica para o fim.",
    "Faz no lugar, em qualquer espaço.",
  ),
  "Mobilidade de quadril": g(
    [
      "Em pé, eleve um joelho até a altura do quadril.",
      "Abra o joelho para fora desenhando um círculo grande e volte.",
      "Alterne as pernas mantendo o tronco firme.",
    ],
    "Amplitude do círculo — quanto maior, mais ganho de mobilidade.",
    "Inclinar o tronco para compensar. Se inclinou, o círculo está grande demais.",
    "Precisa de menos de 1 m².",
  ),
  "Mobilidade de ombro": g(
    [
      "Braços estendidos, faça círculos grandes para frente.",
      "Inverta o sentido na metade do tempo.",
      "Finalize cruzando os braços à frente e abrindo o peito.",
    ],
    "Movimento amplo e lento, sentindo a articulação percorrer todo o arco.",
    "Círculos pequenos e rápidos — não trabalham a amplitude.",
  ),
  "Alongamento posterior": g(
    [
      "Em pé, uma perna à frente com o calcanhar no chão e a ponta do pé para cima.",
      "Empurre o quadril para trás até sentir a parte de trás da coxa.",
      "Segure 15 segundos e troque a perna.",
    ],
    "Coluna reta — o alongamento vem do quadril, não das costas curvadas.",
    "Arredondar as costas para chegar mais perto do pé.",
  ),
  Respiração: g(
    [
      "Em pé ou sentado, inspire pelo nariz contando até 4.",
      "Segure 2 segundos.",
      "Solte pela boca contando até 6, esvaziando o pulmão.",
    ],
    "Expiração mais longa que a inspiração — é o que baixa a frequência cardíaca.",
    "Respirar só com o peito. O ar tem que ir para a barriga.",
  ),
  "Respiração + foco": g(
    [
      "Inspire em 4, segure em 2, solte em 6.",
      "A cada expiração, visualize uma jogada que você quer executar hoje.",
      "Repita até o fim do tempo, olhos fechados se ajudar.",
    ],
    "Chegar no treino com a cabeça no jogo, não no resto do dia.",
    "Correr para o próximo exercício — este bloco é parte do treino.",
  ),
  "Respiração diafragmática": g(
    [
      "Deitado ou sentado, uma mão no peito e outra na barriga.",
      "Inspire fazendo só a mão da barriga subir.",
      "Solte lentamente pela boca, esvaziando por completo.",
    ],
    "Só a barriga se move. O peito fica praticamente parado.",
    "Levantar os ombros ao inspirar.",
  ),
  "Volta à calma": g(
    [
      "Caminhe leve no lugar por 30 segundos.",
      "Solte os braços e as pernas com movimentos frouxos.",
      "Finalize com respiração longa até o coração desacelerar.",
    ],
    "Baixar a frequência cardíaca aos poucos, sem parar de vez.",
    "Sentar ou deitar logo após o último tiro.",
  ),
  "Caminhada leve no lugar": g(
    [
      "Caminhe no lugar em ritmo tranquilo.",
      "Braços soltos, respiração pelo nariz.",
      "Vá diminuindo o ritmo até o fim do tempo.",
    ],
    "Recuperação ativa — o sangue continua circulando.",
    "Parar de repente e ficar em pé imóvel.",
  ),

  // ---------- Cardio / corrida ----------
  Polichinelo: g(
    [
      "Pés juntos, braços ao lado do corpo.",
      "Salte abrindo as pernas e levando os braços acima da cabeça.",
      "Volte à posição inicial no mesmo ritmo, sem pausa.",
    ],
    "Pisada leve na ponta do pé e ritmo constante.",
    "Aterrissar de calcanhar com joelho travado.",
    "Sem espaço para abrir? Alterne as pernas à frente e atrás (step jack).",
  ),
  "Corrida estacionária": g(
    [
      "Corra no lugar elevando os joelhos até a altura do quadril.",
      "Aterrisse na ponta do pé, joelhos macios.",
      "Braços a 90°, alternando com as pernas.",
    ],
    "Cadência alta: muitos passos por segundo, cada passo curto.",
    "Passos altos mas lentos — vira exercício de perna, não de fôlego.",
  ),
  "Corrida contínua": g(
    [
      "Assuma um ritmo em que você consiga conversar frases curtas.",
      "Passada natural, tronco ereto, olhar à frente.",
      "Mantenha o mesmo ritmo do começo ao fim do bloco.",
    ],
    "Constância. Este bloco é base aeróbica, não é tiro.",
    "Começar rápido demais e ter que parar na metade.",
    "Sem espaço para correr? Faça corrida estacionária pelo mesmo tempo.",
  ),
  "Corrida com mudança de ritmo": g(
    [
      "Corra 20 segundos em ritmo moderado.",
      "Acelere para 80% por 10 segundos.",
      "Volte ao moderado sem parar e repita o ciclo.",
    ],
    "A transição: acelerar sem quebrar a passada e desacelerar sem parar.",
    "Parar entre as acelerações — o coração precisa ficar alto o tempo todo.",
  ),
  "Skipping alto": g(
    [
      "Eleve o joelho até a altura do quadril, o mais rápido possível.",
      "Aterrisse na ponta do pé, embaixo do quadril.",
      "Braços acompanhando forte, mãos até a altura do rosto.",
    ],
    "Frequência: mais contatos com o chão no mesmo tempo.",
    "Jogar o tronco para trás para levantar mais o joelho.",
  ),
  "Skipping lateral": g(
    [
      "Desloque-se de lado com passos curtos e rápidos.",
      "Pés nunca se cruzam, quadril baixo.",
      "Vá e volte no mesmo espaço.",
    ],
    "Quadril baixo e centro de gravidade estável — é a base da marcação.",
    "Levantar o tronco entre os passos.",
    "Espaço curto? Faça 2 passos para cada lado, mantendo a velocidade.",
  ),
  "Vai e vem": g(
    [
      "Marque dois pontos com a distância disponível.",
      "Vá em velocidade, freie com o pé de apoio e volte.",
      "Cada mudança de direção é uma repetição.",
    ],
    "A frenagem: joelho flexionado e quadril baixo antes de virar.",
    "Frear com o joelho estendido — é assim que se torce o joelho.",
    "Pouco espaço? Use 3 metros e foque na qualidade da virada.",
  ),
  "Aceleração 8s": g(
    [
      "Saia da posição parada em máxima intensidade.",
      "Primeiros passos curtos e agressivos, tronco inclinado à frente.",
      "Vá abrindo a passada e ergendo o tronco conforme ganha velocidade.",
    ],
    "Os 3 primeiros passos definem a arrancada inteira.",
    "Sair já com o tronco ereto — perde a força de impulso.",
    "Sem espaço? Faça no lugar em máxima frequência pelos mesmos 8 segundos.",
  ),
  "Tiro curto no lugar": g(
    [
      "No lugar, corra na máxima frequência que conseguir.",
      "Pisada curta, na ponta do pé, joelhos à frente.",
      "Sustente a intensidade máxima até o apito.",
    ],
    "Máxima frequência — este é um bloco de intensidade, não de duração.",
    "Ir em 70%: sem intensidade não há adaptação.",
  ),
  "Tiros curtos no lugar": g(
    [
      "Alterne 5 segundos em máxima frequência com 5 segundos leves.",
      "Na fase forte, joelhos altos e braços rápidos.",
      "Na fase leve, não pare: trote no lugar.",
    ],
    "Contraste entre forte e leve. Se a fase leve virar descanso, perde o efeito.",
    "Parar completamente na recuperação.",
  ),
  "Tiro de 10 metros": g(
    [
      "Posição de saída: um pé à frente, peso adiantado.",
      "Arranque explosivo, tronco inclinado nos primeiros passos.",
      "Desacelere depois da marca, caminhe de volta e repita.",
    ],
    "Explosão na saída. Os 10 metros são ganhos nos primeiros 3.",
    "Sair devagar e acelerar no meio.",
    "Sem 10 metros? Faça 5 metros com o dobro de repetições.",
  ),
  "Tiros de 30 metros": g(
    [
      "Arranque forte e vá abrindo a passada.",
      "Atinja a velocidade máxima por volta dos 20 metros.",
      "Recupere caminhando de volta antes do próximo tiro.",
    ],
    "Manter a velocidade máxima nos últimos metros sem travar.",
    "Cortar a recuperação — sem descanso, o próximo tiro é lento e não treina velocidade.",
    "Espaço curto? Faça 15 metros ida e volta.",
  ),
  "Tiros progressivos": g(
    [
      "Comece em 50% da velocidade.",
      "Aumente a cada terço do percurso até chegar a 90%.",
      "Desacelere suave e recupere antes do próximo.",
    ],
    "Progressão suave, sem solavancos entre as fases.",
    "Sair já em 90% — o objetivo é a transição de ritmo.",
  ),
  "Corte 45°": g(
    [
      "Corra 3 passos à frente.",
      "Plante o pé externo e mude a direção em 45°.",
      "Saia acelerando na nova direção e alterne os lados.",
    ],
    "Plantar o pé fora da linha do corpo e sair no primeiro passo.",
    "Frear com passos curtinhos antes de virar em vez de plantar o pé.",
    "Faça em 4 metros de espaço, alternando os lados.",
  ),
  "Queda lateral controlada": g(
    [
      "Em base semiflexionada, jogue o peso para um lado.",
      "Absorva com o pé de fora, joelho alinhado com a ponta do pé.",
      "Volte ao centro com controle e repita para o outro lado.",
    ],
    "Absorção: chegar e segurar, sem cambalear.",
    "Deixar o joelho cair para dentro na hora de absorver.",
  ),
  "Saltos laterais": g(
    [
      "Salte lateralmente sobre uma linha imaginária.",
      "Aterrisse na ponta do pé e salte de volta imediatamente.",
      "Mantenha o tronco estável e o quadril baixo.",
    ],
    "Tempo de contato curto — quicar, não pousar.",
    "Aterrissar de calcanhar e demorar para sair do chão.",
    "Um pé só? Faça saltos unipodais para dobrar a dificuldade.",
  ),
  "Passada longa": g(
    [
      "Corra com passadas propositalmente longas.",
      "Empurre o chão para trás com força a cada passo.",
      "Braços amplos, acompanhando a passada.",
    ],
    "Empurrar o solo — a passada longa vem da força, não de esticar a perna.",
    "Esticar a perna à frente e aterrissar de calcanhar (freia o corpo).",
  ),

  // ---------- Força / explosão ----------
  "Agachamento livre": g(
    [
      "Pés na largura dos ombros, pontas levemente para fora.",
      "Desça empurrando o quadril para trás até a coxa ficar paralela ao chão.",
      "Suba empurrando o chão com o meio do pé, glúteo contraído no topo.",
    ],
    "Joelho na direção da ponta do pé e coluna neutra.",
    "Joelho caindo para dentro e calcanhar saindo do chão.",
    "Difícil? Agache até tocar uma cadeira e levante.",
  ),
  "Agachamento com salto": g(
    [
      "Agache até a metade.",
      "Exploda para cima estendendo quadril, joelho e tornozelo.",
      "Aterrisse macio, já descendo para o próximo salto.",
    ],
    "Aterrissagem silenciosa — barulho alto significa impacto na articulação.",
    "Cair de perna dura e joelho travado.",
    "Impacto demais? Troque por agachamento rápido sem sair do chão.",
  ),
  "Agachamento búlgaro": g(
    [
      "Apoie o peito do pé de trás em um banco, cama ou degrau.",
      "Desça na perna da frente até o joelho de trás quase tocar o chão.",
      "Suba empurnando com o calcanhar da perna da frente.",
    ],
    "Todo o peso na perna da frente. A de trás só equilibra.",
    "Pé da frente perto demais do apoio — o joelho ultrapassa muito a ponta do pé.",
    "Sem apoio? Faça afundo estático na mesma posição.",
  ),
  "Afundo alternado": g(
    [
      "Dê um passo à frente e desça até os dois joelhos formarem 90°.",
      "Empurre com o calcanhar da frente para voltar.",
      "Alterne as pernas a cada repetição.",
    ],
    "Tronco ereto e descida vertical, sem jogar o corpo à frente.",
    "Passo curto demais — sobrecarrega o joelho da frente.",
    "Equilíbrio ruim? Apoie a mão na parede.",
  ),
  "Afundo com impulso": g(
    [
      "Desça no afundo até 90°.",
      "Suba explodindo e troque as pernas no ar.",
      "Aterrisse já na posição do afundo seguinte, macio.",
    ],
    "Aterrissar controlado, absorvendo com a perna da frente.",
    "Aterrissar com o tronco caindo à frente.",
    "Sem impulso: faça o afundo alternado normal, mais rápido.",
  ),
  "Elevação de panturrilha": g(
    [
      "Em pé, suba na ponta dos pés o máximo que conseguir.",
      "Segure 1 segundo no topo.",
      "Desça lentamente até o calcanhar quase tocar o chão.",
    ],
    "Amplitude completa e pausa no topo.",
    "Fazer rápido e curto usando o embalo.",
    "Mais difícil: faça em um pé só ou com o antepé em um degrau.",
  ),
  "Ponte de glúteo": g(
    [
      "Deitado de costas, joelhos flexionados, pés no chão perto do glúteo.",
      "Empurre o chão com os calcanhares e suba o quadril.",
      "Aperte o glúteo no topo por 1 segundo e desça controlado.",
    ],
    "O movimento vem do glúteo, não da lombar.",
    "Estourar a lombar no topo para subir mais.",
    "Mais difícil: apoie um pé só e mantenha o quadril nivelado.",
  ),
  "Isometria na parede": g(
    [
      "Costas na parede, desça até as coxas ficarem paralelas ao chão.",
      "Joelhos a 90°, pés na largura do quadril.",
      "Segure a posição respirando normalmente.",
    ],
    "Manter o ângulo. Se o quadril subir, o exercício acabou.",
    "Apoiar as mãos nas coxas para aliviar.",
  ),
  "Salto vertical": g(
    [
      "Agache rápido até a metade e exploda para cima.",
      "Estenda todo o corpo no ar, braços para o alto.",
      "Aterrisse macio e prepare o próximo salto.",
    ],
    "Usar os braços: o impulso deles vale altura real.",
    "Agachar fundo demais antes de saltar — perde a elasticidade.",
  ),
  "Salto + aterrissagem": g(
    [
      "Salte para cima com os dois pés.",
      "Aterrisse e congele 2 segundos na posição de absorção.",
      "Só então prepare o próximo salto.",
    ],
    "A aterrissagem é o exercício: joelhos alinhados, quadril para trás, silêncio.",
    "Sair do chão de novo sem estabilizar — o objetivo aqui é frear.",
  ),
  "Salto em caixa (sem caixa)": g(
    [
      "Simule a subida na caixa: agache e exploda para cima e à frente.",
      "Aterrisse em posição de agachamento parcial, absorvendo o impacto.",
      "Volte à posição inicial caminhando e repita.",
    ],
    "Aterrissagem em posição de agachamento, nunca com a perna reta.",
    "Fazer em série contínua sem reajustar a base entre os saltos.",
    "Tem um degrau firme? Use como caixa baixa.",
  ),
  "Cone imaginário — zigue": g(
    [
      "Imagine 4 cones em zigue-zague à sua frente.",
      "Desloque-se contornando cada um com passos curtos.",
      "Toque o chão ao lado de cada cone e saia acelerando.",
    ],
    "Quadril baixo nas curvas — é ali que se ganha ou perde o adversário.",
    "Fazer curvas largas para não perder velocidade.",
    "Use garrafas, chinelos ou qualquer marca no chão.",
  ),

  // ---------- Core ----------
  Prancha: g(
    [
      "Apoie antebraços e pontas dos pés, cotovelos abaixo dos ombros.",
      "Corpo em linha reta da cabeça ao calcanhar.",
      "Contraia abdômen e glúteo e respire normalmente.",
    ],
    "Linha reta. Quadril alto ou baixo tira o estímulo do abdômen.",
    "Prender a respiração e deixar a lombar afundar.",
    "Difícil? Apoie os joelhos mantendo o mesmo alinhamento.",
  ),
  "Prancha frontal": g(
    [
      "Antebraços no chão, cotovelos sob os ombros.",
      "Corpo alinhado, abdômen e glúteo contraídos.",
      "Olhar para o chão, pescoço neutro.",
    ],
    "Empurrar o chão com os antebraços para abrir as escápulas.",
    "Levantar o quadril para descansar.",
  ),
  "Prancha isométrica": g(
    [
      "Assuma a prancha e trave a posição.",
      "Aperte glúteo, abdômen e quadríceps ao mesmo tempo.",
      "Segure o tempo inteiro sem ajustar a posição.",
    ],
    "Tensão global — o corpo inteiro contraído, não só a barriga.",
    "Descansar e voltar. Prefira reduzir o tempo e manter a qualidade.",
  ),
  "Prancha leve": g(
    [
      "Faça a prancha com os joelhos apoiados no chão.",
      "Mantenha a linha reta do joelho até a cabeça.",
      "Abdômen contraído do começo ao fim.",
    ],
    "Mesmo alinhamento da prancha completa, com menos carga.",
    "Sentar sobre os calcanhares.",
  ),
  "Prancha lateral": g(
    [
      "Deitado de lado, apoie o antebraço com o cotovelo sob o ombro.",
      "Suba o quadril até formar uma linha reta.",
      "Segure e troque de lado na metade do tempo.",
    ],
    "Quadril alto — é o oblíquo que sustenta a posição.",
    "Deixar o quadril cair ou rodar o tronco para frente.",
    "Difícil? Apoie os joelhos em vez dos pés.",
  ),
  "Prancha lateral direita": g(
    [
      "Deite sobre o lado direito, cotovelo sob o ombro.",
      "Suba o quadril, corpo em linha reta.",
      "Braço livre estendido para cima ou na cintura.",
    ],
    "Quadril alto e ombro estável.",
    "Rodar o tronco para o chão.",
  ),
  "Prancha lateral esquerda": g(
    [
      "Deite sobre o lado esquerdo, cotovelo sob o ombro.",
      "Suba o quadril, corpo em linha reta.",
      "Braço livre estendido para cima ou na cintura.",
    ],
    "Quadril alto e ombro estável.",
    "Rodar o tronco para o chão.",
  ),
  "Prancha dinâmica": g(
    [
      "Comece na prancha com antebraços.",
      "Suba para a posição de flexão, um braço de cada vez.",
      "Volte para os antebraços alternando o braço que inicia.",
    ],
    "Quadril parado — o objetivo é não balançar durante a troca.",
    "Rebolar o quadril para compensar a troca de apoio.",
    "Difícil? Faça com os joelhos apoiados.",
  ),
  "Prancha com toque no ombro": g(
    [
      "Prancha alta, mãos sob os ombros, pés um pouco afastados.",
      "Toque o ombro oposto com uma mão e volte.",
      "Alterne mantendo o quadril imóvel.",
    ],
    "Quadril estável. Se ele roda, afaste mais os pés.",
    "Fazer rápido e balançar o corpo a cada toque.",
  ),
  "Prancha + toque": g(
    [
      "Na prancha, toque com a mão o ombro ou o chão à frente.",
      "Volte ao apoio e alterne os lados.",
      "Mantenha o abdômen contraído durante todo o movimento.",
    ],
    "Controle do tronco enquanto um apoio sai do chão.",
    "Perder o alinhamento para alcançar mais longe.",
  ),
  "Abdominal infra": g(
    [
      "Deitado de costas, mãos ao lado do quadril.",
      "Suba as pernas estendidas até 90° com a lombar colada no chão.",
      "Desça devagar até quase tocar o chão e repita.",
    ],
    "Lombar sempre colada no chão.",
    "Deixar a lombar arquear na descida — reduza a amplitude antes disso.",
    "Difícil? Faça com os joelhos flexionados.",
  ),
  "Abdominal remador": g(
    [
      "Deitado, estenda braços e pernas.",
      "Suba tronco e joelhos ao mesmo tempo, formando um V.",
      "Desça controlado sem relaxar o abdômen.",
    ],
    "Subir e descer no mesmo ritmo, sem embalo.",
    "Usar o impulso dos braços para levantar.",
  ),
  Superman: g(
    [
      "Deitado de barriga para baixo, braços estendidos à frente.",
      "Eleve braços, peito e pernas ao mesmo tempo.",
      "Segure 2 segundos no topo e desça controlado.",
    ],
    "Trabalha a lombar — contrapeso essencial para quem faz muito abdominal.",
    "Jogar a cabeça para trás. Pescoço acompanha a coluna.",
  ),

  // ---------- Bola / técnica ----------
  "Toques com o peito do pé": g(
    [
      "Bola no chão à sua frente, peso no pé de apoio.",
      "Toque a bola com o peito do pé, pouca altura.",
      "Mantenha a bola perto e controle a cada toque.",
    ],
    "Tornozelo firme no momento do contato.",
    "Toques altos demais — perde o controle e o ritmo.",
    "Sem bola? Faça o movimento com uma bola de meia; o padrão do pé é o mesmo.",
  ),
  "Toques sola": g(
    [
      "Alterne o toque na parte de cima da bola com a sola de cada pé.",
      "Mantenha ritmo constante e o joelho de apoio flexionado.",
      "Olhar entre a bola e o horizonte.",
    ],
    "Cadência — o mesmo intervalo entre todos os toques.",
    "Pisar na bola em vez de tocá-la de leve.",
    "Sem bola: repita o padrão de pés no lugar, é ganho de coordenação igual.",
  ),
  "Sola frente e trás": g(
    [
      "Puxe a bola para trás com a sola.",
      "Empurre para frente com o peito do pé.",
      "Repita alternando os pés a cada série de 5.",
    ],
    "Bola sempre a um passo de distância.",
    "Deixar a bola escapar à frente do corpo.",
  ),
  "Condução em zigue-zague": g(
    [
      "Conduza a bola contornando marcas imaginárias.",
      "Use toques curtos, um a cada passo.",
      "Alterne pé de dentro e de fora conforme a curva.",
    ],
    "Toque curto perto do corpo nas mudanças de direção.",
    "Dar um toque forte e correr atrás da bola.",
    "Espaço curto? Reduza a distância entre as marcas e mantenha a velocidade.",
  ),
  "Condução em velocidade": g(
    [
      "Conduza em linha reta com toques a cada 2 ou 3 passos.",
      "Use o peito do pé, empurrando a bola à frente.",
      "Levante a cabeça a cada toque.",
    ],
    "Conduzir sem olhar a bola o tempo todo.",
    "Toques curtos demais que travam a corrida.",
  ),
  "Domínio na parede": g(
    [
      "Toque a bola na parede com força média.",
      "Domine na volta matando a bola no primeiro toque.",
      "Alterne o pé de domínio a cada repetição.",
    ],
    "Recuar o pé no momento do contato para amortecer.",
    "Pé rígido — a bola espirra e você perde o tempo.",
    "Sem parede? Peça para alguém devolver ou use um degrau.",
  ),
  "Passe forte alternado": g(
    [
      "Passe contra a parede com o pé de dentro, com força.",
      "Domine e devolva com o outro pé.",
      "Mantenha o ritmo sem deixar a bola parar.",
    ],
    "Pé de apoio apontado para o alvo — é ele que define a direção.",
    "Passar só com o pé bom.",
  ),
  Finalizações: g(
    [
      "Posicione a bola e escolha o canto antes de chutar.",
      "Pé de apoio ao lado da bola, apontado para o alvo.",
      "Chute com o peito do pé, tronco por cima da bola.",
    ],
    "Tronco por cima da bola mantém o chute baixo e colocado.",
    "Inclinar o tronco para trás — a bola sobe.",
    "Sem gol? Mire um ponto na parede ou marque dois alvos no chão.",
  ),
};

/** Guia do exercício, com fallback pela categoria da animação. */
export function guiaDoExercicio(
  nome: string,
  demo: GuiaCategoria = "cardio",
): ExerciseGuide {
  return GUIAS[nome] ?? GUIAS_POR_CATEGORIA[demo] ?? GUIAS_POR_CATEGORIA.cardio;
}
