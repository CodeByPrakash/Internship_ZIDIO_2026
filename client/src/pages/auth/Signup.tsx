import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useAuth';
import { Video, User, Mail, Lock, ArrowRight, ShieldCheck, Sparkle } from 'lucide-react';
import { Input } from '../../components/ui/input';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const signup = useSignup();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signup.mutate({ name, email, password }, { onSuccess: () => navigate('/dashboard') });
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
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/90 backdrop-blur-md border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-sm">
                                <Sparkle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 animate-pulse" />
                                <span>14-Day Free Enterprise Trial</span>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-sm text-slate-600 font-medium mt-1">
                            Join thousands of teams collaborating with real-time AI transcription
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Full Name
                            </label>
                            <Input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Sarah Connor"
                                className="bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500 shadow-sm"
                                icon={<User className="w-4 h-4 text-slate-500" />}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Work Email
                            </label>
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="sarah@company.com"
                                className="bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500 shadow-sm"
                                icon={<Mail className="w-4 h-4 text-slate-500" />}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Password
                            </label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                className="bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500 shadow-sm"
                                icon={<Lock className="w-4 h-4 text-slate-500" />}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={signup.isPending}
                            className="w-full h-12 mt-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <span>{signup.isPending ? 'Creating Account...' : 'Get Started Free'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>

                {/* Footer Security Badge */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 bg-white/60 backdrop-blur-md py-2 px-4 rounded-full border border-white/80 shadow-sm mx-auto w-fit">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>SOC-2 & GDPR Compliant Security</span>
                </div>
            </div>
        </div>
    );
}
