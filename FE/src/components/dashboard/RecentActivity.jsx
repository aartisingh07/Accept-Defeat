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
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'created':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <PlusCircle className="w-4 h-4" />
          </div>
        );
      case 'received':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case 'earned':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
        );
      case 'challenged':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <Swords className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
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
          <Activity className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">Recent Activity</h2>
        </div>

        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer">
          <span>View All!</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No recent activity. Accept a challenge to begin your battle log!
        </div>
      ) : (
        <div className="space-y-3 divide-y divide-slate-800/50">
          {activities.map((act) => (
            <div key={act.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {renderIcon(act.type)}
                <div>
                  <div className="text-xs text-white">
                    <span className="font-semibold text-slate-400 mr-2">
                      {getActionLabel(act.type)}
                    </span>
                    <span className="font-medium">{act.title}</span>
                  </div>
                  {act.subtitle && (
                    <div className="text-[10px] text-slate-400">{act.subtitle}</div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                {act.points && (
                  <div className="text-xs font-bold text-amber-400">{act.points}</div>
                )}
                <div className="text-[10px] text-slate-400">{act.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

