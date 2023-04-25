// vetor com pecas iniciais para facilitar
var initialPieces = [
  { posY: 0, posX: 1, time: "preto", color: "black" },
  { posY: 0, posX: 3, time: "preto", color: "black" },
  { posY: 0, posX: 5, time: "preto", color: "black" },
  { posY: 0, posX: 7, time: "preto", color: "black" },
  { posY: 1, posX: 0, time: "preto", color: "black" },
  { posY: 1, posX: 2, time: "preto", color: "black" },
  { posY: 1, posX: 4, time: "preto", color: "black" },
  { posY: 1, posX: 6, time: "preto", color: "black" },
  { posY: 2, posX: 1, time: "preto", color: "black" },
  { posY: 2, posX: 3, time: "preto", color: "black" },
  { posY: 2, posX: 5, time: "preto", color: "black" },
  { posY: 2, posX: 7, time: "preto", color: "black" },
  { posY: 5, posX: 0, time: "branco", color: "white" },
  { posY: 5, posX: 2, time: "branco", color: "white" },
  { posY: 5, posX: 4, time: "branco", color: "white" },
  { posY: 5, posX: 6, time: "branco", color: "white" },
  { posY: 6, posX: 1, time: "branco", color: "white" },
  { posY: 6, posX: 3, time: "branco", color: "white" },
  { posY: 6, posX: 5, time: "branco", color: "white" },
  { posY: 6, posX: 7, time: "branco", color: "white" },
  { posY: 7, posX: 0, time: "branco", color: "white" },
  { posY: 7, posX: 2, time: "branco", color: "white" },
  { posY: 7, posX: 4, time: "branco", color: "white" },
  { posY: 7, posX: 6, time: "branco", color: "white" },
];

// desenha tabuleiro
const desenharBoard = () => {
  var tabuleiro = document.getElementById("board");
  var posY = 1;
  for (var linha = 0; linha < 8; linha++) {
    var linhaEl = document.createElement("tr");
    var posY = linha;
    var posX = 0;
    for (var casa = 0; casa < 8; casa++) {
      var casaEl = document.createElement("td");
      casaEl.id = "casa";
      casaEl.dataset.position = [posX, posY]; // Salvando posicao numa string
      casaEl.dataset.ocupado = "nao";
      linhaEl.appendChild(casaEl);
      posX++;
    }

    tabuleiro.appendChild(linhaEl);
  }
};

// cria tabuleiro ao carregar janela
window.onload = desenharBoard;

// funcao auxiliar pra definir a cor da peca
function criarPeca(el, color) {
  el.classname = "";
  el.classList.add(color); // adiciona a classe correspondente ao time
}

// posiciona as pecas
var pecasPosiciodas = false;
function posicionasPeca() {
  if (pecasPosiciodas) return;

  initialPieces.forEach((peca) => {
    var pecaElemento = document.createElement("div");
    pecaElemento.setAttribute("id", "peca");
    pecaElemento.dataset.time = peca.time;

    var casaDaPeca = document.querySelector(
      `td[data-position="${peca.posX},${peca.posY}"]`
    );

    criarPeca(pecaElemento, peca.color);
    casaDaPeca.dataset.ocupado = "sim";
    casaDaPeca.appendChild(pecaElemento);
  });

  pecasPosiciodas = true;
}

function limparTabuleiro() {
  const pecas = document.querySelectorAll("#peca");

  pecas.forEach((peca) => {
    var casaDaPeca = document.querySelector(
      `td[data-position="${posX},${posY}"]`
    );

    casaDaPeca.removeChild(peca);
  });
}

// variaveis de jogabilidade
var num_brancas = 0;
var num_pretas = 0;

var pecaSelecionada = null;
var casaDaPecaSelecionada = null;
var vezDoBranco = true;

var temQueComer = false;
var casasPossiveis = [];
var comerPecas = [];

// mostrar de quem é a vez
var timeJogando = document.getElementById("jogando");

// possiveis movimentos
var movimentos = document.getElementById("movimentos");
var pretas = document.getElementById("pretas");
var brancas = document.getElementById("brancas");

const posicionar = document.getElementById("posicionar");
posicionar.addEventListener("click", posicionasPeca);

const startButton = document.getElementById("start");
startButton.addEventListener("click", start);

const acabarButton = document.getElementById("acabar");
acabarButton.addEventListener("click", limparTabuleiro);

// jogo começa
function start() {
  num_brancas = 12;
  num_pretas = 12;

  gameLoop(15);
}

function gameLoop(fps) {
  num_brancas = 12;
  num_pretas = 12;

  setInterval(update, 1000 / fps); // 15 é o fps
}

// permite jogar
function update() {
  timeJogando.innerText = vezDoBranco ? "branco" : "preto";
  pretas.innerText = `Num de pretas: ${num_pretas}`;
  brancas.innerText = `Num de brancas: ${num_brancas}`;

  // quando o mouse clicar em algo
  onclick = (evento) => {
    if (evento.target.id === "peca") {
      if (vezDoBranco === true && evento.target.dataset.time === "branco") {
        pecaSelecionada = evento.target;
      }

      if (vezDoBranco === false && evento.target.dataset.time === "preto") {
        pecaSelecionada = evento.target;
      }

      if (pecaSelecionada !== null) {
        limparCasasPossiveis();
        verificaPossiveisMovimentos();
      }
    }

    if (evento.target.id === "casa" && pecaSelecionada !== null) {
      performarUmaJogada(evento.target);
    }
  };
}

function verificaPossiveisMovimentos() {
  movimentoSimples();
  pintarCasasPossiveis();
}

function performarUmaJogada(destino) {
  if (validarDestino(destino)) {
    if (comerPecas.length === 0) mover(pecaSelecionada, destino);
    else {
      comerPecas.map((jogadas) => {
        jogadas.map((jogada) => {
          if (destino === jogada[0]) {
            console.log(jogada);
            // tira a peça do tabuleiro
            removePeca(jogada[1]);

            // move peça selecionada
            mover(pecaSelecionada, destino);
          }
        });
      });
    }
  } else alert("Escolha uma posição possivel.");
}

// 2 direcoes
function movimentoSimples() {
  const peca = pecaSelecionada;

  const casaDireita = getCasaDireita(peca, peca.dataset.time);
  const casaEsquerda = getCasaEsquerda(peca, peca.dataset.time);

  if (casaDireita) {
    pecaInimiga = analisaCasa(casaDireita);
    if (pecaInimiga) {
      // analisar se é a unica
      // peça ameaçada
      console.log("comer", pecaInimiga);
    }
  }
  if (casaEsquerda) {
    pecaInimiga = analisaCasa(casaEsquerda);
    if (pecaInimiga) {
      analisaCasa(getCasaEsquerda(pecaInimiga, peca.dataset.time));
    }
  }
}

function mover(peca, destino) {
  movingPeca = removePeca(peca);

  addPeca(movingPeca, destino);

  trocarTurno();
}

function trocarTurno() {
  limparCasasPossiveis();

  pecaSelecionada = null;
  comerPecas = [];

  vezDoBranco = !vezDoBranco;
}

function analisaCasa(casa) {
  const peca = pecaSelecionada;

  if (casa.dataset.ocupado === "nao") {
    casasPossiveis.push(casa);

    return null;
  } else {
    if (casa.firstChild.dataset.time !== peca.dataset.time)
      return casa.firstChild;
  }
}

function ameacarPecaInimiga(pecaInimiga, novaCasa) {
  return casasPossiveis.map((casa) => {
    if (casa === novaCasa) {
      return [novaCasa, pecaInimiga];
    }
  });
}

function validarDestino(destino) {
  var flag = 0;

  casasPossiveis.forEach((casa) => {
    if (casa === destino) flag = 1;
  });

  if (flag === 0) return false;

  return true;
}

function addPeca(peca, casa) {
  casa.appendChild(peca);
  casa.dataset.ocupado = "sim";
}

function removePeca(peca) {
  origem = peca.parentNode;
  movingPeca = origem.removeChild(peca);
  origem.dataset.ocupado = "nao";

  return movingPeca;
}

function getCasa(x, y) {
  return document.querySelector(`td[data-position="${x},${y}"]`);
}

function getCasaX(casa) {
  return parseInt(casa.dataset.position.split(",")[0]);
}

function getCasaY(casa) {
  return parseInt(casa.dataset.position.split(",")[1]);
}

function getCasaDireita(peca, timeJogando) {
  const posX = getCasaX(peca.parentNode);
  const posY = getCasaY(peca.parentNode);

  let novoX = posX + 1,
    novoY;

  if (timeJogando === "branco") {
    // x + 1; y + 1 direita cima
    // x - 1; y + 1 esquerda cima
    novoY = posY - 1;
  } else {
    // x + 1; y - 1 direita baixo
    // x - 1; y - 1 esquerda baixo
    novoY = posY + 1;
  }

  if (novoX > 8 || novoX < 0 || novoY > 8 || novoY < 0) return null;

  return getCasa(novoX, novoY);
}

function getCasaEsquerda(peca, timeJogando) {
  const posX = getCasaX(peca.parentNode);
  const posY = getCasaY(peca.parentNode);

  let novoX = posX - 1,
    novoY;

  if (timeJogando === "branco") {
    // x + 1; y + 1 direita cima
    // x - 1; y + 1 esquerda cima
    novoY = posY - 1;
  } else {
    // x + 1; y - 1 direita baixo
    // x - 1; y - 1 esquerda baixo
    novoY = posY + 1;
  }

  if (novoX > 8 || novoX < 0 || novoY > 8 || novoY < 0) return null;

  return getCasa(novoX, novoY);
}

function pintarCasasPossiveis() {
  casasPossiveis.forEach((casa) => {
    pintar(casa, "verde");
  });
}

function limparCasasPossiveis() {
  casasPossiveis.forEach((casa) => {
    limpar(casa, "verde");
  });

  casasPossiveis = [];
}

function pintar(casa, cor) {
  if (casa !== null) casa.classList.add(cor);
}

function limpar(casa, cor) {
  casa.classList.remove(cor);
}
