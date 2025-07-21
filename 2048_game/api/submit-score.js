// POST /api/submit-score
let scores = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, score } = req.body;
    if (!name || !score) {
      return res.status(400).json({ message: 'Missing name or score' });
    }

    scores.push({ name, score: parseInt(score) });
    scores.sort((a, b) => b.score - a.score); // High to low
    if (scores.length > 10) scores = scores.slice(0, 10); // Keep top 10

    res.status(200).json({ message: 'Score submitted', leaderboard: scores });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
