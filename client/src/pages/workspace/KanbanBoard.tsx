import { useState } from 'react';
import { FolderKanban, Plus, GripVertical, MoreVertical } from 'lucide-react';

const mockColumns = [
    { name: 'To Do', tasks: [
        { id: '1', title: 'Review API documentation', priority: 'high', assignee: 'AJ' },
        { id: '2', title: 'Setup CI/CD pipeline', priority: 'medium', assignee: 'SC' },
    ]},
    { name: 'In Progress', tasks: [
        { id: '3', title: 'Implement video grid layout', priority: 'high', assignee: 'You' },
    ]},
    { name: 'Review', tasks: [
        { id: '4', title: 'Auth middleware unit tests', priority: 'low', assignee: 'AJ' },
    ]},
    { name: 'Done', tasks: [
        { id: '5', title: 'WebRTC signaling setup', priority: 'medium', assignee: 'You' },
        { id: '6', title: 'Redis cache integration', priority: 'high', assignee: 'SC' },
    ]},
];

const priorityColor: Record<string, string> = { low: 'badge-info', medium: 'badge-warning', high: 'badge-danger', urgent: 'badge-danger' };

export default function KanbanBoard() {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>Project Board</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>IntellMeet Development Sprint</p>
                </div>
                <button className="btn btn-primary"><Plus size={18} /> Add Task</button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {mockColumns.map((col) => (
                    <div key={col.name} style={{ minWidth: 280, maxWidth: 320, flex: '0 0 280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 600, color: 'white', fontSize: '0.9375rem' }}>{col.name}</span>
                                <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>{col.tasks.length}</span>
                            </div>
                            <button className="btn btn-ghost btn-icon" style={{ padding: '0.25rem' }}><Plus size={16} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', padding: '0.5rem', minHeight: 100 }}>
                            {col.tasks.map((task) => (
                                <div key={task.id} className="card" style={{ padding: '0.875rem', cursor: 'grab' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span className={`badge ${priorityColor[task.priority]}`} style={{ fontSize: '0.6875rem' }}>{task.priority}</span>
                                        <MoreVertical size={14} color="var(--color-muted)" />
                                    </div>
                                    <div style={{ fontWeight: 500, color: 'white', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{task.title}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', color: 'white', fontWeight: 600 }}>
                                            {task.assignee.slice(0, 2)}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{task.assignee}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
