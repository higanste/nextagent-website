import { createServerSupabase } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { DocChat } from '@/components/DocChat'

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Verify ownership (vibe-security: check user_id)
  const { data: doc } = await supabase
    .from('documents')
    .select('id, name, chunk_count, size_bytes, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) notFound()

  // Get today's remaining questions
  const today = new Date().toISOString().split('T')[0]
  const { data: usage } = await supabase
    .from('usage_logs')
    .select('count')
    .eq('user_id', user.id)
    .eq('action', 'ask')
    .eq('date', today)
    .single()
  const remaining = 100 - (usage?.count ?? 0)

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header */}
      <header style={{ flexShrink: 0, padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
          <Link href="/app" id="back-to-library" style={{ color: 'var(--text-dim)', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '7px', background: 'rgba(124,109,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
              <div className="text-caption">{doc.chunk_count} chunks · {Math.round((doc.size_bytes || 0) / 1024)} KB</div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <DocChat documentId={doc.id} documentName={doc.name} initialRemaining={remaining} />
      </div>
    </div>
  )
}
