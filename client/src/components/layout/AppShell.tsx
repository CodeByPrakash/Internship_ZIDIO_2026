import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import { useLogout } from '../../hooks/useAuth';
import {
    LayoutDashboard, Video, FolderKanban, BarChart3, Bell,
    User, LogOut, Zap, Menu, X, ChevronRight, Settings,
} from 'lucide-react';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/meetings', icon: Video, label: 'Meetings' },
    { path: '/workspaces', icon: FolderKanban, label: 'Workspaces' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function AppShell() {
    const user = useAuthStore((s) => s.user);
    const { sidebarOpen, toggleSidebar } = useUiStore();
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useLogout();

    const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?';

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* ─── Sidebar ────────────────────────────────────── */}
            <aside style={{
                width: sidebarOpen ? 240 : 72, flexShrink: 0,
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.2s ease', overflow: 'hidden',
            }}>
                {/* Logo */}
                <div style={{
                    padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    borderBottom: '1px solid var(--color-border)',
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '0.75rem', flexShrink: 0,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Zap size={20} color="white" />
                    </div>
                    {sidebarOpen && <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'white', whiteSpace: 'nowrap' }}>IntellMeet</span>}
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {navItems.map((item) => {
                        const active = location.pathname.startsWith(item.path);
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.625rem 0.75rem', borderRadius: '0.625rem',
                                textDecoration: 'none', transition: 'all 0.15s',
                                background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                                color: active ? '#818cf8' : 'var(--color-text-secondary)',
                            }}>
                                <item.icon size={20} />
                                {sidebarOpen && <span style={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400 }}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div style={{ padding: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                    <div onClick={() => navigate('/profile')} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.625rem 0.75rem', borderRadius: '0.625rem',
                        cursor: 'pointer', transition: 'background 0.15s',
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '0.5rem', flexShrink: 0,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 600, color: 'white',
                        }}>
                            {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '0.5rem', objectFit: 'cover' }} /> : initials}
                        </div>
                        {sidebarOpen && (
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'white', whiteSpace: 'nowrap' }}>{user?.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{user?.email}</div>
                            </div>
                        )}
                    </div>
                    <button onClick={() => logout.mutate()} className="btn btn-ghost" style={{
                        width: '100%', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                        marginTop: '0.375rem', color: 'var(--color-muted)', padding: '0.5rem 0.75rem',
                    }}>
                        <LogOut size={18} />
                        {sidebarOpen && <span style={{ fontSize: '0.8125rem' }}>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* ─── Main Content ─────────────────────────────── */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Top Bar */}
                <header style={{
                    height: 56, padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', flexShrink: 0,
                }}>
                    <button onClick={toggleSidebar} className="btn btn-ghost btn-icon">
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to="/notifications" className="btn btn-ghost btn-icon" style={{ position: 'relative' }}>
                            <Bell size={18} />
                            <span style={{
                                position: 'absolute', top: 4, right: 4, width: 8, height: 8,
                                borderRadius: '50%', background: '#ef4444',
                            }} />
                        </Link>
                        <Link to="/profile" className="btn btn-ghost btn-icon">
                            <Settings size={18} />
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
