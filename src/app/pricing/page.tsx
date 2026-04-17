'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = (await res.json()) as any;
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        // Not logged in -> trigger login via layout or send to home
        alert('Please log in first before upgrading.');
        router.push('/');
      } else {
        alert('Checkout error: ' + (data.error || 'Unknown error'));
      }
    } catch {
      alert('Network error. Try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100dvh', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      
      <a href="/app" style={{ alignSelf: 'flex-start', color: 'var(--text-dim)', textDecoration: 'none', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to Dashboard
      </a>

      <h1 className="text-display" style={{ marginBottom: '1rem' }}>Pricing</h1>
      <p className="text-body" style={{ color: 'var(--text-dim)', maxWidth: '500px', marginBottom: '4rem' }}>
        Unlock advanced reasoning models from Claude 3.5 Sonnet and GPT-4o, plus 10x higher question limits.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', maxWidth: '1000px', width: '100%' }}>
        
        {/* Starter */}
        <div className="surface" style={{ flex: '1 1 300px', padding: '2.5rem 2rem', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Starter</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>$0 <span className="text-caption" style={{ fontWeight: 400 }}>/m</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, color: 'var(--text-dim)', fontSize: '0.9375rem' }}>
            <li>✓ 50 questions / day</li>
            <li>✓ File uploads (TXT, PDF, Word)</li>
            <li>✓ Ultra-fast Groq Llama Models</li>
          </ul>
          <button disabled className="btn btn-ghost" style={{ width: '100%', cursor: 'not-allowed' }}>Current Plan</button>
        </div>

        {/* Pro */}
        <div className="surface-hi" style={{ flex: '1 1 300px', padding: '2.5rem 2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle glow background for Pro mimicking Weco AI */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-hi)' }}>Pro</h2>
            <span style={{ background: 'rgba(124,109,250,0.1)', color: 'var(--accent-hi)', padding: '0.25rem 0.625rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>POPULAR</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>$15 <span className="text-caption" style={{ fontWeight: 400 }}>/m</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, fontSize: '0.9375rem' }}>
            <li>✓ <strong>500</strong> questions / day</li>
            <li>✓ Audio uploads (MP3, WAV transcription)</li>
            <li>✓ <strong>Premium Models:</strong> Claude 3.5 Sonnet</li>
            <li>✓ <strong>Premium Models:</strong> GPT-4o</li>
          </ul>
          <button onClick={handleCheckout} disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
            {loading ? 'Redirecting...' : 'Upgrade Now'}
          </button>
        </div>

        {/* Enterprise */}
        <div className="surface" style={{ flex: '1 1 300px', padding: '2.5rem 2rem', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Enterprise</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Custom</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, color: 'var(--text-dim)', fontSize: '0.9375rem' }}>
            <li>✓ Unlimited questions</li>
            <li>✓ Bring Your Own Keys (BYOK)</li>
            <li>✓ Priority Support</li>
          </ul>
          <a href="mailto:support@nextagent.site" className="btn btn-ghost" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>Contact Us</a>
        </div>

      </div>
    </div>
  );
}
