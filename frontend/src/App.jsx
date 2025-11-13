import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UpgradePage from './pages/UpgradePage.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import FullScreenLoader from './components/FullScreenLoader.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <FullScreenLoader label="Loading your workspace" />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function App() {
  const { initializing } = useAuth();

  if (initializing) {
    return <FullScreenLoader label="Booting TaskForge" />;
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <UpgradePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
