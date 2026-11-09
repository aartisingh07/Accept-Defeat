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
    <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#DDDCCF] space-y-2 text-left">
      <div className="text-[10px] font-bold text-[#3E5C76] uppercase tracking-wider">
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
              className="w-full text-left p-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F5EF] border border-[#DDDCCF] hover:border-[#748CAB] text-xs text-[#0D1321] transition-all duration-150 flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm font-medium"
            >
              <div className="p-1 rounded-lg bg-[#F7F5EF] text-[#1D2D44] group-hover:bg-[#1D2D44] group-hover:text-[#F0EBD8] transition-colors shrink-0">
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
