import { Brain, CheckCircle, FileText, Clock } from 'lucide-react';

export default function MeetingSummary() {
    const mockSummary = {
        title: 'Team Standup',
        summary: 'The team discussed progress on the IntellMeet platform. Key updates include completion of the authentication module, ongoing WebRTC integration for video calls, and plans to prioritize the chat feature in the next sprint.',
        transcript: [
            'Welcome everyone to today\'s standup meeting.',
            'Let\'s go around and share our updates.',
            'I\'ve completed the authentication module and started on the meeting dashboard.',
            'The WebRTC integration is looking good, we should have video calls working by end of day.',
            'We need to prioritize the chat feature for the next sprint.',
        ],
        actionItems: [
            { text: 'Review API documentation', assignee: 'Team', dueDate: 'Friday', status: 'pending' },
            { text: 'Complete WebRTC video call integration', assignee: 'Dev Lead', dueDate: 'End of day', status: 'completed' },
            { text: 'Prepare chat feature sprint plan', assignee: 'PM', dueDate: 'Next Monday', status: 'pending' },
        ],
        keyDecisions: ['Prioritize chat feature in next sprint', 'Schedule follow-up meeting for next week'],
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={22} color="#8b5cf6" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>AI Meeting Summary</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{mockSummary.title}</p>
                </div>
            </div>

            {/* Summary */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} color="#818cf8" /> Summary
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{mockSummary.summary}</p>
            </div>

            {/* Key Decisions */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Key Decisions</h2>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mockSummary.keyDecisions.map((d, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            <CheckCircle size={16} color="#10b981" /> {d}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action Items */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Action Items</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mockSummary.actionItems.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <CheckCircle size={18} color={item.status === 'completed' ? '#10b981' : 'var(--color-muted)'} />
                                <span style={{ color: item.status === 'completed' ? 'var(--color-muted)' : 'var(--color-text)', textDecoration: item.status === 'completed' ? 'line-through' : 'none' }}>{item.text}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span className="badge badge-primary">{item.assignee}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {item.dueDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transcript */}
            <div className="card">
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '0.75rem' }}>Transcript</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mockSummary.transcript.map((line, i) => (
                        <p key={i} style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, padding: '0.375rem 0', borderBottom: '1px solid var(--color-border)' }}>{line}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
