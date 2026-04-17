import Link from 'next/link';
import { SignInButton } from '@/components/SignInButton';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';


export default async function Home() {
  const session = await auth();
  if (session?.user) redirect('/app');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent rounded-full filter blur-[150px] opacity-[0.05] pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success rounded-full filter blur-[150px] opacity-[0.05] pulse-glow" style={{ animationDelay: '-4s' }} />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="NextAgent" className="w-9 h-9 object-contain" />
            <span className="text-xl font-bold tracking-tight">NextAgent</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/pricing" className="text-caption hover:text-white transition-colors hidden sm:block">Pricing</Link>
            <a href="mailto:support@nextagent.site" className="text-caption hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-bg-subtle/50 text-caption mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Next-gen Audio & Document Analysis
          </div>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl space-y-6 mb-12 animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-display">
            The intelligent agent for your <br className="hidden md:block" />
            <span className="text-accent-hi">unstructured data</span>
          </h1>
          <p className="text-body max-w-2xl mx-auto leading-relaxed">
            Upload PDFs, transcripts, or audio files. NextAgent instantly analyzes the content, allowing you to ask questions and extract insights using advanced 3-tier AI routing.
          </p>
        </div>

        {/* CTA */}
        <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.5s' }}>
          <div className="glass p-1 rounded-2xl">
            <SignInButton />
          </div>
          <p className="mt-4 text-caption flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Free forever for students & researchers
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full animate-fade-in opacity-0" style={{ animationDelay: '0.7s' }}>
          {[
            {
              icon: '🎙️',
              title: 'Audio Insight',
              label: 'Transcribe MP3/WAV instantly with Whisper. Analyze lectures, meetings, and interviews in seconds.'
            },
            {
              icon: '📄',
              title: 'Document Intelligence',
              label: 'Chat with deeply nested PDFs and Word documents. Full citation support and data extraction.'
            },
            {
              icon: '🧠',
              title: 'Tiered Reasoning',
              label: 'Context-aware routing between Llama 3, Claude 3.5, and GPT-4o for optimal speed and accuracy.'
            }
          ].map((feature) => (
            <div key={feature.title} className="surface p-8 text-left group">
              <div className="text-3xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">{feature.title}</h3>
              <p className="text-caption leading-relaxed">{feature.label}</p>
            </div>
          ))}
        </div>

        {/* Device Compatibility Visualization */}
        <div className="mt-32 w-full glass p-12 rounded-3xl overflow-hidden animate-fade-in opacity-0" style={{ animationDelay: '0.9s' }}>
          <div className="text-heading mb-4 text-white">Works where you do.</div>
          <p className="text-caption mb-12">Seamlessly optimized for Chrome, Edge, Safari, Mobile, and iPad.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40">
            {['Chrome', 'Safari', 'Edge', 'iOS', 'Android'].map(name => (
              <span key={name} className="font-bold tracking-widest text-lg">{name.toUpperCase()}</span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 py-12 px-6 border-t border-border bg-bg-subtle/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="NextAgent" className="w-6 h-6 object-contain opacity-50" />
             <span className="text-sm font-bold opacity-50">NextAgent.site</span>
          </div>
          <div className="flex gap-12">
            <Link href="/pricing" className="text-caption hover:text-white transition-opacity italic">Upgrade to Pro</Link>
            <a href="mailto:support@nextagent.site" className="text-caption hover:text-white transition-opacity">support@nextagent.site</a>
          </div>
          <p className="text-[10px] text-dim opacity-30 uppercase tracking-[0.2em]">© {new Date().getFullYear()} Precision Built by Antigravity</p>
        </div>
      </footer>
    </div>
  );
}
