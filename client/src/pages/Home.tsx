import { Link } from 'react-router-dom';
import { Video, Brain, MessageSquare, BarChart3, Shield, Zap, Users, ArrowRight, Sparkles } from 'lucide-react';

const features = [
    { icon: Video, title: 'HD Video Meetings', desc: 'Crystal-clear video conferencing with screen sharing and recording capabilities.' },
    { icon: Brain, title: 'AI Meeting Intelligence', desc: 'Automatic transcription, smart summaries, and action item extraction powered by AI.' },
    { icon: MessageSquare, title: 'Real-Time Chat', desc: 'In-meeting chat with typing indicators, emoji support, and file sharing.' },
    { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Meeting frequency, productivity metrics, and engagement reports.' },
    { icon: Shield, title: 'Enterprise Security', desc: 'End-to-end encryption, JWT auth, role-based access, and OWASP compliance.' },
    { icon: Users, title: 'Team Collaboration', desc: 'Workspaces, Kanban boards, and task management linked to meetings.' },
];

const stats = [
    { value: '40-60%', label: 'Reduced Follow-up Time' },
    { value: '500+', label: 'Concurrent Meetings' },
    { value: '99.95%', label: 'Uptime SLA' },
    { value: '<200ms', label: 'Real-time Latency' },
];

export default function Home() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            {/* ─── Navbar ─────────────────────────────────────────────── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                padding: '1rem 2rem',
                background: 'rgba(10, 10, 20, 0.8)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Zap size={20} color="white" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>IntellMeet</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to="/login" className="btn btn-ghost">Sign In</Link>
                    <Link to="/signup" className="btn btn-primary">
                        Get Started <ArrowRight size={16} />
                    </Link>
                </div>
            </nav>

            {/* ─── Hero ───────────────────────────────────────────────── */}
            <section style={{
                paddingTop: '10rem', paddingBottom: '6rem',
                textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
                {/* Background orbs */}
                <div style={{
                    position: 'absolute', top: '-20%', left: '20%', width: 500, height: 500,
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', top: '10%', right: '10%', width: 400, height: 400,
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
                    filter: 'blur(60px)', pointerEvents: 'none',
                }} />

                <div className="animate-slide-up" style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '0 1.5rem' }}>
                    <div className="badge badge-primary" style={{ marginBottom: '1.5rem', padding: '0.375rem 1rem', fontSize: '0.8125rem' }}>
                        <Sparkles size={14} style={{ marginRight: '0.375rem' }} />
                        AI-Powered Enterprise Platform
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800,
                        lineHeight: 1.1, marginBottom: '1.5rem',
                        background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #818cf8 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        Transform Every Meeting Into Actionable Results
                    </h1>
                    <p style={{
                        fontSize: '1.25rem', color: 'var(--color-text-secondary)',
                        lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem',
                    }}>
                        Real-time video meetings, AI-powered transcription & summaries, smart action items, 
                        and seamless team collaboration — all in one platform.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '1.0625rem' }}>
                            Start Free <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">
                            <Video size={18} /> Watch Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Stats ──────────────────────────────────────────────── */}
            <section style={{
                maxWidth: 900, margin: '0 auto 5rem', padding: '0 1.5rem',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem',
            }}>
                {stats.map((s) => (
                    <div key={s.label} className="glass" style={{
                        padding: '1.5rem', borderRadius: '1rem', textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: '2rem', fontWeight: 800,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>{s.value}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
                    </div>
                ))}
            </section>

            {/* ─── Features ───────────────────────────────────────────── */}
            <section style={{ maxWidth: 1100, margin: '0 auto 6rem', padding: '0 1.5rem' }}>
                <h2 style={{
                    fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem',
                    color: 'white',
                }}>
                    Everything You Need for{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>Productive Meetings</span>
                </h2>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {features.map((f) => (
                        <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '0.75rem',
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <f.icon size={24} color="#818cf8" />
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white' }}>{f.title}</h3>
                            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CTA ────────────────────────────────────────────────── */}
            <section style={{
                margin: '0 1.5rem 4rem', padding: '4rem 2rem', borderRadius: '1.5rem', textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
                border: '1px solid rgba(99,102,241,0.2)',
            }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                    Ready to Transform Your Meetings?
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1.125rem' }}>
                    Join teams who have reduced meeting follow-up time by 40-60%.
                </p>
                <Link to="/signup" className="btn btn-primary btn-lg">
                    Get Started Now <ArrowRight size={18} />
                </Link>
            </section>

            {/* ─── Footer ────────────────────────────────────────────── */}
            <footer style={{
                padding: '2rem', textAlign: 'center',
                borderTop: '1px solid var(--color-border)',
                color: 'var(--color-muted)', fontSize: '0.875rem',
            }}>
                © 2026 IntellMeet by Zidio Development. All rights reserved.
            </footer>
        </div>
    );
}
