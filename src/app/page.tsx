import React from 'react'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center pt-32 pb-20 px-6">
      <div className="grid-bg"></div>
      <div className="hero-glow"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#b87dff] to-[#00d8ff]">
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
              <path d="M7 21V7L14 17.5L21 7V21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight grad-text">NextAgent</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Features</a>
          <a href="#demo" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">How it Works</a>
          <button className="text-sm bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-lg transition-all hidden md:block">
            Support
          </button>
          <a href="#download" className="btn-primary py-2 px-5 text-sm">
            Add to Chrome — Free
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center mt-10 md:mt-20 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-xs text-gray-300 font-medium">Now available for Chrome & Edge</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Tell your browser <br />
          <span className="grad-text">what to do.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          NextAgent is your personal AI browser assistant. Just type or speak your request, and watch it physically click, scroll, and type to get the job done.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#download" className="btn-primary text-lg w-full sm:w-auto justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Add to Chrome
          </a>
          <a href="#demo" className="px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-medium flex items-center gap-2 w-full sm:w-auto justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Watch Demo
          </a>
        </div>
      </div>

      {/* Visual Demo App Simulation */}
      <div className="mt-24 w-full max-w-4xl relative z-10 group" id="demo">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#b87dff] to-[#00d8ff] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="glass p-2 relative">
          <div className="bg-[#0c0d14] rounded-xl overflow-hidden border border-white/5">
            {/* Browser Header */}
            <div className="bg-[#15161e] border-b border-white/5 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex-1 bg-black/40 rounded-md py-1.5 px-3 text-xs text-gray-500 flex items-center justify-center">
                <svg className="mr-2 opacity-50" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                google.com
              </div>
            </div>
            {/* Browser Content Simulated */}
            <div className="h-[400px] flex items-center justify-center relative bg-white">
              <div className="text-center">
                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google" className="h-16 mx-auto mb-6" />
                <div className="w-[400px] h-11 rounded-full border border-gray-200 flex items-center px-4 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <span className="ml-3 text-gray-800 text-sm">latest AI news</span>
                  {/* Cursor simulation */}
                  <div className="w-px h-5 bg-black ml-1 animate-pulse"></div>
                </div>
              </div>

              {/* Extension Overlay Simulation (New Widget UI) */}
              <div className="absolute right-4 top-4 w-[340px] bg-[#191A1D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
                 <div className="flex items-center justify-between px-4 py-3 bg-[#202226] border-b border-white/5">
                   <div className="flex items-center gap-2">
                     <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                       <path d="M7 21V7L14 17.5L21 7V21" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                     <span className="font-semibold text-sm text-white">NexAgent</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                     <div className="w-6 h-6 rounded flex border border-white/5 opacity-50 justify-center items-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"><path d="M5 12h14"/></svg></div>
                     <div className="w-6 h-6 rounded flex border border-white/5 opacity-50 justify-center items-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"><path d="M18 6L6 18M6 6l12 12"/></svg></div>
                   </div>
                 </div>
                 <div className="p-4 space-y-4">
                   <div className="flex justify-end">
                     <div className="bg-[#2b2d31] text-white px-3 py-2 rounded-xl text-[13px] max-w-[80%]">Compile the latest AI news.</div>
                   </div>
                   <div className="flex flex-col gap-2">
                     <div className="text-gray-100 text-[13px] px-1">Taking action on Google.</div>
                     <div className="bg-[#202226] border border-white/10 rounded-xl overflow-hidden">
                       <div className="px-3 py-2 text-[11px] text-gray-300 flex justify-between items-center bg-white/5">
                         <div className="flex items-center gap-2"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> Investigating Google...</div>
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg>
                       </div>
                       <div className="p-3 text-[10px] space-y-2 border-t border-white/5 font-mono text-gray-400">
                         <div className="flex items-center gap-2 text-[#2DD4BF]"><span className="text-xs">✓</span> Typed "latest AI news"</div>
                         <div className="flex items-center gap-2 text-[#2DD4BF]"><span className="text-xs">✓</span> Pressed Enter</div>
                         <div className="flex items-center gap-2 text-white animate-pulse"><span className="text-xs">●</span> Extracting results...</div>
                       </div>
                     </div>
                   </div>
                   <div className="h-4"></div>
                 </div>
                 {/* Input area */}
                 <div className="p-3 bg-[#191A1D]">
                   <div className="border border-white/10 bg-[#202226] rounded-xl flex items-center p-2 gap-2">
                     <div className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white flex items-center gap-1">✨ Smart <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg></div>
                     <div className="flex-1 text-[12px] text-gray-500">Ask anything...</div>
                     <div className="bg-[#2DD4BF] rounded p-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#202226" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-32 max-w-5xl w-full" id="features">
        <h2 className="text-3xl font-bold text-center mb-12">Designed to do the boring work.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl mb-4">🎤</div>
            <h3 className="font-semibold text-lg mb-2">Voice & Text Control</h3>
            <p className="text-gray-400 text-sm">Hold the microphone button and just tell NextAgent what you want. It speaks your language.</p>
          </div>
          <div className="glass p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl mb-4">🛡️</div>
            <h3 className="font-semibold text-lg mb-2">Safe Mode</h3>
            <p className="text-gray-400 text-sm">Before it clicks or types, it tells you exactly what it's going to do. You stay in control.</p>
          </div>
          <div className="glass p-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl mb-4">⚡</div>
            <h3 className="font-semibold text-lg mb-2">Physical Automation</h3>
            <p className="text-gray-400 text-sm">It doesn't just scrape text. It moves the mouse, clicks buttons, and types into fields naturally.</p>
          </div>
        </div>
      </div>

      {/* Setup / Download call to action */}
      <div className="mt-32 max-w-3xl w-full text-center glass p-10 relative overflow-hidden" id="download">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>
        
        <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to hire your AI assistant?</h2>
        <p className="text-gray-400 mb-8 relative z-10">Join thousands of users automating their daily browser tasks.</p>
        <button className="btn-primary text-lg relative z-10 shadow-[0_0_30px_rgba(155,100,255,0.3)]">
          Download NextAgent
        </button>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mt-32 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
           <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
             <path d="M7 21V7L14 17.5L21 7V21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
           <span className="font-semibold text-sm">NextAgent</span>
        </div>
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} NextAgent. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="mailto:support@nextagent.site" className="hover:text-white transition-colors">Contact Support</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>
    </main>
  )
}
