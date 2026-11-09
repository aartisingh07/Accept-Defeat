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
        return 'bg-[#EAF0E7] text-[#55765B] border-[#55765B]/30';
      case 'Medium':
        return 'bg-[#F5EEDF] text-[#A67C42] border-[#A67C42]/30';
      case 'Hard':
        return 'bg-[#F7EAE6] text-[#B65C50] border-[#B65C50]/30';
      default:
        return 'bg-[#F7F5EF] text-[#0D1321] border-[#DDDCCF]';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#FFFFFF] border border-[#DDDCCF] shadow-2xl overflow-hidden text-[#0D1321]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#DDDCCF] flex items-center justify-between shrink-0 bg-[#F7F5EF]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#DDDCCF] text-[#1D2D44] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#1D2D44]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0D1321] flex items-center gap-2">
                    Live Public Challenges
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#1D2D44] border border-[#DDDCCF] font-semibold">
                      Arena Open
                    </span>
                  </h2>
                  <p className="text-xs text-[#3E5C76]">
                    Preview active competitive coding bugs before logging in
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#3E5C76] hover:text-[#0D1321] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="px-6 py-3.5 bg-[#F7F5EF] border-b border-[#DDDCCF] flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#687386]" />
                <input
                  type="text"
                  placeholder="Filter by title, tag, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#FFFFFF] border border-[#DDDCCF] text-xs text-[#0D1321] placeholder-[#687386] focus:outline-none focus:border-[#1D2D44]"
                />
              </div>

              {/* Difficulty filters */}
              <div className="flex items-center gap-1.5">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setFilter(diff)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                      filter === diff
                        ? 'bg-[#1D2D44] text-[#F0EBD8] border-[#0D1321] shadow-sm font-semibold'
                        : 'bg-[#FFFFFF] text-[#3E5C76] hover:text-[#0D1321] border-[#DDDCCF]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Challenge List */}
            <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-[#DDDCCF]/50">
              {filteredChallenges.length === 0 ? (
                <div className="py-12 text-center text-[#687386] text-sm">
                  No challenges matched your query.
                </div>
              ) : (
                filteredChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="pt-3.5 first:pt-0 group hover:bg-[#F7F5EF]/70 p-3 rounded-2xl transition-all border border-transparent hover:border-[#DDDCCF]"
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
                          <span className="text-xs text-[#687386] font-mono">
                            {challenge.language}
                          </span>
                          <span className="text-xs text-[#1D2D44] font-bold flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-[#A67C42]" /> +{challenge.xp} XP
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#0D1321] group-hover:text-[#1D2D44] transition-colors">
                          {challenge.title}
                        </h3>

                        <p className="text-xs text-[#3E5C76] leading-relaxed line-clamp-2">
                          {challenge.description}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          {challenge.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded bg-[#F7F5EF] text-[#3E5C76] border border-[#DDDCCF] font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                          <span className="text-[11px] text-[#687386] flex items-center gap-1 ml-auto">
                            <Users className="w-3 h-3" /> {challenge.solvedCount} solved
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectChallengeForAuth();
                        }}
                        className="self-center px-3.5 py-2 rounded-xl text-xs font-semibold text-[#F0EBD8] bg-[#1D2D44] hover:bg-[#0D1321] transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-sm hover:scale-105"
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
            <div className="p-4 bg-[#F7F5EF] border-t border-[#DDDCCF] text-center flex items-center justify-between text-xs text-[#3E5C76]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1D2D44]" />
                <span>Ready to challenge real minds? Log in or create your profile.</span>
              </span>
              <button
                onClick={() => {
                  onClose();
                  onSelectChallengeForAuth();
                }}
                className="text-[#1D2D44] font-bold hover:underline cursor-pointer"
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
