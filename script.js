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
  for (var row = 0; row < 8; row++) {
    var rowEl = document.createElement("tr");
    var posY = row;
    var posX = 0;
    for (var cell = 0; cell < 8; cell++) {
      var cellEl = document.createElement("td");
      cellEl.dataset.position = [posX, posY]; // Each square on the board needs a way to be identified. ex. <td data-position="1"></td>
      cellEl.dataset.ocupado = "nao";
      rowEl.appendChild(cellEl);
      posX++;
    }
    tabuleiro.appendChild(rowEl);
  }
};

window.onload = desenharBoard;

// desenhar pecas
function setPieceData(el, color) {
  el.classname = ""; // This clears out any classes on the current <td>
  el.classList.add(color); // Add the class of either black or white
}

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

    //console.log(casaDaPeca);

    setPieceData(pecaElemento, peca.color);
    casaDaPeca.dataset.ocupado = "sim";
    casaDaPeca.appendChild(pecaElemento);
  });
}

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
start.addEventListener("click", update);
timeJogando.innerText = vezDoBranco ? "branco" : "preto";

function update() {
  console.log("jogo iniciado");

  onclick = (evento) => {
    if (evento.target.id === "peca") handleClick(evento);
  };
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

  console.log(pecaAmeacada);
  console.log(" esta protegida?");

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
    console.log(verificaCasa(novaCasa, pecaAmeacada))
    if (!verificaCasa(novaCasa, pecaAmeacada)) {
      posPecaComida = casaDaPeca
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
      posPecaComida = casaDaPeca
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

// //debugar_algo = pecas;
// const DEBUG = document.getElementById("debug");
// const debugar = () => {
//   console.log(debugar_algo);
// };

// DEBUG.addEventListener("click", update);
