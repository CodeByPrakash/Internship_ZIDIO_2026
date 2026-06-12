import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import { Eye, EyeOff, Zap, Mail, Lock } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate();
    const login = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login.mutate({ email, password }, { onSuccess: () => navigate('/dashboard') });
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-bg)', padding: '1.5rem', position: 'relative', overflow: 'hidden',
        }}>
            {/* Background orbs */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: 500, height: 500,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: 500, height: 500,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none',
            }} />

            <div className="glass-strong animate-slide-up" style={{
                width: '100%', maxWidth: 420, borderRadius: '1.5rem', padding: '2.5rem',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '1rem', margin: '0 auto 1rem',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Zap size={26} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>Sign in to your IntellMeet account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                            <input
                                type="email" className="input" placeholder="you@company.com"
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                            <input
                                type={showPw ? 'text' : 'password'} className="input" placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                            />
                            <button type="button" onClick={() => setShowPw(!showPw)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 0 }}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={login.isPending}
                        style={{ width: '100%', marginTop: '0.5rem' }}>
                        {login.isPending ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
