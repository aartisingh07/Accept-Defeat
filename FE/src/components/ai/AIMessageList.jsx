import { useEffect, useRef } from 'react';
import { Bot, User, Sparkles } from 'lucide-react';

// Safe text renderer supporting multiline, bold formatting, and inline code blocks
function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Parse markdown bold **text** and inline `code`
        const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);

        return (
          <p key={lineIdx} className="break-words">
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={partIdx} className="font-bold text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code
                    key={partIdx}
                    className="px-1.5 py-0.5 rounded bg-slate-900 text-purple-300 font-mono text-[11px] border border-purple-500/20"
                  >
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function AIMessageList({ messages, isThinking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth text-left">
      {/* Messages */}
      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                isUser
                  ? 'bg-purple-600/30 border-purple-500/40 text-purple-200'
                  : 'bg-[#10182C] border-purple-500/30 text-purple-400 shadow-[0_0_8px_rgba(139,92,246,0.3)]'
              }`}
            >
              {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4 text-purple-300" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                isUser
                  ? 'bg-gradient-to-r from-purple-700/50 to-purple-900/40 border border-purple-500/40 text-[#F8FAFC]'
                  : 'bg-[#0B1222]/95 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-slate-400">
                <span className="font-semibold">{isUser ? 'You' : 'Accept&Defeat AI'}</span>
                <span>{msg.timestamp || 'Just now'}</span>
              </div>

              <FormattedMessage text={msg.content} />
            </div>
          </div>
        );
      })}

      {/* Typing / Thinking Indicator */}
      {isThinking && (
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#10182C] border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          </div>

          <div className="p-3 rounded-2xl bg-[#0B1222] border border-slate-800 flex items-center gap-1.5 text-xs text-purple-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span className="text-[11px] font-mono">Formulating battle intelligence...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

