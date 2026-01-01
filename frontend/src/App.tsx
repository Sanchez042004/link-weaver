import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import DashboardPage from './pages/DashboardPage';
import LinkDetailsPage from './pages/LinkDetailsPage';
import GeneralAnalyticsPage from './pages/GeneralAnalyticsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import ProtectedRoute from './features/auth/components/ProtectedRoute';
import PublicRoute from './features/auth/components/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <GeneralAnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="/analytics/:alias" element={
          <ProtectedRoute>
            <LinkDetailsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
