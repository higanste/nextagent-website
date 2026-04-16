import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/SignOutButton'

export default async function AppPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: docs } = await supabase
    .from('documents')
    .select('id, name, size_bytes, created_at, chunk_count')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* App nav */}
      <nav style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="var(--accent)"/>
            <path d="M8 20V8l6 9 6-9v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>NexAgent</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="text-caption">{user.email}</span>
          <SignOutButton />
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '1.375rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>My Documents</h1>
            <p className="text-caption">{docs?.length ?? 0} document{docs?.length !== 1 ? 's' : ''} · 100 questions/day</p>
          </div>
          <Link href="/app/upload" className="btn btn-primary" id="upload-new-doc">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload Document
          </Link>
        </div>

        {/* Document list */}
        {!docs || docs.length === 0 ? (
          <div className="surface" style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📂</div>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No documents yet</p>
            <p className="text-caption" style={{ marginBottom: '1.5rem' }}>Upload a PDF or Word doc to start asking questions</p>
            <Link href="/app/upload" className="btn btn-primary" id="upload-first-doc">Upload your first document</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {docs.map((doc) => (
              <Link key={doc.id} href={`/app/doc/${doc.id}`} style={{ textDecoration: 'none' }}>
                <div className="surface" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', transition: 'border-color 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hi)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(124,109,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                      <div className="text-caption" style={{ marginTop: '0.125rem' }}>
                        {doc.chunk_count} chunks · {Math.round((doc.size_bytes || 0) / 1024)} KB
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                    <span className="text-caption">{new Date(doc.created_at).toLocaleDateString()}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
