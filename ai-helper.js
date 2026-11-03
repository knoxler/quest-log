/* ai-helper.js – simple wrapper for Anthropic and Ollama chat completions */

/**
 * Generate a response from the specified provider.
 * @param {Array<{role:string, content:string}>} messages - Conversation history.
 * @param {'anthropic'|'ollama'} provider - The provider to use.
 * @param {string} [model] - Optional model name. For Ollama defaults to 'gpt-oss:20b'; for Anthropic defaults to 'claude-3-5-sonnet-20240620'.
 * @returns {Promise<string>} - The assistant's content.
 */
export async function generateResponse(messages, provider, model) {
  if (provider === 'ollama') {
    const url = 'http://localhost:11434/api/chat';
    const body = {
      model: model || 'gpt-oss:20b',
      messages,
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Ollama request failed: ${resp.status} ${err}`);
    }
    const data = await resp.json();
    // Ollama returns {message:{role:'assistant', content:'...'}, done:true}
    return data.message.content;
  }

  if (provider === 'anthropic') {
    const url = 'https://api.anthropic.com/v1/chat/completions';
    const apiKey = localStorage.getItem('anthropicApiKey');
    if (!apiKey) {
      throw new Error('Anthropic API key missing. Set localStorage key "anthropicApiKey".');
    }
    const body = {
      model: model || 'claude-3-5-sonnet-20240620',
      max_tokens: 512,
      messages,
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Anthropic request failed: ${resp.status} ${err}`);
    }
    const data = await resp.json();
    // Anthropic returns data.choices[0].message.content
    const msg = data.choices?.[0]?.message?.content;
    if (!msg) {
      throw new Error('Anthropic response missing content');
    }
    return msg;
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
