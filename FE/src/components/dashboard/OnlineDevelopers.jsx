import { useState, useEffect } from 'react';
import { ArrowRight, Swords, CheckCircle2 } from 'lucide-react';
import userService from '../../services/userService';

export default function OnlineDevelopers() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [challengeSentTo, setChallengeSentTo] = useState(null);

  useEffect(() => {
    let mounted = true;
    userService
      .getOnlineDevelopers()
      .then((data) => {
        if (mounted) {
          setDevelopers(data);
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

  const handleChallenge = (dev) => {
    setChallengeSentTo(dev.name);
    setTimeout(() => {
      setChallengeSentTo(null);
    }, 2500);
  };

  return (
    <div className="dashboard-card rounded-2xl p-5 space-y-4 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-bold text-white tracking-wide">
            Developers Online <span className="text-slate-400 font-normal">({developers.length * 25 + 3})</span>
          </h2>
        </div>

        <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer">
          <span>See All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {challengeSentTo && (
        <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-[11px] text-purple-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Battle invitation sent to <strong>{challengeSentTo}</strong>!</span>
        </div>
      )}

      {/* Developers List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 divide-y divide-slate-800/50">
          {developers.map((dev) => (
            <div key={dev.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-8 h-8 rounded-full object-cover border border-purple-500/30"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0D1528] ${
                      dev.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                </div>

                <div>
                  <div className="text-xs font-semibold text-white leading-tight">
                    {dev.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {dev.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleChallenge(dev)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-purple-300 bg-purple-950/50 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Swords className="w-3 h-3" />
                <span>Challenge</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

