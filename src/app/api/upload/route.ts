import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// ── Text extraction helpers ──────────────────────────────────────────────────

async function extractPdf(buffer: Buffer): Promise<string> {
  // pdf-parse exports differently in ESM vs CJS - handle both
  const mod = await import('pdf-parse')
  const pdfParse = (mod as any).default ?? mod
  const result = await pdfParse(buffer)
  return result.text
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

function chunkText(text: string, chunkSize = 1200, overlap = 200): string[] {
  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end).trim())
    start = end - overlap
    if (start >= text.length) break
  }
  return chunks.filter(c => c.length > 50) // drop tiny chunks
}

// ── Security: validate file type by magic bytes (not just MIME) ──────────────

function detectFileType(buffer: Buffer, filename: string): 'pdf' | 'docx' | 'txt' | null {
  // PDF: starts with %PDF
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) return 'pdf'
  // DOCX: PKZip header (DOCX is a ZIP)
  if (buffer[0] === 0x50 && buffer[1] === 0x4B) return 'docx'
  // Plain text fallback
  if (filename.endsWith('.txt')) return 'txt'
  return null
}

// ── Rate limiting via Supabase private table ──────────────────────────────────

async function checkUploadLimit(supabase: any, userId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('usage_logs')
    .select('count')
    .eq('user_id', userId)
    .eq('action', 'upload')
    .eq('date', today)
    .single()
  return !data || data.count < 20 // 20 uploads/day max
}

async function incrementUploadCount(supabase: any, userId: string) {
  const today = new Date().toISOString().split('T')[0]
  await supabase.rpc('increment_usage', { p_user_id: userId, p_action: 'upload', p_date: today })
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Rate limit check
    const allowed = await checkUploadLimit(supabase, user.id)
    if (!allowed) return NextResponse.json({ error: 'Upload limit reached (20/day). Please try tomorrow.' }, { status: 429 })

    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Size check — hard cap 20MB
    if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: 'File must be under 20MB' }, { status: 413 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate actual file type by magic bytes
    const fileType = detectFileType(buffer, file.name)
    if (!fileType) return NextResponse.json({ error: 'Unsupported file type. Use PDF, DOCX, or TXT.' }, { status: 415 })

    // Extract text
    let text = ''
    if (fileType === 'pdf') text = await extractPdf(buffer)
    else if (fileType === 'docx') text = await extractDocx(buffer)
    else text = buffer.toString('utf-8')

    if (!text.trim()) return NextResponse.json({ error: 'Could not extract text from this file. It may be scanned or image-only.' }, { status: 422 })

    // Chunk text
    const chunks = chunkText(text)

    // Save document record
    const { data: doc, error: docErr } = await supabase
      .from('documents')
      .insert({ user_id: user.id, name: file.name, size_bytes: file.size, chunk_count: chunks.length })
      .select('id')
      .single()

    if (docErr || !doc) return NextResponse.json({ error: 'Failed to save document' }, { status: 500 })

    // Save chunks
    const chunkRows = chunks.map((content, idx) => ({
      document_id: doc.id,
      user_id: user.id,
      chunk_index: idx,
      content,
    }))

    const { error: chunksErr } = await supabase.from('document_chunks').insert(chunkRows)
    if (chunksErr) {
      await supabase.from('documents').delete().eq('id', doc.id)
      return NextResponse.json({ error: 'Failed to save document chunks' }, { status: 500 })
    }

    await incrementUploadCount(supabase, user.id)

    return NextResponse.json({ id: doc.id, chunks: chunks.length })
  } catch (err) {
    console.error('[upload]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
