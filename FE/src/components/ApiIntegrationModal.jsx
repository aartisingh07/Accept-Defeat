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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22 }}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-[#FFFFFF] border border-[#DDDCCF] shadow-2xl overflow-hidden text-left text-[#0D1321]"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[#F7F5EF] border-b border-[#DDDCCF] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#DDDCCF] text-[#1D2D44]">
                  <Server className="w-5 h-5 text-[#1D2D44]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0D1321] flex items-center gap-2">
                    Backend Architecture &amp; Integration Specs
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAF0E7] text-[#55765B] border border-[#55765B]/30 font-semibold">
                      Node + Express + MongoDB
                    </span>
                  </h3>
                  <p className="text-xs text-[#3E5C76]">
                    Defined contracts for connecting your REST or GraphQL backend
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-[#687386] hover:text-[#0D1321] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#0D1321]">
              <div className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#0D1321] leading-relaxed">
                <p className="font-bold text-[#1D2D44] mb-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#3E5C76]" /> Architectural Boundary
                </p>
                The frontend code isolates API operations in <code className="text-[#1D2D44] font-bold font-mono">src/services/authService.js</code>. All form submissions emit real HTTP requests to <code className="text-[#1D2D44] font-bold font-mono">VITE_API_URL</code> (defaults to <code className="text-[#1D2D44] font-bold font-mono">http://localhost:5000/api</code>).
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#0D1321] uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#1D2D44]" />
                  REST API Endpoints Specification
                </h4>

                {endpoints.map((ep, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          ep.method === 'POST' ? 'bg-[#1D2D44] text-[#F0EBD8]' : 'bg-[#3E5C76] text-[#F0EBD8]'
                        }`}>
                          {ep.method}
                        </span>
                        <code className="text-xs text-[#0D1321] font-mono font-bold">{ep.path}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(ep.body, idx)}
                        className="text-[#687386] hover:text-[#1D2D44] transition-colors p-1 cursor-pointer"
                        title="Copy body payload"
                      >
                        {copiedIndex === idx ? (
                          <span className="flex items-center gap-1 text-[10px] text-[#55765B] font-semibold">
                            <Check className="w-3 h-3" /> Copied
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-[#3E5C76] leading-normal">{ep.desc}</p>

                    <div className="rounded-lg bg-[#FFFFFF] p-2.5 font-mono text-[11px] text-[#0D1321] overflow-x-auto border border-[#DDDCCF]">
                      <pre>{ep.body}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#F7F5EF] border-t border-[#DDDCCF] flex items-center justify-between">
              <span className="text-[11px] text-[#3E5C76]">
                Ready for Node.js / Express / Mongoose deployment
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#F0EBD8] bg-[#1D2D44] hover:bg-[#0D1321] transition-colors cursor-pointer"
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
