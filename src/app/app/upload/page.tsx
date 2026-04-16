'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
const MAX_SIZE_MB = 20

export default function UploadPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const [dragging, setDragging] = useState(false)

  function handleFile(f: File) {
    setError('')
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Only PDF, Word (.docx), or plain text files are supported.')
      return
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`)
      return
    }
    setFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setStatus('uploading')
    setProgress('Uploading file...')
    setError('')

    const form = new FormData()
    form.append('file', file)

    try {
      setProgress('Processing and extracting text...')
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Upload failed'); setStatus('error'); return }
      setStatus('done')
      setProgress('Done!')
      setTimeout(() => router.push(`/app/doc/${data.id}`), 800)
    } catch (e) {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1.5rem' }}>
      
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <a href="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '2rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to documents
        </a>

        <h1 style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>Upload a document</h1>
        <p className="text-caption" style={{ marginBottom: '2rem' }}>PDF, Word (.docx), or plain text · Max {MAX_SIZE_MB}MB</p>

        {/* Drop zone */}
        <div
          id="upload-drop-zone"
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          style={{
            border: `2px dashed ${dragging ? 'var(--accent)' : file ? 'var(--success)' : 'var(--border-hi)'}`,
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(124,109,250,0.04)' : 'var(--bg-card)',
            transition: 'all 0.15s ease',
            marginBottom: '1.5rem',
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" hidden onChange={e => { const f = e.target.files?.[0]; if(f) handleFile(f) }} />
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{file ? '✅' : '📄'}</div>
          {file ? (
            <>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{file.name}</p>
              <p className="text-caption">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Drop a file here or click to browse</p>
              <p className="text-caption">PDF, DOCX, TXT supported</p>
            </>
          )}
        </div>

        {error && (
          <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {status === 'uploading' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            <div className="spinner"/>
            {progress}
          </div>
        )}

        {status === 'done' && (
          <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Processed successfully. Opening chat...
          </div>
        )}

        <button
          id="upload-submit-btn"
          onClick={handleUpload}
          disabled={!file || status === 'uploading' || status === 'done'}
          className="btn btn-primary"
          style={{ width: '100%', opacity: (!file || status === 'uploading' || status === 'done') ? 0.5 : 1, cursor: (!file || status === 'uploading') ? 'not-allowed' : 'pointer' }}
        >
          {status === 'uploading' ? 'Processing...' : 'Upload & Process'}
        </button>
      </div>
    </div>
  )
}
