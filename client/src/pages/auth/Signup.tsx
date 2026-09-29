import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useAuth';
import { Zap, User, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="glow-ambient-bg glow-primary top-[-100px] right-[20%]" />
            <div className="glow-ambient-bg glow-secondary bottom-[-100px] left-[20%]" />

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
                            <Badge variant="success">
                                <Sparkles className="w-3 h-3 mr-1" />
                                14-Day Free Enterprise Trial
                            </Badge>
                        </div>
                        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                        <CardDescription>
                            Join thousands of teams collaborating with real-time AI transcription
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Full Name
                                </label>
                                <Input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Sarah Connor"
                                    icon={<User className="w-4 h-4" />}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Work Email
                                </label>
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="sarah@company.com"
                                    icon={<Mail className="w-4 h-4" />}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    icon={<Lock className="w-4 h-4" />}
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-2"
                                disabled={signup.isPending}
                            >
                                {signup.isPending ? 'Creating Account...' : 'Get Started Free'}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-400 font-medium hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>SOC-2 & GDPR Compliant Security</span>
                </div>
            </div>
        </div>
    );
}
