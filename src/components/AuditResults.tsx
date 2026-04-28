'use client';

interface AuditResultsProps {
  results: {
    url: string;
    auditedAt: string;
    overall?: number;
    design?: {
      score: number;
      issues: Array<{ severity: string; category: string; issue: string; fix: string }>;
      strengts: string[];
      summary: string;
    };
    security?: {
      score: number;
      vulnerabilities: Array<{ severity: string; category: string; issue: string; fix: string }>;
      passed: string[];
      summary: string;
    };
  };
}

export default function AuditResults({ results }: { results: AuditResultsProps['results'] }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'major': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'minor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const ScoreGauge = ({ score, label }: { score: number; label: string }) => (
    <div className="text-center space-y-2">
      <div className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</div>
      <div className="text-sm text-caption">{label}</div>
      <div className="w-full bg-bg-subtle/50 rounded-full h-2">
        <div
          className={`h-full rounded-full transition-all ${score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overall Score (Full Audit) */}
      {results.overall && (
        <div className="surface p-8 rounded-2xl text-center">
          <h2 className="text-heading mb-6">Overall Score</h2>
          <ScoreGauge score={results.overall} label="Overall" />
          <p className="text-caption mt-4">{results.url}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Design Results */}
        {results.design && (
          <div className="surface p-6 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold mb-4">Design Audit</h3>
            <ScoreGauge score={results.design.score} label="Design Score" />

            {results.design.summary && (
              <p className="text-caption italic">{results.design.summary}</p>
            )}

            {/* Strengths */}
            {results.design.strengths?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {results.design.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-caption flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Issues */}
            {results.design.issues?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-caption mb-2">Issues Found</h4>
                <div className="space-y-3">
                  {results.design.issues.map((issue, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase">{issue.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{issue.issue}</p>
                      <p className="text-xs text-caption"><strong>Fix:</strong> {issue.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Results */}
        {results.security && (
          <div className="surface p-6 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold mb-4">Security Scan</h3>
            <ScoreGauge score={results.security.score} label="Security Score" />

            {results.security.summary && (
              <p className="text-caption italic">{results.security.summary}</p>
            )}

            {/* Passed Checks */}
            {results.security.passed?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2">Passed Checks</h4>
                <ul className="space-y-1">
                  {results.security.passed.map((p, i) => (
                    <li key={i} className="text-sm text-caption flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vulnerabilities */}
            {results.security.vulnerabilities?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-caption mb-2">Vulnerabilities</h4>
                <div className="space-y-3">
                  {results.security.vulnerabilities.map((vuln, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${getSeverityColor(vuln.severity)}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase">{vuln.category}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{vuln.issue}</p>
                      <p className="text-xs text-caption"><strong>Fix:</strong> {vuln.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Audit Metadata */}
      <div className="text-center text-xs text-dim">
        Audited at {new Date(results.auditedAt).toLocaleString()} • {results.url}
      </div>
    </div>
  );
}
