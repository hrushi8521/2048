const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

let leaderboard = [];

app.use(cors());
app.use(express.json());

app.post("/submit-score", (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid name or score" });
  }

  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10); // Keep top 10
  res.json({ success: true });
});

app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
