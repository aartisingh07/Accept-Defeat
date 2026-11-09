export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  iconColor = 'deepSpace',
}) {
  const colorMap = {
    deepSpace: {
      badge: 'bg-[#F7F5EF] text-[#1D2D44] border-[#DDDCCF]',
    },
    blueSlate: {
      badge: 'bg-[#F7F5EF] text-[#3E5C76] border-[#DDDCCF]',
    },
    dustyDenim: {
      badge: 'bg-[#748CAB]/15 text-[#1D2D44] border-[#748CAB]/30',
    },
    amber: {
      badge: 'bg-[#F5EEDF] text-[#A67C42] border-[#A67C42]/30',
    },
    green: {
      badge: 'bg-[#EAF0E7] text-[#55765B] border-[#55765B]/30',
    },
    coffee: {
      badge: 'bg-[#F7F5EF] text-[#1D2D44] border-[#DDDCCF]',
    },
    taupe: {
      badge: 'bg-[#748CAB]/15 text-[#3E5C76] border-[#DDDCCF]',
    },
    purple: {
      badge: 'bg-[#F7F5EF] text-[#1D2D44] border-[#DDDCCF]',
    },
    cyan: {
      badge: 'bg-[#EAF0E7] text-[#55765B] border-[#55765B]/30',
    },
    violet: {
      badge: 'bg-[#F5EEDF] text-[#A67C42] border-[#A67C42]/30',
    },
    blue: {
      badge: 'bg-[#F7F5EF] text-[#1D2D44] border-[#DDDCCF]',
    },
  };

  const scheme = colorMap[iconColor] || colorMap.deepSpace;

  return (
    <div className="dashboard-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        {/* Icon Badge */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${scheme.badge} shadow-sm`}
        >
          <Icon className="w-6 h-6" />
        </div>

        {/* Value and Label */}
        <div className="space-y-0.5 text-left">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#0D1321] tracking-tight">
              {value}
            </span>
            {trend && (
              <span className="text-[11px] font-semibold text-[#55765B] flex items-center gap-0.5">
                <span>&uarr;</span>
                <span>{trend}</span>
              </span>
            )}
          </div>
          <div className="text-xs text-[#3E5C76] font-medium">{label}</div>
        </div>
      </div>
    </div>
  );
}
