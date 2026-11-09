import { useNavigate } from 'react-router-dom';
import BrandLogo from '../BrandLogo';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function LandingFooter() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="border-t border-[#34465C] bg-[#0D1321] text-[#F0EBD8] relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo size="md" onClick={() => scrollToSection('hero')} />
            <p className="text-xs sm:text-sm text-[#748CAB] max-w-sm leading-relaxed font-normal">
              Accept&Defeat is a competitive developer platform where engineers battle in real-time, solve production-grade bugs, climb the global leaderboard, and verify their technical mastery.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#152237] border border-[#34465C] hover:border-[#748CAB] text-[#F0EBD8] hover:text-[#FFFFFF] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F0EBD8]">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#748CAB]">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('hero')}
                  className="hover:text-[#F0EBD8] transition-colors cursor-pointer"
                >
                  Home (Top)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="hover:text-[#F0EBD8] transition-colors cursor-pointer"
                >
                  Features & Pillars
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-[#F0EBD8] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/challenges')}
                  className="hover:text-[#F0EBD8] transition-colors cursor-pointer"
                >
                  Browse Challenges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('competitive-arena')}
                  className="hover:text-[#F0EBD8] transition-colors cursor-pointer"
                >
                  Arena Leaderboard
                </button>
              </li>
            </ul>
          </div>

          {/* Authentication & Portal */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F0EBD8]">
              Developer Portal
            </h4>
            <ul className="space-y-2 text-xs text-[#748CAB]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="hover:text-[#F0EBD8] transition-colors cursor-pointer"
                >
                  Developer Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="hover:text-[#F0EBD8] transition-colors cursor-pointer"
                >
                  Create New Account
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/challenges')}
                  className="hover:text-[#F0EBD8] transition-colors cursor-pointer"
                >
                  Public Challenge Catalog
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 mt-12 border-t border-[#34465C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#687386]">
          <div>
            &copy; {new Date().getFullYear()} Accept&amp;Defeat. All rights reserved. Built for competitive engineers.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Code. Compete. Conquer.</span>
            <span>•</span>
            <span className="font-mono text-[#748CAB]">v2.0 Arena</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
