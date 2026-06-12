import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/auth.store';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import MeetingRoom from './pages/meeting/MeetingRoom';
import MeetingSummary from './pages/post-meeting/MeetingSummary';
import ProfilePage from './pages/profile/ProfilePage';
import KanbanBoard from './pages/workspace/KanbanBoard';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import AppShell from './components/layout/AppShell';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((s) => !!s.accessToken);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Redirect if already logged in
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((s) => !!s.accessToken);
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function App() {
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1a1a2e',
                        color: '#e2e8f0',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                    },
                }}
            />
            <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

                {/* Meeting Room (full screen, no shell) */}
                <Route path="/meeting/:roomId" element={<ProtectedRoute><MeetingRoom /></ProtectedRoute>} />

                {/* App Shell (sidebar + topbar) */}
                <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/meetings" element={<Dashboard />} />
                    <Route path="/meetings/:id/summary" element={<MeetingSummary />} />
                    <Route path="/workspaces" element={<KanbanBoard />} />
                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/notifications" element={<div style={{ color: 'var(--color-text-secondary)' }}>Notifications — coming soon</div>} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
