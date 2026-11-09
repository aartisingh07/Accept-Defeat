import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Terminal, Award } from 'lucide-react';
import challengeService from '../../services/challengeService';

export default function ChallengePreviewSection() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    challengeService
      .getAll()
      .then((data) => {
        if (!isMounted) return;
        setChallenges(Array.isArray(data) ? data.slice(0, 4) : []);
      })
      .catch(() => {
        if (isMounted) setChallenges([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getDifficultyBadge = (diff) => {
    const d = (diff || '').toLowerCase();
    if (d === 'hard') {
      return 'bg-[#F7EAE6] text-[#B65C50] border-[#B65C50]/30';
    }
    if (d === 'medium') {
      return 'bg-[#F5EEDF] text-[#A67C42] border-[#A67C42]/30';
    }
    return 'bg-[#EAF0E7] text-[#55765B] border-[#55765B]/30';
  };

  return (
    <section id="challenges-preview" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DDDCCF] text-[#0D1321] text-xs font-mono shadow-sm">
              <Terminal className="w-3.5 h-3.5 text-[#748CAB]" />
              <span>Arena Catalog Preview</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1321] tracking-tight">
              Find Your Next Challenge
            </h2>

            <p className="text-sm sm:text-base text-[#3E5C76] leading-relaxed font-normal">
              Real engineering dilemmas, algorithmic duels, and production bug scenarios curated by top developers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/challenges')}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[#1D2D44] hover:text-[#0D1321] bg-[#FFFFFF] hover:bg-[#F7F5EF] border border-[#DDDCCF] hover:border-[#748CAB] transition-all cursor-pointer shadow-sm"
          >
            <span>Explore All Challenges</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1D2D44]" />
          </button>
        </div>

        {/* Challenge Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-44 rounded-3xl bg-[#FFFFFF] border border-[#DDDCCF]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((ch) => (
              <div
                key={ch.id || ch.title}
                className="group rounded-3xl p-6 bg-[#FFFFFF] border border-[#DDDCCF] hover:border-[#748CAB] transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_8px_rgba(13,19,33,0.04)] hover:shadow-[0_8px_20px_rgba(13,19,33,0.08)] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Difficulty, Badge & Points */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                          ch.difficulty
                        )}`}
                      >
                        {ch.difficulty || 'Intermediate'}
                      </span>
                      {ch.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F7F5EF] border border-[#DDDCCF] text-[#3E5C76]">
                          {ch.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1D2D44] bg-[#F7F5EF] border border-[#DDDCCF] px-2.5 py-0.5 rounded-lg">
                      <Award className="w-3.5 h-3.5 text-[#A67C42]" />
                      <span>+{ch.points || ch.xp || 150} XP</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#0D1321] group-hover:text-[#1D2D44] transition-colors line-clamp-1">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-[#3E5C76] leading-relaxed line-clamp-2 font-normal">
                      {ch.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Tags & Action */}
                <div className="pt-4 mt-4 border-t border-[#DDDCCF] flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5 overflow-hidden">
                    {(ch.tags || ['Coding', 'Algorithms']).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F7F5EF] border border-[#DDDCCF] text-[#3E5C76]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/challenges')}
                    className="shrink-0 text-xs font-semibold text-[#1D2D44] hover:text-[#0D1321] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
