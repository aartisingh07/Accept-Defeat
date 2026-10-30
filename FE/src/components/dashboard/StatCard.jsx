export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  iconColor = 'purple',
}) {
  const colorMap = {
    purple: {
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      glow: 'shadow-[0_0_15px_rgba(139,92,246,0.2)]',
    },
    cyan: {
      badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    },
    violet: {
      badge: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
      glow: 'shadow-[0_0_15px_rgba(167,139,250,0.2)]',
    },
    blue: {
      badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    },
  };

  const scheme = colorMap[iconColor] || colorMap.purple;

  return (
    <div className="dashboard-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        {/* Icon Badge */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${scheme.badge} ${scheme.glow}`}
        >
          <Icon className="w-6 h-6" />
        </div>

        {/* Value and Label */}
        <div className="space-y-0.5 text-left">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {value}
            </span>
            {trend && (
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5">
                <span>&uarr;</span>
                <span>{trend}</span>
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 font-medium">{label}</div>
        </div>
      </div>
    </div>
  );
}

