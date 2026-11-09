import { Swords, Trophy, Sparkles, Terminal, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeaturesSection() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Challenge Yourself',
      description: 'Create coding challenges and solve problems created by other developers.',
      detail:
        'Tackle authentic production bugs, concurrency races, memory leaks, and architectural bottlenecks inspired by real open-source systems.',
      icon: Terminal,
      pill: 'Challenge Creator',
      iconBg: 'bg-[#F7F5EF] text-[#1D2D44] border-[#DDDCCF]',
      tags: ['Bug Fixing', 'Edge Cases', 'System Design'],
    },
    {
      title: 'Compete With Developers',
      description: 'Accept challenges, compete, and prove your problem-solving abilities.',
      detail:
        'Step onto the proving grounds. Engage in 1v1 live coding duels, test your speed under pressure, and benchmark your solution against engineers worldwide.',
      icon: Swords,
      pill: 'Real-Time Arena',
      iconBg: 'bg-[#F7F5EF] text-[#3E5C76] border-[#DDDCCF]',
      tags: ['1v1 Duels', 'Live Tests', 'ELO Matchmaking'],
    },
    {
      title: 'Earn Rewards',
      description: 'Collect points, coins, badges, and achievements as you progress.',
      detail:
        'Every victory earns you tangible developer reputation. Unlock prestigious profile badges, climb skill tiers, and build a verified portfolio of solved challenges.',
      icon: Trophy,
      pill: 'Progression & Glory',
      iconBg: 'bg-[#F7F5EF] text-[#A67C42] border-[#DDDCCF]',
      tags: ['Reputation Points', 'Rare Badges', 'Global Rank'],
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DDDCCF] text-[#0D1321] text-xs font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#748CAB]" />
            <span>Core Pillars</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1321] tracking-tight">
            More Than Just Coding
          </h2>

          <p className="text-sm sm:text-base text-[#3E5C76] leading-relaxed font-normal">
            Accept&Defeat turns learning and coding into a competitive experience. Build skills, challenge others, and make every solved problem count.
          </p>
        </div>

        {/* 3 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="relative group rounded-3xl p-7 bg-[#FFFFFF] border border-[#DDDCCF] hover:border-[#748CAB] transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_16px_rgba(13,19,33,0.06)] hover:shadow-[0_12px_28px_rgba(13,19,33,0.1)] flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Icon & Pill Header */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm ${item.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-[#F7F5EF] border border-[#DDDCCF] text-[#0D1321]">
                      {item.pill}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2.5">
                    <h3 className="text-xl font-bold text-[#1D2D44] group-hover:text-[#0D1321] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-[#3E5C76] leading-snug">
                      {item.description}
                    </p>
                    <p className="text-xs text-[#687386] leading-relaxed pt-1">
                      {item.detail}
                    </p>
                  </div>
                </div>

                {/* Tags and CTA */}
                <div className="pt-6 border-t border-[#DDDCCF] mt-6 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#3E5C76] border border-[#DDDCCF]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D2D44] hover:text-[#0D1321] transition-colors cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
