import Script from 'next/script';
import Link from 'next/link';

export default function TelegramWebApp() {
  return (
    <div className="container">
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
      <div className="header">
        <h2 style={{ margin: 0 }}>Telegram WebApp</h2>
        <Link href="/">Back</Link>
      </div>
      <div className="card">
        <p>This page is optimized to open inside Telegram via a bot using the WebApp interface.</p>
        <p>Choose a grade to begin a quiz:</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[9,10,11,12].map((g) => (
            <Link key={g} className="button" href={{ pathname: `/grade/${g}`, query: { mode: 'timed' } }}>Grade {g} (Timed)</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
