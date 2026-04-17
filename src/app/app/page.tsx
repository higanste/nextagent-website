import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignOutButton } from '@/components/SignOutButton';
import { auth } from '@/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { documents, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const runtime = 'edge';

export default async function AppPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/');
  const userId = session.user.id;

  const { env } = getRequestContext() as unknown as { env: any };
  const db = getDb(env.nextagent_db);

  // Fetch documents and user plan
  const [docs, userRecord] = await Promise.all([
    db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.createdAt)),
    db.select().from(users).where(eq(users.id, userId)).get()
  ]);

  const plan = userRecord?.plan || 'free';
  const limitLabel = plan === 'pro' ? '500 questions/day' : '50 questions/day';

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* App nav */}
      <nav style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <img src="/logo.png" alt="NextAgent Logo" width="30" height="30" style={{ borderRadius: '6px' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>NextAgent</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {plan === 'free' && (
            <Link href="/pricing" className="btn btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              Upgrade to Pro
            </Link>
          )}
          <span className="text-caption">{session.user.email}</span>
          <SignOutButton />
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '1.375rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>My Documents</h1>
            <p className="text-caption">{docs.length} document{docs.length !== 1 ? 's' : ''} · {limitLabel} ({plan.toUpperCase()})</p>
          </div>
          <Link href="/app/upload" className="btn btn-primary" id="upload-new-doc">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload Document
          </Link>
        </div>

        {/* Document list */}
        {docs.length === 0 ? (
          <div className="surface" style={{ padding: '4rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📂</div>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No documents yet</p>
            <p className="text-caption" style={{ marginBottom: '1.5rem' }}>Upload a PDF, Word doc, or Audio file to start asking questions</p>
            <Link href="/app/upload" className="btn btn-primary" id="upload-first-doc">Upload your first document</Link>
            {/* Interactive Onboarding Tooltip */}
            <div className="fade-up" style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'var(--accent)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', maxWidth: '250px', textAlign: 'left', pointerEvents: 'none' }}>
              👋 <strong>Welcome!</strong> Start by dragging a document here to create your first AI agent.
              <div style={{ position: 'absolute', top: '-6px', left: '20px', width: '12px', height: '12px', background: 'var(--accent)', transform: 'rotate(45deg)' }} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {docs.map((doc) => (
              <Link key={doc.id} href={`/app/doc/${doc.id}`} style={{ textDecoration: 'none' }}>
                <div className="surface" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', transition: 'all 0.15s ease', cursor: 'pointer' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(124, 109, 250, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(124,109,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>
                        {doc.name}
                      </div>
                      <div className="text-caption" style={{ marginTop: '0.125rem' }}>
                        {doc.chunkCount} chunks · {Math.round((doc.sizeBytes || 0) / 1024)} KB
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                    <span className="text-caption">{new Date(doc.createdAt!).toLocaleDateString()}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
