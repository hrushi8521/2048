 const boardSize = 4;
    let board = [];
    let score = 0;
    // let highscore = 0;

    function startGame() {
      const welcome = document.getElementById("welcome-screen");
      welcome.classList.add("wipe-out-up");
      
      setTimeout(() => {
        welcome.style.display = "none";
      }, 1000);
    }

    function createBoard() {
      const boardElement = document.getElementById("game-board");
      boardElement.innerHTML = "";
      for (let i = 0; i < boardSize * boardSize; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        boardElement.appendChild(tile);
      }
    }

    function drawBoard() {
      const tiles = document.querySelectorAll(".tile");
      
      board.forEach((value, i) => {
        tiles[i].textContent = (value === 0 ? "" : value);
        tiles[i].style.background = getTileColor(value);
        tiles[i].style.color = value > 4 ? "#fff" : "#776e65";
      });
      document.getElementById("score").textContent = score;
      // document.getElementById("highscore").textContent = highscore;
    }

    function getTileColor(value) {
      const colors = {
        0: "#eee4da",
        2: "#fdf6e3",
        4: "#fceabb",
        8: "#f8b195",
        16: "#f67280",
        32: "#c06c84",
        64: "#6c5b7b",
        128: "#355c7d",
        256: "#99b898",
        512: "#3fb68b",
        1024: "#2a9d8f",
        2048: "#e9c46a",
      };
      return colors[value] || "#264653";
    }

    function addRandomTile() {
      const emptyTiles = board
        .map((val, idx) => (val === 0 ? idx : null))
        .filter((val) => val !== null);
      
      if (emptyTiles.length === 0) return;
      
      const index = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
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

    // document.addEventListener("DOMContentLoaded", setup);
    document.addEventListener("DOMContentLoaded", () => {
      setup();
      
      fetchTopPlayer();
      const savedName = localStorage.getItem("playerName");
      if (savedName) {
        document.getElementById("player-name").value = savedName;
      }
    });

    document.addEventListener("keydown", handleInput);

    window.addEventListener("keydown", function(e) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }
    }, { passive: false });

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
      while (arr.length < boardSize) arr.push(0);
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
          colVals.push(board[row * boardSize + col]);
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
      const hasEmptyTiles = board.some(tile => tile === 0);
      if (hasEmptyTiles) return;

      if (canMove("left") || canMove("right") || canMove("up") || canMove("down")) {
        return;
      }

      document.getElementById("final-score").textContent = score;
      document.getElementById("game-over").classList.remove("hidden");
      document.getElementById("main-content").classList.add("blur");
    }

    function canMove(direction) {
      const tempBoard = [...board];

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
      setup();
    }

    // function submitScore(event) {
    //   event.preventDefault();
    //   const name = document.getElementById("player-name").value;
      
    //   if (!name.trim()) {
    //     alert("Please enter your name");
    //     return;
    //   }
      
    //   // Get existing scores from memory (since localStorage isn't available)
    //   const leaderboard = document.getElementById('scores');
    //   const newEntry = document.createElement('li');
    //   newEntry.textContent = `${name}: ${score}`;
    //   leaderboard.appendChild(newEntry);
      
    //   // Show success message
    //   alert(`Score submitted! ${name}: ${score}`);
      
    //   // Clear the form
    //   document.getElementById("player-name").value = "";
    // }

    // async function submitScore(event) {
    //   event.preventDefault();
    //   const name = document.getElementById("player-name").value.trim();
    //   if (!name) {
    //     alert("Please enter your name");
    //     return;
    //   }

    //   // Save name to localStorage
    //   localStorage.setItem("playerName", name);

    //   // Save to Supabase
    //   const { data, error } = await supabase.from("Players").insert([{ name, score }]);
      
    //   if (error) {
    //     console.error("Supabase insert error:", error.message);
    //     alert("Failed to submit score. Try again.");
    //     return;
    //   }

    //   alert(`Score submitted! ${name}: ${score}`);
    //   document.getElementById("player-name").value = "";
    // }

    async function submitScore(event) {
      event.preventDefault();
      const name = document.getElementById("player-name").value.trim();
      if (!name) {
        alert("Please enter your name");
        return;
      }

      localStorage.setItem("playerName", name);

      // First: Check if player already exists
      const { data: existing, error: fetchError } = await supabase
        .from("Players")
        .select("*")
        .eq("name", name)
        .limit(1)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking player:", fetchError.message);
        alert("Something went wrong while checking player.");
        return;
      }

      if (existing) {
        // Player exists → update score only if new one is higher
        if (score > existing.score) {
          const { error: updateError } = await supabase
            .from("Players")
            .update({ score })
            .eq("name", name);

          if (updateError) {
            console.error("Update error:", updateError.message);
            alert("Failed to update score.");
            return;
          }

          alert(`Score updated! ${name}: ${score}`);
        } else {
          alert(`You already have a higher score (${existing.score}).`);
        }
      } else {
        // Player doesn't exist → insert new
        const { error: insertError } = await supabase
          .from("Players")
          .insert([{ name, score }]);

        if (insertError) {
          console.error("Insert error:", insertError.message);
          alert("Failed to submit score.");
          return;
        }

        alert(`Score submitted! ${name}: ${score}`);
      }

      fetchTopPlayer();
      restartGame()
      // document.getElementById("player-name").value = "";
      // document.getElementById("final-score").textContent = 0;
  }

    // async function submitScore(event) {
    //   event.preventDefault();

    //   const name = document.getElementById("player-name").value.trim();
    //   if (!name) {
    //     alert("Please enter your name");
    //     return;
    //   }

    //   localStorage.setItem("playerName", name);

    //   // Use upsert to insert if not exists or update if exists
    //   const { data, error } = await supabase
    //     .from("Players")
    //     .upsert([{ name, score }], { onConflict: ['name'] }) // 'name' must be a unique column

    //   if (error) {
    //     console.error("Upsert error:", error.message);
    //     alert("Failed to submit/update score.");
    //     return;
    //   }

    //   alert(`Score submitted! ${name}: ${score}`);
    //   document.getElementById("player-name").value = "";
    //   document.getElementById("final-score").textContent = 0;
    //   fetchTopPlayer();
    // }

    // async function submitScore(event) {
    //   event.preventDefault();

    //   const name = document.getElementById("player-name").value.trim();
    //   if (!name) {
    //     alert("Please enter your name");
    //     return;
    //   }

    //   localStorage.setItem("playerName", name);

    //   // Step 1: Check if the player already exists
    //   const { data: existing, error: fetchError } = await supabase
    //     .from("Players")
    //     .select("*")
    //     .eq("name", name)
    //     .single();

    //   if (fetchError && fetchError.code !== "PGRST116") {
    //     console.error("Error checking player:", fetchError.message);
    //     alert("Something went wrong while checking the player.");
    //     return;
    //   }

    //   if (existing) {
    //     // Step 2: If player exists, update score only if the new score is higher
    //     if (score > existing.score) {
    //       const { error: updateError } = await supabase
    //         .from("Players")
    //         .update({ score })
    //         .eq("name", name);

    //       if (updateError) {
    //         console.error("Update error:", updateError.message);
    //         alert("Failed to update score.");
    //         return;
    //       }

    //       alert(`Score updated! ${name}: ${score}`);
    //     } else {
    //       alert(`You already have a higher score (${existing.score}).`);
    //     }
    //   } else {
    //     // Step 3: Player doesn't exist → insert new
    //     const { error: insertError } = await supabase
    //       .from("Players")
    //       .insert([{ name, score }]);

    //     if (insertError) {
    //       console.error("Insert error:", insertError.message);
    //       alert("Failed to submit score.");
    //       return;
    //     }

    //     alert(`Score submitted! ${name}: ${score}`);
    //   }

    //   // Step 4: Reset UI
    //   document.getElementById("player-name").value = "";
    //   document.getElementById("final-score").textContent = 0;
    //   fetchTopPlayer(); // Refresh leaderboard
    // }

    async function fetchTopPlayer() {
      const { data, error } = await supabase
        .from("Players")
        .select("name, score")
        .order("score", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching top player:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const topPlayer = data[0];
        document.getElementById("top-player").textContent = topPlayer.name;
        document.getElementById("top-score").textContent = topPlayer.score;
      } else {
        document.getElementById("top-player").textContent = "No data";
        document.getElementById("top-score").textContent = "0";
      }
    }


    // Touch/swipe functionality
    let touchStartX = 0;
    let touchStartY = 0;
    let gameBoard = null;

    document.addEventListener("DOMContentLoaded", () => {
      gameBoard = document.getElementById("game-board");
    });

    document.addEventListener("touchstart", e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchend", e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      // Prevent small accidental swipes
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

      let moved = false;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          moved = moveRight();
        } else {
          moved = moveLeft();
        }
      } else {
        if (dy > 0) {
          moved = moveDown();
        } else {
          moved = moveUp();
        }
      }

      if (moved) {
        addRandomTile();
        drawBoard();
        checkGameOver();
      }
    }, { passive: true });

    // Prevent default touch behaviors on game board
    document.addEventListener("touchmove", e => {
      if (e.target.closest("#game-board")) {
        e.preventDefault();
      }
    }, { passive: false });

    // Leaderboard toggle logic
document.getElementById("open-leaderboard").addEventListener("click", () => {
  const modal = document.getElementById("leaderboard-modal");
  modal.classList.remove("hidden");
  modal.classList.add("show");
});

document.getElementById("close-leaderboard").addEventListener("click", () => {
  const modal = document.getElementById("leaderboard-modal");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 400); // match transition duration
});

// Populate leaderboard dynamically
async function populateLeaderboard() {
  const { data, error } = await supabase
    .from("Players")
    .select("name, score")
    .order("score", { ascending: false })
    .limit(10);

  const list = document.getElementById("scores-list");
  list.innerHTML = "";

  if (error) {
    console.error("Error fetching leaderboard:", error.message);
    list.innerHTML = "<li>Error loading leaderboard</li>";
    return;
  }

  data.forEach((player, index) => {
    const item = document.createElement("li");
    item.textContent = `${index + 1}. ${player.name} - ${player.score}`;
    list.appendChild(item);
  });
}

// Also fetch when modal opens
document.getElementById("open-leaderboard").addEventListener("click", populateLeaderboard);

function closeLeaderboard() {
  document.querySelector(".leaderboard-modal").classList.remove("show");
}
