"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function InteractiveWidget() {
  const [step, setStep] = useState(0)
  const [inputVal, setInputVal] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    if (step === 1) {
      const text = "Compile the latest AI news"
      let i = 0
      setInputVal('')
      const iv = setInterval(() => {
        setInputVal(text.slice(0, i + 1))
        i++
        if (i === text.length) { clearInterval(iv); setTimeout(() => setStep(2), 400) }
      }, 45)
      return () => clearInterval(iv)
    }
    if (step === 2) { const iv = setTimeout(() => setStep(3), 1400); return () => clearTimeout(iv) }
    if (step === 3) { const iv = setTimeout(() => setStep(4), 1600); return () => clearTimeout(iv) }
  }, [step])

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.3 }}
      style={{ boxShadow: '0 32px 64px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07), 0 0 48px -8px rgba(45,212,191,0.15)' }}
      className="w-full max-w-[380px] bg-[#191A1D] rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#202226] border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="url(#wg)"/>
            <path d="M7 21V7L14 17.5L21 7V21" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="wg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#0891b2"/></linearGradient></defs>
          </svg>
          <span className="font-semibold text-sm text-white">NexAgent</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 ml-1">Pro</span>
        </div>
        <div className="flex gap-1.5">
          {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{background:c}} className="w-2.5 h-2.5 rounded-full opacity-60"/>)}
        </div>
      </div>

      {/* Chat Body */}
      <div className="p-4 space-y-4 min-h-[200px]">
        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <p className="text-white text-lg font-semibold">Hi, what should we dive into?</p>
            <p className="text-white/40 text-xs">I can control your browser and research anything.</p>
            <button onClick={() => setStep(1)} className="mt-2 px-4 py-1.5 rounded-full border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-medium hover:bg-[#2DD4BF]/10 transition-colors">
              ▶ Try a live demo
            </button>
          </motion.div>
        )}

        {step > 1 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-end">
            <div className="bg-[#2b2d31] text-white px-3.5 py-2 rounded-2xl rounded-tr-sm text-[13px] max-w-[80%]">Compile the latest AI news</div>
          </motion.div>
        )}

        {step > 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
            <p className="text-white/80 text-[13px] px-1">Taking action on Google.</p>
            <div className="bg-[#202226] border border-white/8 rounded-xl overflow-hidden">
              <button onClick={() => setIsExpanded(e => !e)} className="w-full px-3 py-2.5 flex items-center justify-between text-[11px] text-white/70 font-medium hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  {step === 4
                    ? <span className="text-[#2DD4BF]">✓</span>
                    : <svg className="animate-spin text-[#2DD4BF]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                  }
                  Investigating Google...
                </div>
                <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </motion.span>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-3 border-t border-white/5 text-[10.5px] font-mono space-y-1.5 text-white/50">
                      <div className="flex items-center gap-2 text-[#2DD4BF]"><span>✓</span> Navigated to google.com</div>
                      {step >= 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[#2DD4BF]"><span>✓</span> Typed "latest AI news"</motion.div>}
                      {step === 4
                        ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[#2DD4BF]"><span>✓</span> Extracted 15 articles</motion.div>
                        : step >= 3 && <div className="flex items-center gap-2 text-white/60 animate-pulse"><span>●</span> Clicking Search...</div>
                      }
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
            <div className="bg-[#202226] border border-white/8 text-white p-3 rounded-xl text-[12px] space-y-1.5 text-white/70">
              <p>• OpenAI announces GPT-5 training run...</p>
              <p>• Google DeepMind releases AlphaFold 3...</p>
              <p>• AI agents now match senior engineers on benchmarks...</p>
            </div>
            <button onClick={() => { setStep(0); setInputVal('') }} className="text-[11px] text-white/30 hover:text-white/60 self-center mt-1 transition-colors">↺ Reset demo</button>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 bg-[#202226] border border-white/8 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1 text-[10px] bg-white/8 border border-white/8 px-2 py-1 rounded-full text-white/60 whitespace-nowrap">
            ✨ Smart <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <input readOnly value={inputVal} placeholder="Ask anything..." className="flex-1 text-[13px] bg-transparent outline-none text-white placeholder-white/30 min-w-0"/>
          <button className="bg-[#2DD4BF] text-[#06070e] p-1.5 rounded-lg flex-shrink-0 hover:bg-[#20b2a6] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#06070e] text-white overflow-x-hidden">

      {/* ═══ NAV ═══════════════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="url(#ng)"/>
            <path d="M7 21V7L14 17.5L21 7V21" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="ng" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#0891b2"/></linearGradient></defs>
          </svg>
          <span className="font-bold text-base tracking-tight">NextAgent</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="https://github.com/higanste/NextAgent" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block">GitHub</a>
          <a href="#download" className="bg-white text-[#06070e] text-sm font-semibold px-4 py-2 rounded-full hover:scale-[1.03] active:scale-[0.97] transition-transform">
            Install Free
          </a>
        </div>
      </nav>

      {/* Top gradient blur */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-[#06070e] to-transparent z-40"/>

      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6">
        {/* Glow meshes */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"/>
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none"/>

        <div className="relative max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 backdrop-blur-sm text-xs text-white/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
              Now live — Chrome &amp; Edge
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.08] tracking-tight">
              Tell your browser<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">what to do.</span>
            </h1>

            <p className="text-lg text-white/55 leading-relaxed max-w-sm">
              NextAgent is a Chrome extension that physically clicks, types, and scrolls on your behalf. Just describe your goal in plain English.
            </p>

            <div className="flex flex-wrap gap-3 pt-2" id="download">
              <a
                href="https://github.com/higanste/NextAgent"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2DD4BF] text-[#06070e] font-bold px-5 py-3 rounded-full text-sm shadow-[0_0_24px_rgba(45,212,191,0.4)] hover:shadow-[0_0_36px_rgba(45,212,191,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Extension
              </a>
              <a
                href="https://github.com/higanste/NextAgent"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/10 bg-white/4 text-white font-semibold px-5 py-3 rounded-full text-sm hover:bg-white/8 active:scale-[0.98] transition-all"
              >
                View Source
              </a>
            </div>

            <div className="flex items-center gap-5 text-xs text-white/35 pt-2">
              {['Free forever','No accounts required','Safe Mode included'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Live Widget Demo */}
          <div className="flex justify-center lg:justify-end">
            <InteractiveWidget />
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0B0C11]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Designed to do the boring work.</h2>
            <p className="text-white/50 max-w-md mx-auto">Everything that's tedious, repetitive, or time-consuming on the web — NextAgent handles it.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: '🎤', color: 'violet', title: 'Voice & Text Control', body: 'Hold the mic and tell NextAgent what you want. It understands natural language — no special commands, no syntax.' },
              { icon: '🛡️', color: 'cyan', title: 'Safe Mode', body: 'Before clicking or submitting anything, NextAgent will show you a preview and wait for your approval.' },
              { icon: '⚡', color: 'emerald', title: 'Physical Automation', body: 'It doesn\'t just scrape data. It moves the mouse, clicks buttons, fills out forms — exactly like a human would.' },
            ].map(({ icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/6 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-white/5 border border-white/8">{icon}</div>
                <h3 className="text-white font-semibold text-lg">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/8 rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-600/10 pointer-events-none"/>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative z-10">Ready to hire your AI assistant?</h2>
          <p className="text-white/50 mb-8 relative z-10">Free, open-source, and runs entirely in Chrome. No data leaves your machine.</p>
          <a
            href="https://github.com/higanste/NextAgent"
            target="_blank" rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-2 bg-[#2DD4BF] text-[#06070e] font-bold px-8 py-3.5 rounded-full text-sm shadow-[0_0_30px_rgba(45,212,191,0.3)] hover:shadow-[0_0_50px_rgba(45,212,191,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Get NexAgent — It&apos;s Free
          </a>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-white/30 text-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} NextAgent. Open source.</span>
          <div className="flex gap-6">
            <a href="mailto:support@nextagent.site" className="hover:text-white/60 transition-colors">Contact</a>
            <a href="https://github.com/higanste/NextAgent" className="hover:text-white/60 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
