import { Compass, PlusCircle, Trophy, Bug } from 'lucide-react';

const SUGGESTIONS = [
  {
    label: 'Recommend challenges for my skills',
    icon: Compass,
  },
  {
    label: 'Help me create a challenge',
    icon: PlusCircle,
  },
  {
    label: 'Explain the point system',
    icon: Trophy,
  },
  {
    label: 'Help me debug my code',
    icon: Bug,
  },
];

export default function SuggestedPrompts({ onSelectPrompt, disabled = false }) {
  return (
    <div className="p-3 bg-[#0A1020]/90 rounded-2xl border border-purple-500/15 space-y-2 text-left">
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        Suggested battle prompts:
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {SUGGESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPrompt(item.label)}
              className="w-full text-left p-2 rounded-xl bg-[#10182C] hover:bg-[#182442] border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-white transition-all duration-150 flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
            >
              <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/25 group-hover:text-purple-300 transition-colors shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="leading-snug">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

