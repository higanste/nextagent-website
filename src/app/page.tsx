import { redirect } from 'next/navigation';
import { SignInButton } from '@/components/SignInButton';
import { auth } from '@/auth';

export const runtime = 'edge';

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect('/app');

  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <img src="/logo.png" alt="NextAgent Logo" width="32" height="32" style={{ borderRadius: '8px' }} />
          <span style={{ fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-0.02em' }}>NextAgent</span>
        </div>
        <a href="mailto:support@nextagent.site" style={{ color: 'var(--text-dim)', fontSize: '0.875rem', textDecoration: 'none' }}>
          Support
        </a>
      </nav>

      {/* Hero */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem', gap: '2rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Weco AI cinematic glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'var(--accent)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }}/>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', borderRadius: '99px', border: '1px solid var(--border)', color: 'var(--text-dim)', fontSize: '0.8125rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}/>
          Fast, Free, Edge-native Document AI
        </div>

        <div style={{ maxWidth: '640px', position: 'relative' }}>
          <h1 className="text-display" style={{ marginBottom: '1.25rem' }}>
            Transcribe Audio. Chat with PDFs.<br/>
            <span style={{ color: 'var(--accent-hi)' }}>In seconds.</span>
          </h1>
          <p className="text-body" style={{ color: 'var(--text-dim)', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
            Upload any document or audio file. NextAgent instantly reads or transcribes it, letting you ask questions via advanced reasoning models.
          </p>
          <SignInButton />
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '800px', width: '100%', marginTop: '3rem', position: 'relative' }}>
          {[
            { icon: '📄', title: 'File Uploads', body: 'Support for PDF, DOCX, and TXT.' },
            { icon: '🎙️', title: 'Audio Transcription', body: 'Upload MP3/WAV. Instantly transcribed natively via Groq Whisper.' },
            { icon: '🧠', title: '3-Tier AI Routing', body: 'Llama 3.3 for speed. Claude 3.5 Sonnet & GPT-4o for complex reasoning.' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="surface" style={{ padding: '1.5rem', textAlign: 'left', background: 'rgba(22, 22, 26, 0.6)', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.375rem', fontSize: '1rem' }}>{title}</div>
              <div className="text-caption">{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span className="text-caption">© {new Date().getFullYear()} NextAgent.site</span>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/pricing" className="text-caption" style={{ textDecoration: 'none', color: 'var(--text-dim)' }}>Pricing</Link>
          <a href="mailto:support@nextagent.site" className="text-caption" style={{ textDecoration: 'none', color: 'var(--text-dim)' }}>support@nextagent.site</a>
        </div>
      </footer>
    </main>
  );
}
