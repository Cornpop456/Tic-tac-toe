import './style.css';

const appElement = document.getElementById('app');
const boardElement = document.getElementById('board');
const ROW_COUNT = 3;
const COL_COUNT = 3;

type Cell = '' | 'X' | 'O';

type TicTacToeBoard = [[Cell, Cell, Cell], [Cell, Cell, Cell], [Cell, Cell, Cell]];

let boardState: TicTacToeBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

let currentMove: 'X' | 'O' = 'X';
let winner: Cell | 'Draw' = '';

function createCell(row: number, col: number, content: Cell = '') {
  const cell = document.createElement('button');
  cell.setAttribute('data-row', row.toString());
  cell.setAttribute('data-col', col.toString());
  cell.setAttribute('data-content', content);
  cell.classList.add('cell');
  cell.addEventListener('click', () => {
    if (boardState[row][col] !== '' || winner) {
      return;
    }

    boardState[row][col] = currentMove;
    winner = checkBoard(row, col);
    console.log(winner);
    currentMove = currentMove === 'X' ? 'O' : 'X';
    renderBoard();
  });
  return cell;
}

type Coord = [number, number];

type Diagonal = [Coord, Coord, Coord];

type Diagonals = [Diagonal, Diagonal];

const diagonals: Diagonals = [
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

function checkBoard(row: number, col: number): Cell | 'Draw' {
  if (boardState[row].every((cell) => cell === currentMove)) {
    return currentMove;
  } else if (boardState.every((row) => row[col] === currentMove)) {
    return currentMove;
  } else if (
    diagonals.some((diagonal) =>
      diagonal.every(([row, col]) => boardState[row][col] === currentMove)
    )
  ) {
    return currentMove;
  } else if (boardState.every((row) => row.every((cell) => cell !== ''))) {
    return 'Draw';
  }

  return '';
}

function renderBoard() {
  if (!appElement) throw new Error('Cannot find app');
  if (!boardElement) throw new Error('Cannot find board');
  boardElement.innerHTML = '';
  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      boardElement.appendChild(createCell(i, j, boardState[i][j]));
    }
  }
  const oldMoveElement = document.getElementById('move-element');
  if (oldMoveElement) {
    oldMoveElement.remove();
  }
  const moveElement = document.createElement('p');
  moveElement.id = 'move-element';
  moveElement.innerText = winner ? `Winner is ${winner}` : `Next Move: ${currentMove}`;
  moveElement.classList.add('current-move');
  appElement.insertBefore(moveElement, document.getElementById('reset'));
}

function init() {
  const resetButton = document.getElementById('reset');
  if (!resetButton) throw new Error('No Reset button');
  resetButton.addEventListener('click', () => {
    boardState = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    currentMove = 'X';
    winner = '';
    renderBoard();
  });
  renderBoard();
}

init();
