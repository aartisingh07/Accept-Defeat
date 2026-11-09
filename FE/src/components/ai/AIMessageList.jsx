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
                  <strong key={partIdx} className="font-bold">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code
                    key={partIdx}
                    className="px-1.5 py-0.5 rounded bg-[#FFFFFF] text-[#1D2D44] font-mono text-[11px] border border-[#DDDCCF]"
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
                  ? 'bg-[#1D2D44] border-[#0D1321] text-[#F0EBD8]'
                  : 'bg-[#F7F5EF] border-[#DDDCCF] text-[#1D2D44] shadow-sm'
              }`}
            >
              {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4 text-[#1D2D44]" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                isUser
                  ? 'bg-[#1D2D44] border border-[#0D1321] text-[#F0EBD8]'
                  : 'bg-[#F7F5EF] border border-[#DDDCCF] text-[#0D1321]'
              }`}
            >
              <div
                className={`flex items-center justify-between gap-2 mb-1 text-[10px] ${
                  isUser ? 'text-[#748CAB]' : 'text-[#3E5C76]'
                }`}
              >
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
          <div className="w-7 h-7 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#1D2D44] flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#1D2D44] animate-spin" />
          </div>
          <div className="rounded-2xl px-4 py-2.5 bg-[#F7F5EF] border border-[#DDDCCF] text-xs text-[#3E5C76] flex items-center gap-1.5 shadow-sm">
            <span>Thinking</span>
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
