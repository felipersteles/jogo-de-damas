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
const criar = document.getElementById("criar");
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

    casaDaPeca.removeChild(peca)
  });
}

// variaveis de jogabilidade
var num_brancas = 12;
var num_pretas = 12;

var pecaSelecionada = null;
var casaDireita = null;
var casaEsquerda = null;
let vezDoBranco = true;

var temQueComer = false;
var pecaComida = null;
var posPecaComida = null;

const timeJogando = document.getElementById("jogando");

const posicionar = document.getElementById("posicionar");
posicionar.addEventListener("click", posicionasPeca);

const start = document.getElementById("start");
start.addEventListener("click", gameLoop(15));

function update() {
  onclick = (evento) => {
    if (evento.target.id === "peca") handleClick(evento);
  };

  timeJogando.innerText = vezDoBranco ? "branco" : "preto";

  if (num_brancas === 0) {
    acabaJogo("preto");
  }
  if (num_pretas === 0) {
    acabaJogo("branco");
  }
}

const acabar = document.getElementById("acabar");
acabar.addEventListener("click", acabaJogo);

function acabaJogo(vencedor) {
  limparTabuleiro()
  console.log(vencedor + "venceu");
  return;
}

function handleClick(evento) {
  if (pecaSelecionada !== null) limparSelecao();

  if (vezDoBranco === true) {
    if (evento.target.dataset.time === "branco")
      pecaSelecionada = evento.target;
  } else {
    if (evento.target.dataset.time === "preto") pecaSelecionada = evento.target;
  }

  if (pecaSelecionada !== null) possiveisMovimentos(pecaSelecionada);
  else console.log("Selecione uma peça válida");
}

function possiveisMovimentos(pecaSelecionada) {
  verificaMovimento(pecaSelecionada);

  verificaCasa(casaDireita, pecaSelecionada);
  verificaCasa(casaEsquerda, pecaSelecionada);
}

function verificaMovimento(peca) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);
  const time = peca.dataset.time;

  casaDaPeca = document.querySelector(`td[data-position="${posX},${posY}"]`);
  pintar(casaDaPeca, "amarelo");

  if (time === "branco") {
    if (posX + 1 < 8 && posY - 1 >= 0)
      casaDireita = document.querySelector(
        `td[data-position="${posX + 1},${posY - 1}"]`
      );

    if (posX - 1 >= 0 && posY - 1 >= 0)
      casaEsquerda = document.querySelector(
        `td[data-position="${posX - 1},${posY - 1}"]`
      );
  } else {
    if (posX + 1 < 8 && posY + 1 >= 0)
      casaDireita = document.querySelector(
        `td[data-position="${posX + 1},${posY + 1}"]`
      );
    if (posX - 1 >= 0 && posY + 1 >= 0)
      casaEsquerda = document.querySelector(
        `td[data-position="${posX - 1},${posY + 1}"]`
      );
  }
}

function verificaCasa(casa, peca) {
  if (casa !== null) {
    if (casa.dataset.ocupado === "nao") {
      pintar(casa, "verde");
      casa.addEventListener("click", moverPeca, { once: true });

      return false;
    } else {
      const pecaDaCasa = casa.firstChild;

      if (pecaDaCasa.dataset.time !== peca.dataset.time) {
        verificarProtecao(pecaDaCasa);
      }

      return true;
    }
  }
}

function verificarProtecao(pecaAmeacada) {
  const posX = parseInt(pecaAmeacada.dataset.posX);
  const posY = parseInt(pecaAmeacada.dataset.posY);
  const time = pecaAmeacada.dataset.time;

  const casaDaPeca = document.querySelector(
    `td[data-position="${posX},${posY}"]`
  );

  var novaCasa = null;
  if (casaDaPeca === casaDireita) {
    // verificar se a casa a direita esta ocupada

    if (time === "preto") {
      novaCasa = document.querySelector(
        `td[data-position="${posX + 1},${posY - 1}"]`
      );
    } else {
      novaCasa = document.querySelector(
        `td[data-position="${posX + 1},${posY + 1}"]`
      );
    }

    casaDireita = novaCasa;
    if (!verificaCasa(novaCasa, pecaAmeacada)) {
      posPecaComida = casaDaPeca;
      pecaComida = pecaAmeacada;
      temQueComer = true;
    }
  } else {
    // verificar se a casa a direita esta ocupada

    if (time === "preto") {
      novaCasa = document.querySelector(
        `td[data-position="${posX - 1},${posY - 1}"]`
      );
    } else {
      novaCasa = document.querySelector(
        `td[data-position="${posX - 1},${posY + 1}"]`
      );
    }

    casaEsquerda = novaCasa;
    if (!verificaCasa(novaCasa, pecaAmeacada)) {
      posPecaComida = casaDaPeca;
      pecaComida = pecaAmeacada;
      temQueComer = true;
    }
  }
}

function moverPeca(evento) {
  // faz a mudanca de casas
  var novaCasa = evento.target;
  if (novaCasa != casaDireita && novaCasa != casaEsquerda) return;

  var casaDaPeca = document.querySelector(
    `td[data-position="${pecaSelecionada.dataset.posX},${pecaSelecionada.dataset.posY}"]`
  );

  if (temQueComer === true) {
    if (pecaComida.dataset.time === "branco") num_brancas--;
    if (pecaComida.dataset.time === "preto") num_pretas--;

    removerPeca(posPecaComida, pecaComida);
    pecaComida = null;
    temQueComer = false;
  }

  removerPeca(casaDaPeca, pecaSelecionada);
  novaCasa.appendChild(pecaSelecionada);
  novaCasa.dataset.ocupado = "sim";

  // atualiza peca
  pecaSelecionada.dataset.posX = novaCasa.dataset.position.split(",")[0];
  pecaSelecionada.dataset.posY = novaCasa.dataset.position.split(",")[1];

  limparSelecao();

  vezDoBranco = !vezDoBranco;
}

function removerPeca(casaDaPeca, peca) {
  casaDaPeca.removeChild(peca);
  casaDaPeca.dataset.ocupado = "nao";
}

function pintar(casaDaPeca, cor) {
  casaDaPeca.classList.add(cor);
}
function limpar(casaDaPeca, cor) {
  casaDaPeca.classList.remove(cor);
}
function limparSelecao() {
  limpar(casaDaPeca, "amarelo");

  if (casaDireita !== null) limpar(casaDireita, "verde");
  if (casaEsquerda !== null) limpar(casaEsquerda, "verde");

  pecaSelecionada = null;
  casaDireita = null;
  casaEsquerda = null;
}

function gameLoop(fps) {
  num_brancas = 12;
  num_pretas = 12;

  setInterval(show, 1000 / fps); // 15 é o fps
}

function show() {
  update();
}

//-----------------------------------------------------------------------------------------------------
// Tentativa utilizando canvas (tentar depois)
//-----------------------------------------------------------------------------------------------------

// sensores são a forma como os computadores veem o mundo
// nova iorque sistema de crime batman e coringa
// class Casa {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.peca = null;
//   }

//   addPeca(peca) {
//     this.peca = peca;
//   }
// }

// class Peca {
//   constructor(time, posX, posY) {
//     this.posX = posX;
//     this.posY = posY;
//     this.time = time;
//   }
// }

// function criarBoard(board) {
//   for (var i = 0; i < 8; i++) {
//     for (var j = 0; j < 8; j++) {
//       if (board[i][j] === 1) {
//         board[i][j] = new Casa(i, j);
//       }
//     }
//   }

//   preencherBoard(board);
// }

// function preencherBoard(board) {
//   for (var i = 0; i < 8; i++) {
//     for (var j = 0; j < 8; j++) {
//       if (board[i][j] !== 0) {
//         if (i < 3) {
//           board[i][j].addPeca(new Peca("preta", i, j));
//         } else if (i > 4) {
//           board[i][j].addPeca(new Peca("branca", i, j));
//         }
//       }
//     }
//   }
// }

// criarBoard(board);

// -------------------------------------------------------------------------------------
// DEBUG
// -------------------------------------------------------------------------------------

// debugar_algo = num_brancas;
// const DEBUG = document.getElementById("debug");
// const debugar = () => {
//   console.log(debugar_algo);
// };

// DEBUG.addEventListener("click", acabaJogo);
