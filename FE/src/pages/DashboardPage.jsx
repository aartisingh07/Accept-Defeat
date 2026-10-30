import DashboardLayout from '../components/layout/DashboardLayout';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import StatsGrid from '../components/dashboard/StatsGrid';
import RecommendedChallenges from '../components/dashboard/RecommendedChallenges';
import RecentActivity from '../components/dashboard/RecentActivity';
import OnlineDevelopers from '../components/dashboard/OnlineDevelopers';
import SkillsCard from '../components/dashboard/SkillsCard';
import AchievementsCard from '../components/dashboard/AchievementsCard';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Hero Banner */}
        <WelcomeHero />

        {/* 4 Stats Cards */}
        <StatsGrid />

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Feed: Recommended Challenges & Recent Activity */}
          <div className="lg:col-span-8 space-y-6">
            <RecommendedChallenges />
            <RecentActivity />
          </div>

          {/* Right Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-6">
            <OnlineDevelopers />
            <SkillsCard />
            <AchievementsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
