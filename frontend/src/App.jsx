import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout       from './components/layout/Layout';
import LoginPage    from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PartnersPage  from './pages/PartnersPage';
import SessionsPage  from './pages/SessionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PeriodPage    from './pages/PeriodPage';
import HealthLogPage from './pages/HealthLogPage';
import SettingsPage  from './pages/SettingsPage';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace/>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace/> : <LoginPage/>}/>
      <Route path="/"          element={<Protected><Layout><DashboardPage/></Layout></Protected>}/>
      <Route path="/partners"  element={<Protected><Layout><PartnersPage/></Layout></Protected>}/>
      <Route path="/sessions"  element={<Protected><Layout><SessionsPage/></Layout></Protected>}/>
      <Route path="/analytics" element={<Protected><Layout><AnalyticsPage/></Layout></Protected>}/>
      <Route path="/period"    element={<Protected><Layout><PeriodPage/></Layout></Protected>}/>
      <Route path="/health"    element={<Protected><Layout><HealthLogPage/></Layout></Protected>}/>
      <Route path="/settings"  element={<Protected><Layout><SettingsPage/></Layout></Protected>}/>
      <Route path="*"          element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes/>
    </AuthProvider>
  );
}
