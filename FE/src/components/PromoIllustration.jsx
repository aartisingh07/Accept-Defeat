import { motion, AnimatePresence } from 'framer-motion';

export default function PromoIllustration({ activeTab }) {
  const isLogin = activeTab === 'login';

  return (
    <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0F172A]/40 to-[#070B14]/80 border border-purple-500/20 shadow-[inset_0_0_30px_rgba(139,92,246,0.1)] flex items-center justify-center p-3 select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-purple-600/15 via-transparent to-transparent opacity-60 pointer-events-none" />

      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login-illustration"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* SVG Illustration: Developer at dual monitors with neon badge */}
            <svg
              viewBox="0 0 460 220"
              className="w-full h-full max-h-52 object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="screenGrad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E1B4B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="purpleGlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="neonCardGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3B0764" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.7" />
                </linearGradient>
                <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="neonSignGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Desk Surface */}
              <rect x="20" y="180" width="420" height="12" rx="4" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
              <line x1="40" y1="181" x2="420" y2="181" stroke="#8B5CF6" strokeOpacity="0.4" strokeWidth="1.5" />

              {/* Ambient Glow behind monitors */}
              <ellipse cx="180" cy="110" rx="120" ry="70" fill="#7C3AED" fillOpacity="0.18" />

              {/* Left Monitor (Secondary) */}
              <rect x="50" y="70" width="105" height="85" rx="6" fill="url(#screenGrad1)" stroke="#8B5CF6" strokeWidth="1.5" strokeOpacity="0.5" />
              {/* Left monitor stand */}
              <rect x="95" y="155" width="15" height="25" fill="#1E293B" />
              <rect x="80" y="178" width="45" height="4" rx="2" fill="#334155" />
              {/* Code lines on left monitor */}
              <rect x="60" y="80" width="30" height="3" rx="1.5" fill="#A855F7" />
              <rect x="60" y="88" width="55" height="3" rx="1.5" fill="#38BDF8" fillOpacity="0.8" />
              <rect x="68" y="96" width="65" height="3" rx="1.5" fill="#34D399" fillOpacity="0.8" />
              <rect x="68" y="104" width="45" height="3" rx="1.5" fill="#F472B6" fillOpacity="0.7" />
              <rect x="60" y="112" width="75" height="3" rx="1.5" fill="#94A3B8" fillOpacity="0.6" />
              <rect x="68" y="120" width="50" height="3" rx="1.5" fill="#38BDF8" fillOpacity="0.7" />
              <rect x="60" y="128" width="35" height="3" rx="1.5" fill="#A855F7" fillOpacity="0.8" />
              <rect x="60" y="136" width="20" height="3" rx="1.5" fill="#34D399" />

              {/* Main Monitor (Primary Center-Right) */}
              <rect x="145" y="55" width="130" height="100" rx="8" fill="#090D1A" stroke="#8B5CF6" strokeWidth="2" strokeOpacity="0.8" />
              {/* Main monitor stand */}
              <rect x="202" y="155" width="16" height="26" fill="#1E293B" />
              <rect x="185" y="178" width="50" height="4" rx="2" fill="#334155" />
              {/* Code window chrome */}
              <rect x="145" y="55" width="130" height="14" rx="8" fill="#1E1B4B" fillOpacity="0.6" />
              <circle cx="155" cy="62" r="2.5" fill="#EF4444" fillOpacity="0.7" />
              <circle cx="163" cy="62" r="2.5" fill="#F59E0B" fillOpacity="0.7" />
              <circle cx="171" cy="62" r="2.5" fill="#10B981" fillOpacity="0.7" />
              {/* Active IDE Code lines with glowing cursor */}
              <rect x="156" y="77" width="45" height="3.5" rx="1.5" fill="#C084FC" />
              <rect x="156" y="86" width="70" height="3.5" rx="1.5" fill="#60A5FA" />
              <rect x="166" y="95" width="85" height="3.5" rx="1.5" fill="#34D399" />
              <rect x="166" y="104" width="60" height="3.5" rx="1.5" fill="#F43F5E" />
              <rect x="176" y="113" width="75" height="3.5" rx="1.5" fill="#A78BFA" />
              <rect x="176" y="122" width="50" height="3.5" rx="1.5" fill="#38BDF8" />
              <rect x="166" y="131" width="40" height="3.5" rx="1.5" fill="#FBBF24" />
              {/* Animated blinking cursor */}
              <rect x="210" y="131" width="3" height="5" fill="#C4B5FD" className="animate-pulse" />

              {/* Keyboard & Mouse */}
              <rect x="155" y="174" width="75" height="7" rx="2" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
              <rect x="245" y="174" width="14" height="7" rx="3" fill="#334155" stroke="#475569" strokeWidth="0.8" />
              <ellipse cx="252" cy="177" rx="2" ry="1" fill="#8B5CF6" />

              {/* Developer Silhouette (back view with headphones) */}
              {/* Shoulders / Hoodie */}
              <path
                d="M140 215 C140 185, 175 168, 205 168 C235 168, 270 185, 270 215 Z"
                fill="#13192B"
                stroke="#3B4261"
                strokeWidth="1.5"
              />
              {/* Hoodie Back */}
              <path
                d="M175 168 C175 160, 185 152, 205 152 C225 152, 235 160, 235 168 Z"
                fill="#1E253B"
              />
              {/* Head */}
              <ellipse cx="205" cy="140" rx="18" ry="21" fill="#0F1424" />
              {/* Headphones Band */}
              <path
                d="M185 138 C185 118, 225 118, 225 138"
                stroke="#8B5CF6"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Headphone Earcups with purple neon ring */}
              <ellipse cx="184" cy="140" rx="4" ry="8" fill="#A855F7" />
              <ellipse cx="226" cy="140" rx="4" ry="8" fill="#A855F7" />

              {/* Plant on left side */}
              <rect x="26" y="160" width="16" height="20" rx="2" fill="#1E293B" stroke="#334155" />
              <path d="M34 160 Q20 140 16 142 Q28 152 34 160" fill="#10B981" fillOpacity="0.8" />
              <path d="M34 160 Q34 130 38 132 Q37 148 34 160" fill="#059669" />
              <path d="M34 160 Q48 142 50 145 Q40 152 34 160" fill="#34D399" fillOpacity="0.9" />

              {/* Neon Sign hanging on Right: "/Accept\nthe Challenge >>" */}
              <g filter="url(#neonSignGlow)">
                <rect
                  x="295"
                  y="65"
                  width="135"
                  height="65"
                  rx="12"
                  fill="url(#neonCardGrad)"
                  stroke="#A855F7"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text x="310" y="88" fill="#E9D5FF" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold">
                  /Accept
                </text>
                <text x="310" y="103" fill="#C084FC" fontFamily="Inter" fontSize="11" fontWeight="bold">
                  the Challenge
                </text>
                <text x="310" y="118" fill="#38BDF8" fontFamily="JetBrains Mono" fontSize="12" fontWeight="bold">
                  &gt;&gt;
                </text>
                {/* Neon glow dot */}
                <circle cx="415" cy="78" r="3" fill="#34D399" className="animate-pulse" />
              </g>

              {/* Hanging wires for neon sign */}
              <line x1="320" y1="0" x2="320" y2="65" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="410" y1="0" x2="410" y2="65" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="signup-illustration"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* SVG Illustration: Cyber Battle Station with Neon Cat Companion and Floating Code Today card */}
            <svg
              viewBox="0 0 460 220"
              className="w-full h-full max-h-52 object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="laptopScreenGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2E1065" />
                  <stop offset="100%" stopColor="#090D1A" />
                </linearGradient>
                <linearGradient id="floatingCardGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.75" />
                </linearGradient>
                <filter id="catEyeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Ambient Glow */}
              <ellipse cx="260" cy="115" rx="140" ry="75" fill="#8B5CF6" fillOpacity="0.16" />

              {/* Desk Surface */}
              <rect x="20" y="180" width="420" height="12" rx="4" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
              <line x1="40" y1="181" x2="420" y2="181" stroke="#A855F7" strokeOpacity="0.45" strokeWidth="1.5" />

              {/* Stack of Developer Docs / Books on Left */}
              <rect x="40" y="165" width="55" height="15" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
              <rect x="44" y="152" width="50" height="14" rx="3" fill="#2E1065" stroke="#7C3AED" strokeWidth="1" />
              <rect x="48" y="140" width="45" height="13" rx="3" fill="#1E1B4B" stroke="#8B5CF6" strokeWidth="1" />
              <line x1="53" y1="147" x2="80" y2="147" stroke="#C4B5FD" strokeWidth="1.5" />
              <line x1="49" y1="159" x2="75" y2="159" stroke="#E9D5FF" strokeWidth="1.5" />

              {/* Plant in Purple Neon Pot */}
              <rect x="18" y="145" width="15" height="20" rx="3" fill="#2E1065" stroke="#8B5CF6" strokeWidth="1" />
              <path d="M25 145 Q12 125 10 128 Q20 138 25 145" fill="#34D399" />
              <path d="M25 145 Q26 120 29 122 Q28 135 25 145" fill="#10B981" />

              {/* Open Laptop in Center */}
              {/* Laptop Screen */}
              <rect
                x="140"
                y="85"
                width="145"
                height="85"
                rx="7"
                fill="url(#laptopScreenGrad)"
                stroke="#8B5CF6"
                strokeWidth="1.8"
              />
              {/* Glowing Code Symbol </> on screen */}
              <text
                x="212"
                y="136"
                textAnchor="middle"
                fill="#C4B5FD"
                fontFamily="JetBrains Mono"
                fontSize="24"
                fontWeight="bold"
                className="filter drop-shadow-[0_0_8px_rgba(196,181,253,0.8)]"
              >
                &lt;/&gt;
              </text>
              <line x1="165" y1="148" x2="260" y2="148" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="180" y1="154" x2="245" y2="154" stroke="#A78BFA" strokeWidth="1" strokeOpacity="0.4" />

              {/* Laptop Base / Keyboard */}
              <path
                d="M125 170 L300 170 L285 182 L140 182 Z"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1"
              />
              <rect x="195" y="174" width="35" height="5" rx="1.5" fill="#334155" />

              {/* Floating Hologram Card: </> Code Today. Defeat Tomorrow. */}
              <g transform="translate(130, 25)">
                <rect
                  x="0"
                  y="0"
                  width="170"
                  height="55"
                  rx="10"
                  fill="url(#floatingCardGrad)"
                  stroke="#A78BFA"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                  className="filter drop-shadow-[0_8px_20px_rgba(139,92,246,0.35)]"
                />
                <text x="14" y="22" fill="#E9D5FF" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold">
                  &lt;/&gt;
                </text>
                <text x="14" y="37" fill="#F8FAFC" fontFamily="Inter" fontSize="11" fontWeight="bold">
                  Code Today.
                </text>
                <text x="14" y="49" fill="#C4B5FD" fontFamily="Inter" fontSize="10" fontWeight="medium">
                  Defeat Tomorrow.
                </text>
                {/* Floating particle sparkle */}
                <circle cx="152" cy="16" r="2.5" fill="#38BDF8" className="animate-ping" />
              </g>

              {/* Dark Cyber Cat Mascot with Glowing Violet Eyes */}
              <g transform="translate(315, 115)">
                {/* Cat Body */}
                <path
                  d="M15 65 C15 45, 30 35, 45 35 C60 35, 75 45, 75 65 Z"
                  fill="#0B0F1A"
                  stroke="#2E1065"
                  strokeWidth="1.5"
                />
                {/* Cat Head */}
                <ellipse cx="45" cy="30" rx="18" ry="16" fill="#0F172A" stroke="#3B0764" strokeWidth="1" />
                {/* Left Ear */}
                <polygon points="32,20 26,4 40,16" fill="#1E1B4B" stroke="#7C3AED" strokeWidth="1" />
                <polygon points="32,18 28,8 38,16" fill="#A855F7" fillOpacity="0.4" />
                {/* Right Ear */}
                <polygon points="58,20 64,4 50,16" fill="#1E1B4B" stroke="#7C3AED" strokeWidth="1" />
                <polygon points="58,18 62,8 52,16" fill="#A855F7" fillOpacity="0.4" />
                {/* Glowing Purple Eyes */}
                <g filter="url(#catEyeGlow)">
                  <ellipse cx="38" cy="28" rx="3.5" ry="4" fill="#C084FC" />
                  <ellipse cx="52" cy="28" rx="3.5" ry="4" fill="#C084FC" />
                  <circle cx="39" cy="27" r="1.2" fill="#FFFFFF" />
                  <circle cx="53" cy="27" r="1.2" fill="#FFFFFF" />
                </g>
                {/* Cat Nose & Mouth */}
                <polygon points="45,34 43,36 47,36" fill="#A78BFA" />
                <path d="M43 37 Q45 39 47 37" stroke="#A78BFA" strokeWidth="1" fill="none" />
                {/* Tail curled behind */}
                <path
                  d="M72 60 C85 55, 90 40, 85 30 C82 25, 78 28, 80 34 C82 40, 78 50, 70 58"
                  stroke="#7C3AED"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
