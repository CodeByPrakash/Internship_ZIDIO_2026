import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Bell, CheckCheck, Trash2, Video, Calendar, Sparkles, 
    CheckCircle2, AlertCircle, ArrowUpRight, Filter
} from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';

interface NotificationItem {
    _id: string;
    type: 'meeting_invite' | 'ai_summary_ready' | 'task_assigned' | 'system' | 'mention';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    data?: {
        roomId?: string;
        meetingId?: string;
        taskId?: string;
    };
}

export default function NotificationsPage() {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: notifications = [], isLoading } = useQuery<NotificationItem[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            try {
                const res = await api.get('/notifications');
                return res.data?.notifications || [];
            } catch {
                return [
                    {
                        _id: 'n1',
                        type: 'ai_summary_ready',
                        title: 'AI Summary Generated',
                        message: 'The AI transcript and key action items for "Q3 Architecture Sync" are ready to view.',
                        read: false,
                        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                        data: { meetingId: 'demo-1' }
                    },
                    {
                        _id: 'n2',
                        type: 'meeting_invite',
                        title: 'Meeting Invitation',
                        message: 'Sarah Chen invited you to "Product Roadmap 2026 & AI Integration Review".',
                        read: false,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                        data: { roomId: 'roadmap-sync-2026' }
                    },
                    {
                        _id: 'n3',
                        type: 'task_assigned',
                        title: 'New Task Assigned',
                        message: 'You have been assigned: "Complete WebRTC mesh peer connection resilience testing".',
                        read: true,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                        data: { taskId: 'task-102' }
                    },
                    {
                        _id: 'n4',
                        type: 'system',
                        title: 'Better Auth + Neon Live',
                        message: 'IntellMeet authentication and session security with Neon PostgreSQL is fully operational.',
                        read: true,
                        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
                    }
                ];
            }
        },
    });

    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            try {
                await api.patch(`/notifications/${id}/read`);
            } catch {}
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            try {
                await api.patch('/notifications/read-all');
            } catch {}
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success('All notifications marked as read');
        }
    });

    const filtered = notifications.filter(n => filter === 'all' || !n.read);
    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: NotificationItem['type']) => {
        switch (type) {
            case 'meeting_invite':
                return <Video className="w-5 h-5 text-indigo-400" />;
            case 'ai_summary_ready':
                return <Sparkles className="w-5 h-5 text-purple-400" />;
            case 'task_assigned':
                return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
            default:
                return <AlertCircle className="w-5 h-5 text-cyan-400" />;
        }
    };

    const handleAction = (n: NotificationItem) => {
        if (!n.read) markReadMutation.mutate(n._id);
        if (n.data?.roomId) {
            navigate(`/meeting/${n.data.roomId}`);
        } else if (n.data?.meetingId) {
            navigate(`/meetings/${n.data.meetingId}/summary`);
        } else if (n.data?.taskId) {
            navigate('/workspaces');
        }
    };

    return (
        <div className="space-y-8 pb-12 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Notifications</h1>
                        {unreadCount > 0 && (
                            <Badge variant="default">{unreadCount} new</Badge>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                        Stay updated with meeting invites, AI summaries, and team action items.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center p-1 bg-slate-900/90 border border-white/10 rounded-xl">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                                filter === 'all'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                                filter === 'unread'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => markAllReadMutation.mutate()}
                        >
                            <CheckCheck className="w-4 h-4 mr-1.5" />
                            Mark all read
                        </Button>
                    )}
                </div>
            </div>

            {/* Notification List */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <CheckCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">You're all caught up!</h3>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                        {filter === 'unread' ? 'No unread notifications at the moment.' : 'Notifications for meetings, transcripts, and tasks will show up here.'}
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((item) => (
                        <Card
                            key={item._id}
                            glow
                            onClick={() => handleAction(item)}
                            className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-all ${
                                item.read ? 'bg-slate-900/60' : 'bg-slate-900/95 border-indigo-500/30'
                            }`}
                        >
                            <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                    item.read ? 'bg-white/[0.03] border-white/10' : 'bg-indigo-500/15 border-indigo-500/30'
                                }`}>
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`text-sm font-semibold truncate ${item.read ? 'text-slate-300' : 'text-white'}`}>
                                            {item.title}
                                        </h4>
                                        {!item.read && (
                                            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                        {item.message}
                                    </p>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                                        <span>
                                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                        {(item.data?.roomId || item.data?.meetingId || item.data?.taskId) && (
                                            <span className="text-indigo-400 font-medium flex items-center gap-1">
                                                Open resource <ArrowUpRight className="w-3 h-3" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!item.read && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 text-slate-400 hover:text-emerald-400"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markReadMutation.mutate(item._id);
                                    }}
                                    title="Mark as read"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
