import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';
import SuperAdminRoute from './components/auth/SuperAdminRoute';
import SuperAdminLayout from './components/superadmin/SuperAdminLayout';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ExploreChallengesPage from './pages/ExploreChallengesPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import ProfilePage from './pages/ProfilePage';
import AdminApplicationPage from './pages/admin/AdminApplicationPage';

import SuperAdminLoginPage from './pages/superadmin/SuperAdminLoginPage';
import SuperAdminOverviewPage from './pages/superadmin/SuperAdminOverviewPage';
import AdminApplicationsPage from './pages/superadmin/AdminApplicationsPage';
import AdminManagementPage from './pages/superadmin/AdminManagementPage';
import PermissionManagementPage from './pages/superadmin/PermissionManagementPage';
import UserModerationPage from './pages/superadmin/UserModerationPage';
import AuditLogsPage from './pages/superadmin/AuditLogsPage';
import PlatformSettingsPage from './pages/superadmin/PlatformSettingsPage';

import {
  LiveBattlesPage,
  CreateChallengePage,
  MyChallengesPage,
  MessagesPage,
  DevelopersPage,
  LeaderboardPage,
  SettingsPage,
} from './pages/PlaceholderDashboardPages';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing & Authentication Pages (Redirect to dashboard if already authenticated) */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <LandingPage />
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

          {/* Public Admin Application Portal */}
          <Route path="/admin/apply" element={<AdminApplicationPage />} />

          {/* Super Admin Login (Dedicated entry) */}
          <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />

          {/* OAuth Callback handler */}
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />

          {/* Public Browsing for Challenges (Accessible without signing in per specs) */}
          <Route path="/challenges" element={<ExploreChallengesPage />} />

          {/* Protected Developer Dashboard Routes */}
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

          {/* Super Admin Console Protected Portal */}
          <Route
            path="/superadmin"
            element={
              <SuperAdminRoute>
                <SuperAdminLayout />
              </SuperAdminRoute>
            }
          >
            <Route index element={<SuperAdminOverviewPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="admins" element={<AdminManagementPage />} />
            <Route path="permissions" element={<PermissionManagementPage />} />
            <Route path="users" element={<UserModerationPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="settings" element={<PlatformSettingsPage />} />
          </Route>

          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
