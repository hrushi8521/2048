// GET /api/get-leaderboard
export default function handler(req, res) {
  res.status(200).json({ leaderboard: scores });
}
