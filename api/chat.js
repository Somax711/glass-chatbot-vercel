export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sólo se permiten solicitudes POST' });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta la clave de API de OpenAI' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un asistente útil y conversacional.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || 'Sin respuesta.';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error al conectar con OpenAI:', error);
    res.status(500).json({ error: 'Error al conectar con OpenAI' });
  }
}
