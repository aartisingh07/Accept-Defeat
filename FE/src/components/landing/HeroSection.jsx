import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Code2,
  Swords,
  Trophy,
  Zap,
  Sparkles,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden select-none"
    >
      {/* Subtle Deep Sea ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#748CAB]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#1D2D44]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description, CTAs, Trust Indicators */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Live Arena Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#DDDCCF] text-[#0D1321] text-xs font-mono shadow-[0_2px_8px_rgba(13,19,33,0.04)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#55765B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#55765B]"></span>
              </span>
              <span className="text-[#3E5C76]">Live Developer Arena</span>
              <span className="text-[#DDDCCF]">•</span>
              <span className="text-[#1D2D44] font-semibold">1,420 Battles Active</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0D1321] leading-[1.1]">
                <span>Code. </span>
                <span className="text-[#1D2D44] underline decoration-[#748CAB]/40 underline-offset-8">
                  Compete.
                </span>{' '}
                <span className="text-[#3E5C76]">
                  Conquer.
                </span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#3E5C76] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Your coding journey doesn't have to be a solo mission. Challenge developers, solve problems, compete in real-time, and prove your skills in the ultimate developer arena.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="btn-primary-deep-space w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold text-[#F0EBD8] bg-[#1D2D44] hover:bg-[#0D1321] flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Swords className="w-4 h-4" />
                <span>Start Competing</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/challenges')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-[#1D2D44] hover:text-[#0D1321] bg-[#FFFFFF] hover:bg-[#F7F5EF] border border-[#DDDCCF] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                <Code2 className="w-4 h-4 text-[#3E5C76]" />
                <span>Explore Challenges</span>
              </button>
            </div>

            {/* Mini Trust Highlights */}
            <div className="pt-4 border-t border-[#DDDCCF] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#3E5C76]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#55765B] shrink-0" />
                <span>Production Bug Scenarios</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#748CAB] shrink-0" />
                <span>Real-Time ELO Ratings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1D2D44] shrink-0" />
                <span>Verified Developer Badges</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Gaming Arena Card Illustration */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Halo */}
            <div className="absolute inset-0 bg-[#748CAB]/15 rounded-3xl blur-2xl pointer-events-none" />

            {/* Interactive Battle Card */}
            <div className="relative w-full max-w-lg rounded-3xl bg-[#FFFFFF] border border-[#DDDCCF] p-5 sm:p-6 shadow-[0_16px_36px_-8px_rgba(13,19,33,0.1)] space-y-4">
              
              {/* Card Header: Live Duel Match */}
              <div className="flex items-center justify-between pb-3 border-b border-[#DDDCCF]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#F7F5EF] text-[#1D2D44] border border-[#DDDCCF]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-[#0D1321] tracking-wide">
                      ARENA MATCH #2847
                    </div>
                    <div className="text-[10px] text-[#687386]">Concurrency Bug Race • 1v1 Live</div>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#EAF0E7] border border-[#55765B]/30 text-[#55765B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55765B] animate-pulse" />
                  IN PROGRESS
                </span>
              </div>

              {/* Developer Duelist Versus Showcase */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#F7F5EF] border border-[#DDDCCF]">
                {/* Competitor 1: The User */}
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <img
                      src="/default-avatar.png"
                      alt="Developer Avatar"
                      className="w-10 h-10 rounded-xl object-cover border border-[#DDDCCF] shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-md bg-[#FFFFFF] border border-[#DDDCCF] text-[#A67C42]">
                      <Flame className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0D1321] truncate">@you (Challenger)</div>
                    <div className="text-[10px] font-mono text-[#687386]">1,250 pts • Tier IV</div>
                  </div>
                </div>

                {/* Competitor 2: Opponent */}
                <div className="flex items-center gap-2.5 border-l border-[#DDDCCF] pl-3">
                  <div className="relative shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Opponent Avatar"
                      className="w-10 h-10 rounded-xl object-cover border border-[#DDDCCF] shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-md bg-[#FFFFFF] border border-[#DDDCCF] text-[#748CAB]">
                      <Trophy className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0D1321] truncate">@sarah_c</div>
                    <div className="text-[10px] font-mono text-[#687386]">2,450 pts • Master</div>
                  </div>
                </div>
              </div>

              {/* Code Snippet Card */}
              <div className="rounded-2xl bg-[#F7F5EF] border border-[#DDDCCF] p-3.5 space-y-2 font-mono text-[11px] text-[#0D1321] relative overflow-hidden">
                <div className="flex items-center justify-between text-[#687386] text-[10px] pb-1 border-b border-[#DDDCCF]">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-[#1D2D44]" />
                    <span>challenge_worker.js</span>
                  </span>
                  <span className="text-[#55765B] font-semibold">12/12 Tests Passing</span>
                </div>

                <pre className="text-[#0D1321] overflow-x-auto leading-relaxed pt-1">
                  <code>
                    <span className="text-[#1D2D44] font-bold">async function</span>{' '}
                    <span className="text-[#3E5C76] font-semibold">solveChallenge</span>(solution) &#123;{'\n'}
                    {'  '}<span className="text-[#1D2D44]">const</span> verified ={' '}
                    <span className="text-[#A67C42]">await</span> runSandboxTests(solution);{'\n'}
                    {'  '}<span className="text-[#1D2D44]">if</span> (verified.pass) &#123;{'\n'}
                    {'    '}<span className="text-[#55765B] font-bold">return</span> awardReputation(&#123;{' '}
                    <span className="text-[#0D1321]">points: +350</span>,{' '}
                    <span className="text-[#687386]">rank: 'Grandmaster'</span> &#125;);{'\n'}
                    {'  '}&#125;{'\n'}
                    &#125;
                  </code>
                </pre>
              </div>

              {/* Badges & Live Achievements */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#F5EEDF] border border-[#A67C42]/30 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FFFFFF] text-[#A67C42] border border-[#DDDCCF] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#0D1321]">+350 XP Bonus</div>
                    <div className="text-[9px] text-[#687386]">First Blood solve</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#EAF0E7] border border-[#55765B]/30 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FFFFFF] text-[#55765B] border border-[#DDDCCF] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#0D1321]">Grandmaster Tier</div>
                    <div className="text-[9px] text-[#687386]">Top 1% Global</div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="w-full py-2 rounded-xl text-xs font-semibold text-[#0D1321] hover:text-[#F0EBD8] bg-[#F7F5EF] hover:bg-[#1D2D44] border border-[#DDDCCF] text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Enter This Arena Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
