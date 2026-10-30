import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ExploreChallengesPage from './pages/ExploreChallengesPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import {
  LiveBattlesPage,
  CreateChallengePage,
  MyChallengesPage,
  MessagesPage,
  DevelopersPage,
  LeaderboardPage,
  ProfilePage,
  SettingsPage,
} from './pages/PlaceholderDashboardPages';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Pages (Redirect to dashboard if already authenticated) */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />

          {/* OAuth Callback handler */}
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />

          {/* Public Browsing for Challenges (Accessible without signing in per specs) */}
          <Route path="/challenges" element={<ExploreChallengesPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/create"
            element={
              <ProtectedRoute>
                <CreateChallengePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-challenges"
            element={
              <ProtectedRoute>
                <MyChallengesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/battles"
            element={
              <ProtectedRoute>
                <LiveBattlesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/developers"
            element={
              <ProtectedRoute>
                <DevelopersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
