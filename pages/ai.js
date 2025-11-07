import { useState } from 'react';
import Link from 'next/link';

export default function AIPage() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are an AI tutor for grades 9-12.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, userMsg] }) });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'AI is currently unavailable.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ margin: 0 }}>AI Tutor</h2>
        <Link href="/">Back</Link>
      </div>

      <div className="card" style={{ minHeight: 240 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 8 }}>
            {messages.filter(m => m.role !== 'system').map((m, i) => (
              <div key={i} className="card" style={{ background: m.role === 'user' ? '#0f172a' : '#111827', borderColor: '#1f2937', marginBottom: 8 }}>
                <strong>{m.role === 'user' ? 'You' : 'AI'}</strong>
                <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Ask for help or request a quiz?" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? send() : null} />
            <button className="button" onClick={send} disabled={loading}>{loading ? 'Sending?' : 'Send'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
