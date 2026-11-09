import { useNavigate } from 'react-router-dom';

export default function BrandLogo({ size = 'md', className = '', onClick }) {
  const navigate = useNavigate();
  const isLarge = size === 'lg';

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      className={`inline-flex items-center gap-2.5 group cursor-pointer select-none ${className}`}
    >
      {/* Code Icon with Deep Space Blue Badge */}
      <div className={`relative flex items-center justify-center rounded-xl bg-[#1D2D44] border border-[#0D1321] text-[#F0EBD8] shadow-[0_2px_8px_rgba(29,45,68,0.25)] group-hover:bg-[#0D1321] transition-all duration-300 ${
        isLarge ? 'w-11 h-11' : 'w-9 h-9'
      }`}>
        <span className="font-mono font-bold text-sm tracking-tighter text-[#F0EBD8] flex items-center justify-center">
          &lt;/&gt;
        </span>
      </div>

      {/* Brand Text */}
      <div className="flex items-center tracking-tight">
        <span className={`font-bold text-[#0D1321] tracking-tight ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          Accept
        </span>
        <span className={`font-bold text-[#748CAB] mx-[1px] transition-colors group-hover:text-[#1D2D44] ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          &amp;
        </span>
        <span className={`font-bold text-[#0D1321] tracking-tight ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          Defeat
        </span>
      </div>
    </div>
  );
}
