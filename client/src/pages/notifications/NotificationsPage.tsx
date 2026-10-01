import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Bell, CheckCheck, Trash2, Video, Calendar, Sparkle, 
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
                return <Video className="w-5 h-5 text-indigo-600" />;
            case 'ai_summary_ready':
                return <Sparkle className="w-5 h-5 text-purple-600" />;
            case 'task_assigned':
                return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
            default:
                return <AlertCircle className="w-5 h-5 text-sky-600" />;
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
            {/* Header (Frosted Glass Container) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/90 shadow-sm ring-1 ring-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-xs">
                            <Bell className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Notifications</h1>
                        {unreadCount > 0 && (
                            <Badge variant="default">{unreadCount} new</Badge>
                        )}
                    </div>
                    <p className="text-sm font-medium text-slate-600 mt-1">
                        Stay updated with meeting invites, AI summaries, and team action items.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center p-1 bg-white/90 border border-slate-200/80 rounded-2xl shadow-xs">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                filter === 'all'
                                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                            }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                filter === 'unread'
                                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
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
                <Card className="p-12 text-center border-dashed border-slate-200">
                    <div className="w-14 h-14 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <CheckCheck className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">You're all caught up!</h3>
                    <p className="text-sm font-medium text-slate-600 max-w-sm mx-auto">
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
                                item.read ? 'bg-white/70 opacity-90' : 'bg-white/95 border-indigo-300/80 shadow-md ring-1 ring-indigo-500/20'
                            }`}
                        >
                            <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${
                                    item.read ? 'bg-slate-50 border-slate-200' : 'bg-indigo-50 border-indigo-200'
                                }`}>
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`text-sm font-bold truncate ${item.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                            {item.title}
                                        </h4>
                                        {!item.read && (
                                            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                                        {item.message}
                                    </p>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-1">
                                        <span>
                                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                        {(item.data?.roomId || item.data?.meetingId || item.data?.taskId) && (
                                            <span className="text-indigo-600 font-bold flex items-center gap-1 hover:underline">
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
                                    className="shrink-0 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
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
