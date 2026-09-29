import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="glow-ambient-bg glow-primary top-[-100px] left-[20%]" />
            <div className="glow-ambient-bg glow-secondary bottom-[-100px] right-[20%]" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">IntellMeet</span>
                    </Link>
                </div>

                <Card className="border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-2">
                            <Badge variant="default">
                                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                                Better Auth • Neon PostgreSQL
                            </Badge>
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to access your AI-powered workspaces and meetings
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    icon={<Mail className="w-4 h-4" />}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <span className="text-xs text-indigo-400 cursor-pointer hover:underline">
                                        Forgot?
                                    </span>
                                </div>
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    icon={<Lock className="w-4 h-4" />}
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-2"
                                disabled={login.isPending}
                            >
                                {login.isPending ? 'Authenticating...' : 'Sign In to Workspace'}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>

                        {/* Quick Demo Fill Buttons */}
                        <div className="mt-6 pt-5 border-t border-white/10">
                            <p className="text-xs text-slate-400 text-center mb-3 font-medium">
                                Quick Fill Demo Credentials:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setEmail('admin@intellmeet.io');
                                        setPassword('Password123');
                                    }}
                                >
                                    👑 Admin Demo
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setEmail('demo@intellmeet.io');
                                        setPassword('Demo1234!');
                                    }}
                                >
                                    👤 Member Demo
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-400 font-medium hover:underline">
                                Create account
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>End-to-End Encrypted Sessions with Better Auth</span>
                </div>
            </div>
        </div>
    );
}
