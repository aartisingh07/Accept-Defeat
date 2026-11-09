import { useState, useEffect } from 'react';
import { Activity, ArrowRight, CheckCircle2, PlusCircle, MessageSquare, Trophy, Swords } from 'lucide-react';
import userService from '../../services/userService';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    userService
      .getActivity()
      .then((data) => {
        if (mounted) {
          setActivities(data);
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

  const renderIcon = (type) => {
    switch (type) {
      case 'solved':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#EAF0E7] border border-[#55765B]/30 text-[#55765B] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'created':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#1D2D44] flex items-center justify-center shrink-0">
            <PlusCircle className="w-4 h-4" />
          </div>
        );
      case 'received':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#EAF0F1] border border-[#6D8490]/30 text-[#6D8490] flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case 'earned':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#F5EEDF] border border-[#A67C42]/30 text-[#A67C42] flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
        );
      case 'challenged':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#F7EAE6] border border-[#B65C50]/30 text-[#B65C50] flex items-center justify-center shrink-0">
            <Swords className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#0D1321] flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
        );
    }
  };

  const getActionLabel = (type) => {
    switch (type) {
      case 'solved':
        return 'Solved';
      case 'created':
        return 'Created';
      case 'received':
        return 'Received';
      case 'earned':
        return 'Earned';
      case 'challenged':
        return 'Challenged';
      default:
        return 'Action';
    }
  };

  return (
    <div className="dashboard-card rounded-2xl p-5 space-y-4 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#1D2D44]" />
          <h2 className="text-sm font-bold text-[#0D1321] tracking-wide">Recent Activity</h2>
        </div>

        <button className="text-xs font-bold text-[#1D2D44] hover:text-[#0D1321] flex items-center gap-1 transition-colors cursor-pointer">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#3E5C76]">
          No recent activity. Accept a challenge to begin your battle log!
        </div>
      ) : (
        <div className="space-y-3 divide-y divide-[#DDDCCF]/50">
          {activities.map((act) => (
            <div key={act.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {renderIcon(act.type)}
                <div>
                  <div className="text-xs text-[#0D1321]">
                    <span className="font-semibold text-[#3E5C76] mr-2">
                      {getActionLabel(act.type)}
                    </span>
                    <span className="font-bold">{act.title}</span>
                  </div>
                  {act.subtitle && (
                    <div className="text-[10px] text-[#3E5C76]">{act.subtitle}</div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                {act.points && (
                  <div className="text-xs font-bold text-[#A67C42]">{act.points}</div>
                )}
                <div className="text-[10px] text-[#3E5C76]">{act.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
