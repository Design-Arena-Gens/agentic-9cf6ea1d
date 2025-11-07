import { useEffect, useMemo, useRef, useState } from 'react';

export default function Quiz({ grade, mode = 'normal' }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/api/quizzes/${grade}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load quiz');
        return r.json();
      })
      .then((data) => {
        setQuiz(data);
        setSelected(new Array(data.questions.length).fill(null));
        if (mode === 'timed') {
          const total = data.timePerQuestionSeconds * data.questions.length;
          setTimeLeft(total);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [grade, mode]);

  useEffect(() => {
    if (mode !== 'timed' || submitted || !quiz) return;
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    timerRef.current = setTimeout(() => setTimeLeft((t) => (t !== null ? t - 1 : t)), 1000);
    return () => clearTimeout(timerRef.current);
  }, [mode, timeLeft, submitted, quiz]);

  const answeredCount = useMemo(() => selected.filter((x) => x !== null).length, [selected]);

  function handleSelect(qIndex, optionIndex) {
    if (submitted) return;
    const next = [...selected];
    next[qIndex] = optionIndex;
    setSelected(next);
  }

  function handleSubmit() {
    if (!quiz || submitted) return;
    const body = {
      grade,
      selectedIndices: selected,
    };
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((res) => {
        setSubmitted(true);
        setScore(res.score);
      })
      .catch(() => setError('Failed to submit answers'));
  }

  if (loading) return <div className="card">Loading?</div>;
  if (error) return <div className="card">Error: {error}</div>;
  if (!quiz) return null;

  return (
    <div className="card">
      <div className="header">
        <div>
          <div className="badge">Grade {grade}</div>
          <h2 style={{ margin: '8px 0 0 0' }}>{mode === 'timed' ? 'Timed Quiz' : 'Normal Quiz'}</h2>
        </div>
        <div>
          {mode === 'timed' && (
            <div className="badge" aria-live="polite">Time left: {timeLeft}s</div>
          )}
        </div>
      </div>

      <p style={{ color: '#9ca3af' }}>
        Answered {answeredCount} / {quiz.questions.length}
      </p>

      <div className="grid">
        {quiz.questions.map((q, qi) => (
          <div key={q.id} className="card">
            <strong>{qi + 1}. {q.question}</strong>
            <div style={{ marginTop: 12 }}>
              {q.options.map((opt, oi) => {
                const isSelected = selected[qi] === oi;
                const showCorrect = submitted && oi === q.answerIndex;
                const showWrong = submitted && isSelected && oi !== q.answerIndex;
                return (
                  <button
                    key={oi}
                    className="button"
                    style={{
                      width: '100%',
                      marginTop: 8,
                      background: showCorrect ? '#059669' : showWrong ? '#b91c1c' : isSelected ? '#1d4ed8' : '#374151',
                    }}
                    onClick={() => handleSelect(qi, oi)}
                    disabled={submitted}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        {!submitted && (
          <button className="button" onClick={handleSubmit} disabled={answeredCount === 0}>
            Submit Answers
          </button>
        )}
        {submitted && (
          <div className="badge">Score: {score} / {quiz.questions.length}</div>
        )}
      </div>

      <hr />

      <div>
        <h3 style={{ margin: 0 }}>Question Papers</h3>
        <p style={{ color: '#9ca3af' }}>Download sample papers for Grade {grade}.</p>
        <ul>
          {quiz.papers.map((p) => (
            <li key={p}>
              <a href={p} target="_blank" rel="noreferrer">{p.split('/').pop()}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
