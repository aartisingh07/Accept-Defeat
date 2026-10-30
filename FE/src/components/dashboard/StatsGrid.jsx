import { useState, useEffect } from 'react';
import { Trophy, Code2, Clock, BarChart3 } from 'lucide-react';
import StatCard from './StatCard';
import userService from '../../services/userService';

export default function StatsGrid() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    userService
      .getStats()
      .then((data) => {
        if (mounted) {
          setStats(data);
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-[#0D1528] border border-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Trophy}
          label="Total Points"
          value={stats?.totalPoints?.toLocaleString() || '1,250'}
          trend={stats?.pointsTrend || '+120'}
          iconColor="purple"
        />

        <StatCard
          icon={Code2}
          label="Challenges Solved"
          value={stats?.challengesSolved || 12}
          trend={stats?.solvedTrend || '+3'}
          iconColor="cyan"
        />

        <StatCard
          icon={Clock}
          label="Ongoing Challenges"
          value={stats?.ongoingChallenges || 8}
          trend={null}
          iconColor="violet"
        />

        <StatCard
          icon={BarChart3}
          label="Global Rank"
          value={stats?.globalRank || '#42'}
          trend={stats?.rankTrend || '+8'}
          iconColor="blue"
        />
      </div>

      {stats?.isSampleData && (
        <div className="text-right text-[10px] text-slate-500 font-mono pr-1">
          * Displaying development sample metrics until stats API is connected
        </div>
      )}
    </div>
  );
}

