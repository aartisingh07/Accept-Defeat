import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Code2,
  Trophy,
  Globe,
  Sparkles,
  Flame,
  ShieldCheck,
  Users2,
  Terminal,
  ArrowRight,
  Server,
  Radio,
  Lock
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import AuthPanel from './AuthPanel';
import PromoIllustration from './PromoIllustration';
import ChallengesModal from './ChallengesModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ApiIntegrationModal from './ApiIntegrationModal';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function AuthLayout() {
  const [activeTab, setActiveTab] = useState('login');
  const [direction, setDirection] = useState(1);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setDirection(newTab === 'signup' ? 1 : -1);
    setActiveTab(newTab);
  };

  const isLogin = activeTab === 'login';

  // Feature highlight definitions
  const loginFeatures = [
    {
      icon: Terminal,
      title: 'Real coding challenges',
      description: 'Production bug scenarios from real open-source systems',
    },
    {
      icon: Trophy,
      title: 'Compete and earn points',
      description: 'Climb leaderboard tiers and gain verified reputation',
    },
    {
      icon: GithubIcon,
      title: 'Connect your GitHub',
      description: 'Showcase your solved repositories and battle badges',
    },
    {
      icon: Globe,
      title: 'Join a global developer community',
      description: 'Battle alongside 45,000+ engineers across 110 countries',
    },
  ];

  const signupFeatures = [
    {
      icon: Code2,
      title: 'Post or solve real challenges',
      description: 'Contribute tricky bug bounties or claim first blood',
    },
    {
      icon: Flame,
      title: 'Earn reputation points',
      description: 'Multiply your ELO rating in weekend live hack battles',
    },
    {
      icon: ShieldCheck,
      title: 'Showcase your skills',
      description: 'Prove your algorithmic depth and debugging acumen',
    },
    {
      icon: Users2,
      title: 'Be part of a growing community',
      description: 'Form competitive squads and challenge rival engineering teams',
    },
  ];

  const promoVariants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 25 : -25,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.45 },
      },
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -25 : 25,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const containerStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemFade = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] relative overflow-x-hidden flex flex-col justify-between selection:bg-purple-600/30 selection:text-purple-200">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left deep purple glow */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-[#8B5CF6]/15 rounded-full blur-[130px]" />
        {/* Bottom-right cyan/blue glow */}
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[140px]" />
        {/* Center subtle violet accent */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-[#7C3AED]/10 rounded-full blur-[120px]" />
        {/* Subtle dot matrix / grid texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <BrandLogo size="md" />

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Backend Spec Button */}
          <button
            type="button"
            onClick={() => setIsApiModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/50 hover:border-purple-400/50 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.15)]"
            title="Inspect backend API endpoints for Node.js / Express"
          >
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span>API Specs</span>
          </button>

          {/* Browse Challenges Button */}
          <button
            type="button"
            onClick={() => setIsChallengesOpen(true)}
            className="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-slate-200 hover:text-white bg-[#101827]/90 hover:bg-[#1A253E] border border-slate-700/60 hover:border-purple-500/60 transition-all cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            <span>Browse Challenges</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Promotional Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="relative overflow-hidden min-h-[290px] flex flex-col justify-center">
              <AnimatePresence custom={direction} mode="wait" initial={false}>
                {isLogin ? (
                  <motion.div
                    key="login-promo"
                    custom={direction}
                    variants={promoVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-5"
                  >
                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-mono tracking-widest uppercase">
                      <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                      <span>CODE · CHALLENGE · IMPROVE</span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-1">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
                        Challenge <br />
                        Real Minds. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#818CF8]">
                          Prove Yours.
                        </span>
                      </h1>
                      <p className="text-sm sm:text-base text-slate-300 max-w-lg pt-2 leading-relaxed font-normal">
                        Solve real problems, fix real bugs, and defeat developers in live challenges.
                      </p>
                    </div>

                    {/* 4 Feature Highlights */}
                    <motion.div
                      variants={containerStagger}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
                    >
                      {loginFeatures.map((feat, idx) => {
                        const Icon = feat.icon;
                        return (
                          <motion.div
                            key={idx}
                            variants={itemFade}
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-800/30 transition-colors group"
                          >
                            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/25 transition-all shrink-0">
                              <Icon className="w-4 h-4 text-purple-300" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                                {feat.title}
                              </div>
                              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                                {feat.description}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup-promo"
                    custom={direction}
                    variants={promoVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-5"
                  >
                    {/* Eyebrow badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-mono tracking-widest uppercase">
                      <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                      <span>CODE · COMPETE · GROW</span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-1">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
                        Same <br />
                        Platform. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#818CF8]">
                          Bigger Battles.
                        </span>
                      </h1>
                      <p className="text-sm sm:text-base text-slate-300 max-w-lg pt-2 leading-relaxed font-normal">
                        Create your account and start challenging developers worldwide.
                      </p>
                    </div>

                    {/* 4 Feature Highlights */}
                    <motion.div
                      variants={containerStagger}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
                    >
                      {signupFeatures.map((feat, idx) => {
                        const Icon = feat.icon;
                        return (
                          <motion.div
                            key={idx}
                            variants={itemFade}
                            className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-800/30 transition-colors group"
                          >
                            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/25 transition-all shrink-0">
                              <Icon className="w-4 h-4 text-purple-300" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                                {feat.title}
                              </div>
                              <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                                {feat.description}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Developer Illustration */}
            <div className="pt-2">
              <PromoIllustration activeTab={activeTab} />
            </div>
          </div>

          {/* RIGHT COLUMN: Authentication Panel */}
          <div className="lg:col-span-5 flex justify-center">
            <AuthPanel
              activeTab={activeTab}
              direction={direction}
              onTabChange={handleTabChange}
              onForgotPassword={() => setIsForgotPassOpen(true)}
            />
          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 gap-2">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Accept&amp;Defeat Platform. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>End-to-End Secure Battles</span>
          </span>
          <button
            type="button"
            onClick={() => setIsApiModalOpen(true)}
            className="hover:text-purple-400 transition-colors cursor-pointer"
          >
            Backend Architecture
          </button>
        </div>
      </footer>

      {/* Modals */}
      <ChallengesModal
        isOpen={isChallengesOpen}
        onClose={() => setIsChallengesOpen(false)}
        onSelectChallengeForAuth={() => {
          handleTabChange('signup');
        }}
      />

      <ForgotPasswordModal
        isOpen={isForgotPassOpen}
        onClose={() => setIsForgotPassOpen(false)}
      />

      <ApiIntegrationModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />
    </div>
  );
}
