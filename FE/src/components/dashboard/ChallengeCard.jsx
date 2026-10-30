import { useState } from 'react';
import { ArrowRight, Star, Flame, Sparkles, Coins, CheckCircle, X, Code2 } from 'lucide-react';

export default function ChallengeCard({ challenge, onSolve }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [solutionCode, setSolutionCode] = useState('// Write your fix here\n');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  const getDifficultyBadge = (diff) => {
    switch (diff) {
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

  const getBadgeStyle = (badgeType) => {
    switch (badgeType) {
      case 'popular':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'match':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'trending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  // Tech stack icon representation
  const renderTechIcon = () => {
    if (challenge.iconType === 'react') {
      return (
        <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <svg className="w-6 h-6 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <ellipse cx="12" cy="12" rx="10" ry="4" strokeWidth="1.5" />
            <ellipse cx="12" cy="12" rx="10" ry="4" strokeWidth="1.5" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" strokeWidth="1.5" transform="rotate(120 12 12)" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>
      );
    }
    if (challenge.iconType === 'node') {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
          node
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-green-950/40 border border-green-500/30 flex items-center justify-center text-green-400">
        <Code2 className="w-5 h-5" />
      </div>
    );
  };

  const handleSubmitSolution = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionFeedback('Solution submitted to test sandbox! Passing 4/4 test suites.');
    }, 1200);
  };

  return (
    <>
      <div className="dashboard-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-purple-500/35 transition-all">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${getBadgeStyle(
              challenge.badgeType
            )}`}
          >
            {challenge.badgeType === 'popular' && <Flame className="w-3 h-3" />}
            {challenge.badgeType === 'match' && <Sparkles className="w-3 h-3" />}
            {challenge.badgeType === 'trending' && <Star className="w-3 h-3" />}
            <span>{challenge.badge}</span>
          </span>

          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getDifficultyBadge(
              challenge.difficulty
            )}`}
          >
            {challenge.difficulty}
          </span>
        </div>

        {/* Tech Icon, Title & Description */}
        <div className="space-y-2.5 text-left">
          <div className="flex items-start gap-3">
            {renderTechIcon()}
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                {challenge.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {challenge.description}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {challenge.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-[#131D33] text-slate-300 text-[10px] font-mono border border-slate-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Creator, Points & Solve Button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src={challenge.creator.avatar}
              alt={challenge.creator.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-[11px] text-slate-400">by {challenge.creator.name}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs">
            <Coins className="w-3.5 h-3.5 fill-amber-400" />
            <span>{challenge.points} pts</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (onSolve) onSolve(challenge);
            setModalOpen(true);
          }}
          className="btn-primary-purple w-full py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Solve Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Challenge Solve / Preview Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0D1528] border border-purple-500/30 shadow-2xl p-6 text-left space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                  Live Battle Sandbox
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">{challenge.title}</h2>
              </div>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSubmissionFeedback(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{challenge.description}</p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Your Code Solution:</label>
              <textarea
                value={solutionCode}
                onChange={(e) => setSolutionCode(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-xl bg-[#070B14] border border-slate-700 font-mono text-xs text-emerald-300 focus:outline-none focus:border-purple-500"
              />
            </div>

            {submissionFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{submissionFeedback}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> +{challenge.points} XP on pass
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmitSolution}
                  disabled={isSubmitting}
                  className="btn-primary-purple px-4 py-1.5 rounded-xl text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Evaluating...' : 'Submit Solution'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

