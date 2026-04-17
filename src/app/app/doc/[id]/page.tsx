import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { DocChat } from '@/components/DocChat';
import { auth } from '@/auth';
import { getRequestContext } from '@/cf-helpers';
import { getDb } from '@/db';
import { documents, usageLogs, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';


export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect('/');
  const userId = session.user.id;

  const { env } = getRequestContext() as unknown as { env: any };
  const db = getDb(env.nextagent_db);

  // Verify ownership
  const doc = await db.select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.userId, userId)))
    .get();

  if (!doc) notFound();

  const userRecord = await db.select({ plan: users.plan }).from(users).where(eq(users.id, userId)).get();
  const plan = userRecord?.plan || 'free';
  const limit = plan === 'pro' ? 500 : 50;

  const today = new Date().toISOString().split('T')[0];
  const usage = await db.select().from(usageLogs)
    .where(and(eq(usageLogs.userId, userId), eq(usageLogs.action, 'ask'), eq(usageLogs.date, today)))
    .get();
  
  const remaining = limit - (usage?.count ?? 0);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header */}
      <header style={{ flexShrink: 0, padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
          <Link href="/app" id="back-to-library" style={{ color: 'var(--text-dim)', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '7px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/logo.png" alt="Logo" width="32" height="32" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
              <div className="text-caption">{doc.chunkCount} chunks · {Math.round((doc.sizeBytes || 0) / 1024)} KB</div>
            </div>
          </div>
        </div>
        {plan === 'free' && (
          <Link href="/pricing" className="btn btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
            Upgrade for Claude 3.5
          </Link>
        )}
      </header>

      {/* Chat */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <DocChat documentId={doc.id} documentName={doc.name} initialRemaining={remaining} />
      </div>
    </div>
  );
}
