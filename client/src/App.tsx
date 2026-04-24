import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';

// Lazy-loaded pages (will be built out day by day)
const Home = () => (
    <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                IntellMeet
            </h1>
            <p className="text-slate-400 text-lg">AI-Powered Enterprise Meetings</p>
        </div>
    </div>
);

const Login = () => (
    <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Login page — coming in Day 3 UI</p>
    </div>
);

const Signup = () => (
    <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Signup page — coming in Day 3 UI</p>
    </div>
);

const Dashboard = () => (
    <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Dashboard — coming in Day 5</p>
    </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((s) => !!s.accessToken);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
