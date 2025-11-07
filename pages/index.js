import Link from 'next/link';
import { useMemo, useState } from 'react';
import { GRADES } from '../lib/data';

export default function Home() {
  const [mode, setMode] = useState('normal');
  const grades = useMemo(() => GRADES, []);

  return (
    <div className="container">
      <header className="header">
        <h1 style={{ margin: 0 }}>Telegram Board ? Grades 9?12</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/ai" className="button secondary">AI Tutor</Link>
          <Link href="/telegram/webapp" className="button secondary">Open Telegram WebApp</Link>
        </div>
      </header>

      <div className="card" style={{ marginBottom: 16 }}>
        <label htmlFor="mode">Quiz Mode</label>
        <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="normal">Normal Quiz</option>
          <option value="timed">Timed Quiz</option>
        </select>
      </div>

      <div className="grid">
        {grades.map((g) => (
          <div key={g} className="card">
            <h3 style={{ marginTop: 0 }}>Grade {g}</h3>
            <p style={{ color: '#9ca3af' }}>Practice quizzes and question papers.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link className="button" href={{ pathname: `/grade/${g}`, query: { mode } }}>Start</Link>
              <Link className="button secondary" href={`/papers/grade-${g}/paper1.txt`} target="_blank">Paper</Link>
            </div>
          </div>
        ))}
      </div>

      <footer>
        Built for Grades 9?12. Timed and normal quizzes, AI help, Telegram integration.
      </footer>
    </div>
  );
}
