import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { SignInButton } from '@/components/SignInButton'

export default async function Home() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/app')

  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="var(--accent)"/>
            <path d="M8 20V8l6 9 6-9v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-0.02em' }}>NexAgent</span>
        </div>
        <a href="mailto:support@nextagent.site" style={{ color: 'var(--text-dim)', fontSize: '0.875rem', textDecoration: 'none' }}>
          Support
        </a>
      </nav>

      {/* Hero */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem', gap: '2rem' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', borderRadius: '99px', border: '1px solid var(--border)', color: 'var(--text-dim)', fontSize: '0.8125rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}/>
          Free · No credit card · 100 questions/day
        </div>

        <div style={{ maxWidth: '640px' }}>
          <h1 className="text-display" style={{ marginBottom: '1.25rem' }}>
            Ask questions.<br/>
            <span style={{ color: 'var(--accent)' }}>Get answers from your documents.</span>
          </h1>
          <p className="text-body" style={{ color: 'var(--text-dim)', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
            Upload any PDF, Word doc, or text file. NexAgent reads it and lets you chat with it — no copy-pasting, no manual searching. Like NotebookLM, but free.
          </p>
          <SignInButton />
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '700px', width: '100%', marginTop: '3rem' }}>
          {[
            { icon: '📄', title: 'PDF & Word Docs', body: 'Upload any document up to 20MB' },
            { icon: '💬', title: 'Chat Interface', body: 'Ask questions in plain English' },
            { icon: '📍', title: 'Cited Answers', body: 'See which part of the doc answered you' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="surface" style={{ padding: '1.25rem', textAlign: 'left' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.625rem' }}>{icon}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9375rem' }}>{title}</div>
              <div className="text-caption">{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span className="text-caption">© {new Date().getFullYear()} NexAgent · Free forever</span>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="mailto:support@nextagent.site" className="text-caption" style={{ textDecoration: 'none', color: 'var(--text-dim)' }}>support@nextagent.site</a>
          <a href="https://ko-fi.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}>
            ☕ Donate
          </a>
        </div>
      </footer>
    </main>
  )
}
