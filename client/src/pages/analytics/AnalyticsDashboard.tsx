import { BarChart3, TrendingUp, Clock, Users, Video, Brain } from 'lucide-react';

const metrics = [
    { label: 'Meetings This Week', value: '12', change: '+3', icon: Video, color: '#6366f1' },
    { label: 'Avg Duration', value: '34m', change: '-5m', icon: Clock, color: '#0ea5e9' },
    { label: 'Participants', value: '47', change: '+12', icon: Users, color: '#10b981' },
    { label: 'AI Summaries', value: '8', change: '+2', icon: Brain, color: '#8b5cf6' },
];

const weeklyData = [
    { day: 'Mon', meetings: 3, hours: 2.5 },
    { day: 'Tue', meetings: 2, hours: 1.5 },
    { day: 'Wed', meetings: 4, hours: 3.0 },
    { day: 'Thu', meetings: 1, hours: 0.5 },
    { day: 'Fri', meetings: 2, hours: 1.8 },
];

export default function AnalyticsDashboard() {
    const maxMeetings = Math.max(...weeklyData.map(d => d.meetings));

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>Analytics</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Meeting insights and productivity metrics</p>

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {metrics.map((m) => (
                    <div key={m.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <m.icon size={22} color={m.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{m.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {m.label} <span style={{ color: '#10b981' }}>{m.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bar Chart */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem' }}>Weekly Meeting Activity</h2>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: 200, padding: '0 1rem' }}>
                    {weeklyData.map((d) => (
                        <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>{d.meetings}</span>
                            <div style={{
                                width: '100%', maxWidth: 48,
                                height: `${(d.meetings / maxMeetings) * 150}px`,
                                background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                                borderRadius: '0.5rem 0.5rem 0.25rem 0.25rem',
                                transition: 'height 0.5s ease',
                            }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Engagement */}
            <div className="card">
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '1rem' }}>Productivity Insights</h2>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {[
                        { label: 'Meeting Efficiency', value: 85, color: '#10b981' },
                        { label: 'Action Items Completed', value: 72, color: '#6366f1' },
                        { label: 'On-time Start Rate', value: 91, color: '#0ea5e9' },
                    ].map((item) => (
                        <div key={item.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{item.label}</span>
                                <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: 600 }}>{item.value}%</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                                <div style={{ height: '100%', borderRadius: 3, background: item.color, width: `${item.value}%`, transition: 'width 1s ease' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
