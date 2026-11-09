import { Minus, X, Sparkles } from 'lucide-react';

export default function AIChatHeader({ onClose, onMinimize }) {
  return (
    <div className="px-4 py-3.5 bg-[#F7F5EF] border-b border-[#DDDCCF] flex items-center justify-between shrink-0 rounded-t-3xl select-none text-[#0D1321]">
      {/* AI Avatar & Title */}
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-full bg-[#1D2D44] p-0.5 shadow-sm">
          <div className="w-full h-full rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#1D2D44]">
            <Sparkles className="w-4 h-4 text-[#1D2D44]" />
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#55765B] border-2 border-[#FFFFFF]" />
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#0D1321] tracking-wide">
              Accept&amp;Defeat AI
            </h3>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#748CAB]/15 text-[#1D2D44] border border-[#748CAB]/30">
              Battle Assistant
            </span>
          </div>
          <p className="text-[10px] text-[#3E5C76] font-normal">
            Your coding battle companion
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onMinimize}
          className="p-1.5 rounded-lg text-[#3E5C76] hover:text-[#0D1321] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
          aria-label="Minimize AI Assistant"
          title="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#3E5C76] hover:text-[#0D1321] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
          aria-label="Close AI Assistant"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
