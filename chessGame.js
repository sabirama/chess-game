const board = document.getElementById("board");

//variables for setting piece to the board and for checking for column last selected and currently selected..
let isHoldingPiece = false;
let setPiece = "";
let selected = "";

//variables for checking pieces
let player = "";
let validMoves = [];
let king = 2;
let passPawn = false;

// function for initializing the game
function initialize() {
  player = "white";
  newBoard();
  document.querySelectorAll(".col").forEach((col) => {
    col.addEventListener("click", (e) => {
      handleColumnClick(e);
    });
  });

  setInterval(() => {
    gameCheck();
  }, 150);
}

//creating the board in start of the game
function newBoard() {
  for (let i = 0; i < 8; i++) {
    const row = document.createElement("div");
    row.id = `row-${i + 1}`;
    row.classList.add("row");
    row.style = `display:flex;`;

    for (let j = 0; j < 8; j++) {
      colColor =
        i % 2 === 0
          ? `${j % 2 === 0 ? "darkorange" : "azure"}`
          : `${j % 2 === 1 ? "darkorange" : "azure"}`;
      col = document.createElement("div");
      col.classList.add("col");
      col.id = `col-${i + 1}-${j + 1}`;
      row.appendChild(col);

      if (i === 1 || i === 6) {
        col.classList.add("have-piece");
        col.classList.add("pawn");
        col.classList.add("first-move");
        col.textContent = "♙";

        if (i === 1) {
          col.classList.add(`pawn-black-${j + 1}`);
          col.classList.add("black");
        } else {
          col.classList.add(`pawn-white-${j + 1}`);
          col.classList.add("white");
        }
      }

      if (
        (i === 0 && (j === 0 || j === 7)) ||
        (i === 7 && (j === 0 || j === 7))
      ) {
        col.classList.add("tower");
        col.classList.add("have-piece");
        col.classList.add("first-move");
        col.textContent = "♖";

        if (i === 0) {
          col.classList.add("black");
          col.classList.add(`tower-black-${j / 7 == 1 ? 2 : 1}`);
        } else {
          col.classList.add("white");
          col.classList.add(`tower-white-${j / 7 == 1 ? 2 : 1}`);
        }
      }

      if (
        (i === 0 && (j === 1 || j === 6)) ||
        (i === 7 && (j === 1 || j === 6))
      ) {
        col.classList.add("horse");
        col.classList.add("have-piece");
        col.classList.add("first-move");
        col.textContent = "♞";

        if (i === 0) {
          col.classList.add("black");
          col.classList.add(`horse-black-${j % 6 == 0 ? 2 : 1}`);
        } else {
          col.classList.add("white");
          col.classList.add(`horse-white-${j % 6 == 0 ? 2 : 1}`);
        }
      }

      if (
        (i === 0 && (j === 2 || j === 5)) ||
        (i === 7 && (j === 2 || j === 5))
      ) {
        col.classList.add("bishop");
        col.classList.add("have-piece");
        col.classList.add("first-move");
        col.textContent = "♗";

        if (i === 0) {
          col.classList.add("black");
          col.classList.add(`bishop-black-${(j + 1) / 3}`);
        } else {
          col.classList.add("white");
          col.classList.add(`bishop-white-${(j + 1) / 3}`);
        }
      }

      if ((i === 0 || i === 7) && j === 3) {
        col.classList.add("queen");
        col.classList.add("have-piece");
        col.classList.add("first-move");
        col.textContent = "♕";

        if (i === 0) {
          col.classList.add("black");
          col.classList.add(`queen-black`);
        } else {
          col.classList.add("white");
          col.classList.add(`queen-white`);
        }
      }

      if ((i === 0 || i === 7) && j === 4) {
        col.classList.add("king");
        col.classList.add("have-piece");
        col.classList.add("first-move");
        col.textContent = "♔";

        if (i === 0) {
          col.classList.add("black");
          col.classList.add("king-black");
        } else {
          col.classList.add("white");
          col.classList.add("king-black");
        }
      }
    }

    board.appendChild(row);
  }
}

function pawnMoves(row, col) {
  const moves = [];
  const selected = document.getElementById(`col-${row}-${col}`);
  let forwardMove;
  let firstMove;

  if(selected?.classList?.contains('black') && row == 5) {
    if (selected?.classList?.contains('pawn')) {
      if((document.getElementById(`col-${row}-${col + 1}`).classList.contains('pawn'))) {
        moves.push({row : row + 1, col: col + 1})
        selected.classList.add('passpawn');
      }
      else if((document.getElementById(`col-${row}-${col - 1}`).classList.contains('pawn'))) {
        moves.push({row : row + 1, col: col - 1})
        selected.classList.add('passpawn');
      } else {
        selected.classList.remove('passpawn')
      }
    }
  } else if (selected?.classList?.contains('white') && row == 4) {
    if (selected?.classList?.contains('pawn')) {
      if((document.getElementById(`col-${row}-${col + 1}`).classList.contains('pawn'))) {
        moves.push({row : row - 1, col: col + 1})
        selected.classList.add('passpawn');
      }
      else if((document.getElementById(`col-${row}-${col - 1}`).classList.contains('pawn'))) {
        moves.push({row : row - 1, col: col - 1})
        selected.classList.add('passpawn');
      } else {
        selected.classList.remove('passpawn')
      }
    }
  }

  if (selected?.classList?.contains("black")) {
    if (
      !document
        .getElementById(`col-${row + 1}-${col}`)
        .classList.contains("have-piece")
    ) {
      forwardMove = { row: row + 1, col: col };
      moves.push(forwardMove);
    }

    if (
      selected.classList.contains("first-move") &&
      !document
        .getElementById(`col-${row + 1}-${col}`)
        .classList?.contains("have-piece") &&
      !document
        .getElementById(`col-${row + 2}-${col}`)
        .classList?.contains("have-piece")
    ) {
      firstMove = { row: row + 2, col: col };
      moves.push(firstMove);
    }

    //diagonal moves
    if (
      document
        .getElementById(`col-${row + 1}-${col - 1}`)
        ?.classList?.contains("white")
    ) {
      moves.push({ row: row + 1, col: col - 1 });
    }
    if (
      document
        .getElementById(`col-${row + 1}-${col + 1}`)
        ?.classList?.contains("white")
    ) {
      moves.push({ row: row + 1, col: col + 1 });
    }
  }

  if (selected.classList.contains("white")) {
    if (
      !document
        .getElementById(`col-${row - 1}-${col}`)
        ?.classList?.contains("have-piece")
    ) {
      forwardMove = { row: row - 1, col: col };
      moves.push(forwardMove);
    }

    if (
      selected.classList.contains("first-move") &&
      !document
        .getElementById(`col-${row - 1}-${col}`)
        ?.classList?.contains("have-piece") &&
      !document
        .getElementById(`col-${row - 2}-${col}`)
        ?.classList?.contains("have-piece")
    ) {
      firstMove = { row: row - 2, col: col };
      moves.push(firstMove);
    }

    //diagonal moves
    if (
      document
        .getElementById(`col-${row - 1}-${col - 1}`)
        ?.classList?.contains("black")
    ) {
      moves.push({ row: row - 1, col: col - 1 });
    }
    if (
      document
        .getElementById(`col-${row - 1}-${col + 1}`)
        ?.classList?.contains("black")
    ) {
      moves.push({ row: row - 1, col: col + 1 });
    }
  }
  return moves;
}

function towerMoves(row, col) {
  const moves = [];

  // Horizontal moves
  for (let i = col - 1; i > 0; i--) {
    //left
    if (
      !document.getElementById(`col-${row}-${i}`).classList.contains(player)
      && col > i
    ) {
      moves.push({ row: row, col: i});
    }
    if (
      document.getElementById(`col-${row}-${i}`).classList.contains("have-piece")
    ) {
      break;
    }
  }

  for (let i = col + 1; i < 9; i++) {
    // right
    if (
      !document.getElementById(`col-${row}-${i}`).classList.contains(player)
      && col < i
    ) {
      moves.push({ row: row, col: i});
    }

    if (
      document.getElementById(`col-${row}-${i}`).classList.contains("have-piece")
    ) {
      break;
    }
  }

  // Vertical moves
  for (let i = row - 1; i > 0; i--) {
    //up
    if (
      !document.getElementById(`col-${i}-${col}`).classList.contains(player) &&
      row > i
    ) {
      moves.push({ row: i, col: col });
    }
    if (
      document.getElementById(`col-${i}-${col}`).classList.contains("have-piece")
    ) {
      break;
    }
  }
  for (let i = row + 1; i < 9; i++) {
    // down
    if (
      !document.getElementById(`col-${i}-${col}`).classList.contains(player) &&
      row < i
    ) {
      moves.push({ row: i, col: col });
    }
    if (
      document.getElementById(`col-${i}-${col}`).classList.contains("have-piece")
    ) {
      break;
    }
  }

  return moves;
}

function horseMoves(row, col) {
  const moves = [];

  // Possible moves in L-shape
  const moveOffsets = [
    { row: -2, col: -1 },
    { row: -2, col: 1 },
    { row: -1, col: -2 },
    { row: -1, col: 2 },
    { row: 1, col: -2 },
    { row: 1, col: 2 },
    { row: 2, col: -1 },
    { row: 2, col: 1 },
  ];

  for (const offset of moveOffsets) {
    const newRow = row + offset.row;
    const newCol = col + offset.col;

    // Check if the new position is within the board
    if (newRow >= 1 && newRow <= 8 && newCol >= 1 && newCol <= 8) {
      moves.push({ row: newRow, col: newCol });
    }
  }

  return moves;
}

function bishopMoves(row, col) {
  const moves = [];

  // Diagonal moves
  for (let i = 1; i < 9; i++) {
    const currentCell = document.getElementById(`col-${row - i}-${col - i}`);
  
    if (currentCell && !currentCell.classList.contains(player)) {
      moves.push({ row: row - i, col: col - i });
  
      if (currentCell.classList.contains('have-piece')) {
        break; // Stop if there's a piece in the way
      }
    } else {
      break; // Stop if out of bounds or if it's the player's own piece
    }
  }

  for (let i = 1; i < 9; i++) {
    const currentCell = document.getElementById(`col-${row - i}-${col + i}`);
  
    if (currentCell && !currentCell.classList.contains(player)) {
      moves.push({ row: row - i, col: col + i });
  
      if (currentCell.classList.contains('have-piece')) {
        break; // Stop if there's a piece in the way
      }
    } else {
      break; // Stop if out of bounds or if it's the player's own piece
    }
  }

  for (let i = 1; i < 9; i++) {
    const currentCell = document.getElementById(`col-${row + i}-${col - i}`);
  
    if (currentCell && !currentCell.classList.contains(player)) {
      moves.push({ row: row + i, col: col - i });
  
      if (currentCell.classList.contains('have-piece')) {
        break; // Stop if there's a piece in the way
      }
    } else {
      break; // Stop if out of bounds or if it's the player's own piece
    }
  }

  for (let i = 1; i < 9; i++) {
    const currentCell = document.getElementById(`col-${row + i}-${col + i}`);
  
    if (currentCell && !currentCell.classList.contains(player)) {
      moves.push({ row: row + i, col: col + i });
  
      if (currentCell.classList.contains('have-piece')) {
        break; // Stop if there's a piece in the way
      }
    } else {
      break; // Stop if out of bounds or if it's the player's own piece
    }
  }

  return moves;
}

function queenMoves(row, col) {
  const moves = [];

  // Horizontal moves
  for (let i = col - 1; i > 0; i--) {
    //left
    if (
      !document.getElementById(`col-${row}-${i}`).classList.contains(player)
      && col > i
    ) {
      moves.push({ row: row, col: i});
    }
    if (
      document.getElementById(`col-${row}-${i}`).classList.contains("have-piece")
    ) {
      break;
    }
  }

  for (let i = col + 1; i < 9; i++) {
    // right
    if (
      !document.getElementById(`col-${row}-${i}`).classList.contains(player)
      && col < i
    ) {
      moves.push({ row: row, col: i});
    }

    if (
      document.getElementById(`col-${row}-${i}`).classList.contains("have-piece")
    ) {
      break;
    }
  }

  // Vertical moves
  for (let i = row - 1; i > 0; i--) {
    //up
    if (
      !document.getElementById(`col-${i}-${col}`).classList.contains(player) &&
      row > i
    ) {
      moves.push({ row: i, col: col });
    }
    if (
      document.getElementById(`col-${i}-${col}`).classList.contains("have-piece")
    ) {
      break;
    }
  }
  for (let i = row + 1; i < 9; i++) {
    // down
    if (
      !document.getElementById(`col-${i}-${col}`).classList.contains(player) &&
      row < i
    ) {
      moves.push({ row: i, col: col });
    }
    if (
      document.getElementById(`col-${i}-${col}`).classList.contains("have-piece")
    ) {
      break;
    }
  }

  for (let i = 1; i < 9; i++) {
    const currentCell = document.getElementById(`col-${row - i}-${col - i}`);
  
    if (currentCell && !currentCell.classList.contains(player)) {
      moves.push({ row: row - i, col: col - i });
  
      if (currentCell.classList.contains('have-piece')) {
        break; // Stop if there's a piece in the way
      }
    } else {
      break; // Stop if out of bounds or if it's the player's own piece
    }
  }

  for (let i = 1; i < 9; i++) {
    const currentCell = document.getElementById(`col-${row - i}-${col + i}`);
  
    if (currentCell && !currentCell.classList.contains(player)) {
      moves.push({ row: row - i, col: col + i });
  
      if (currentCell.classList.contains('have-piece')) {
        break; // Stop if there's a piece in the way
      }
    } else {
      break; // Stop if out of bounds or if it's the player's own piece
    }
  }

  for (let i = 1; i < 9; i++) {
    const currentCell = document.getElementById(`col-${row + i}-${col - i}`);
  
    if (currentCell && !currentCell.classList.contains(player)) {
      moves.push({ row: row + i, col: col - i });
  
      if (currentCell.classList.contains('have-piece')) {
        break; // Stop if there's a piece in the way
      }
    } else {
      break; // Stop if out of bounds or if it's the player's own piece
    }
  }

  for (let i = 1; i < 9; i++) {
    const currentCell = document.getElementById(`col-${row + i}-${col + i}`);
  
    if (currentCell && !currentCell.classList.contains(player)) {
      moves.push({ row: row + i, col: col + i });
  
      if (currentCell.classList.contains('have-piece')) {
        break; // Stop if there's a piece in the way
      }
    } else {
      break; // Stop if out of bounds or if it's the player's own piece
    }
  }

  return moves;
}

function kingMoves(row, col) {
  const moves = [];

  // Horizontal and Vertical moves
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 1 && i < 9 && j >= 1 && j < 9 && !(i === row && j === col) && !document.getElementById(`col-${i}-${j}`).classList.contains(player)) {
        moves.push({ row: i, col: j });
      }
    }
  }

  return moves;
}

function handlePieceClick(row, col, pieceMoves, isFirstMove) {
  const selected = document.getElementById(`col-${row + 1}-${col + 1}`);
  // Remove previous highlights
  document.querySelectorAll(".col").forEach((cell) => {
    cell.classList.remove("selected");
    cell.classList.remove("valid-move");
  });

  selected.classList.add("selected");

  // Get valid moves for the selected piece
  const moves = pieceMoves(row, col, isFirstMove);
  // Highlight valid moves
  moves.forEach((move) => {
    const validMoveCell = document.getElementById(
      `col-${move.row}-${move.col}`
    );
    validMoveCell.classList.add("valid-move");
  });

  validMoves = moves;
}

//giving response depending on the classes in the selected column
function handleColumnClick(e) {
  selected = e.target;
  const selectedId = [...selected.id];

  //removing valid move after clicking on the board
  const removeValidMove = () => {
    return document.querySelectorAll(".col").forEach((cell) => {
      cell.classList.remove("valid-move");
    });
  };

  const moves = selected.classList.contains("pawn")
    ? pawnMoves(Number(selectedId[4]), Number(selectedId[6]))
    : selected.classList.contains("tower")
    ? towerMoves(Number(selectedId[4]), Number(selectedId[6]))
    : selected.classList.contains("horse")
    ? horseMoves(Number(selectedId[4]), Number(selectedId[6]))
    : selected.classList.contains("bishop")
    ? bishopMoves(Number(selectedId[4]), Number(selectedId[6]))
    : selected.classList.contains("queen")
    ? queenMoves(Number(selectedId[4]), Number(selectedId[6]))
    : selected.classList.contains("king")
    ? kingMoves(Number(selectedId[4]), Number(selectedId[6]))
    : null;

   if ( isHoldingPiece && selected?.classList?.contains(player) && setPiece?.classList?.contains(player)) {
      isHoldingPiece = false;
      setPiece = "";
      selected = "";
      removeValidMove();

    } else if (isHoldingPiece && selected.classList.contains("valid-move")) {
    selected.classList = setPiece.classList;
    selected.textContent = setPiece.textContent;
    setPiece.classList = "col";
    setPiece.innerHTML = "";
    setPiece = "";
    removeValidMove();
    selected.classList.remove("first-move");
    isHoldingPiece = false;

    if (player === "white") {
      if (selected.classList.contains('passpawn')) {
        document.getElementById(`col-${Number(selectedId[4]) + 1}-${Number(selectedId[6])}`).classList = "col";
        document.getElementById(`col-${Number(selectedId[4]) + 1}-${Number(selectedId[6])}`).innerHTML = "";
      }
      player = "black";
    } else {
      if (selected.classList.contains('passpawn')) {
        document.getElementById(`col-${Number(selectedId[4]) - 1}-${Number(selectedId[6])}`).classList = "col";
        document.getElementById(`col-${Number(selectedId[4]) - 1}-${Number(selectedId[6])}`).innerHTML = "";
      }
      player = "white";
    }
  } else if (selected.classList.contains("have-piece") && selected.classList.contains(player)) {
    removeValidMove();
    isHoldingPiece = true;
    setPiece = selected;

    moves.forEach((cell) => {
      document.getElementById(`col-${cell.row}-${cell.col}`)?.classList?.add("valid-move");
    });
  } else {
    removeValidMove();
  }

  if (selected?.classList?.contains('pawn') && (selectedId[4] == '1' || selectedId[4] == '8')) {
    selected?.classList?.remove('pawn');
    selected?.classList?.add('queen');
    selected.textContent = "♕";
  }
}

//checking for continuity of the game
function gameCheck() {
  king = 0;

  document.querySelectorAll(".col").forEach((col) => {
    if (col.classList.contains("king-black") || col.classList.contains("king-white")) {
      king += 1;
    }

  });

  if (king != 2) {
    const gameEnd = document.querySelector(".game-over");
    gameEnd.style = "display:flex";
  }
}

initialize();
