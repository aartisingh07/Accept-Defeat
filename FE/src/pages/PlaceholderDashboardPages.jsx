import { Swords, PlusCircle, FileCode2, MessageSquare, Users, Trophy, User, Settings } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/useAuth';

function PageShell({ icon: Icon, title, description, children }) {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 text-left">
        <div>
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-[#1D2D44]" />
            <h1 className="text-2xl font-bold text-[#0D1321] tracking-tight">{title}</h1>
          </div>
          <p className="text-xs text-[#3E5C76] mt-1">{description}</p>
        </div>

        <div className="dashboard-card rounded-2xl p-6">{children}</div>
      </div>
    </DashboardLayout>
  );
}

export function LiveBattlesPage() {
  return (
    <PageShell
      icon={Swords}
      title="Live Coding Battles"
      description="Compete in real-time 1v1 algorithmic duels with live test execution"
    >
      <div className="py-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#1D2D44] flex items-center justify-center mx-auto shadow-sm">
          <Swords className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#0D1321]">Live Battle Arena Matchmaking</h3>
        <p className="text-xs text-[#3E5C76] max-w-sm mx-auto">
          Ready to duel? Queue up for a 15-minute speed debugging match against an opponent in your ELO bracket.
        </p>
        <button
          onClick={() => alert('Searching for opponent in ELO bracket 1200-1300...')}
          className="bg-[#1D2D44] hover:bg-[#0D1321] text-[#F0EBD8] px-5 py-2.5 rounded-xl text-xs font-semibold text-[#F0EBD8] cursor-pointer shadow-sm hover:shadow"
        >
          Find Match
        </button>
      </div>
    </PageShell>
  );
}

export function CreateChallengePage() {
  return (
    <PageShell
      icon={PlusCircle}
      title="Create a Coding Challenge"
      description="Author real-world bug scenarios and reward points to developers who solve them"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert('Challenge created and sent to review pipeline!');
        }}
        className="space-y-4 max-w-2xl text-[#0D1321]"
      >
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#0D1321]">Challenge Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Memory Leak in WebSocket Listener Pool"
            className="w-full h-10 px-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-xs text-[#0D1321] focus:outline-none focus:border-[#1D2D44]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0D1321]">Difficulty</label>
            <select className="w-full h-10 px-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-xs text-[#0D1321] focus:outline-none focus:border-[#1D2D44]">
              <option>Easy (50-100 pts)</option>
              <option>Medium (150-250 pts)</option>
              <option>Hard (300-500 pts)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0D1321]">Technology Tag</label>
            <input
              type="text"
              placeholder="React, Node.js, Express"
              className="w-full h-10 px-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-xs text-[#0D1321] focus:outline-none focus:border-[#1D2D44]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#0D1321]">Bug Scenario Description</label>
          <textarea
            rows={4}
            required
            placeholder="Describe the bug symptoms, environment, and expected behavior..."
            className="w-full p-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-xs text-[#0D1321] focus:outline-none focus:border-[#1D2D44]"
          />
        </div>

        <button
          type="submit"
          className="bg-[#1D2D44] hover:bg-[#0D1321] text-[#F0EBD8] px-5 py-2.5 rounded-xl text-xs font-semibold text-[#F0EBD8] cursor-pointer shadow-sm hover:shadow"
        >
          Publish Challenge
        </button>
      </form>
    </PageShell>
  );
}

export function MyChallengesPage() {
  return (
    <PageShell
      icon={FileCode2}
      title="My Challenges"
      description="Track challenges you have created, attempted, or solved"
    >
      <div className="py-8 text-center text-xs text-[#3E5C76] space-y-2">
        <FileCode2 className="w-8 h-8 text-[#1D2D44] mx-auto" />
        <p>You have 8 active in-progress challenge attempts and 12 completed solves.</p>
      </div>
    </PageShell>
  );
}

export function MessagesPage() {
  return (
    <PageShell
      icon={MessageSquare}
      title="Messages"
      description="Direct communication and squad battle invites"
    >
      <div className="space-y-3">
        {[
          { sender: 'Karan Mehta', preview: 'Hey! Want to team up for Saturday’s 3v3 bug hackathon?', time: '10m ago' },
          { sender: 'Riya Sharma', preview: 'Reviewed your fix for the render bug. Great approach on the reducer!', time: '2h ago' },
          { sender: 'System Arena', preview: 'You earned +120 points for passing 5 automated test suites.', time: '1d ago' },
        ].map((m, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#0D1321]">{m.sender}</div>
              <div className="text-xs text-[#3E5C76]">{m.preview}</div>
            </div>
            <span className="text-[10px] text-[#3E5C76] shrink-0 font-mono">{m.time}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function DevelopersPage() {
  return (
    <PageShell
      icon={Users}
      title="Developers Directory"
      description="Connect with competitive software engineers across the globe"
    >
      <p className="text-xs text-[#3E5C76]">
        Browse and challenge verified coders by language, ELO tier, and reputation points.
      </p>
    </PageShell>
  );
}

export function LeaderboardPage() {
  return (
    <PageShell
      icon={Trophy}
      title="Global Leaderboard"
      description="Top ranking developers and competitive battle champions"
    >
      <div className="space-y-2">
        {[
          { rank: 1, name: 'Alex Rivera', handle: '@alex_r', pts: '4,890', tier: 'Grandmaster' },
          { rank: 2, name: 'Sarah Chen', handle: '@sarah_c', pts: '4,450', tier: 'Master' },
          { rank: 3, name: 'Dmitri Volkov', handle: '@dmitri_v', pts: '4,120', tier: 'Master' },
          { rank: 42, name: 'Aarti Singh (You)', handle: '@aarti_dev', pts: '1,250', tier: 'Challenger' },
        ].map((u) => (
          <div
            key={u.rank}
            className={`p-3 rounded-xl flex items-center justify-between text-xs ${
              u.rank === 42
                ? 'bg-[#EAF0E7] border border-[#55765B]/40 text-[#0D1321] font-semibold'
                : 'bg-[#F7F5EF] border border-[#DDDCCF] text-[#0D1321]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold w-6 text-center text-[#3E5C76]">#{u.rank}</span>
              <div>
                <span className="font-bold text-[#0D1321] mr-2">{u.name}</span>
                <span className="text-[#3E5C76] font-mono text-[11px]">{u.handle}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFFFFF] text-[#1D2D44] border border-[#DDDCCF] font-semibold">
                {u.tier}
              </span>
              <span className="font-bold text-[#A67C42]">{u.pts} pts</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  return (
    <PageShell
      icon={User}
      title="My Developer Profile"
      description="View and update your competitive developer profile"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src="/default-avatar.png"
            alt="Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#DDDCCF]"
          />
          <div>
            <h2 className="text-lg font-bold text-[#0D1321]">{user?.username || 'Developer'}</h2>
            <p className="text-xs text-[#1D2D44] font-mono">{user?.email || 'verified contestant'}</p>
          </div>
        </div>

        <div className="pt-2 text-xs text-[#3E5C76]">
          Member since 2026 · Solved 12 challenges · Win rate: 78% in live battles.
        </div>
      </div>
    </PageShell>
  );
}

export function SettingsPage() {
  return (
    <PageShell
      icon={Settings}
      title="Settings"
      description="Manage account security, notifications, and battle preferences"
    >
      <div className="space-y-3 text-xs text-[#0D1321] max-w-lg">
        <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] flex items-center justify-between">
          <div>
            <div className="font-bold text-[#0D1321]">Live Battle Invitations</div>
            <div className="text-[11px] text-[#3E5C76]">Receive 1v1 coding battle challenges from online peers</div>
          </div>
          <input type="checkbox" defaultChecked className="accent-[#1D2D44] w-4 h-4" />
        </div>

        <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] flex items-center justify-between">
          <div>
            <div className="font-bold text-[#0D1321]">Email Digest on Solved Bugs</div>
            <div className="text-[11px] text-[#3E5C76]">Weekly breakdown of points earned and rank shifts</div>
          </div>
          <input type="checkbox" defaultChecked className="accent-[#1D2D44] w-4 h-4" />
        </div>
      </div>
    </PageShell>
  );
}
