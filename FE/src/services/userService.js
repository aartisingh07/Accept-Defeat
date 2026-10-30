import api from './api';

// Development sample fixtures per project requirements
const MOCK_STATS = {
  totalPoints: 1250,
  pointsTrend: '+120',
  challengesSolved: 12,
  solvedTrend: '+3',
  ongoingChallenges: 8,
  globalRank: '#42',
  rankTrend: '+8',
  isSampleData: true,
};

const MOCK_SKILLS = ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML', 'CSS'];

const MOCK_ACTIVITY = [
  {
    id: 'act-1',
    type: 'solved',
    title: 'Fix the JWT Authentication Bug',
    timestamp: '2 hours ago',
    points: '+150 pts',
    color: 'emerald',
  },
  {
    id: 'act-2',
    type: 'created',
    title: 'MERN Stack Project Challenge',
    timestamp: '6 hours ago',
    points: null,
    color: 'purple',
  },
  {
    id: 'act-3',
    type: 'received',
    title: 'Solution for MongoDB Query',
    subtitle: '3 submissions',
    timestamp: '1 day ago',
    points: null,
    color: 'blue',
  },
  {
    id: 'act-4',
    type: 'earned',
    title: 'React Master Badge',
    timestamp: '1 day ago',
    points: null,
    color: 'amber',
  },
  {
    id: 'act-5',
    type: 'challenged',
    title: '@devpatel to a Node.js battle',
    timestamp: '2 days ago',
    points: null,
    color: 'rose',
  },
];

const MOCK_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    name: 'Bug Hunter',
    description: '10 likes',
    icon: 'Award',
    color: 'amber',
    unlocked: true,
  },
  {
    id: 'ach-2',
    name: 'React Master',
    description: '5 challenges',
    icon: 'Code2',
    color: 'blue',
    unlocked: true,
  },
  {
    id: 'ach-3',
    name: 'Speed Coder',
    description: '3 wins',
    icon: 'Zap',
    color: 'yellow',
    unlocked: true,
  },
  {
    id: 'ach-4',
    name: 'Top 50',
    description: 'Global Rank',
    icon: 'TrendingUp',
    color: 'purple',
    unlocked: true,
  },
];

const MOCK_DEVELOPERS = [
  {
    id: 'dev-1',
    name: 'Riya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    skills: ['React', 'UI/UX'],
    status: 'Available',
    available: true,
  },
  {
    id: 'dev-2',
    name: 'Karan Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['Node.js', 'Express'],
    status: 'Available',
    available: true,
  },
  {
    id: 'dev-3',
    name: 'Dev Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skills: ['MongoDB', 'Backend'],
    status: 'Busy',
    available: false,
  },
  {
    id: 'dev-4',
    name: 'Sneha Verma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['Python', 'DSA'],
    status: 'Available',
    available: true,
  },
  {
    id: 'dev-5',
    name: 'Arjun Singh',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    skills: ['Java', 'Spring'],
    status: 'Available',
    available: true,
  },
];

export const userService = {
  async getStats() {
    try {
      const res = await api.get('/users/me/stats');
      return res.data;
    } catch {
      return MOCK_STATS;
    }
  },

  async getSkills() {
    try {
      const res = await api.get('/users/me/skills');
      return res.data?.skills || MOCK_SKILLS;
    } catch {
      return MOCK_SKILLS;
    }
  },

  async updateSkills(skills) {
    try {
      const res = await api.put('/users/me/skills', { skills });
      return res.data?.skills || skills;
    } catch {
      return skills;
    }
  },

  async getActivity() {
    try {
      const res = await api.get('/users/me/activity');
      return res.data?.activities || MOCK_ACTIVITY;
    } catch {
      return MOCK_ACTIVITY;
    }
  },

  async getAchievements() {
    try {
      const res = await api.get('/users/me/achievements');
      return res.data?.achievements || MOCK_ACHIEVEMENTS;
    } catch {
      return MOCK_ACHIEVEMENTS;
    }
  },

  async getOnlineDevelopers() {
    try {
      const res = await api.get('/users/online');
      return res.data?.developers || MOCK_DEVELOPERS;
    } catch {
      return MOCK_DEVELOPERS;
    }
  },
};

export default userService;

