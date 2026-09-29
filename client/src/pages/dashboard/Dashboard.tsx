import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetings, useCreateMeeting, useDeleteMeeting } from '../../hooks/useMeeting';
import { 
    Plus, Video, Clock, Users, CalendarDays, ArrowRight, 
    Sparkles, Trash2, Copy, Search, Play, Check, Share2,
    Calendar, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../../components/ui/dialog';
import { Skeleton } from '../../components/ui/skeleton';

export default function Dashboard() {
    const [tab, setTab] = useState('all');
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [agenda, setAgenda] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [joinId, setJoinId] = useState('');

    const { data, isLoading } = useMeetings(tab === 'all' ? undefined : tab);
    const createMeeting = useCreateMeeting();
    const deleteMeeting = useDeleteMeeting();
    const navigate = useNavigate();

    const meetings = data?.meetings || [];
    const tabs = [
        { key: 'all', label: 'All Meetings' },
        { key: 'active', label: 'Active Now' },
        { key: 'scheduled', label: 'Scheduled' },
        { key: 'ended', label: 'Past & Summaries' }
    ];

    const filteredMeetings = meetings.filter((m: any) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            m.title?.toLowerCase().includes(query) ||
            m.roomId?.toLowerCase().includes(query) ||
            m.description?.toLowerCase().includes(query)
        );
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMeeting.mutate({ 
            title, 
            description: desc,
            startTime: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
            agenda: agenda.trim() ? agenda.split('\n').filter(Boolean) : undefined,
        }, {
            onSuccess: (res: any) => {
                setShowCreate(false);
                setTitle('');
                setDesc('');
                setScheduledDate('');
                setAgenda('');
                toast.success('Meeting created successfully!');
                if (res?.meeting?.roomId && !scheduledDate) {
                    navigate(`/meeting/${res.meeting.roomId}`);
                }
            },
        });
    };

    const handleQuickJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinId.trim()) return;
        navigate(`/meeting/${joinId.trim()}`);
    };

    const handleInstantMeeting = () => {
        createMeeting.mutate({
            title: `Instant Meeting ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            description: 'Ad-hoc live team collaboration session',
        }, {
            onSuccess: (res: any) => {
                if (res?.meeting?.roomId) {
                    navigate(`/meeting/${res.meeting.roomId}`);
                }
            }
        });
    };

    const copyLink = (roomId: string) => {
        const url = `${window.location.origin}/meeting/${roomId}`;
        navigator.clipboard.writeText(url);
        toast.success('Meeting invite URL copied to clipboard');
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Top Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Meeting Hub</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Host HD sessions, join rooms, and review AI-generated action minutes.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button 
                        variant="glow"
                        onClick={handleInstantMeeting}
                        disabled={createMeeting.isPending}
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Start Instant Room
                    </Button>

                    <Dialog open={showCreate} onOpenChange={setShowCreate}>
                        <DialogTrigger asChild>
                            <Button variant="default">
                                <Plus className="w-4 h-4" />
                                Schedule Meeting
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[520px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Schedule New Meeting</DialogTitle>
                                    <DialogDescription>
                                        Create a room with AI auto-transcription, agenda, and action item tracking.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Meeting Title</label>
                                        <Input
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Q3 Sprint Planning & Architecture"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description</label>
                                        <Input
                                            value={desc}
                                            onChange={(e) => setDesc(e.target.value)}
                                            placeholder="Key objectives and context..."
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Schedule Time (Optional)</label>
                                        <Input
                                            type="datetime-local"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Agenda Topics (One per line)</label>
                                        <textarea
                                            rows={3}
                                            className="flex w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-400/80 transition-all duration-200"
                                            value={agenda}
                                            onChange={(e) => setAgenda(e.target.value)}
                                            placeholder="1. Roadmap review&#10;2. Architecture updates&#10;3. Action items dispatch"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={createMeeting.isPending}>
                                        {createMeeting.isPending ? 'Creating...' : 'Confirm & Schedule'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Quick Join & Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border-white/10 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Video className="w-5 h-5 text-indigo-400" />
                            Quick Room Entry
                        </CardTitle>
                        <CardDescription>Enter a 9-digit room code or invite link</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleQuickJoin} className="space-y-3">
                            <Input
                                value={joinId}
                                onChange={(e) => setJoinId(e.target.value)}
                                placeholder="Enter Room ID (e.g. room-abc-123)"
                            />
                            <Button type="submit" variant="secondary" className="w-full">
                                Join Room Now <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-white/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            AI Insights Status
                        </CardTitle>
                        <CardDescription>Automated meeting intelligence metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Total Transcribed:</span>
                            <span className="font-semibold text-white">{meetings.length} Sessions</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Database Engine:</span>
                            <Badge variant="cyan">Neon PostgreSQL</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Auth Engine:</span>
                            <Badge variant="default">Better Auth</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-emerald-400" />
                            Upcoming Schedule
                        </CardTitle>
                        <CardDescription>Next sessions on your calendar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">
                                {meetings.filter((m: any) => m.status === 'scheduled').length}
                            </div>
                            <Badge variant="success">Active Agenda</Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            Invitations and reminders sent automatically via WebSockets.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-white/10 rounded-xl backdrop-blur-md overflow-x-auto w-full sm:w-auto">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                tab === t.key
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="w-full sm:w-72">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search rooms or titles..."
                        icon={<Search className="w-4 h-4" />}
                    />
                </div>
            </div>

            {/* Meetings Grid List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <Card key={n} className="p-6 space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-10 w-full" />
                        </Card>
                    ))}
                </div>
            ) : filteredMeetings.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                        <Video className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">No Meetings Found</h3>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                        {searchQuery ? 'No meetings match your search query.' : 'Start your first instant meeting or schedule one for your team.'}
                    </p>
                    <Button variant="default" onClick={() => setShowCreate(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Schedule Meeting
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMeetings.map((meeting: any) => {
                        const isActive = meeting.status === 'active';
                        const isEnded = meeting.status === 'ended';

                        return (
                            <Card
                                key={meeting.id}
                                glow
                                className="flex flex-col justify-between"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge
                                            variant={
                                                isActive
                                                    ? 'success'
                                                    : isEnded
                                                    ? 'secondary'
                                                    : 'default'
                                            }
                                        >
                                            {isActive ? '● Live Now' : isEnded ? 'Ended' : 'Scheduled'}
                                        </Badge>
                                        <span className="text-xs text-slate-500 font-mono">
                                            #{meeting.roomId}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1">{meeting.title}</CardTitle>
                                    {meeting.description && (
                                        <CardDescription className="line-clamp-2">
                                            {meeting.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-4 pt-0">
                                    <div className="space-y-2 text-xs text-slate-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                Created:
                                            </span>
                                            <span className="text-slate-200">
                                                {new Date(meeting.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {meeting.participants && (
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    Participants:
                                                </span>
                                                <span className="text-slate-200">
                                                    {meeting.participants.length} attended
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {meeting.agenda && Array.isArray(meeting.agenda) && meeting.agenda.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Agenda ({meeting.agenda.length})
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {meeting.agenda.slice(0, 2).map((item: string, i: number) => (
                                                    <Badge key={i} variant="outline" className="text-[10px]">
                                                        {item}
                                                    </Badge>
                                                ))}
                                                {meeting.agenda.length > 2 && (
                                                    <span className="text-[10px] text-slate-500">
                                                        +{meeting.agenda.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                                        {isEnded ? (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => navigate(`/meetings/${meeting.id}/summary`)}
                                            >
                                                <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
                                                View Summary
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={isActive ? 'glow' : 'default'}
                                                size="sm"
                                                className="w-full"
                                                onClick={() => navigate(`/meeting/${meeting.roomId}`)}
                                            >
                                                <Video className="w-3.5 h-3.5 mr-1" />
                                                {isActive ? 'Join Live Room' : 'Start Session'}
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyLink(meeting.roomId)}
                                            title="Copy Invite Link"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                                            onClick={() => {
                                                if (confirm('Delete this meeting session?')) {
                                                    deleteMeeting.mutate(meeting.id);
                                                }
                                            }}
                                            title="Delete Meeting"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
