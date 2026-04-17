import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { documents, chunks, usageLogs, users } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/auth';

export const runtime = 'edge';

const FREE_DAILY_LIMIT = 50;
const PRO_DAILY_LIMIT = 500;

// ── Rate limit check via D1 ──────────────────────────────────────────
async function checkUsage(db: any, userId: string, plan: string) {
  const limit = plan === 'pro' ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT;
  const today = new Date().toISOString().split('T')[0];
  
  let usage = await db.select().from(usageLogs)
    .where(and(eq(usageLogs.userId, userId), eq(usageLogs.action, 'ask'), eq(usageLogs.date, today)))
    .get();

  if (!usage) {
    // initialize
    await db.insert(usageLogs)
      .values({ userId, action: 'ask', date: today, count: 0 })
      .onConflictDoNothing()
      .run();
    return { allowed: true, used: 0, limit };
  }

  return { allowed: usage.count < limit, used: usage.count, limit };
}

async function incrementAskCount(db: any, userId: string) {
  const today = new Date().toISOString().split('T')[0];
  // Raw D1 statement because optimistic update in Drizzle SQLite can be clunky
  await db.run(sql`
    INSERT INTO usage_logs (userId, action, date, count)
    VALUES (${userId}, 'ask', ${today}, 1)
    ON CONFLICT(userId, action, date) DO UPDATE SET count = usage_logs.count + 1
  `);
}

// ── Simple keyword relevance ranking (Edge compatible without large ML libs) ──
function rankChunks(docChunks: { content: string; chunkIndex: number }[], query: string): string[] {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const scored = docChunks.map(c => {
    const low = c.content.toLowerCase();
    const score = words.reduce((acc, w) => acc + (low.split(w).length - 1), 0);
    return { ...c, score };
  });
  scored.sort((a, b) => b.score - a.score || a.chunkIndex - b.chunkIndex);
  return scored.slice(0, 6).map(c => `[Chunk ${c.chunkIndex + 1}]\n${c.content}`);
}

// ── 3-Tier LLM Routing ───────────────────────────────────────────────
async function fetchAI(messages: any[], plan: string, env: any) {
  // Tier 3: Pro
  if (plan === 'pro') {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.OPENROUTER_API_KEY}` },
      body: JSON.stringify({ model: 'anthropic/claude-3.5-sonnet', messages }),
    });
    if (res.ok) return res;
  }

  // Tier 1: Fast (Groq)
  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.GROQ_API_KEY_1}` },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages }),
  });
  
  if (groqRes.ok) return groqRes;

  // Tier 2: Think Fallback (OpenRouter Free)
  const fallbackRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.OPENROUTER_API_KEY}` },
    body: JSON.stringify({ model: 'google/gemini-2.0-flash-exp:free', messages }),
  });

  return fallbackRes;
}

// ── Main Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const { documentId, question, history } = await req.json() as any;
    if (!documentId || !question?.trim()) return NextResponse.json({ error: 'Missing input' }, { status: 400 });

    const { env } = getRequestContext() as unknown as { env: any };
    const db = getDb(env.nextagent_db);

    // Get user plan
    const userRecord = await db.select({ plan: users.plan }).from(users).where(eq(users.id, userId)).get();
    const plan = userRecord?.plan || 'free';

    // Verify ownership
    const doc = await db.select({ id: documents.id, name: documents.name })
      .from(documents).where(and(eq(documents.id, documentId), eq(documents.userId, userId))).get();
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

    // Rate Limit check
    const { allowed, used, limit } = await checkUsage(db, userId, plan);
    if (!allowed) {
      return NextResponse.json({ error: `Daily limit reached (${limit}/day). Upgrade for more!` }, { status: 429 });
    }

    // Fetch chunks
    const allChunks = await db.select().from(chunks).where(eq(chunks.documentId, documentId)).all();
    if (!allChunks?.length) return NextResponse.json({ error: 'Document is empty' }, { status: 404 });

    const relevantContext = rankChunks(allChunks, question).join('\n\n---\n\n');

    const messages = [
      {
        role: 'system',
        content: `You are NextAgent. Answer questions strictly based on the document context. Document Name: ${doc.name}.
Always indicate which chunk(s) you used by referencing "[Chunk N]".
Context:
${relevantContext}`
      },
      ...(history || []).slice(-6),
      { role: 'user', content: question }
    ];

    const aiRes = await fetchAI(messages, plan, env);
    if (!aiRes.ok) {
      console.error('[AI Routing Error]', await aiRes.text());
      return NextResponse.json({ error: 'All AI networks busy. Please try again.' }, { status: 502 });
    }

    const data = await aiRes.json() as any;
    const answer = data.choices?.[0]?.message?.content || 'No response generated.';

    await incrementAskCount(db, userId);

    return NextResponse.json({ answer, remaining: limit - used - 1 });
  } catch (err) {
    console.error('[ask api err]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
