import { QUESTIONS } from '../../lib/data';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { grade, selectedIndices } = req.body || {};
  const g = Number(grade);
  const data = QUESTIONS[g];
  if (!data) {
    res.status(400).json({ error: 'Invalid grade' });
    return;
  }
  const correct = data.questions.map((q) => q.answerIndex);
  let score = 0;
  correct.forEach((ans, i) => {
    if (selectedIndices && selectedIndices[i] === ans) score += 1;
  });
  res.status(200).json({ score });
}
