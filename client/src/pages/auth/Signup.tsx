import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useAuth';
import { Eye, EyeOff, Zap, Mail, Lock, User } from 'lucide-react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const signup = useSignup();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError('Passwords do not match'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) { setError('Password must contain uppercase, lowercase, and a number'); return; }
        signup.mutate({ name, email, password }, {
            onSuccess: () => navigate('/dashboard'),
            onError: (err: any) => setError(err?.response?.data?.message || 'Signup failed'),
        });
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-bg)', padding: '1.5rem', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none',
            }} />

            <div className="glass-strong animate-slide-up" style={{
                width: '100%', maxWidth: 420, borderRadius: '1.5rem', padding: '2.5rem',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: '1rem', margin: '0 auto 1rem',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Zap size={26} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>Join IntellMeet today</p>
                </div>

                {error && <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                            <input type="text" className="input" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                            <input type="email" className="input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                            <input type={showPw ? 'text' : 'password'} className="input" placeholder="Aa1... (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
                            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 0 }}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                            <input type="password" className="input" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={signup.isPending} style={{ width: '100%', marginTop: '0.25rem' }}>
                        {signup.isPending ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
