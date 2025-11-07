import { useRouter } from 'next/router';
import Link from 'next/link';
import Quiz from '../../components/Quiz';

export default function GradePage() {
  const router = useRouter();
  const { grade } = router.query;
  const mode = (router.query.mode || 'normal').toString();

  if (!grade) return null;
  const g = Number(grade);

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ margin: 0 }}>Grade {g}</h2>
        <Link href="/">Back</Link>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link className={`button ${mode === 'normal' ? '' : 'secondary'}`} href={{ pathname: `/grade/${g}`, query: { mode: 'normal' } }}>Normal</Link>
          <Link className={`button ${mode === 'timed' ? '' : 'secondary'}`} href={{ pathname: `/grade/${g}`, query: { mode: 'timed' } }}>Timed</Link>
        </div>
      </div>

      <Quiz grade={g} mode={mode} />
    </div>
  );
}
