const boardSize = 4;
let board = [];
let score = 0;

function startGame() {
  const welcome = document.getElementById("welcome-screen");
  welcome.classList.add("wipe-out-up");

  // Wait for the animation to finish (1s), then hide the screen and start game
  setTimeout(() => {
    welcome.style.display = "none";
    // setup(); // your 2048 setup function
  }, 1000); // must match the animation duration
}


function createBoard() {
  const boardElement = document.getElementById("game-board");
  boardElement.innerHTML = "";
  for (let i = 0; i < boardSize * boardSize; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile"); // adds css of the class tile to the element
    boardElement.appendChild(tile); // adding divs/tiles in the game-board div
  }
}

function drawBoard() {
  const tiles = document.querySelectorAll(".tile");
  // board is a 1D array ->[0, 1, 2, 3, 4, 5, 6, 7, 8 .... 16]
  // Index:     0  1  2  3   ← Row 0
  //            4  5  6  7   ← Row 1
  //            8  9 10 11   ← Row 2
  //           12 13 14 15   ← Row 3

  board.forEach((value, i) => {
    tiles[i].textContent = (value === 0 ? "" : value);
    tiles[i].style.background = getTileColor(value);
  });
  document.getElementById("score").textContent = score;
}

// og color scheme ###
// function getTileColor(value) {
//   const colors = {
//     0: "#eee4da",        // empty tile
//     2: "#fdf6e3",         // light beige
//     4: "#fceabb",         // soft yellow
//     8: "#f8b195",         // salmon pink
//     16: "#f67280",        // coral red
//     32: "#c06c84",        // plum
//     64: "#6c5b7b",        // dark purple
//     128: "#355c7d",       // steel blue
//     256: "#99b898",       // sage green
//     512: "#3fb68b",       // emerald green
//     1024: "#2a9d8f",      // teal
//     2048: "#e9c46a",      // gold
//   };
//   return colors[value] || "#264653"; // fallback: dark greenish
// }

function getTileColor(value) {
  const colors = {
    0: "#eee4da",        // empty tile
    2: "#fdf6e3",         // light beige
    4: "#fceabb",         // soft yellow
    8: "#f8b195",         // salmon pink
    16: "#f67280",        // coral red
    32: "#c06c84",        // plum
    64: "#6c5b7b",        // dark purple
    128: "#355c7d",       // steel blue
    256: "#99b898",       // sage green
    512: "#3fb68b",       // emerald green
    1024: "#2a9d8f",      // teal
    2048: "#e9c46a",      // gold
  };
  return colors[value] || "#264653"; // fallback: dark greenish
}


function addRandomTile() {
// board is an array of 16 numbers (e.g., [0, 2, 0, 4, ...]).
// map(...) checks each tile:
// If the tile value is 0, that means it's empty, so return its index.
// If not, return null.
// filter(...) removes all null values, leaving only the indexes of empty tiles.

  const emptyTiles = board
    .map((val, idx) => (val === 0 ? idx : null)) // check if tile value == 0 then get tile id or return null
    .filter((val) => val !== null); // removes all null values, leaving only the indexes of empty tiles.
  
  if (emptyTiles.length === 0) return;
  
  const index = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  // 90% chance of a 2 
  // 10% chance for 40
  board[index] = Math.random() > 0.1 ? 2 : 4; 
}

function setup() {
  board = new Array(boardSize * boardSize).fill(0);
  score = 0;
  createBoard();
  addRandomTile();
  addRandomTile();
  drawBoard();
}

// used so that the js does not run before the html is loaded
document.addEventListener("DOMContentLoaded", setup);

// Listen to arrow key events
document.addEventListener("keydown", handleInput);

function handleInput(event) {
  let moved = false;
  switch (event.key) {
    case "ArrowLeft":
      moved = moveLeft();
      break;
    case "ArrowRight":
      moved = moveRight();
      break;
    case "ArrowUp":
      moved = moveUp();
      break;
    case "ArrowDown":
      moved = moveDown();
      break;
  }

  if (moved) { 
    addRandomTile();
    drawBoard();
    checkGameOver();
  }
}

function slide(row) {
  let arr = row.filter(val => val !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(val => val !== 0);
  while (arr.length < boardSize) arr.push(0); // pushes zeros in the empty space
  return arr;
}

function moveLeft() {
  let moved = false;
  for (let i = 0; i < boardSize; i++) {
    const row = board.slice(i * boardSize, (i + 1) * boardSize);
    const newRow = slide(row);
    for (let j = 0; j < boardSize; j++) {
      if (board[i * boardSize + j] !== newRow[j]) {
        board[i * boardSize + j] = newRow[j];
        moved = true;
      }
    }
  }
  return moved;
}

function moveRight() {
  let moved = false;
  // [0,0,2,2] => [0,0,0,4] (moveRight)
  // slide movement is [2,2,0,0] => [4,0,0,0]
  // so using reverse twice we achieve right movement  
  for (let i = 0; i < boardSize; i++) {
    const row = board.slice(i * boardSize, (i + 1) * boardSize).reverse();
    const newRow = slide(row).reverse();
    for (let j = 0; j < boardSize; j++) {
      if (board[i * boardSize + j] !== newRow[j]) {
        board[i * boardSize + j] = newRow[j];
        moved = true;
      }
    }
  }
  return moved;
}

function moveUp() {
  let moved = false;
  for (let col = 0; col < boardSize; col++) {
    const colVals = [];
    for (let row = 0; row < boardSize; row++) {
      // convert 1st column -> 1st row
      colVals.push(board[row * boardSize + col]);//0,4,8,12 for first column positions 
    }
    const newCol = slide(colVals);
    for (let row = 0; row < boardSize; row++) {
      if (board[row * boardSize + col] !== newCol[row]) {
        board[row * boardSize + col] = newCol[row];
        moved = true;
      }
    }
  }
  return moved;
}

function moveDown() {
  let moved = false;
  for (let col = 0; col < boardSize; col++) {
    const colVals = [];
    for (let row = 0; row < boardSize; row++) {
      colVals.push(board[row * boardSize + col]);
    }
    const newCol = slide(colVals.reverse()).reverse();
    for (let row = 0; row < boardSize; row++) {
      if (board[row * boardSize + col] !== newCol[row]) {
        board[row * boardSize + col] = newCol[row];
        moved = true;
      }
    }
  }
  return moved;
}

function checkGameOver() {
  // Check if there are any empty tiles
  const hasEmptyTiles = board.some(tile => tile === 0);
  if (hasEmptyTiles) return;

  // Check if any move is still possible
  if (canMove("left") || canMove("right") || canMove("up") || canMove("down")) {
    return;
  }

  // If no moves are possible and no empty tiles -> game over
  document.getElementById("final-score").textContent = score;
  // update_high_score(score)
  document.getElementById("game-over").classList.remove("hidden");
  document.getElementById("main-content").classList.add("blur");
}

function canMove(direction) {
  const tempBoard = [...board];
  let moved = false;

  function slideTemp(row) {
    let arr = row.filter(val => val !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(val => val !== 0);
    while (arr.length < boardSize) arr.push(0);
    return arr;
  }

  function simulateMoveLeft() {
    for (let i = 0; i < boardSize; i++) {
      const row = tempBoard.slice(i * boardSize, (i + 1) * boardSize);
      const newRow = slideTemp([...row]);
      for (let j = 0; j < boardSize; j++) {
        if (row[j] !== newRow[j]) return true;
      }
    }
    return false;
  }

  function simulateMoveRight() {
    for (let i = 0; i < boardSize; i++) {
      const row = tempBoard.slice(i * boardSize, (i + 1) * boardSize).reverse();
      const newRow = slideTemp([...row]).reverse();
      for (let j = 0; j < boardSize; j++) {
        if (tempBoard[i * boardSize + j] !== newRow[j]) return true;
      }
    }
    return false;
  }

  function simulateMoveUp() {
    for (let col = 0; col < boardSize; col++) {
      const colVals = [];
      for (let row = 0; row < boardSize; row++) {
        colVals.push(tempBoard[row * boardSize + col]);
      }
      const newCol = slideTemp([...colVals]);
      for (let row = 0; row < boardSize; row++) {
        if (tempBoard[row * boardSize + col] !== newCol[row]) return true;
      }
    }
    return false;
  }

  function simulateMoveDown() {
    for (let col = 0; col < boardSize; col++) {
      const colVals = [];
      for (let row = 0; row < boardSize; row++) {
        colVals.push(tempBoard[row * boardSize + col]);
      }
      const newCol = slideTemp([...colVals].reverse()).reverse();
      for (let row = 0; row < boardSize; row++) {
        if (tempBoard[row * boardSize + col] !== newCol[row]) return true;
      }
    }
    return false;
  }

  if (direction === "left") return simulateMoveLeft();
  if (direction === "right") return simulateMoveRight();
  if (direction === "up") return simulateMoveUp();
  if (direction === "down") return simulateMoveDown();
  return false;
}

function restartGame() {
  document.getElementById("game-over").classList.add("hidden");
  document.getElementById("main-content").classList.remove("blur");
  setup(); // Reset board and score
}

// function update_high_score(score){

// }

function submitScore() {
  let all_scores = JSON.parse(localStorage.getItem('all_scores')) || [];
  let leaderboard = document.getElementById('scores')
  let new_entry = document.createElement('li')
  const name = document.getElementById("player-name").value;
  if (!name) {
    alert("Please enter your name");
    return;
  }
  const score = document.getElementById("score").textContent;
  const player_entry = {
    name: name,
    score: score
  }
  leaderboard.append(player_entry)
  all_scores.push(player_entry);
  localStorage.setItem('all_scores', JSON.stringify(player_entry))
}

// swipe functionality
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  // Prevent small accidental swipes
  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      moveRight();
    } else {
      moveLeft();
    }
  } else {
    if (dy > 0) {
      moveDown();
    } else {
      moveUp();
    }
  }

  drawBoard();
  checkGameOver();
});
