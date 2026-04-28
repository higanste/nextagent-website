import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AuditForm from '@/components/AuditForm';

export default async function AuditPage() {
  const session = await auth();
  if (!session?.user) redirect('/');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent rounded-full filter blur-[150px] opacity-[0.05] pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success rounded-full filter blur-[150px] opacity-[0.05] pulse-glow" style={{ animationDelay: '-4s' }} />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="NextAgent" className="w-9 h-9 object-contain" />
            <span className="text-xl font-bold tracking-tight">NextAgent</span>
          </a>
          <div className="flex items-center gap-8">
            <a href="/app" className="text-caption hover:text-white transition-colors">Dashboard</a>
            <a href="/pricing" className="text-caption hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-bg-subtle/50 text-caption mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            AI-Powered Site Auditor
          </div>
          <h1 className="text-display mb-4">
            Audit Your <span className="text-accent-hi">Website</span>
          </h1>
          <p className="text-body max-w-2xl mx-auto leading-relaxed">
            Get instant design & security analysis powered by Impeccable design system and Vibe Security patterns.
          </p>
        </div>

        {/* Audit Form */}
        <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
          <AuditForm />
        </div>
      </main>
    </div>
  );
}
