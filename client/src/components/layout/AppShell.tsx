import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import { useLogout } from '../../hooks/useAuth';
import {
    LayoutDashboard, Video, FolderKanban, BarChart3, Bell,
    LogOut, Menu, Settings, Plus, Search,
    Sparkle, ShieldCheck, User, ChevronDown
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
        <div className="flex min-h-screen relative overflow-hidden font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
            {/* High-res Dashboard Background Image Layer with Subtle Soft Blur */}
            <div 
                className="absolute inset-[-10px] bg-no-repeat bg-cover bg-center z-0 pointer-events-none filter blur-[2px] scale-102 transition-all duration-500"
                style={{ 
                    backgroundImage: `url('/dashboard_bg.png')`,
                }}
            />
            
            {/* Ambient Soft Overlay to Preserve Image Clarity & Text Contrast */}
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] z-0 pointer-events-none" />

            {/* Sidebar */}
            <aside
                className={`flex flex-col shrink-0 bg-white/80 backdrop-blur-2xl border-r border-white/90 shadow-lg shadow-slate-900/5 transition-all duration-300 z-40 relative ${
                    sidebarOpen ? 'w-64' : 'w-20'
                }`}
            >
                {/* Brand Header */}
                <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200/80">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                            <Video className="w-5 h-5 text-white fill-white/20" />
                        </div>
                        {sidebarOpen && (
                            <div className="flex items-center gap-1.5">
                                <span className="font-black text-lg tracking-tight text-slate-900">
                                    Intell<span className="text-indigo-600">Meet</span>
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 tracking-wider">
                                    AI
                                </span>
                            </div>
                        )}
                    </Link>
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
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
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
                <div className="p-3 border-t border-slate-200/80">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-slate-100/80 transition-colors text-left cursor-pointer">
                                <Avatar className="h-9 w-9 ring-2 ring-indigo-500/20 shadow-xs">
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xs">{initials}</AvatarFallback>
                                </Avatar>
                                {sidebarOpen && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Admin User'}</p>
                                        <p className="text-[11px] font-medium text-slate-500 truncate">{user?.email || 'admin@intellmeet.io'}</p>
                                    </div>
                                )}
                                {sidebarOpen && <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <User className="w-4 h-4 mr-2 text-indigo-600" /> Profile & Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/notifications')}>
                                <Bell className="w-4 h-4 mr-2 text-indigo-600" /> Notification Center
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logout.mutate()} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold">
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                {/* Topbar */}
                <header className="h-16 px-6 bg-white/70 border-b border-white/90 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        <form onSubmit={handleQuickJoin} className="hidden sm:flex items-center w-64 md:w-80">
                            <Input
                                value={quickJoinId}
                                onChange={(e) => setQuickJoinId(e.target.value)}
                                placeholder="Enter Room ID to jump in..."
                                icon={<Search className="w-4 h-4" />}
                                className="h-9 text-xs bg-white/90 border-slate-200/80 text-slate-900"
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="success" className="hidden md:inline-flex">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                            Better Auth + Neon Live
                        </Badge>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/notifications')}
                            className="relative text-slate-600 hover:text-slate-900 rounded-xl"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
                        </Button>

                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate('/dashboard')}
                            className="rounded-xl font-bold shadow-md shadow-indigo-500/20"
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
