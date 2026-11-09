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
          <div className="w-9 h-9 rounded-xl bg-[#F5EEDF] border border-[#A67C42]/30 text-[#A67C42] flex items-center justify-center shadow-sm">
            <Award className="w-5 h-5" />
          </div>
        );
      case 'ach-2':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#EAF0E7] border border-[#55765B]/30 text-[#55765B] flex items-center justify-center shadow-sm">
            <Code2 className="w-5 h-5" />
          </div>
        );
      case 'ach-3':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#1D2D44] flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
        );
      case 'ach-4':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#EAF0F1] border border-[#6D8490]/30 text-[#6D8490] flex items-center justify-center shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#1D2D44] flex items-center justify-center shadow-sm">
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
          <Award className="w-4 h-4 text-[#1D2D44]" />
          <h2 className="text-sm font-bold text-[#0D1321] tracking-wide">Achievements</h2>
        </div>

        <button className="text-xs font-bold text-[#1D2D44] hover:text-[#0D1321] flex items-center gap-1 transition-colors cursor-pointer">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Badges Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] hover:border-[#748CAB] transition-all flex flex-col items-center text-center space-y-1.5 group cursor-default"
            >
              {renderBadgeIcon(ach.id)}
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-[#0D1321] leading-tight">
                  {ach.name}
                </div>
                <div className="text-[9px] text-[#3E5C76] leading-none">
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
