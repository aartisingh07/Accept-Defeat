import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trophy, Compass, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import BrandLogo from '../components/BrandLogo';
import { useAuth } from '../context/useAuth';

const ALL_CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Fix Race Condition in Async Event Queue',
    difficulty: 'Hard',
    category: 'Concurrency',
    xp: 350,
    tags: ['Async', 'Locks', 'EventLoop'],
    description: 'A multi-threaded worker queue occasionally loses task acknowledgments under peak load. Pinpoint the mutex race condition and ensure zero data drop.',
  },
  {
    id: 'ch-2',
    title: 'Fix the React Render Bug',
    difficulty: 'Medium',
    category: 'Frontend Bugs',
    xp: 200,
    tags: ['React', 'Bug Fix', 'Hooks'],
    description: 'Component re-renders infinitely when state updates inside useEffect without dependency memoization.',
  },
  {
    id: 'ch-3',
    title: 'Build a Rate Limiter Middleware',
    difficulty: 'Hard',
    category: 'Backend Security',
    xp: 150,
    tags: ['Node.js', 'Express', 'Redis'],
    description: 'Create a token bucket rate limiter for Express using an in-memory store and sliding window counter.',
  },
  {
    id: 'ch-4',
    title: 'Optimize MongoDB Query Aggregation',
    difficulty: 'Medium',
    category: 'Database Optimization',
    xp: 180,
    tags: ['MongoDB', 'Indexes', 'Pipelines'],
    description: 'Current aggregation pipeline suffers from unindexed stage scans. Optimize with compound index lookups.',
  },
  {
    id: 'ch-5',
    title: 'CSS Grid Subgrid Layout Breakdown on Safari',
    difficulty: 'Easy',
    xp: 90,
    tags: ['CSSGrid', 'Subgrid', 'Safari'],
    description: 'Solve nested card misalignment across older WebKit viewports while maintaining fluid responsive column widths.',
  },
];

export default function ExploreChallengesPage() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = ALL_CHALLENGES.filter((c) => {
    const matchesFilter = filter === 'All' || c.difficulty === filter;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const content = (
    <div className="max-w-6xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Explore Competitive Challenges
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse real-world engineering bugs and competitive coding problems
          </p>
        </div>

        {!isAuthenticated && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer"
            >
              Sign In to Battle
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0D1528] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search challenges by title, tag, or language..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#070B14] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilter(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                filter === diff
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#121D33] text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="dashboard-card rounded-2xl p-5 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-400 font-semibold">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {item.difficulty}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> +{item.xp} XP
              </span>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login', { state: { from: { pathname: '/challenges' } } });
                  } else {
                    alert(`Attempting ${item.title}. Loading sandbox...`);
                  }
                }}
                className="btn-primary-purple px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Solve Challenge' : 'Sign in to Solve'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isAuthenticated) {
    return <DashboardLayout>{content}</DashboardLayout>;
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC]">
      <header className="h-16 px-6 border-b border-purple-500/20 flex items-center justify-between">
        <BrandLogo size="md" />
        <button
          onClick={() => navigate('/login')}
          className="btn-primary-purple px-4 py-2 rounded-xl text-xs font-semibold text-white"
        >
          Sign In
        </button>
      </header>
      <div className="p-6 sm:p-8">{content}</div>
    </div>
  );
}
