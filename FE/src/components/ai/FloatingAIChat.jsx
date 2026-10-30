import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Bot, Sparkles, X } from 'lucide-react';
import AIChatHeader from './AIChatHeader';
import AIMessageList from './AIMessageList';
import AIChatInput from './AIChatInput';
import SuggestedPrompts from './SuggestedPrompts';
import aiService from '../../services/aiService';
import { useAuth } from '../../context/useAuth';

const INITIAL_WELCOME = {
  id: 'welcome-msg',
  role: 'assistant',
  content:
    "Hey! 👋 I'm your Accept&Defeat AI assistant. Need help finding a coding challenge, debugging an issue, or improving your skills? Let's get started!",
  timestamp: 'Just now',
};

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [isThinking, setIsThinking] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

  const { user } = useAuth();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend || isThinking) return;

    setErrorNotice(null);
    setLastFailedMessage(null);

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    const context = {
      username: user?.username || 'Contestant',
      skills: user?.skills || ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      points: user?.points || 1250,
      currentPath: location.pathname,
    };

    try {
      const reply = await aiService.sendMessage({ message: textToSend, context });
      const assistantMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setErrorNotice('Failed to reach AI assistant service. Tap retry to attempt again.');
      setLastFailedMessage(textToSend);
    } finally {
      setIsThinking(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage);
    }
  };

  const hasOnlyWelcome = messages.length === 1;

  return (
    <>
      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 25, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 25, scale: 0.96 }
            }
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[410px] max-w-[calc(100vw-24px)] h-[620px] max-h-[calc(100dvh-120px)] flex flex-col rounded-3xl bg-[#0D1528]/95 backdrop-blur-2xl border border-purple-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(139,92,246,0.2)] overflow-hidden"
            role="dialog"
            aria-label="Accept&Defeat AI Assistant Chat"
          >
            {/* Header */}
            <AIChatHeader
              onClose={() => setIsOpen(false)}
              onMinimize={() => setIsOpen(false)}
            />

            {/* Message List */}
            <AIMessageList messages={messages} isThinking={isThinking} />

            {/* Clickable Suggested Prompts when fresh */}
            {hasOnlyWelcome && (
              <div className="px-4 pb-2">
                <SuggestedPrompts
                  onSelectPrompt={handleSendMessage}
                  disabled={isThinking}
                />
              </div>
            )}

            {/* Composer Input */}
            <AIChatInput
              onSendMessage={handleSendMessage}
              isThinking={isThinking}
              error={errorNotice}
              onRetry={lastFailedMessage ? handleRetry : null}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
          className={`relative w-14 h-14 sm:w-15 sm:h-15 rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-300 shadow-[0_4px_25px_rgba(139,92,246,0.55)] border-2 ${
            isOpen
              ? 'bg-[#10182C] border-purple-400 text-purple-300 shadow-[0_0_30px_rgba(139,92,246,0.7)]'
              : 'bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] border-purple-300/40 text-white hover:shadow-[0_0_35px_rgba(139,92,246,0.8)]'
          }`}
          aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          title="Ask Accept&Defeat AI"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform rotate-0 group-hover:rotate-90 duration-200" />
          ) : (
            <>
              <Bot className="w-6 h-6 transition-transform group-hover:scale-110" />
              <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-cyan-300 animate-pulse" />
              {/* Online pulse dot */}
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070B14]" />
            </>
          )}
        </motion.button>

        {/* Hover Tooltip (Hidden when open) */}
        {!isOpen && (
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-xl bg-[#0D1528] border border-purple-500/30 text-xs font-semibold text-purple-200 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask Accept&amp;Defeat AI
          </div>
        )}
      </div>
    </>
  );
}

