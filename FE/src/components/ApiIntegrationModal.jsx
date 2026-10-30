import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, X, Check, Copy, Terminal, Layers } from 'lucide-react';

export default function ApiIntegrationModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/auth/login',
      desc: 'Authenticates developer via Email or Username + Password. Returns JWT and user profile.',
      body: `{
  "identifier": "alex_dev or alex@code.io",
  "password": "StrongPassword123!"
}`
    },
    {
      method: 'POST',
      path: '/api/auth/signup',
      desc: 'Registers new contestant with validation for username uniqueness & password hash in MongoDB.',
      body: `{
  "username": "coder_x",
  "email": "coder@acceptdefeat.com",
  "password": "StrongPassword123!"
}`
    },
    {
      method: 'POST',
      path: '/api/auth/forgot-password',
      desc: 'Dispatches signed reset token to user email with 15-minute expiration.',
      body: `{
  "email": "coder@acceptdefeat.com"
}`
    },
    {
      method: 'GET',
      path: '/api/auth/oauth/:provider/callback',
      desc: 'Handles GitHub/Google OAuth2 exchange code for user access token.',
      body: `// Query parameters: ?code=XYZ&state=ABC`
    }
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22 }}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-[#101827] border border-purple-500/30 shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(139,92,246,0.2)] overflow-hidden text-left"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[#0E1524] border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                  <Server className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Backend Architecture &amp; Integration Specs
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Node + Express + MongoDB
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defined contracts for connecting your REST or GraphQL backend
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 leading-relaxed">
                <p className="font-semibold text-purple-300 mb-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Architectural Boundary
                </p>
                The frontend code strictly isolates API operations in <code className="text-purple-300 font-mono">src/services/authService.js</code>. All form submissions emit real HTTP requests to <code className="text-purple-300 font-mono">VITE_API_URL</code> (defaults to <code className="text-purple-300 font-mono">http://localhost:5000/api</code>).
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  REST API Endpoints Specification
                </h4>

                {endpoints.map((ep, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#090D1A] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          ep.method === 'POST' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {ep.method}
                        </span>
                        <code className="text-xs text-white font-mono font-semibold">{ep.path}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(ep.body, idx)}
                        className="text-slate-400 hover:text-purple-300 transition-colors p-1"
                        title="Copy body payload"
                      >
                        {copiedIndex === idx ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                            <Check className="w-3 h-3" /> Copied
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-normal">{ep.desc}</p>

                    <div className="rounded-lg bg-[#060810] p-2.5 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800/80">
                      <pre>{ep.body}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#0A0F1D] border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Ready for Node.js / Express / Mongoose deployment
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors cursor-pointer"
              >
                Close Specs
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
