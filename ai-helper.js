/* ai-helper.js – simple wrapper for Anthropic and Ollama chat completions */

/**
 * Generate a response from the specified provider.
 * @param {Array<{role:string, content:string}>} messages - Conversation history.
 * @param {'anthropic'|'ollama'} provider - The provider to use.
 * @param {string} [model] - Optional model name. For Ollama defaults to 'gpt-oss:20b'; for Anthropic defaults to 'claude-sonnet-5-5'.
 * @param {object} [opts] - Optional Ollama request options, e.g. { num_predict: 120 }. Ignored by other providers.
 * @returns {Promise<string>} - The assistant's content.
 */
export async function generateResponse(messages, provider, model, opts) {
  if (provider === 'ollama') {
    const url = 'http://localhost:11434/api/chat';
    const body = {
      model: model || 'gpt-oss:20b',
      messages,
      stream: false, // return one JSON object instead of streamed lines
      ...(opts ? { options: opts } : {}), // e.g. { num_predict: 120 }
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
    const url = 'https://api.anthropic.com/v1/messages';
    const apiKey = localStorage.getItem('anthropicApiKey');
    if (!apiKey) {
      throw new Error('Anthropic API key missing. Set localStorage key "anthropicApiKey".');
    }
    // The Anthropic Messages API takes the system prompt as a top-level
    // field, not as a message in the array.
    const systemText = messages.filter(m => m.role === 'system').map(m => m.content).join('\n');
    const chatMessages = messages.filter(m => m.role !== 'system');
    const body = {
      model: model || 'claude-sonnet-5-5',
      max_tokens: 1024,
      system: systemText,
      messages: chatMessages,
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        // Required for calling the API directly from a browser.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Anthropic request failed: ${resp.status} ${err}`);
    }
    const data = await resp.json();
    // Anthropic returns { content: [{ type: 'text', text: '...' }] }
    const block = (data.content || []).find(b => b.type === 'text');
    if (!block) {
      throw new Error('Anthropic response missing content');
    }
    return block.text;
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
