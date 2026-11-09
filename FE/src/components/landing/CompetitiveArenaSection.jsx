import { Trophy, Swords, ShieldCheck, Flame, ArrowRight, Sparkles, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CompetitiveArenaSection() {
  const navigate = useNavigate();

  const previewLeaderboard = [
    { rank: 1, name: 'Alex Rivera', handle: '@alex_r', pts: '4,890', tier: 'Grandmaster', winRate: '88%', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
    { rank: 2, name: 'Sarah Chen', handle: '@sarah_c', pts: '4,450', tier: 'Master', winRate: '84%', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { rank: 3, name: 'Dmitri Volkov', handle: '@dmitri_v', pts: '4,120', tier: 'Master', winRate: '81%', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { rank: 4, name: 'Priya Nair', handle: '@priya_codes', pts: '3,890', tier: 'Challenger', winRate: '79%', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  ];

  return (
    <section id="competitive-arena" className="py-20 md:py-28 relative bg-[#1D2D44] text-[#F0EBD8] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#748CAB]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0D1321]/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Competitive Value Propositions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#152237] border border-[#34465C] text-[#748CAB] text-xs font-mono shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-[#748CAB]" />
              <span>Rankings & Progression</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0EBD8] tracking-tight">
              Prove Your Skills. Earn Your Rank.
            </h2>

            <p className="text-sm sm:text-base text-[#748CAB] leading-relaxed font-normal">
              Accept&Defeat turns problem-solving into a sport. Climb through competitive tiers, defeat opponents in live hack duels, and gain public developer reputation that speaks for itself.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#152237] border border-[#34465C] flex items-start gap-3.5 text-left shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#1D2D44] text-[#748CAB] border border-[#34465C] flex items-center justify-center shrink-0 mt-0.5">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F0EBD8]">Skill-Based ELO Matchmaking</h4>
                  <p className="text-xs text-[#748CAB] pt-0.5 leading-relaxed">
                    Battle engineers at your exact level. Fair, synchronized matchups test true problem-solving capabilities without fluff.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#152237] border border-[#34465C] flex items-start gap-3.5 text-left shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#1D2D44] text-[#748CAB] border border-[#34465C] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F0EBD8]">Verifiable Proof of Mastery</h4>
                  <p className="text-xs text-[#748CAB] pt-0.5 leading-relaxed">
                    Every solved challenge records execution efficiency, test passes, and memory footprint directly on your public developer profile.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#152237] border border-[#34465C] flex items-start gap-3.5 text-left shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#1D2D44] text-[#748CAB] border border-[#34465C] flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F0EBD8]">Seasonal Sprints & Rewards</h4>
                  <p className="text-xs text-[#748CAB] pt-0.5 leading-relaxed">
                    Participate in weekend battle sprints with multiplier rewards, unlock limited-edition badges, and claim seasonal arena trophies.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-[#1D2D44] bg-[#F0EBD8] hover:bg-[#FFFFFF] inline-flex items-center gap-2 cursor-pointer shadow-md transition-all font-bold"
              >
                <span>Join The Arena Leaderboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Leaderboard Card Preview */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl bg-[#152237] border border-[#34465C] p-6 shadow-2xl relative space-y-5">
              
              {/* Leaderboard Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#34465C]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#1D2D44] border border-[#34465C] text-[#748CAB]">
                    <Medal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F0EBD8]">Global Arena Rankings</h3>
                    <p className="text-[11px] text-[#748CAB] font-mono">Season 4 • Top Competitors</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#1D2D44] border border-[#34465C] text-[#748CAB]">
                  Preview Mode
                </span>
              </div>

              {/* Ranks List */}
              <div className="space-y-2.5">
                {previewLeaderboard.map((u) => {
                  const isTop1 = u.rank === 1;
                  const isTop2 = u.rank === 2;
                  const isTop3 = u.rank === 3;
                  return (
                    <div
                      key={u.rank}
                      className={`p-3 rounded-2xl flex items-center justify-between text-xs transition-colors border ${
                        isTop1
                          ? 'bg-[#1D2D44] border-[#748CAB]/60 text-[#F0EBD8]'
                          : isTop2
                          ? 'bg-[#1D2D44]/70 border-[#34465C] text-[#F0EBD8]'
                          : 'bg-[#152237] border-[#34465C] text-[#F0EBD8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono font-bold w-6 text-center ${
                            isTop1
                              ? 'text-[#F0EBD8] text-sm'
                              : isTop2
                              ? 'text-[#748CAB] text-sm'
                              : isTop3
                              ? 'text-[#748CAB] text-sm'
                              : 'text-[#687386]'
                          }`}
                        >
                          #{u.rank}
                        </span>

                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-xl object-cover border border-[#34465C]"
                        />

                        <div>
                          <div className="font-bold text-[#F0EBD8] flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isTop1 && <Medal className="w-3 h-3 text-[#748CAB]" />}
                          </div>
                          <div className="text-[10px] font-mono text-[#748CAB]">{u.handle}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-[#F0EBD8]">{u.pts} pts</div>
                        <div className="text-[10px] font-mono text-[#748CAB]">{u.tier} • {u.winRate}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Invitation to Rank Banner */}
              <div className="p-3.5 rounded-2xl bg-[#1D2D44] border border-dashed border-[#34465C] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#F0EBD8]">
                  <Sparkles className="w-4 h-4 text-[#748CAB] shrink-0" />
                  <span>Ready to claim your spot? Your starting rank awaits.</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="px-3 py-1.5 rounded-xl bg-[#F0EBD8] hover:bg-[#FFFFFF] text-[#1D2D44] font-bold text-[11px] cursor-pointer shrink-0 transition-colors shadow-sm"
                >
                  Enter
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
