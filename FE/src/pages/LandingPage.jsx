import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ChallengePreviewSection from '../components/landing/ChallengePreviewSection';
import CompetitiveArenaSection from '../components/landing/CompetitiveArenaSection';
import RewardsSection from '../components/landing/RewardsSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    document.title = 'Accept&Defeat — Competitive Developer Platform';

    // Handle hash scroll if arriving with hash like /#features
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-[#F0EBD8] text-[#0D1321] relative overflow-x-hidden selection:bg-[#748CAB]/30 selection:text-[#0D1321]">
      {/* Background Decorative Ambient Deep Sea Glows and Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left Dusty Denim ambient glow */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#748CAB]/15 rounded-full blur-[140px]" />
        {/* Bottom-right Deep Space Blue ambient glow */}
        <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] bg-[#1D2D44]/10 rounded-full blur-[150px]" />
        {/* Center subtle light surface glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#F7F5EF]/40 rounded-full blur-[160px]" />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" />
      </div>

      {/* Section 1: Navigation Bar */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        {/* Section 2: Hero Section */}
        <HeroSection />

        {/* Section 3: Platform Introduction / Core Pillars */}
        <FeaturesSection />

        {/* Section 4: How It Works */}
        <HowItWorksSection />

        {/* Section 5: Challenge Preview */}
        <ChallengePreviewSection />

        {/* Section 6: Competitive Arena */}
        <CompetitiveArenaSection />

        {/* Section 7: Rewards and Progression */}
        <RewardsSection />

        {/* Section 8: Final Call to Action */}
        <FinalCTASection />
      </main>

      {/* Section 9: Footer */}
      <LandingFooter />
    </div>
  );
}
