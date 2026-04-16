import { NextResponse } from 'next/server';

const GROQ_KEYS = [
  process.env.GROQ_API_KEY,
  // Add more keys in Vercel Environment Variables
].filter(Boolean);

const GROQ_MODEL = 'llama-3.1-70b-versatile';

let currentKeyIndex = 0;
function getNextKey() {
  if (GROQ_KEYS.length === 0) return null;
  const key = GROQ_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
  return key;
}

export async function POST(req: Request) {
  try {
    const { userMessage, pageState, history } = await req.json();

    const key = getNextKey();
    if (!key) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY in backend environment." }, { status: 500 });
    }

    const ctx = pageState
      ? `Current page:\nURL: ${pageState.url}\nTitle: ${pageState.title}\nInteractive elements:\n${pageState.elements}`
      : 'No page context. Ask user to navigate to a website first.';

    const systemPrompt = `You are NexAgent, an AI browser automation agent. You physically control the user's browser.
Your GOAL is to help the user achieve their task automatically.
You operate in a loop. When you issue actions, they are executed, and you will be invoked again with the new page state.
If you need to extract data into a sheet or summarize, you can use the "extract" action and then in your NEXT loop, read the text and respond.

${ctx}

RULES:
- Make EXACT, valid JSON.
- If the entire goal is completed, return empty actions: [].
- Never fill passwords.
- Use explicit text for targets.

Respond ONLY with valid JSON:
{
  "thought": "what you have observed and what your next immediate step is",
  "reply": "friendly status update to the user",
  "requiresApproval": false,
  "actions": [
    { "type": "navigate", "url": "https://...", "description": "Go to Google" },
    { "type": "wait", "ms": 1500, "description": "Wait for page" },
    { "type": "click", "target": "Search box", "description": "Click search" },
    { "type": "type", "target": "input[name=q]", "value": "AI news", "description": "Type query" },
    { "type": "key", "key": "Enter", "description": "Press enter" },
    { "type": "extract", "target": "body", "description": "Read content" }
  ]
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      return NextResponse.json({ error: `Groq error: ${txt}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ result: data.choices[0]?.message?.content || '{}' });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
