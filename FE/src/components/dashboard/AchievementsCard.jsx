import { useState, useEffect } from 'react';
import { Award, ArrowRight, Code2, Zap, TrendingUp } from 'lucide-react';
import userService from '../../services/userService';

export default function AchievementsCard() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    userService
      .getAchievements()
      .then((data) => {
        if (mounted) {
          setAchievements(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const renderBadgeIcon = (id) => {
    switch (id) {
      case 'ach-1':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        );
      case 'ach-2':
        return (
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
        );
      case 'ach-3':
        return (
          <div className="w-9 h-9 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        );
      case 'ach-4':
        return (
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="dashboard-card rounded-2xl p-5 space-y-3.5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">Achievements</h2>
        </div>

        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Badges Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-2.5 rounded-xl bg-[#090F1E] border border-slate-800/80 hover:border-purple-500/30 transition-all flex flex-col items-center text-center space-y-1.5 group cursor-default"
            >
              {renderBadgeIcon(ach.id)}
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                  {ach.name}
                </div>
                <div className="text-[9px] text-slate-400 leading-none">
                  {ach.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

