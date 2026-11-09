import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import BrandLogo from '../BrandLogo';

export default function LandingNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'Home', onClick: () => scrollToSection('hero') },
    { label: 'Features', onClick: () => scrollToSection('features') },
    { label: 'How It Works', onClick: () => scrollToSection('how-it-works') },
    { label: 'Challenges', onClick: () => navigate('/challenges') },
    { label: 'Leaderboard', onClick: () => scrollToSection('competitive-arena') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#DDDCCF] shadow-[0_4px_20px_rgba(13,19,33,0.06)] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" onClick={() => scrollToSection('hero')} />
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-[#F7F5EF] text-[#0D1321] border border-[#DDDCCF]">
            <Sparkles className="w-2.5 h-2.5 text-[#748CAB]" />
            <span>v2.0 Arena</span>
          </span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#DDDCCF] shadow-[0_2px_8px_rgba(13,19,33,0.04)]">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={link.onClick}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#3E5C76] hover:text-[#0D1321] hover:bg-[#F7F5EF] transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Auth Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0D1321] hover:bg-[#F7F5EF] border border-[#DDDCCF] transition-all cursor-pointer"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="btn-primary-deep-space px-4 py-2 rounded-xl text-xs font-semibold text-[#F0EBD8] flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <span>Sign Up</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0D1321] bg-[#F7F5EF] border border-[#DDDCCF] cursor-pointer"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-[#FFFFFF] border border-[#DDDCCF] text-[#0D1321] hover:bg-[#F7F5EF] focus:outline-none cursor-pointer shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#1D2D44]" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-3 pb-6 bg-[#FFFFFF] border-b border-[#DDDCCF] shadow-xl animate-fadeIn space-y-3">
          <nav className="flex flex-col space-y-1 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={link.onClick}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0D1321] hover:bg-[#F7F5EF] border border-transparent hover:border-[#DDDCCF] transition-all cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#DDDCCF] flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#0D1321] bg-[#F7F5EF] border border-[#DDDCCF] text-center cursor-pointer"
            >
              Developer Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/signup');
              }}
              className="btn-primary-deep-space w-full py-2.5 rounded-xl text-xs font-semibold text-[#F0EBD8] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Start Competing — Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
