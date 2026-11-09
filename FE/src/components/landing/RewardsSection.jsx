import { Award, Coins, Flame, Shield, Trophy, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RewardsSection() {
  const navigate = useNavigate();

  const rewardItems = [
    {
      title: 'Reputation Points',
      subtitle: 'Measure your algorithmic depth',
      description:
        'Earn points for each verified test pass, speed bonus, and accepted challenge. Points drive your global ranking and unlock high-stakes tournament tiers.',
      icon: Flame,
      stat: '50-500 pts / solve',
      color: 'text-[#A67C42] bg-[#F5EEDF] border-[#A67C42]/30',
    },
    {
      title: 'Arena Coins',
      subtitle: 'Platform currency for achievements',
      description:
        'Accumulate coins through daily problem-solving streaks, peer review bounties, and winning 1v1 duels. Use them to customize your profile card.',
      icon: Coins,
      stat: 'Earnable Daily',
      color: 'text-[#1D2D44] bg-[#F7F5EF] border-[#DDDCCF]',
    },
    {
      title: 'Cryptographic Badges',
      subtitle: 'Verified proof-of-skill credentials',
      description:
        'Collect badges representing genuine engineering milestones—such as "Concurrency Slayer", "Bug Hunter Elite", and "Memory Leak Exterminator".',
      icon: Award,
      stat: '30+ Unlockable',
      color: 'text-[#748CAB] bg-[#F7F5EF] border-[#DDDCCF]',
    },
    {
      title: 'Competitive Ranks',
      subtitle: 'From Warrior to Grandmaster',
      description:
        'Rise through 6 competitive tiers based on true ELO performance. Showcase your rank on your public developer profile and GitHub bio.',
      icon: Shield,
      stat: '6 Prestige Tiers',
      color: 'text-[#3E5C76] bg-[#F7F5EF] border-[#DDDCCF]',
    },
    {
      title: 'Battle Achievements',
      subtitle: 'Permanent milestones in your journey',
      description:
        'Complete milestones like "First Blood Solve", "Clean Architecture", and "10-Win Streak" to establish a verified portfolio of technical triumphs.',
      icon: Trophy,
      stat: 'Achievement Feed',
      color: 'text-[#55765B] bg-[#EAF0E7] border-[#55765B]/30',
    },
  ];

  return (
    <section id="rewards" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DDDCCF] text-[#0D1321] text-xs font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#748CAB]" />
            <span>Progression System</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1321] tracking-tight">
            Every Challenge Counts
          </h2>

          <p className="text-sm sm:text-base text-[#3E5C76] leading-relaxed font-normal">
            Every line of code you optimize, every bug you crush, and every duel you win earns meaningful reputation and permanent achievements on your profile.
          </p>
        </div>

        {/* 5 Reward Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewardItems.map((r, idx) => {
            const Icon = r.icon;
            const isFullWidth = idx === 4; // Center the 5th item on larger screens
            return (
              <div
                key={r.title}
                className={`rounded-3xl p-6 bg-[#FFFFFF] border border-[#DDDCCF] hover:border-[#748CAB] transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_8px_rgba(13,19,33,0.04)] hover:shadow-[0_8px_20px_rgba(13,19,33,0.08)] flex flex-col justify-between group ${
                  isFullWidth ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${r.color} group-hover:scale-110 transition-transform shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#F7F5EF] border border-[#DDDCCF] text-[#0D1321]">
                      {r.stat}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[#1D2D44] group-hover:text-[#0D1321] transition-colors">
                      {r.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#748CAB]">{r.subtitle}</div>
                    <p className="text-xs text-[#687386] leading-relaxed pt-1">
                      {r.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#DDDCCF] flex items-center gap-1.5 text-[11px] text-[#687386]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#55765B]" />
                  <span>Permanent profile recognition</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progression Callout */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D1321] hover:text-[#1D2D44] px-5 py-2.5 rounded-full bg-[#FFFFFF] border border-[#DDDCCF] hover:bg-[#F7F5EF] transition-all cursor-pointer shadow-sm"
          >
            <span>Begin Your Progression Journey</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1D2D44]" />
          </button>
        </div>

      </div>
    </section>
  );
}
