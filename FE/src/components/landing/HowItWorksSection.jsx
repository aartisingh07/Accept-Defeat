import { UserCheck, Compass, Swords, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorksSection() {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      title: 'Create Your Account',
      description: 'Join Accept&Defeat and set up your developer profile.',
      detail:
        'Sign up with email or one-click OAuth (GitHub / Google). Customize your developer handle, select your preferred programming languages, and claim your initial tier ranking.',
      icon: UserCheck,
      badge: 'Step 1 • Onboarding',
    },
    {
      step: '02',
      title: 'Discover Challenges',
      description: 'Explore available coding challenges and find your next challenge.',
      detail:
        'Browse challenges curated by tech stacks—React, Node.js, Python, MongoDB, and concurrency. Filter by difficulty, points bounty, or live battle format.',
      icon: Compass,
      badge: 'Step 2 • Exploration',
    },
    {
      step: '03',
      title: 'Compete and Solve',
      description: 'Accept challenges, solve problems, and compete with other developers.',
      detail:
        'Dive into realistic debugging environments. Run test suites, battle other engineers in synchronized match countdowns, and submit clean, optimized solutions.',
      icon: Swords,
      badge: 'Step 3 • Combat',
    },
    {
      step: '04',
      title: 'Earn and Level Up',
      description: 'Gain points, coins, badges, and improve your competitive standing.',
      detail:
        'Climb the global arena leaderboard. Unlock rare achievement badges, build an irrefutable proof-of-skill profile, and gain industry recognition.',
      icon: Trophy,
      badge: 'Step 4 • Victory',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative bg-[#F7F5EF] border-y border-[#DDDCCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DDDCCF] text-[#0D1321] text-xs font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#748CAB]" />
            <span>Workflow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D1321] tracking-tight">
            Your Journey Starts Here
          </h2>

          <p className="text-sm sm:text-base text-[#3E5C76] leading-relaxed font-normal">
            From your very first line of code to the top of the global developer leaderboard in four intuitive steps.
          </p>
        </div>

        {/* 4 Connected Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-[#3E5C76]/30 -translate-y-12 z-0 pointer-events-none" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative z-10 rounded-3xl p-6 bg-[#FFFFFF] border border-[#DDDCCF] hover:border-[#748CAB] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group shadow-[0_2px_8px_rgba(13,19,33,0.04)]"
              >
                <div className="space-y-4">
                  {/* Top Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-[#1D2D44]">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#1D2D44] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-mono font-medium text-[#3E5C76] px-2 py-0.5 rounded-md bg-[#F7F5EF] border border-[#DDDCCF]">
                    {item.badge}
                  </span>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#0D1321] group-hover:text-[#1D2D44] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#3E5C76] leading-snug">
                      {item.description}
                    </p>
                    <p className="text-xs text-[#687386] leading-relaxed pt-1">
                      {item.detail}
                    </p>
                  </div>
                </div>

                {/* Step Arrow for progression */}
                <div className="pt-4 mt-4 border-t border-[#DDDCCF] flex items-center justify-between text-[11px] text-[#687386]">
                  <span>Phase {idx + 1} of 4</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#748CAB] group-hover:translate-x-1 group-hover:text-[#1D2D44] transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner inside How It Works */}
        <div className="mt-14 p-6 rounded-2xl bg-[#F7F5EF] border border-[#DDDCCF] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#0D1321]">Ready to begin Phase 01?</h4>
            <p className="text-xs text-[#3E5C76]">Registration takes less than 30 seconds with GitHub or Google.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="btn-primary-deep-space px-5 py-2.5 rounded-xl text-xs font-semibold text-[#F0EBD8] bg-[#1D2D44] hover:bg-[#0D1321] flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <span>Create Developer Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
