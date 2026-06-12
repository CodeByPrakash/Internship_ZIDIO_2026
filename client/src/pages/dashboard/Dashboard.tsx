import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetings, useCreateMeeting, useDeleteMeeting } from '../../hooks/useMeeting';
import { Plus, Video, Clock, Users, CalendarDays, ArrowRight, Sparkles, Trash2 } from 'lucide-react';

export default function Dashboard() {
    const [tab, setTab] = useState('all');
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [joinId, setJoinId] = useState('');
    const { data, isLoading } = useMeetings(tab === 'all' ? undefined : tab);
    const createMeeting = useCreateMeeting();
    const deleteMeeting = useDeleteMeeting();
    const navigate = useNavigate();
    const meetings = data?.meetings || [];
    const tabs = [{ key: 'all', label: 'All' }, { key: 'scheduled', label: 'Scheduled' }, { key: 'active', label: 'Active' }, { key: 'ended', label: 'Past' }];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMeeting.mutate({ title, description: desc }, {
            onSuccess: (data: any) => {
                setShowCreate(false); setTitle(''); setDesc('');
                // Navigate directly to the new meeting room
                if (data?.meeting?.roomId) navigate(`/meeting/${data.meeting.roomId}`);
            },
        });
    };

    const handleInstantMeeting = () => {
        const roomId = crypto.randomUUID();
        navigate(`/meeting/${roomId}`);
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinId.trim()) navigate(`/meeting/${joinId.trim()}`);
    };

    const statusColor: Record<string, string> = { scheduled: 'badge-info', active: 'badge-success', ended: 'badge-warning' };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Manage your meetings and collaboration</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <form onSubmit={handleJoinRoom} style={{ display: 'flex', gap: '0.375rem' }}>
                        <input className="input" placeholder="Enter Room ID to join" value={joinId} onChange={(e) => setJoinId(e.target.value)} style={{ width: 180, fontSize: '0.8125rem' }} />
                        <button type="submit" className="btn btn-secondary" disabled={!joinId.trim()}>Join</button>
                    </form>
                    <button onClick={handleInstantMeeting} className="btn btn-primary"><Video size={18} /> Instant Meeting</button>
                    <button onClick={() => setShowCreate(true)} className="btn btn-secondary"><Plus size={18} /> Schedule</button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { icon: Video, label: 'Total Meetings', value: data?.total || 0, color: '#6366f1' },
                    { icon: Clock, label: 'Active Now', value: meetings.filter((m: any) => m.status === 'active').length, color: '#10b981' },
                    { icon: CalendarDays, label: 'Scheduled', value: meetings.filter((m: any) => m.status === 'scheduled').length, color: '#0ea5e9' },
                    { icon: Sparkles, label: 'AI Summaries', value: 0, color: '#8b5cf6' },
                ].map((s) => (
                    <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <s.icon size={22} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{s.value}</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'var(--color-surface)', borderRadius: '0.75rem', padding: '0.25rem', width: 'fit-content' }}>
                {tabs.map((t) => (
                    <button key={t.key} onClick={() => setTab(t.key)} className="btn btn-sm"
                        style={{ background: tab === t.key ? 'rgba(99,102,241,0.15)' : 'transparent', color: tab === t.key ? '#818cf8' : 'var(--color-text-secondary)' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Meeting List */}
            {isLoading ? (
                <div style={{ display: 'grid', gap: '1rem' }}>{[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: '1rem' }} />)}</div>
            ) : meetings.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Video size={48} style={{ color: 'var(--color-muted)', margin: '0 auto 1rem' }} />
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No meetings yet</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Create your first meeting to get started</p>
                    <button onClick={() => setShowCreate(true)} className="btn btn-primary"><Plus size={16} /> Create Meeting</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {meetings.map((m: any) => (
                        <div key={m._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '1rem 1.5rem' }}
                            onClick={() => m.status !== 'ended' ? navigate(`/meeting/${m.roomId}`) : navigate(`/meetings/${m._id}/summary`)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 42, height: 42, borderRadius: '0.75rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Video size={20} color="#818cf8" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>{m.title}</div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={13} /> {m.participants?.length || 0}</span>
                                        <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span className={`badge ${statusColor[m.status] || 'badge-info'}`}>{m.status}</span>
                                {m.status !== 'active' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (confirm('Delete this meeting?')) deleteMeeting.mutate(m._id); }}
                                        className="btn btn-icon"
                                        title="Delete meeting"
                                        style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <ArrowRight size={16} color="var(--color-muted)" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreate && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowCreate(false)}>
                    <div className="glass-strong animate-slide-up" style={{ width: '100%', maxWidth: 440, borderRadius: '1.25rem', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>New Meeting</h2>
                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input className="input" placeholder="Meeting title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            <textarea className="input" placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} style={{ resize: 'vertical' }} />
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={createMeeting.isPending}>{createMeeting.isPending ? 'Creating...' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
