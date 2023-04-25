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
    pecaElemento.dataset.posX = peca.posX;
    pecaElemento.dataset.posY = peca.posY;
    pecaElemento.dataset.time = peca.time;
    pecaElemento.dataset.dama = "nao";

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
    const posX = peca.dataset.posX;
    const posY = peca.dataset.posY;

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
      if (vezDoBranco === true && evento.target.dataset.time === "branco")
        pecaSelecionada = evento.target;

      if (vezDoBranco === false && evento.target.dataset.time === "preto")
        pecaSelecionada = evento.target;

      if (pecaSelecionada !== null) {
        verificaPossiveisMovimentos(pecaSelecionada);
      } else alert("Peça inválida");
    }
  };
}

function verificaPossiveisMovimentos(peca) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);
  const time = peca.dataset.time;
  const ehDama = peca.dataset.dama;

  limparSelecao();
  pecaSelecionada = peca;
  casaDaPecaSelecionada = getCasa(posX, posY);

  if (time === "branco") {
    if (ehDama === "nao") {
      movimentoSimples(peca, time);
    }
  } else {
    if (ehDama === "nao") {
      movimentoSimples(peca, time);
    }
  }
}

// 2 direcoes
function movimentoSimples(peca, timeJogando) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);

  let casaDireita, casaEsquerda;

  if (timeJogando === "branco") {
    // x + 1; y + 1 direita cima
    // x - 1; y + 1 esquerda cima
    novoY = posY - 1;
  } else {
    // x + 1; y - 1 direita baixo
    // x - 1; y - 1 esquerda baixo
    novoY = posY + 1;
  }

  casaDireita = getCasaDireita(peca, timeJogando);
  casaEsquerda = getCasaEsquerda(peca, timeJogando);

  analisaCasa(casaDireita, timeJogando, "direita");
  analisaCasa(casaEsquerda, timeJogando, "esquerda");

  if (pecasAmeacadas.length > 0) {
    possibilidades = pecasAmeacadas.length;

    // unicas casas possiveis sao as que envolvem comer a peça
    casasPossiveis = [];
    pecasAmeacadas.forEach((pecaAmeacada) => {
      //verifica se é a ultima casa possivel
      casasPossiveis.push(pecaAmeacada[1]);
    });
  } else possibilidades = casasPossiveis.length;

  if (possibilidades > 0) pintar(casaDaPecaSelecionada, "amarelo");

  casasPossiveis.forEach((casa) => {
    pintar(casa, "verde");
    casa.addEventListener("click", mover, { once: true });
  });
}

function mover(evento) {
  const novaCasa = evento.target;

  addPeca(novaCasa, pecaSelecionada);

  // atualiza peca e limpar a casa
  pecaSelecionada.dataset.posX = novaCasa.dataset.position.split(",")[0];
  pecaSelecionada.dataset.posY = novaCasa.dataset.position.split(",")[1];
  casaDaPecaSelecionada.dataset.ocupado = "nao";

  if (pecasAmeacadas.length > 0) {
    pecasAmeacadas.forEach((pecaAmeacada) => {
      if (pecaAmeacada[1] === novaCasa) comerPeca(pecaAmeacada[0]);
    });
  }

  vezDoBranco = !vezDoBranco;

  if (
    pecaSelecionada.dataset.time === "branco" &&
    pecaSelecionada.dataset.posY == 0
  )
    coroarPeca(pecaSelecionada);

  if (
    pecaSelecionada.dataset.time === "preto" &&
    pecaSelecionada.dataset.posY == 7
  )
    coroarPeca(pecaSelecionada);

  limparSelecao();
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

function analisaCasa(casa, timeJogando, dir) {
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

function coroarPeca(peca) {
  peca.classList.add("dama");
  peca.dataset.dama = "sim";
}

function getCasa(x, y) {
  return document.querySelector(`td[data-position="${x},${y}"]`);
}

function getCasaDireita(peca, time) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);

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

  return getCasa(novoX, novoY);
}

function getCasaEsquerda(peca, time) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);
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

  return getCasa(novoX, novoY);
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
