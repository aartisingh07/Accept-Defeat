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
        return 'bg-[#EAF0E7] text-[#55765B] border-[#55765B]/30';
      case 'Medium':
        return 'bg-[#F5EEDF] text-[#A67C42] border-[#A67C42]/30';
      case 'Hard':
        return 'bg-[#F7EAE6] text-[#B65C50] border-[#B65C50]/30';
      default:
        return 'bg-[#F7F5EF] text-[#0D1321] border-[#DDDCCF]';
    }
  };

  const getBadgeStyle = (badgeType) => {
    switch (badgeType) {
      case 'popular':
        return 'bg-[#F7EAE6] text-[#B65C50] border-[#B65C50]/30';
      case 'match':
        return 'bg-[#EAF0E7] text-[#55765B] border-[#55765B]/30';
      case 'trending':
        return 'bg-[#F5EEDF] text-[#A67C42] border-[#A67C42]/30';
      default:
        return 'bg-[#F7F5EF] text-[#1D2D44] border-[#DDDCCF]';
    }
  };

  const renderTechIcon = () => {
    if (challenge.iconType === 'react') {
      return (
        <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] flex items-center justify-center text-[#1D2D44]">
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
        <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] flex items-center justify-center text-[#55765B] font-mono font-bold text-xs">
          node
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] flex items-center justify-center text-[#1D2D44]">
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
      <div className="dashboard-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-[#748CAB] transition-all">
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
              <h3 className="text-sm font-bold text-[#0D1321] group-hover:text-[#1D2D44] transition-colors">
                {challenge.title}
              </h3>
              <p className="text-xs text-[#3E5C76] line-clamp-2 mt-1 leading-relaxed">
                {challenge.description}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {challenge.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[#0D1321] text-[10px] font-mono border border-[#DDDCCF]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Creator, Points & Solve Button */}
        <div className="pt-2 border-t border-[#DDDCCF]/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src={challenge.creator.avatar}
              alt={challenge.creator.name}
              className="w-5 h-5 rounded-full object-cover border border-[#DDDCCF]"
            />
            <span className="text-[11px] text-[#3E5C76]">by {challenge.creator.name}</span>
          </div>

          <div className="flex items-center gap-1 text-[#A67C42] font-semibold text-xs">
            <Coins className="w-3.5 h-3.5 fill-[#A67C42]" />
            <span>{challenge.points} pts</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (onSolve) onSolve(challenge);
            setModalOpen(true);
          }}
          className="bg-[#1D2D44] hover:bg-[#0D1321] w-full py-2 rounded-xl text-xs font-semibold text-[#F0EBD8] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-colors"
        >
          <span>Solve Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Challenge Solve / Preview Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#FFFFFF] border border-[#DDDCCF] shadow-2xl p-6 text-left space-y-4 text-[#0D1321]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#1D2D44] font-bold uppercase tracking-widest">
                  Live Battle Sandbox
                </span>
                <h2 className="text-lg font-bold text-[#0D1321] mt-0.5">{challenge.title}</h2>
              </div>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSubmissionFeedback(null);
                }}
                className="p-1 rounded-lg text-[#3E5C76] hover:text-[#0D1321] hover:bg-[#F7F5EF] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#3E5C76] leading-relaxed">{challenge.description}</p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#0D1321]">Your Code Solution:</label>
              <textarea
                value={solutionCode}
                onChange={(e) => setSolutionCode(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] font-mono text-xs text-[#0D1321] focus:outline-none focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]/30"
              />
            </div>

            {submissionFeedback && (
              <div className="p-3 rounded-xl bg-[#EAF0E7] border border-[#55765B]/40 text-xs text-[#55765B] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{submissionFeedback}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#A67C42] font-semibold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> +{challenge.points} XP on pass
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-[#0D1321] hover:bg-[#F7F5EF] cursor-pointer font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmitSolution}
                  disabled={isSubmitting}
                  className="bg-[#1D2D44] hover:bg-[#0D1321] px-4 py-1.5 rounded-xl text-xs font-semibold text-[#F0EBD8] cursor-pointer disabled:opacity-50 transition-colors"
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
