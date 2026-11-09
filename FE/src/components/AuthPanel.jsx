import { useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthPanel({
  activeTab,
  direction,
  onTabChange,
  onForgotPassword,
}) {
  const shouldReduceMotion = useReducedMotion();
  const lastSwitchTime = useRef(0);

  // Prevent rapid clicks from breaking animation
  const handleTabClick = (newTab) => {
    const now = Date.now();
    if (now - lastSwitchTime.current < 450) return;
    lastSwitchTime.current = now;
    if (newTab !== activeTab) {
      onTabChange(newTab);
    }
  };

  const formVariants = {
    enter: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 35 : -35,
      opacity: 0,
      filter: shouldReduceMotion ? 'none' : 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 },
        opacity: { duration: 0.45, ease: 'easeOut' },
        filter: { duration: 0.35 },
      },
    },
    exit: (dir) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -35 : 35,
      opacity: 0,
      filter: shouldReduceMotion ? 'none' : 'blur(4px)',
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 },
        opacity: { duration: 0.35, ease: 'easeIn' },
        filter: { duration: 0.25 },
      },
    }),
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Outer Card with White Background, Neutral Border, Elegant Shadow */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle Deep Sea Ambient Accent inside card */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#748CAB]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#1D2D44]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Sliding Tab Switcher */}
        <div className="relative mb-6 p-1 rounded-2xl bg-[#F7F5EF] border border-[#DDDCCF] flex items-center shadow-inner">
          {/* Animated Deep Space Blue Pill Indicator */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-xl bg-[#1D2D44] shadow-sm"
            initial={false}
            animate={{
              left: activeTab === 'login' ? '4px' : '50%',
              width: 'calc(50% - 4px)',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 32,
            }}
          />

          {/* Login Tab Button */}
          <button
            type="button"
            onClick={() => handleTabClick('login')}
            className={`relative z-10 w-1/2 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors duration-200 cursor-pointer select-none ${
              activeTab === 'login' ? 'text-[#F0EBD8]' : 'text-[#3E5C76] hover:text-[#0D1321]'
            }`}
            aria-selected={activeTab === 'login'}
            role="tab"
          >
            Login
          </button>

          {/* Sign Up Tab Button */}
          <button
            type="button"
            onClick={() => handleTabClick('signup')}
            className={`relative z-10 w-1/2 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors duration-200 cursor-pointer select-none ${
              activeTab === 'signup' ? 'text-[#F0EBD8]' : 'text-[#3E5C76] hover:text-[#0D1321]'
            }`}
            aria-selected={activeTab === 'signup'}
            role="tab"
          >
            Sign Up
          </button>
        </div>

        {/* Form Container with Directional Sliding & No Overlapping */}
        <div className="relative min-h-[460px] flex flex-col justify-center overflow-hidden">
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            {activeTab === 'login' ? (
              <motion.div
                key="login-form-view"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <LoginForm
                  onSwitchTab={() => handleTabClick('signup')}
                  onForgotPassword={onForgotPassword}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup-form-view"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <SignupForm onSwitchTab={() => handleTabClick('login')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
