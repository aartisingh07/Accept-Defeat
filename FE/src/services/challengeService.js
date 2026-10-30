import api from './api';

const MOCK_RECOMMENDED = [
  {
    id: 'ch-react-bug',
    title: 'Fix the React Render Bug',
    badge: 'Popular',
    badgeType: 'popular',
    difficulty: 'Medium',
    iconType: 'react',
    description: 'Component re-renders infinitely when state updates.',
    tags: ['React', 'Bug Fix', 'Frontend'],
    creator: {
      name: 'Riya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    points: 200,
    status: 'open',
  },
  {
    id: 'ch-rate-limiter',
    title: 'Build a Rate Limiter Middleware',
    badge: 'Good Match',
    badgeType: 'match',
    difficulty: 'Hard',
    iconType: 'node',
    description: 'Create a rate limiter for Express using in-memory store.',
    tags: ['Node.js', 'Backend', 'API'],
    creator: {
      name: 'Karan Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    points: 150,
    status: 'open',
  },
  {
    id: 'ch-mongo-query',
    title: 'Optimize MongoDB Query',
    badge: 'Trending',
    badgeType: 'trending',
    difficulty: 'Medium',
    iconType: 'mongo',
    description: 'Current aggregation is slow. Improve query performance.',
    tags: ['MongoDB', 'Database', 'Optimization'],
    creator: {
      name: 'Dev Patel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    points: 180,
    status: 'open',
  },
];

export const challengeService = {
  async getRecommended() {
    try {
      const res = await api.get('/challenges/recommended');
      return res.data?.challenges || MOCK_RECOMMENDED;
    } catch {
      return MOCK_RECOMMENDED;
    }
  },

  async getAll() {
    try {
      const res = await api.get('/challenges');
      return res.data?.challenges || MOCK_RECOMMENDED;
    } catch {
      return MOCK_RECOMMENDED;
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/challenges/${id}`);
      return res.data?.challenge || MOCK_RECOMMENDED.find((c) => c.id === id);
    } catch {
      return MOCK_RECOMMENDED.find((c) => c.id === id) || null;
    }
  },

  async acceptChallenge(id) {
    try {
      const res = await api.post(`/challenges/${id}/accept`);
      return res.data;
    } catch {
      return { success: true, message: 'Challenge accepted! Good luck, warrior.' };
    }
  },
};

export default challengeService;

