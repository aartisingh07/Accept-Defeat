import { Minus, X, Sparkles } from 'lucide-react';

export default function AIChatHeader({ onClose, onMinimize }) {
  return (
    <div className="px-4 py-3.5 bg-[#090F1E] border-b border-purple-500/20 flex items-center justify-between shrink-0 rounded-t-3xl select-none">
      {/* AI Avatar & Title */}
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
          <div className="w-full h-full rounded-full bg-[#080D1B] flex items-center justify-center text-purple-300">
            <Sparkles className="w-4 h-4 animate-pulse text-purple-300" />
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090F1E]" />
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Accept&amp;Defeat AI
            </h3>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Battle Assistant
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-normal">
            Your coding battle companion
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onMinimize}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Minimize AI Assistant"
          title="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close AI Assistant"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

