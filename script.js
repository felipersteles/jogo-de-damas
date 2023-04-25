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
function posicionasPeca() {
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
var pecaAmeacadaEsq, pecaAmeacadaDir;
var possibilidades = 0;
var casasPossiveis = [];
var pecasAmeacadas = [];

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
  movimentos.innerText = `Possiveis movimentos: ${possibilidades}`;
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
        verificaPossiveisMovimentos();
      }
    }

    if (evento.target.id === "casa" && pecaSelecionada !== null) {
      performarUmaJogada(evento.target);
    }
  };
}

function verificaPossiveisMovimentos() {
  casa = pecaSelecionada.parentNode;

  console.log("verificar peca", pecaSelecionada);
  console.log("verificar casa", casa);

  movimentoSimples(pecaSelecionada, pecaSelecionada.dataset.time);
  pintarCasasPossiveis();
}

function performarUmaJogada(destino) {
  if (validarDestino(destino)) {
    mover(pecaSelecionada, destino);
  } else alert("Escolha uma posição possivel.");
}

// 2 direcoes
function movimentoSimples(peca, time) {
  const posY = getCasaY(peca.parentNode);

  let casaDireita, casaEsquerda;

  if (time === "branco") {
    // x + 1; y + 1 direita cima
    // x - 1; y + 1 esquerda cima
    novoY = posY - 1;
  } else {
    // x + 1; y - 1 direita baixo
    // x - 1; y - 1 esquerda baixo
    novoY = posY + 1;
  }

  casaDireita = getCasaDireita(peca, time);
  casaEsquerda = getCasaEsquerda(peca, time);

  if (casaDireita) analisaCasa(casaDireita);
  if (casaEsquerda) analisaCasa(casaEsquerda);
}

function mover(peca, destino) {
  console.log("movendo", peca, "para", destino);
  origem = peca.parentNode;
  movingPeca = origem.removeChild(peca);
  origem.dataset.ocupado = "nao";

  destino.appendChild(movingPeca);
  destino.dataset.ocupado = "sim";

  changeTurn();
}

function changeTurn() {
  casasPossiveis.forEach((casa) => {
    limpar(casa, "verde");
  });

  casasPossiveis = [];
  pecaSelecionada = null;

  vezDoBranco = !vezDoBranco;
}

function comerPeca(peca) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);
  const time = peca.dataset.time;

  const casaDaPeca = getCasa(posX, posY);

  casaDaPeca.removeChild(peca);
  casaDaPeca.dataset.ocupado = "nao";

  if (time === "preto") num_pretas--;
  else num_brancas--;
}

function analisaCasa(casa) {
  if (casa.dataset.ocupado === "nao") {
    casasPossiveis.push(casa);
  }
}

function analisaCasa_OLD(casa, timeJogando, dir) {
  if (casa !== null) {
    if (casa.dataset.ocupado === "nao") {
      casasPossiveis.push(casa);
    } else {
      const pecaDaCasa = casa.firstChild;
      if (pecaDaCasa.dataset.time !== timeJogando) {
        if (verificarProtecao(pecaDaCasa, dir) === "desprotegida") {
          let novaCasa = getCasaDaFrente(pecaDaCasa, dir);
          pecasAmeacadas.push([pecaDaCasa, novaCasa]);
        }
      }
    }
  }
}

function verificarProtecao(pecaAmeacada, dir) {
  const casaDaPeca = getCasaDaFrente(pecaAmeacada, dir);
  if (casaDaPeca !== null && casaDaPeca.dataset.ocupado === "nao")
    return "desprotegida";

  return "protegida";
}

function analisaCasasAdjacentes(casa, peca) {
  // x + 1; y - 1 direita cima
  // x - 1; y + 1 esquerda cima
  // x + 1; y + 1 direita baixo
  // x - 1; y - 1 esquerda baixo

  const x = parseInt(casa.dataset.position.split(",")[0]);
  const y = parseInt(casa.dataset.position.split(",")[1]);

  const casaDireitaCima = getCasa(x + 1, y - 1);
  const casaEsquerdaCima = getCasa(x - 1, y + 1);
  const casaDireitaBaixo = getCasa(x + 1, y + 1);
  const casaEsquerdaBaixo = getCasa(x - 1, y - 1);

  if (casaDireitaCima !== null && casaDireitaCima.dataset.ocupado === "sim") {
    const pecaAux = casaDireitaCima.firstChild;
    if (verificarProtecao(pecaAux, "direita") === "desprotegida") {
      pecasAmeacadas.push([
        [pecaAux, peca],
        getCasaDaFrente(pecaAux, "direita"),
      ]);
    }
  }
}

function validarDestino(destino) {
  var flag = 0;

  casasPossiveis.forEach((casa) => {
    if (casa === destino) flag = 1;
  });

  if (flag === 0) return false;

  return true;
}

function coroarPeca(peca) {
  peca.classList.add("dama");
  peca.dataset.dama = "sim";
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

function getCasaDireita(peca, time) {
  const posX = getCasaX(peca.parentNode);
  const posY = getCasaY(peca.parentNode);

  let novoX = posX + 1,
    novoY;

  if (time === "branco") {
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

function getCasaEsquerda(peca, time) {
  const posX = getCasaX(peca.parentNode);
  const posY = getCasaY(peca.parentNode);

  let novoX = posX - 1,
    novoY;

  if (time === "branco") {
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

function getCasaDaFrente(peca, dir) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);
  const time = peca.dataset.time;

  let novoY = -1,
    novoX = -1;

  // verifica se a peca ameacada esta na esquerda ou na direita
  if (dir === "direita") novoX = posX + 1;
  else novoX = posX - 1;

  // se o time ameacado for preto, então a pos a ser verificada é y - 1
  if (time === "preto") novoY = posY - 1;
  else novoY = posY + 1;

  return document.querySelector(`td[data-position="${novoX},${novoY}"]`);
}

function addPeca(casa, peca) {
  casa.appendChild(peca);
  casa.dataset.ocupado = "sim";
}

function pintar(casa, cor) {
  if (casa !== null) casa.classList.add(cor);
}

function limpar(casa, cor) {
  casa.classList.remove(cor);
}

function limparSelecao() {
  pecaSelecionada = null;
  possibilidades = 0;

  if (casaDaPecaSelecionada !== null) limpar(casaDaPecaSelecionada, "amarelo");

  // limpa as casas possiveis
  casasPossiveis.forEach((casa) => limpar(casa, "verde"));
  casasPossiveis = [];
  pecasAmeacadas = [];
}
