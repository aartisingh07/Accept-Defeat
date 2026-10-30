import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Flame, Search, ChevronRight, Sparkles, Users } from 'lucide-react';

const CHALLENGES = [
  {
    id: 'ch-01',
    title: 'Fix Race Condition in Async Event Queue',
    difficulty: 'Hard',
    xp: 350,
    solvedCount: 142,
    category: 'Concurrency',
    language: 'TypeScript / Node.js',
    tags: ['Async', 'Locks', 'EventLoop'],
    description: 'A multi-threaded worker queue occasionally loses task acknowledgments under peak load. Pinpoint the mutex race condition and ensure zero data drop.'
  },
  {
    id: 'ch-02',
    title: 'Memory Leak in Long-Lived WebSocket Gateway',
    difficulty: 'Medium',
    xp: 220,
    solvedCount: 389,
    category: 'System Performance',
    language: 'JavaScript / V8',
    tags: ['WebSockets', 'Memory', 'GarbageCollection'],
    description: 'Unsubscribed clients keep listener references alive in heap memory. Optimize cleanup logic to prevent memory bloat.'
  },
  {
    id: 'ch-03',
    title: 'CSS Grid Subgrid Layout Breakdown on Safari',
    difficulty: 'Easy',
    xp: 90,
    solvedCount: 812,
    category: 'Frontend Bugs',
    language: 'CSS / Tailwind',
    tags: ['CSSGrid', 'Subgrid', 'CrossBrowser'],
    description: 'Solve nested card misalignment across older WebKit viewports while maintaining fluid responsive column widths.'
  },
  {
    id: 'ch-04',
    title: 'Optimize O(N^2) Topological Sort in Dependency Graph',
    difficulty: 'Hard',
    xp: 400,
    solvedCount: 98,
    category: 'Algorithms',
    language: 'Python / Rust',
    tags: ['Graph', 'Topological', 'DAG'],
    description: 'The package dependency resolver stalls on cycles and deep graphs. Implement Kahn’s algorithm with cycle detection in linear time.'
  },
  {
    id: 'ch-05',
    title: 'SQL Injection via Unsanitized JSON Payload',
    difficulty: 'Medium',
    xp: 240,
    solvedCount: 421,
    category: 'Security Defeat',
    language: 'PostgreSQL / Express',
    tags: ['SQLi', 'Sanitization', 'ORM'],
    description: 'Analyze an exploitable raw query snippet, patch it with parameterized queries, and pass the automated penetration tests.'
  }
];

export default function ChallengesModal({ isOpen, onClose, onSelectChallengeForAuth }) {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChallenges = CHALLENGES.filter((c) => {
    const matchesFilter = filter === 'All' || c.difficulty === filter;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#101827] border border-purple-500/30 shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(139,92,246,0.2)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0E1524]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Live Public Challenges
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Arena Open
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Preview active competitive coding bugs before logging in
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="px-6 py-3.5 bg-[#0B101E] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by title, tag, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#141E34] border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Difficulty filters */}
              <div className="flex items-center gap-1.5">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setFilter(diff)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      filter === diff
                        ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                        : 'bg-[#141E34] text-slate-400 hover:text-white hover:bg-[#1B2742]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Challenge List */}
            <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-slate-800/50">
              {filteredChallenges.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No challenges matched your query.
                </div>
              ) : (
                filteredChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="pt-3.5 first:pt-0 group hover:bg-slate-800/30 p-3 rounded-2xl transition-all border border-transparent hover:border-purple-500/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getDifficultyBadge(
                              challenge.difficulty
                            )}`}
                          >
                            {challenge.difficulty}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {challenge.language}
                          </span>
                          <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> +{challenge.xp} XP
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {challenge.title}
                        </h3>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {challenge.description}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          {challenge.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded bg-[#172138] text-slate-300 border border-slate-700/50 font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 ml-auto">
                            <Users className="w-3 h-3" /> {challenge.solvedCount} solved
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectChallengeForAuth();
                        }}
                        className="self-center px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600/90 hover:bg-purple-500 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105"
                      >
                        <span>Battle</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Sign Up Callout */}
            <div className="p-4 bg-[#0A0F1D] border-t border-slate-800 text-center flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Ready to challenge real minds? Log in or create your profile.</span>
              </span>
              <button
                onClick={() => {
                  onClose();
                  onSelectChallengeForAuth();
                }}
                className="text-purple-300 font-semibold hover:underline cursor-pointer"
              >
                Sign In to Code &rarr;
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
