'use client';

import { useState } from 'react';
import AuditResults from '@/components/AuditResults';

export default function AuditForm() {
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'full' | 'design' | 'security'>('full');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch(`/api/auditor?url=${encodeURIComponent(url)}&type=${type}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Audit failed');
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-caption">
            Website URL
          </label>
          <div className="flex gap-3">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 bg-bg-subtle/50 border border-border rounded-xl text-white placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-3 bg-accent text-bg font-semibold rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Auditing...' : 'Audit'}
            </button>
          </div>
        </div>

        {/* Audit Type Toggle */}
        <div className="space-y-2">
          <span className="block text-sm font-medium text-caption">Audit Type</span>
          <div className="flex gap-2">
            {(['full', 'design', 'security'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  type === t
                    ? 'bg-accent text-bg'
                    : 'bg-bg-subtle/50 text-caption hover:text-white'
                }`}
              >
                {t === 'full' ? 'Full Audit' : t === 'design' ? 'Design Only' : 'Security Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 text-caption">
              <svg className="animate-spin h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing {type === 'full' ? 'design & security' : type}... This may take 10-30 seconds.
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
      </form>

      {/* Results */}
      {results && <AuditResults results={results} />}
    </div>
  );
}
