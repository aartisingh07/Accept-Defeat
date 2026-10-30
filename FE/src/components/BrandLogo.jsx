export default function BrandLogo({ size = 'md', className = '' }) {
  const isLarge = size === 'lg';

  return (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      {/* Code Icon with subtle glowing badge */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6]/25 to-[#6D28D9]/35 border border-[#8B5CF6]/40 text-[#A78BFA] shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_22px_rgba(139,92,246,0.55)] group-hover:border-[#8B5CF6]/70 transition-all duration-300 ${
        isLarge ? 'w-11 h-11' : 'w-9 h-9'
      }`}>
        <span className="font-mono font-bold text-sm tracking-tighter text-[#C4B5FD] flex items-center justify-center">
          &lt;/&gt;
        </span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Brand Text */}
      <div className="flex items-center tracking-tight">
        <span className={`font-bold text-[#F8FAFC] tracking-tight ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          Accept
        </span>
        <span className={`font-bold text-[#A78BFA] mx-[1px] transition-colors group-hover:text-[#C4B5FD] ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          &amp;
        </span>
        <span className={`font-bold text-[#F8FAFC] tracking-tight ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          Defeat
        </span>
      </div>
    </div>
  );
}
