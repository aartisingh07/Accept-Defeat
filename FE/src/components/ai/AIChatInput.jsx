import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, RotateCcw } from 'lucide-react';

export default function AIChatInput({ onSendMessage, isThinking, error, onRetry }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || isThinking) return;

    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-3 bg-[#090F1E] border-t border-purple-500/20 shrink-0 rounded-b-3xl space-y-2">
      {/* Error notification banner with retry option */}
      {error && (
        <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300 flex items-center justify-between gap-2">
          <span>{error}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* Input composer form */}
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isThinking}
            placeholder="Ask AI battle companion... (Enter to send, Shift+Enter for new line)"
            className="w-full py-2.5 pl-3 pr-3 rounded-2xl bg-[#0D1528] border border-slate-700/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all resize-none max-h-32 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim() || isThinking}
          className="btn-primary-purple p-2.5 rounded-xl text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md select-none"
          aria-label="Send message"
        >
          {isThinking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      <div className="text-[10px] text-slate-500 text-left flex items-center justify-between px-1">
        <span>Press <strong className="font-mono text-purple-400">Enter ↵</strong> to send</span>
        <span>Accept&amp;Defeat Assistant</span>
      </div>
    </div>
  );
}

