import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

const GROQ_MODEL = 'llama-3.3-70b-versatile'
const DAILY_LIMIT = 100

// ── Rate limit check (vibe-security: never store in public Supabase table) ────
async function checkAskLimit(supabase: any, userId: string): Promise<{ allowed: boolean; used: number }> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('usage_logs')
    .select('count')
    .eq('user_id', userId)
    .eq('action', 'ask')
    .eq('date', today)
    .single()
  const used = data?.count ?? 0
  return { allowed: used < DAILY_LIMIT, used }
}

async function incrementAskCount(supabase: any, userId: string) {
  const today = new Date().toISOString().split('T')[0]
  await supabase.rpc('increment_usage', { p_user_id: userId, p_action: 'ask', p_date: today })
}

// ── Simple keyword relevance ranking ─────────────────────────────────────────
function rankChunks(chunks: { content: string; chunk_index: number }[], query: string): string[] {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const scored = chunks.map(c => {
    const low = c.content.toLowerCase()
    const score = words.reduce((acc, w) => acc + (low.split(w).length - 1), 0)
    return { ...c, score }
  })
  scored.sort((a, b) => b.score - a.score || a.chunk_index - b.chunk_index)
  // Take top 6 chunks, ~7200 chars — fits in Groq context
  return scored.slice(0, 6).map(c => `[Chunk ${c.chunk_index + 1}]\n${c.content}`)
}

// ── POST /api/ask ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { documentId, question, history } = await req.json()
    if (!documentId || !question?.trim()) return NextResponse.json({ error: 'documentId and question are required' }, { status: 400 })
    if (question.length > 2000) return NextResponse.json({ error: 'Question too long (max 2000 chars).' }, { status: 400 })

    // Verify document belongs to this user (vibe-security: always check ownership)
    const { data: doc } = await supabase.from('documents').select('id, name').eq('id', documentId).eq('user_id', user.id).single()
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

    // Rate limit
    const { allowed, used } = await checkAskLimit(supabase, user.id)
    if (!allowed) return NextResponse.json({ error: `Daily limit reached (${DAILY_LIMIT}/day). Resets at midnight UTC.`, remaining: 0 }, { status: 429 })

    // Fetch chunks
    const { data: chunks } = await supabase.from('document_chunks').select('content, chunk_index').eq('document_id', documentId).order('chunk_index')
    if (!chunks?.length) return NextResponse.json({ error: 'No content found in this document.' }, { status: 404 })

    // Rank by relevance
    const relevantContext = rankChunks(chunks, question).join('\n\n---\n\n')

    const key = process.env.GROQ_API_KEY?.split(',')[0]?.trim()
    if (!key) return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })

    const messages = [
      {
        role: 'system',
        content: `You are a precise document assistant. Answer questions based ONLY on the document context provided. 
If the answer is not in the context, say "I couldn't find that information in this document."
Always indicate which chunk(s) you used by referencing "[Chunk N]" in your answer.
Be concise and direct. Document name: "${doc.name}"`
      },
      ...(history || []).slice(-6),
      {
        role: 'user',
        content: `Document context:\n${relevantContext}\n\nQuestion: ${question}`
      }
    ]

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model: GROQ_MODEL, messages, temperature: 0.1, max_tokens: 1024 }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error('[ask] Groq error:', err)
      return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 502 })
    }

    const groqData = await groqRes.json()
    const answer = groqData.choices?.[0]?.message?.content || 'No response generated.'

    await incrementAskCount(supabase, user.id)

    return NextResponse.json({ answer, remaining: DAILY_LIMIT - used - 1 })
  } catch (err) {
    console.error('[ask]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
