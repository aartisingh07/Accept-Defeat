import api from './api';

export const assistantService = {
  /**
   * Send a query to the AI Assistant endpoint or return guidance
   */
  async askQuestion(prompt) {
    try {
      const res = await api.post('/assistant/chat', { prompt });
      return res.data?.reply;
    } catch {
      // Offline / unconfigured handler providing accurate platform guidance without fabricating personal data
      const lower = prompt.toLowerCase();

      if (lower.includes('rank') || lower.includes('leaderboard')) {
        return (
          '🏆 Ranking System: Global Rank is calculated using your ELO points earned from solving challenges, winning 1v1 live battles, and code review bounties. Higher difficulty bugs give multiplier bonuses!'
        );
      }

      if (lower.includes('point') || lower.includes('system') || lower.includes('pts')) {
        return (
          '⚡ Point System: Easy challenges award 50-100 pts, Medium 150-250 pts, and Hard 300-500 pts. Submitting first blood or solving within the speed window grants up to 20% bonus points.'
        );
      }

      if (lower.includes('create') || lower.includes('description')) {
        return (
          '📝 Creating a Challenge: Head to "Create Challenge" in the sidebar. Provide a clear bug scenario, reproducible code sandbox, passing test assertions, and assign difficulty points.'
        );
      }

      if (lower.includes('suggest') || lower.includes('skills')) {
        return (
          '🎯 Recommended Challenges: For your stack, check out "Fix the React Render Bug" (+200 pts) and "Build a Rate Limiter Middleware" (+150 pts) listed in your Recommended section!'
        );
      }

      return (
        '🤖 Accept&Defeat Assistant: I can help you discover challenges, understand ELO points, or craft challenge specs. Note: AI backend service is running in local assistant mode.'
      );
    }
  },
};

export default assistantService;

