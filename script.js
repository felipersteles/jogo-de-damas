// To començando a me divertir rs

// Controle do arquivo HTML
const title = document.getElementById("titulo");
title.innerHTML = "Testando";

// Elemento do tabuleiro
const tabuleirosEl = document.getElementById(`board`);
const h2 = document.getElementById("tituloTabuleiro");

const gerarButton = document.getElementById("gerar");
const sizeInput = document.getElementById("sizeInput");

gerarButton.addEventListener("click", () => {
  const size = sizeInput.value <= 0 ? 8 : sizeInput.value;
  gerarTabuleiro(tabuleirosEl, size, size);
  h2.innerText = "Estudos HTML, Css, JavaScript";
});

const startButton = document.getElementById("comecar");
startButton.addEventListener("click", () => {
  start();
});

const timeDaNovaPeca = document.getElementById("posTime");
const posicionarPeca = document.getElementById("posicionarPeca");
posicionarPeca.onclick = () => {
  h2.innerText = "Posicionando peça";
  const casas = document.getElementsByName("casa");
  casas.forEach((casa) => {
    if (!casa.firstChild) {
      casa.addEventListener("click", handlePosPeca, true);
    }
  });
};

const handlePosPeca = (e) => {
  const time = timeDaNovaPeca.checked ? "branco" : "preto";
  const color = timeDaNovaPeca.checked ? "white" : "black";

  const pecaEl = criarPeca({ time, color });

  e.target.appendChild(pecaEl);
  const casas = document.getElementsByName("casa");
  casas.forEach((casa) => {
    if (!casa.firstChild) {
      casa.removeEventListener("click", handlePosPeca, true);
    }
  });

  h2.innerText = "Estudos HTML, Css, JavaScript";
};

// desenhar tabuleiro  --------------------------------------------------------------

const desenharTabuleiro = (tabuleiroEl, linha, coluna) => {
  for (var l = 0; l < linha; l++) {
    // criando o elemento linha
    var linhaEl = document.createElement("tr");

    for (var c = 0; c < coluna; c++) {
      var casaEl = document.createElement("td");

      // colocando uma casa em casa
      // posição da linha
      casaEl.setAttribute("name", "casa");
      casaEl.dataset.position = [l, c];
      linhaEl.appendChild(casaEl);
    }

    tabuleiroEl.appendChild(linhaEl);
  }
};

const gerarTabuleiro = (tabuleiroEl, linha, coluna) => {
  console.log(`Gerando tabuleiro ${linha}x${coluna}`);
  tabuleirosEl.innerHTML = "";
  desenharTabuleiro(tabuleiroEl, linha, coluna);
};

// Jogo ---------------------------------------------------------------------

const initialPieces = [
  { posX: 0, posY: 1, time: "preto", color: "black" },
  { posX: 0, posY: 3, time: "preto", color: "black" },
  { posX: 0, posY: 5, time: "preto", color: "black" },
  { posX: 0, posY: 7, time: "preto", color: "black" },
  { posX: 1, posY: 0, time: "preto", color: "black" },
  { posX: 1, posY: 2, time: "preto", color: "black" },
  { posX: 1, posY: 4, time: "preto", color: "black" },
  { posX: 1, posY: 6, time: "preto", color: "black" },
  { posX: 2, posY: 1, time: "preto", color: "black" },
  { posX: 2, posY: 3, time: "preto", color: "black" },
  { posX: 2, posY: 5, time: "preto", color: "black" },
  { posX: 2, posY: 7, time: "preto", color: "black" },
  { posX: 5, posY: 0, time: "branco", color: "white" },
  { posX: 5, posY: 2, time: "branco", color: "white" },
  { posX: 5, posY: 4, time: "branco", color: "white" },
  { posX: 5, posY: 6, time: "branco", color: "white" },
  { posX: 6, posY: 1, time: "branco", color: "white" },
  { posX: 6, posY: 3, time: "branco", color: "white" },
  { posX: 6, posY: 5, time: "branco", color: "white" },
  { posX: 6, posY: 7, time: "branco", color: "white" },
  { posX: 7, posY: 0, time: "branco", color: "white" },
  { posX: 7, posY: 2, time: "branco", color: "white" },
  { posX: 7, posY: 4, time: "branco", color: "white" },
  { posX: 7, posY: 6, time: "branco", color: "white" },
];

const t = sizeInput.value;
const testePecas = [
  { posY: 0, posX: t - 1, time: "branco", color: "white" },
  { posY: 2, posX: t - 1, time: "branco", color: "white" },
  { posY: t - 1, posX: t - 1, time: "branco", color: "white" },
  { posY: 1, posX: t - 2, time: "preto", color: "black" },
  { posY: t - 2, posX: t - 2, time: "preto", color: "black" },
  { posY: t - 4, posX: t - 4, time: "preto", color: "black" },
];

const start = () => {
  posicionarPecas(initialPieces);
  game(15); // entra no mundo do jogo
};

const posicionarPecas = (pecas) => {
  // tabuleirosEl.innerHTML = "";
  removePecas();
  pecas.forEach((peca) => {
    const pecaEl = criarPeca(peca);

    const casaDaPeca = document.querySelector(
      `td[data-position="${peca.posX},${peca.posY}"]`
    );

    casaDaPeca.appendChild(pecaEl);
  });
};

const removePecas = () => {
  const casas = document.getElementsByName("casa");
  casas.forEach((casa) => {
    casa.innerHTML = "";
  });
};

// atribui a ela um estilo css
const criarPeca = (peca) => {
  const pecaEl = document.createElement("div");
  pecaEl.setAttribute("id", "peca");
  pecaEl.setAttribute("time", peca.time);

  pecaEl.classname = "";
  pecaEl.classList.add(peca.color); // adiciona a classe correspondente ao time

  return pecaEl;
};

// Mundo do jogo -------------------------------------------------------------
const game = (fps) => {
  num_brancas = 12;
  num_pretas = 12;

  console.clear();
  gameLoop(fps);
};

function gameLoop(fps) {
  setInterval(update, 1000 / fps); // 15 é o fps
}

// metodo que ocorre o jogo
let movimentosPossiveis = [];
let pecaSelecionada = null;
var vezDoBranco = true;

const update = () => {
  onclick = (e) => {
    if (e.target.id === "peca") {
      if (vezDoBranco) {
        if (pecaBranca(e.target)) {
          limparSelecao();
          pecaSelecionada = e.target;

          movimentosPossiveis = verificaMovimentos(
            e.target.parentNode,
            e.target.getAttribute("time")
          );

          pintarMovimentosPossiveis(movimentosPossiveis);
        } else console.log("peca invalida");
      } else {
        if (!pecaBranca(e.target)) {
          limparSelecao();
          pecaSelecionada = e.target;

          movimentosPossiveis = verificaMovimentos(
            e.target.parentNode,
            e.target.getAttribute("time")
          );

          pintarMovimentosPossiveis(movimentosPossiveis);
        } else console.log("peca invalida");
      }
    } else if (e.target.getAttribute("name") === "casa") {
      if (movimentosPossiveis.length > 0) {
        movimentosPossiveis.forEach((mov) => {
          if (e.target === mov.destino) {
            if (mov.comer && mov.comer.length > 0) comer(mov.comer);
            mover(pecaSelecionada.parentNode, mov.destino);
          }
        });
      }
    }
  };
};

const comer = (casas) => {
  casas.forEach((casa, key) => {
    if (key % 2 === 0) {
      casa.innerHTML = "";
    }
  });
};

const mover = (src, target) => {
  const peca = src.removeChild(src.firstChild);
  target.appendChild(peca);
  limparSelecao();

  vezDoBranco = !vezDoBranco;
};

const limparSelecao = () => {
  movimentosPossiveis.forEach((mov) => {
    limpar(mov.destino, "verde");
  });

  movimentosPossiveis = [];
  pecaSelecionada = null;
};

const verificaMovimentos = (casaDaPeca, time, estaComendo = false) => {
  var movimentosPossiveis = [];
  var aux = [];

  if (time === "branco") {
    if (dirFrente(casaDaPeca)) {
      if (vazia(dirFrente(casaDaPeca)) && !estaComendo)
        movimentosPossiveis.push({ destino: dirFrente(casaDaPeca) });
      else if (
        pecaInimiga(dirFrente(casaDaPeca), time) &&
        !protegida(dirFrente(dirFrente(casaDaPeca)))
      ) {
        aux = verificaMovimentos(dirFrente(dirFrente(casaDaPeca)), time, true);
        aux.push(dirFrente(casaDaPeca), dirFrente(dirFrente(casaDaPeca)));
        if (!estaComendo)
          movimentosPossiveis.push({
            destino: aux[1],
            comer: aux,
          });
      }
    }

    if (esqFrente(casaDaPeca)) {
      if (vazia(esqFrente(casaDaPeca)) && !estaComendo)
        movimentosPossiveis.push({ destino: esqFrente(casaDaPeca) });
      else if (
        pecaInimiga(esqFrente(casaDaPeca), time) &&
        !protegida(esqFrente(esqFrente(casaDaPeca)))
      ) {
        aux = verificaMovimentos(esqFrente(esqFrente(casaDaPeca)), time, true);
        aux.push(esqFrente(casaDaPeca), esqFrente(esqFrente(casaDaPeca)));
        if (!estaComendo)
          movimentosPossiveis.push({
            destino: aux[1],
            comer: aux,
          });
      }
    }
  } else {
    if (dirCosta(casaDaPeca)) {
      if (vazia(dirCosta(casaDaPeca)) && !estaComendo)
        movimentosPossiveis.push({ destino: dirCosta(casaDaPeca) });
      else if (
        pecaInimiga(dirCosta(casaDaPeca), time) &&
        !protegida(dirCosta(dirCosta(casaDaPeca)))
      ) {
        aux = verificaMovimentos(dirCosta(dirCosta(casaDaPeca)), time, true);
        aux.push(dirCosta(casaDaPeca), dirCosta(dirCosta(casaDaPeca)));
        if (!estaComendo)
          movimentosPossiveis.push({
            destino: aux[1],
            comer: aux,
          });
      }
    }

    if (esqCosta(casaDaPeca)) {
      if (vazia(esqCosta(casaDaPeca)) && !estaComendo)
        movimentosPossiveis.push({ destino: esqCosta(casaDaPeca) });
      else if (
        pecaInimiga(esqCosta(casaDaPeca), time) &&
        !protegida(esqCosta(esqCosta(casaDaPeca)))
      ) {
        aux = verificaMovimentos(esqCosta(esqCosta(casaDaPeca)), time, true);
        aux.push(esqCosta(casaDaPeca), esqCosta(esqCosta(casaDaPeca)));
        if (!estaComendo)
          movimentosPossiveis.push({
            destino: aux[1],
            comer: aux,
          });
      }
    }
  }

  if (estaComendo) return aux;

  return movimentosPossiveis;
};

const pintarMovimentosPossiveis = (m) => {
  if (!m || m.length === 0) return;

  m.forEach((mov) => {
    pintar(mov.destino, "verde");
  });
};

const posicao = (casa) => {
  return casa.dataset.position;
};

const protegida = (casaSeguinte) => {
  return !casaSeguinte || casaSeguinte.firstChild !== null;
};

const pecaInimiga = (casa, time) => {
  return (
    casa && casa.firstChild && casa.firstChild.getAttribute("time") !== time
  );
};

const vazia = (casa) => {
  return casa && casa.firstChild === null;
};

const pecaBranca = (peca) => {
  return peca.getAttribute("time") === "branco";
};

const dirFrente = (casa) => {
  const pos = [
    parseInt(casa.dataset.position[0]),
    parseInt(casa.dataset.position[2]),
  ];

  return document.querySelector(
    `td[data-position="${[pos[0] - 1, pos[1] + 1]}"]`
  );
};

const esqFrente = (casa) => {
  const pos = [
    parseInt(casa.dataset.position[0]),
    parseInt(casa.dataset.position[2]),
  ];

  return document.querySelector(
    `td[data-position="${[pos[0] - 1, pos[1] - 1]}"]`
  );
};

const esqCosta = (casa) => {
  const pos = [
    parseInt(casa.dataset.position[0]),
    parseInt(casa.dataset.position[2]),
  ];

  return document.querySelector(
    `td[data-position="${[pos[0] + 1, pos[1] - 1]}"]`
  );
};

const dirCosta = (casa) => {
  const pos = [
    parseInt(casa.dataset.position[0]),
    parseInt(casa.dataset.position[2]),
  ];

  return document.querySelector(
    `td[data-position="${[pos[0] + 1, pos[1] + 1]}"]`
  );
};

// Interface ----------------------------------------------------------------

const pintar = (casa, cor) => {
  if (casa) {
    casa.classList = "";
    casa.classList.add(cor);
  }
};

const limpar = (casa, cor) => {
  if (casa) casa.classList.remove(cor);
};
