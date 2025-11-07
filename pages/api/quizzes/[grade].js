import { QUESTIONS, getPapersForGrade } from '../../../lib/data';

export default function handler(req, res) {
  const { grade } = req.query;
  const g = Number(grade);
  if (!QUESTIONS[g]) {
    res.status(404).json({ error: 'Grade not found' });
    return;
  }
  const { questions, timePerQuestionSeconds } = QUESTIONS[g];
  res.status(200).json({ grade: g, questions, timePerQuestionSeconds, papers: getPapersForGrade(g) });
}
