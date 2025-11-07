const TELEGRAM_API = 'https://api.telegram.org';

async function sendMessage(token, chatId, text) {
  try {
    await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
  } catch {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(200).json({ ok: true });
    return;
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const update = req.body;
  try {
    const msg = update?.message;
    const chatId = msg?.chat?.id;
    const text = (msg?.text || '').trim().toLowerCase();
    if (!chatId) {
      res.status(200).json({ ok: true });
      return;
    }
    if (!token) {
      // Acknowledge without sending (no token configured)
      res.status(200).json({ ok: true, note: 'No TELEGRAM_BOT_TOKEN set' });
      return;
    }

    if (text === '/start' || text.includes('hello') || text.includes('hi')) {
      const intro = [
        'Welcome to the Grades 9?12 Board! ??',
        'Open the web app for quizzes and papers:',
        'https://agentic-9cf6ea1d.vercel.app/telegram/webapp',
        '',
        'Or pick a grade directly:',
        'Grade 9: https://agentic-9cf6ea1d.vercel.app/grade/9?mode=normal',
        'Grade 10: https://agentic-9cf6ea1d.vercel.app/grade/10?mode=normal',
        'Grade 11: https://agentic-9cf6ea1d.vercel.app/grade/11?mode=normal',
        'Grade 12: https://agentic-9cf6ea1d.vercel.app/grade/12?mode=normal',
      ].join('\n');
      await sendMessage(token, chatId, intro);
    } else if (text.includes('ai') || text.includes('help')) {
      await sendMessage(token, chatId, 'AI Tutor: https://agentic-9cf6ea1d.vercel.app/ai');
    } else {
      await sendMessage(token, chatId, 'Type /start to see options, or visit https://agentic-9cf6ea1d.vercel.app');
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: true });
  }
}
