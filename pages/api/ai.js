export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { messages = [] } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const reply = lastUser ? `Offline AI mode: You asked ? ${lastUser.content}. Try again later for full AI.` : 'Offline AI mode.';
    res.status(200).json({ reply });
    return;
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful AI tutor for grades 9-12. Be concise. You can generate quizzes and explain solutions clearly.' },
          ...messages.filter(Boolean),
        ],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.status(200).json({ reply });
  } catch (e) {
    res.status(200).json({ reply: 'AI request failed. Please try again later.' });
  }
}
