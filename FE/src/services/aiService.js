import api from './api';

export const aiService = {
  /**
   * Send a chat message with contextual developer profile
   * @param {Object} payload
   * @param {string} payload.message - User prompt
   * @param {Object} payload.context - Authenticated user context (username, skills, points, path)
   * @returns {Promise<string>}
   */
  async sendMessage({ message, context = {} }) {
    try {
      // Attempt backend AI route
      const res = await api.post('/ai/chat', {
        message,
        context,
      });

      if (res.data?.reply) return res.data.reply;
      if (res.data?.message) return res.data.message;
    } catch {
      // If backend AI endpoint is not configured (404/offline), handle with smart local context
    }

    // Local context-aware responses without fabricating backend claims
    const lower = message.toLowerCase();
    const username = context.username || 'Warrior';
    const skills = context.skills && context.skills.length > 0
      ? context.skills.join(', ')
      : 'React, Node.js, MongoDB';

    if (lower.includes('recommend') || lower.includes('skills') || lower.includes('suggest')) {
      return (
        `🎯 **Recommended Challenges for ${username}**\n\n` +
        `Based on your active tech stack (**${skills}**), I recommend starting with:\n` +
        `• **Fix the React Render Bug** *(Medium • 200 pts)* — Great for mastering hook dependency memoization.\n` +
        `• **Build a Rate Limiter Middleware** *(Hard • 150 pts)* — Production-grade Express & sliding window cache.\n` +
        `• **Optimize MongoDB Query** *(Medium • 180 pts)* — Compound indexing & aggregation pipeline tuning.\n\n` +
        `You can jump right in from the **Explore Challenges** tab!`
      );
    }

    if (lower.includes('create') || lower.includes('author') || lower.includes('new challenge')) {
      return (
        `🛠️ **How to Author a Coding Challenge**\n\n` +
        `Head over to **Create Challenge** in the sidebar. High-quality challenges include:\n` +
        `1. **A Concrete Bug Scenario**: Describe real symptoms (e.g., memory leak under concurrency).\n` +
        `2. **Reproduction Sandbox**: Include boilerplate code with the subtle flaw.\n` +
        `3. **Automated Assertions**: Define unit tests that fail on the bug and pass only when solved.\n` +
        `4. **Difficulty & XP**: Easy (50–100 pts), Medium (150–250 pts), or Hard (300–500 pts).`
      );
    }

    if (lower.includes('point') || lower.includes('system') || lower.includes('rank') || lower.includes('elo')) {
      return (
        `⚡ **Accept&Defeat Reputation & Point System**\n\n` +
        `• **Challenge Solves**: Earn base XP based on difficulty. First blood bonus adds +15%!\n` +
        `• **Live 1v1 Battles**: Stake reputation points against opponents in real-time speed duels.\n` +
        `• **Leaderboard Tiers**: Climb from *Challenger* to *Master* and *Grandmaster* (Top 10).\n` +
        `• **Code Reviews**: Earn peer points for verifying community bug submissions.`
      );
    }

    if (lower.includes('debug') || lower.includes('code') || lower.includes('error') || lower.includes('bug')) {
      return (
        `🐛 **Debugging Strategy**\n\n` +
        `Paste your snippet or describe the behavior you are seeing! For competitive challenges, check:\n` +
        `• State mutation vs. immutable updates.\n` +
        `• Unhandled async promises or missing awaits in loops.\n` +
        `• Missing index constraints leading to query timeouts.\n` +
        `• Unsubscribed event listeners causing heap memory leaks.`
      );
    }

    return (
      `🤖 **Accept&Defeat Assistant**\n\n` +
      `Hey ${username}! I am your coding battle companion. I can help you discover challenges matching your stack (**${skills}**), explain the ELO rank rules, or guide you through creating challenges.\n\n` +
      `*Tip: To connect an external LLM (e.g. Gemini or OpenAI), configure \`POST /api/ai/chat\` in your Express backend.*`
    );
  },
};

export default aiService;

