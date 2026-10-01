import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import { Video, Mail, Lock, ArrowRight, ShieldCheck, Sparkle } from 'lucide-react';
import { Input } from '../../components/ui/input';

export default function Login() {
    const [email, setEmail] = useState('admin@intellmeet.io');
    const [password, setPassword] = useState('Password123');
    const navigate = useNavigate();
    const login = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login.mutate({ email, password }, { onSuccess: () => navigate('/dashboard') });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
            {/* High-res Background Image matching Home Page */}
            <div 
                className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
                style={{ 
                    backgroundImage: `url('/bg.png')`,
                }}
            />
            
            {/* Ambient Soft Vignette / Blur Overlay for Contrast */}
            <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[2px] z-0 pointer-events-none" />

            <div className="w-full max-w-md relative z-10 py-6">
                {/* Brand Header */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
                            <Video className="w-6 h-6 text-white fill-white/20" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-3xl font-black tracking-tight text-slate-900 drop-shadow-sm">
                                Intell<span className="text-indigo-600">Meet</span>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 tracking-wider shadow-sm">
                                AI
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Glassmorphic Auth Card */}
                <div className="rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-slate-900/15 ring-1 ring-white/60 p-6 sm:p-8 transition-all">
                    
                    {/* Card Header */}
                    <div className="text-center pb-5">
                        <div className="flex justify-center mb-3">
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/90 backdrop-blur-md border border-purple-200/80 text-purple-700 text-xs font-bold shadow-sm">
                                <Sparkle className="w-3.5 h-3.5 fill-purple-600 text-purple-600 animate-pulse" />
                                <span>Better Auth • Neon PostgreSQL</span>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-slate-600 font-medium mt-1">
                            Sign in to access your AI-powered workspaces and meetings
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500 shadow-sm"
                                icon={<Mail className="w-4 h-4 text-slate-500" />}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 hover:underline">
                                    Forgot password?
                                </span>
                            </div>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500 shadow-sm"
                                icon={<Lock className="w-4 h-4 text-slate-500" />}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full h-12 mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <span>{login.isPending ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Quick Demo Credentials */}
                    <div className="mt-6 pt-5 border-t border-slate-200/80">
                        <p className="text-xs text-slate-600 text-center mb-3 font-semibold">
                            Quick Fill Demo Credentials:
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail('admin@intellmeet.io');
                                    setPassword('Password123');
                                }}
                                className="py-2 px-3 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 hover:border-indigo-300 text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                                <span>👑 Admin Demo</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail('demo@intellmeet.io');
                                    setPassword('Demo1234!');
                                }}
                                className="py-2 px-3 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 hover:border-indigo-300 text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                                <span>👤 Member Demo</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-slate-600 font-medium">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
                            Create account
                        </Link>
                    </div>
                </div>

                {/* Footer Security Badge */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 bg-white/60 backdrop-blur-md py-2 px-4 rounded-full border border-white/80 shadow-sm mx-auto w-fit">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>End-to-End Encrypted Sessions with Better Auth</span>
                </div>
            </div>
        </div>
    );
}
