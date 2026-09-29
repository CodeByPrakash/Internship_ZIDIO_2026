import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import { useLogout } from '../../hooks/useAuth';
import {
    LayoutDashboard, Video, FolderKanban, BarChart3, Bell,
    LogOut, Zap, Menu, X, Settings, Plus, Search,
    Sparkles, ShieldCheck, User, ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, 
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator 
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/meetings', icon: Video, label: 'Meetings' },
    { path: '/workspaces', icon: FolderKanban, label: 'Workspaces' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: '2' },
];

export default function AppShell() {
    const user = useAuthStore((s) => s.user);
    const { sidebarOpen, toggleSidebar } = useUiStore();
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useLogout();
    const [quickJoinId, setQuickJoinId] = useState('');

    const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

    const handleQuickJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (quickJoinId.trim()) {
            navigate(`/meeting/${quickJoinId.trim()}`);
            setQuickJoinId('');
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
            {/* Sidebar */}
            <aside
                className={`flex flex-col shrink-0 bg-slate-900/90 border-r border-white/10 transition-all duration-300 z-40 ${
                    sidebarOpen ? 'w-64' : 'w-20'
                }`}
            >
                {/* Brand Header */}
                <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    {sidebarOpen && (
                        <div className="flex flex-col">
                            <span className="font-bold text-base tracking-tight text-white">IntellMeet</span>
                            <span className="text-[10px] text-indigo-400 font-medium tracking-wide">ENTERPRISE AI</span>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                                }`}
                                title={!sidebarOpen ? item.label : undefined}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {sidebarOpen && <span className="flex-1 truncate">{item.label}</span>}
                                {sidebarOpen && item.badge && (
                                    <Badge variant="cyan" className="px-1.5 py-0 text-[10px]">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom User Area */}
                <div className="p-3 border-t border-white/10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/[0.05] transition-colors text-left">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                {sidebarOpen && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-white truncate">{user?.name || 'Admin User'}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@intellmeet.io'}</p>
                                    </div>
                                )}
                                {sidebarOpen && <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <User className="w-4 h-4 mr-2" /> Profile & Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/notifications')}>
                                <Bell className="w-4 h-4 mr-2" /> Notification Center
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logout.mutate()} className="text-rose-400 focus:text-rose-300">
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 px-6 bg-slate-900/60 border-b border-white/10 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="text-slate-400 hover:text-white"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        <form onSubmit={handleQuickJoin} className="hidden sm:flex items-center w-64 md:w-80">
                            <Input
                                value={quickJoinId}
                                onChange={(e) => setQuickJoinId(e.target.value)}
                                placeholder="Enter Room ID to jump in..."
                                icon={<Search className="w-4 h-4" />}
                                className="h-9 text-xs"
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="success" className="hidden md:inline-flex">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                            Better Auth + Neon Live
                        </Badge>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/notifications')}
                            className="relative text-slate-300"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
                        </Button>

                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate('/dashboard')}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            New Meeting
                        </Button>
                    </div>
                </header>

                {/* Page View Body */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
