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

    casaDaPeca.removeChild(peca);
  });
}

// variaveis de jogabilidade
var num_brancas = 0;
var num_pretas = 0;

var pecaSelecionada = null;
var casaDaPecaSelecionada = null;
var casaDireita = null;
var casaEsquerda = null;
var vezDoBranco = true;

var temQueComer = false;
var pecaComida = null;
var posicaoPecaComida = null;

// mostrar de quem é a vez
var timeJogando = document.getElementById("jogando");

const posicionar = document.getElementById("posicionar");
posicionar.addEventListener("click", posicionasPeca);

const startButton = document.getElementById("start");
startButton.addEventListener("click", start);

// jogo começa
function start() {
  num_brancas = 12;
  num_pretas = 12;

  gameLoop(15);
}

// permite jogar
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

// incompleta
function acabaJogo(vencedor) {
  limparTabuleiro();
  console.log(vencedor + "venceu");
  return;
}

// selecionar uma peça
function handleClick(evento) {
  if (!temQueComer) {
    if (pecaSelecionada !== null) limparSelecao();

    if (vezDoBranco === true && evento.target.dataset.time === "branco")
      pecaSelecionada = evento.target;

    if (vezDoBranco === false && evento.target.dataset.time === "preto")
      pecaSelecionada = evento.target;

    if (pecaSelecionada !== null) possiveisMovimentos(pecaSelecionada);
    else console.log("Selecione uma peça válida");
  }
}

function possiveisMovimentos(peca) {
  verificaMovimento(peca); // preenche a casa direita e a casa esquerda

  // verifica se sao movimentos possiveis
  verificaCasa(casaDireita, peca);
  verificaCasa(casaEsquerda, peca);
}

function verificaMovimento(peca) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);
  const time = peca.dataset.time;

  // preenche a casa da peca selecionada e pinta de amarelo
  casaDaPecaSelecionada = document.querySelector(
    `td[data-position="${posX},${posY}"]`
  );
  pintar(casaDaPecaSelecionada, "amarelo");

  // vertical
  // se o time for preto a nova pos Y é posY + 1
  // se o time for branco a nova pos Y é posY - 1
  let yBranco = posY - 1;
  let yPreto = posY + 1;

  // horizontal
  let direita = posX + 1;
  let esquerda = posX - 1;

  // verifica qual o time da peca selecionada
  if (time === "branco") {
    if (posX + 1 < 8 && posY - 1 >= 0)
      casaDireita = document.querySelector(
        `td[data-position="${direita},${yBranco}"]`
      );

    if (posX - 1 >= 0 && posY - 1 >= 0)
      casaEsquerda = document.querySelector(
        `td[data-position="${esquerda},${yBranco}"]`
      );
  } else {
    if (posX + 1 < 8 && posY + 1 >= 0)
      casaDireita = document.querySelector(
        `td[data-position="${direita},${yPreto}"]`
      );
    if (posX - 1 >= 0 && posY + 1 >= 0)
      casaEsquerda = document.querySelector(
        `td[data-position="${esquerda},${yPreto}"]`
      );
  }
}

function verificaCasa(casa, peca) {
  if (casa !== null) {
    // caso a casa esteja vazia, permite o movimento
    if (casa.dataset.ocupado === "nao") {
      pintar(casa, "verde");
      casa.addEventListener("click", moverPeca, { once: true });
    } else {
      const pecaDaCasa = casa.firstChild;

      // caso a casa esteja ocupada por uma peça do time inimigo, verifica se a peça do inimigo esta protegida
      if (pecaDaCasa.dataset.time !== peca.dataset.time) {
        const dir = direcao(pecaDaCasa);
        if (verificarProtecao(pecaDaCasa, dir) === "desprotegida") {
          comerPeca(pecaDaCasa);
        }
      }
    }
  }
}

function verificarProtecao(pecaAmeacada, dir) {
  const protecao = casaDaFrente(pecaAmeacada, dir);

  if (protecao.dataset.ocupado === "nao") return "desprotegida";
  else return "protegida";
}
function verificarProtecaoCasa(casa, direcao) {
  // direcao que a peça esta
  const posX = casa.dataset.position.split(",")[0];
  const posY = casa.dataset.position.split(",")[1];

  let x = -1;
  let y = -1;

  // casas adjacentes:
  // x = posx - 1, y = posy - 1
  // x = posx + 1, y = posy - 1
  // x = posx - 1, y = posy + 1
  // x = posx - 1, y = posy + 1

  if (direcao === "nw") {
    x = posX - 1
    y = posY - 1
  }else if(direcao === "ne"){
    x = posX + 1
    y = posY - 1
  }else if(direcao === "sw"){
    x = posX - 1
    y = posY + 1
  }else if(direcao === "se"){
    x = posX + 1
    y = posY + 1
  }

  console.log(getPeca(x,y))
}

function moverPeca(evento) {
  // faz a mudanca de casas
  var novaCasa = evento.target;
  if (novaCasa != casaDireita && novaCasa != casaEsquerda) return;

  removerPeca(pecaSelecionada);
  addPeca(novaCasa, pecaSelecionada);

  // atualiza peca
  pecaSelecionada.dataset.posX = novaCasa.dataset.position.split(",")[0];
  pecaSelecionada.dataset.posY = novaCasa.dataset.position.split(",")[1];

  if (temQueComer === true) removerPeca(pecaComida);

  vezDoBranco = !vezDoBranco;
  temQueComer = false;

  limparSelecao();
}

function comerPeca(peca) {
  temQueComer = true;

  const dir = direcao(peca);
  const novaCasa = casaDaFrente(peca, dir);
  verificarProtecaoCasa(novaCasa, 'ne');

  if (dir === "direita") {
    casaDireita = novaCasa;
    if (casaEsquerda !== null && casaEsquerda.dataset.ocupado === "nao")
      casaEsquerda = null;
  }
  if (dir === "esquerda") {
    casaEsquerda = novaCasa;
    if (casaDireita !== null && casaDireita.dataset.ocupado === "nao")
      casaDireita = null;
  }

  pintar(novaCasa, "verde");
  // novaCasa.addEventListener("click", moverPeca, {once: true} );

  pecaComida = peca;
}

function removerPeca(peca) {
  const casa = getCasaDaPeca(peca);

  casa.removeChild(peca);
  casa.dataset.ocupado = "nao";
}
function addPeca(casa, peca) {
  casa.appendChild(peca);
  casa.dataset.ocupado = "sim";
}

function pintar(casa, cor) {
  casa.classList.add(cor);
}
function limpar(casa, cor) {
  casa.classList.remove(cor);
}
function limparSelecao() {
  limpar(casaDaPecaSelecionada, "amarelo");

  if (casaDireita !== null) limpar(casaDireita, "verde");
  if (casaEsquerda !== null) limpar(casaEsquerda, "verde");

  if (temQueComer === false) pecaSelecionada = null;
  casaDireita = null;
  casaEsquerda = null;

  pecaComida = null;
  temQueComer = null;
}

function getPeca(x, y) {
  const casaDaPeca = document.querySelector(`td[data-position="${x},${y}"]`);

  if (casaDaPeca.dataset.ocupado === "sim") return casaDaPeca.firstChild;
}
function getCasaDaPeca(peca) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);

  return (casaDaPeca = document.querySelector(
    `td[data-position="${posX},${posY}"]`
  ));
}
function getPecaDaCasa(casa) {
  if (casa.dataset.ocupado === "sim") return casa.firstChild;

  return null;
}
function casaDaFrente(peca, dir) {
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
function direcao(peca) {
  const posX = parseInt(peca.dataset.posX);
  const posY = parseInt(peca.dataset.posY);

  const casaDaPeca = document.querySelector(
    `td[data-position="${posX},${posY}"]`
  );

  // verifica se a peca ameacada esta na esquerda ou na direita
  if (casaDaPeca === casaDireita) return "direita";
  if (casaDaPeca === casaEsquerda) return "esquerda";
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
