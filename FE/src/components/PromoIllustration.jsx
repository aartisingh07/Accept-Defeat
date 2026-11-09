import { motion, AnimatePresence } from 'framer-motion';

export default function PromoIllustration({ activeTab }) {
  const isLogin = activeTab === 'login';

  return (
    <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-[#F7F5EF] border border-[#DDDCCF] shadow-sm flex items-center justify-center p-3 select-none">
      {/* Background ambient Deep Sea glow */}
      <div className="absolute inset-0 bg-radial from-[#748CAB]/15 via-transparent to-transparent opacity-80 pointer-events-none" />

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
            {/* SVG Illustration: Developer at dual monitors in modern Deep Sea workspace */}
            <svg
              viewBox="0 0 460 220"
              className="w-full h-full max-h-52 object-contain filter drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="screenGrad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F7F5EF" />
                </linearGradient>
                <linearGradient id="deepSeaCardGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F7F5EF" />
                </linearGradient>
              </defs>

              {/* Desk Surface */}
              <rect x="20" y="180" width="420" height="12" rx="4" fill="#FFFFFF" stroke="#DDDCCF" strokeWidth="1.5" />
              <line x1="40" y1="181" x2="420" y2="181" stroke="#748CAB" strokeOpacity="0.4" strokeWidth="1.5" />

              {/* Ambient Glow behind monitors */}
              <ellipse cx="180" cy="110" rx="120" ry="70" fill="#748CAB" fillOpacity="0.1" />

              {/* Left Monitor (Secondary) */}
              <rect x="50" y="70" width="105" height="85" rx="6" fill="url(#screenGrad1)" stroke="#DDDCCF" strokeWidth="1.5" />
              {/* Left monitor stand */}
              <rect x="95" y="155" width="15" height="25" fill="#687386" />
              <rect x="80" y="178" width="45" height="4" rx="2" fill="#0D1321" />
              {/* Code lines on left monitor */}
              <rect x="60" y="80" width="30" height="3" rx="1.5" fill="#1D2D44" />
              <rect x="60" y="88" width="55" height="3" rx="1.5" fill="#748CAB" />
              <rect x="68" y="96" width="65" height="3" rx="1.5" fill="#55765B" />
              <rect x="68" y="104" width="45" height="3" rx="1.5" fill="#A67C42" />
              <rect x="60" y="112" width="75" height="3" rx="1.5" fill="#3E5C76" />
              <rect x="68" y="120" width="50" height="3" rx="1.5" fill="#748CAB" />
              <rect x="60" y="128" width="35" height="3" rx="1.5" fill="#1D2D44" />
              <rect x="60" y="136" width="20" height="3" rx="1.5" fill="#55765B" />

              {/* Main Monitor (Primary Center-Right) */}
              <rect x="145" y="55" width="130" height="100" rx="8" fill="#FFFFFF" stroke="#1D2D44" strokeWidth="2" />
              {/* Main monitor stand */}
              <rect x="202" y="155" width="16" height="26" fill="#687386" />
              <rect x="185" y="178" width="50" height="4" rx="2" fill="#0D1321" />
              {/* Code window chrome */}
              <rect x="145" y="55" width="130" height="14" rx="8" fill="#F7F5EF" />
              <circle cx="155" cy="62" r="2.5" fill="#B65C50" />
              <circle cx="163" cy="62" r="2.5" fill="#A67C42" />
              <circle cx="171" cy="62" r="2.5" fill="#55765B" />
              {/* Active IDE Code lines */}
              <rect x="156" y="77" width="45" height="3.5" rx="1.5" fill="#1D2D44" />
              <rect x="156" y="86" width="70" height="3.5" rx="1.5" fill="#3E5C76" />
              <rect x="166" y="95" width="85" height="3.5" rx="1.5" fill="#55765B" />
              <rect x="166" y="104" width="60" height="3.5" rx="1.5" fill="#B65C50" />
              <rect x="176" y="113" width="75" height="3.5" rx="1.5" fill="#748CAB" />
              <rect x="176" y="122" width="50" height="3.5" rx="1.5" fill="#0D1321" />
              <rect x="166" y="131" width="40" height="3.5" rx="1.5" fill="#A67C42" />
              {/* Cursor */}
              <rect x="210" y="131" width="3" height="5" fill="#1D2D44" className="animate-pulse" />

              {/* Keyboard & Mouse */}
              <rect x="155" y="174" width="75" height="7" rx="2" fill="#FFFFFF" stroke="#DDDCCF" strokeWidth="1" />
              <rect x="245" y="174" width="14" height="7" rx="3" fill="#FFFFFF" stroke="#DDDCCF" strokeWidth="1" />
              <ellipse cx="252" cy="177" rx="2" ry="1" fill="#748CAB" />

              {/* Developer Silhouette */}
              <path
                d="M140 215 C140 185, 175 168, 205 168 C235 168, 270 185, 270 215 Z"
                fill="#1D2D44"
                stroke="#0D1321"
                strokeWidth="1.5"
              />
              <path
                d="M175 168 C175 160, 185 152, 205 152 C225 152, 235 160, 235 168 Z"
                fill="#0D1321"
              />
              <ellipse cx="205" cy="140" rx="18" ry="21" fill="#1D2D44" />
              {/* Headphones */}
              <path
                d="M185 138 C185 118, 225 118, 225 138"
                stroke="#748CAB"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="184" cy="140" rx="4" ry="8" fill="#1D2D44" />
              <ellipse cx="226" cy="140" rx="4" ry="8" fill="#1D2D44" />

              {/* Plant on left side */}
              <rect x="26" y="160" width="16" height="20" rx="2" fill="#FFFFFF" stroke="#DDDCCF" />
              <path d="M34 160 Q20 140 16 142 Q28 152 34 160" fill="#55765B" />
              <path d="M34 160 Q34 130 38 132 Q37 148 34 160" fill="#3D5341" />
              <path d="M34 160 Q48 142 50 145 Q40 152 34 160" fill="#748CAB" />

              {/* Hanging Sign on Right: "/Accept\nthe Challenge >>" */}
              <g>
                <rect
                  x="295"
                  y="65"
                  width="135"
                  height="65"
                  rx="12"
                  fill="url(#deepSeaCardGrad)"
                  stroke="#DDDCCF"
                  strokeWidth="1.5"
                />
                <text x="310" y="88" fill="#1D2D44" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="bold">
                  /Accept
                </text>
                <text x="310" y="103" fill="#0D1321" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold">
                  the Challenge
                </text>
                <text x="310" y="118" fill="#748CAB" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold">
                  &gt;&gt;
                </text>
                <circle cx="415" cy="78" r="3" fill="#55765B" className="animate-pulse" />
              </g>

              <line x1="320" y1="0" x2="320" y2="65" stroke="#DDDCCF" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="410" y1="0" x2="410" y2="65" stroke="#DDDCCF" strokeWidth="1" strokeDasharray="2 2" />
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
            {/* SVG Illustration: Developer battle station */}
            <svg
              viewBox="0 0 460 220"
              className="w-full h-full max-h-52 object-contain filter drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="laptopScreenGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F7F5EF" />
                </linearGradient>
                <linearGradient id="floatingCardGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F7F5EF" />
                </linearGradient>
              </defs>

              {/* Ambient Glow */}
              <ellipse cx="260" cy="115" rx="140" ry="75" fill="#748CAB" fillOpacity="0.1" />

              {/* Desk Surface */}
              <rect x="20" y="180" width="420" height="12" rx="4" fill="#FFFFFF" stroke="#DDDCCF" strokeWidth="1.5" />
              <line x1="40" y1="181" x2="420" y2="181" stroke="#748CAB" strokeOpacity="0.4" strokeWidth="1.5" />

              {/* Stack of Developer Docs / Books on Left */}
              <rect x="40" y="165" width="55" height="15" rx="3" fill="#F7F5EF" stroke="#DDDCCF" strokeWidth="1" />
              <rect x="44" y="152" width="50" height="14" rx="3" fill="#FFFFFF" stroke="#748CAB" strokeWidth="1" />
              <rect x="48" y="140" width="45" height="13" rx="3" fill="#1D2D44" stroke="#0D1321" strokeWidth="1" />
              <line x1="53" y1="147" x2="80" y2="147" stroke="#F0EBD8" strokeWidth="1.5" />
              <line x1="49" y1="159" x2="75" y2="159" stroke="#0D1321" strokeWidth="1.5" />

              {/* Plant in Neutral Pot */}
              <rect x="18" y="145" width="15" height="20" rx="3" fill="#FFFFFF" stroke="#DDDCCF" strokeWidth="1" />
              <path d="M25 145 Q12 125 10 128 Q20 138 25 145" fill="#748CAB" />
              <path d="M25 145 Q26 120 29 122 Q28 135 25 145" fill="#55765B" />

              {/* Open Laptop in Center */}
              <rect
                x="140"
                y="85"
                width="145"
                height="85"
                rx="7"
                fill="url(#laptopScreenGrad)"
                stroke="#DDDCCF"
                strokeWidth="1.8"
              />
              {/* Code Symbol </> on screen */}
              <text
                x="212"
                y="136"
                textAnchor="middle"
                fill="#1D2D44"
                fontFamily="JetBrains Mono, monospace"
                fontSize="24"
                fontWeight="bold"
              >
                &lt;/&gt;
              </text>
              <line x1="165" y1="148" x2="260" y2="148" stroke="#DDDCCF" strokeWidth="1" />
              <line x1="180" y1="154" x2="245" y2="154" stroke="#748CAB" strokeWidth="1" />

              {/* Laptop Base / Keyboard */}
              <path
                d="M125 170 L300 170 L285 182 L140 182 Z"
                fill="#FFFFFF"
                stroke="#DDDCCF"
                strokeWidth="1"
              />
              <rect x="195" y="174" width="35" height="5" rx="1.5" fill="#F7F5EF" />

              {/* Floating Card on Right */}
              <rect
                x="300"
                y="75"
                width="135"
                height="70"
                rx="10"
                fill="url(#floatingCardGrad)"
                stroke="#DDDCCF"
                strokeWidth="1.5"
              />
              <text x="315" y="98" fill="#1D2D44" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold">
                Code Today.
              </text>
              <text x="315" y="113" fill="#3E5C76" fontFamily="system-ui, sans-serif" fontSize="10">
                Defeat Tomorrow.
              </text>
              <text x="315" y="130" fill="#55765B" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold">
                RANK #1 AWAITS
              </text>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
