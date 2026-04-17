'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  documentId: string
  documentName: string
  initialRemaining: number
}

export function DocChat({ documentId, documentName, initialRemaining }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState(initialRemaining)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }, [input])

  async function send() {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setError('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)

    const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, question: q, history }),
      })
      const data = (await res.json()) as any;

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setMessages(prev => prev.slice(0, -1)) // remove optimistic user msg
        return
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
      if (data.remaining !== undefined) setRemaining(data.remaining)
    } catch {
      setError('Network error. Please check your connection.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {messages.length === 0 && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: '0.75rem' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p style={{ fontWeight: 500, color: 'var(--text)' }}>Ask anything about this document</p>
            <p className="text-caption">Try: "Summarize this document" or "What are the key points?"</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '0.75rem 1rem',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              color: m.role === 'user' ? '#fff' : 'var(--text)',
              fontSize: '0.9375rem',
              lineHeight: '1.65',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div className="surface" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div className="spinner" style={{ width: '14px', height: '14px' }}/>
              <span className="text-caption">Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--danger)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Input area */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', background: 'var(--bg-subtle)' }}>
        <div className="text-caption" style={{ marginBottom: '0.625rem', textAlign: 'right' }}>
          {remaining} question{remaining !== 1 ? 's' : ''} remaining today
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            id="doc-chat-input"
            className="input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={`Ask about "${documentName}"...`}
            rows={1}
            disabled={loading || remaining <= 0}
            style={{ flex: 1, minHeight: '44px', maxHeight: '160px' }}
          />
          <button
            id="doc-chat-send"
            onClick={send}
            disabled={!input.trim() || loading || remaining <= 0}
            className="btn btn-primary"
            style={{ flexShrink: 0, padding: '0.625rem 1rem', opacity: (!input.trim() || loading || remaining <= 0) ? 0.5 : 1, cursor: (!input.trim() || loading || remaining <= 0) ? 'not-allowed' : 'pointer' }}
          >
            {loading ? <div className="spinner" style={{ width: '16px', height: '16px' }}/> : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            )}
          </button>
        </div>
        <p className="text-caption" style={{ marginTop: '0.5rem' }}>Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
