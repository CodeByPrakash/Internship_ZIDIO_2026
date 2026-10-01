import { useState } from 'react';
import { 
    Brain, CheckCircle, FileText, Clock, Sparkle, Download, 
    Copy, Share2, ArrowLeft, Check, Plus, User, Search, 
    Calendar, Video, Play, ExternalLink, CheckCircle2, Circle
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

interface ActionItem {
    id: string;
    text: string;
    assignee: string;
    dueDate: string;
    completed: boolean;
    convertedToTask?: boolean;
}

export default function MeetingSummary() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transcriptFilter, setTranscriptFilter] = useState('');

    const [actionItems, setActionItems] = useState<ActionItem[]>([
        { id: '1', text: 'Deploy Better Auth & Neon PostgreSQL schema migration', assignee: 'Alex Johnson', dueDate: 'This Friday', completed: false },
        { id: '2', text: 'Configure OpenAI Whisper real-time audio chunk pipeline', assignee: 'Sarah Chen', dueDate: 'Next Monday', completed: true },
        { id: '3', text: 'Finalize enterprise RBAC permission matrix for team workspaces', assignee: 'Dev Lead', dueDate: 'Oct 5th', completed: false },
        { id: '4', text: 'Audit OWASP top 10 security headers & token expiry', assignee: 'Security Eng', dueDate: 'Oct 8th', completed: false }
    ]);

    const mockSummary = {
        title: 'Q3 Enterprise Architecture & AI Integration Sync',
        date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
        duration: '42 mins',
        attendees: ['Sarah Chen (Host)', 'Alex Johnson', 'Prakash Sharma', 'Dev Lead'],
        summary: 'The executive engineering team aligned on the Q3 release milestones for IntellMeet. Key consensus was reached on leveraging Better Auth with Neon Serverless PostgreSQL and OpenAI Whisper for real-time speech transcription. The frontend team demonstrated the WebRTC mesh peer connection and integrated Kanban sprint boards.',
        keyDecisions: [
            'Adopt Whisper API for multi-lingual audio transcription and automated action extraction.',
            'Deploy Better Auth with session management over Neon PostgreSQL.',
            'Directly synchronize AI-extracted action items with the project workspace Kanban board.',
            'Deploy full production Docker container stack with Kubernetes Helm charts by sprint end.'
        ],
        transcript: [
            { time: '00:02', speaker: 'Sarah Chen', text: 'Welcome everyone to today\'s Q3 architecture sync. Let\'s review our real-time meeting pipeline.' },
            { time: '02:15', speaker: 'Alex Johnson', text: 'The WebRTC mesh signaling server is running smooth, with automatic ICE candidate renegotiation.' },
            { time: '08:40', speaker: 'Sarah Chen', text: 'Great. Let\'s make sure we deploy the Better Auth and Neon DB patch by this Friday.' },
            { time: '14:20', speaker: 'Dev Lead', text: 'I\'ll also finalize the RBAC permissions so workspace admins can restrict meeting recordings.' },
            { time: '22:10', speaker: 'Prakash Sharma', text: 'The AI summarization engine is now automatically extracting action items with assignee tags directly from these transcript lines.' },
            { time: '35:00', speaker: 'Sarah Chen', text: 'Awesome progress team. Let\'s convert these action items into tasks and meet again next Monday.' }
        ]
    };

    const toggleActionItem = (itemId: string) => {
        setActionItems(prev => prev.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
        ));
    };

    const convertToTask = (item: ActionItem) => {
        setActionItems(prev => prev.map(i => 
            i.id === item.id ? { ...i, convertedToTask: true } : i
        ));
        toast.success(`Action item converted to Kanban Task: "${item.text}"`);
    };

    const copySummary = () => {
        const text = `Meeting Summary: ${mockSummary.title}\nDate: ${mockSummary.date}\n\nSummary:\n${mockSummary.summary}\n\nKey Decisions:\n${mockSummary.keyDecisions.map(d => `- ${d}`).join('\n')}\n\nAction Items:\n${actionItems.map(a => `- [${a.completed ? 'x' : ' '}] ${a.text} (${a.assignee}, Due: ${a.dueDate})`).join('\n')}`;
        navigator.clipboard.writeText(text);
        toast.success('Summary copied to clipboard in Markdown format');
    };

    const filteredTranscript = mockSummary.transcript.filter(t => 
        t.speaker.toLowerCase().includes(transcriptFilter.toLowerCase()) ||
        t.text.toLowerCase().includes(transcriptFilter.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12 max-w-5xl mx-auto">
            {/* Navigation & Header (Frosted Glass Container) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/90 shadow-sm ring-1 ring-white/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="cyan">AI Summary Ready</Badge>
                            <span className="text-xs font-semibold text-slate-500">ID: #{id || 'meeting-901'}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{mockSummary.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button variant="outline" size="sm" onClick={copySummary}>
                        <Copy className="w-4 h-4 mr-1.5" /> Copy Markdown
                    </Button>
                    <Button variant="default" size="sm" onClick={() => navigate('/workspaces')}>
                        <Plus className="w-4 h-4 mr-1.5" /> View Kanban Board
                    </Button>
                </div>
            </div>

            {/* Quick Metadata Bar */}
            <Card className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
                    <div>
                        <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-bold">Date</span>
                        <span className="font-bold text-slate-900">{mockSummary.date}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-bold">Duration</span>
                        <span className="font-bold text-slate-900">{mockSummary.duration}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-bold">Attendees</span>
                        <span className="font-bold text-slate-900">{mockSummary.attendees.length} members</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-bold">AI Engine</span>
                        <span className="font-bold text-emerald-700">99.4% (Whisper + GPT-4o)</span>
                    </div>
                </div>
            </Card>

            {/* Tabs for Summary, Action Items, and Full Transcript */}
            <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="summary">
                        <Sparkle className="w-3.5 h-3.5 mr-1.5 text-purple-600" /> Synopsis
                    </TabsTrigger>
                    <TabsTrigger value="actions">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Actions ({actionItems.length})
                    </TabsTrigger>
                    <TabsTrigger value="transcript">
                        <FileText className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Transcript
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: EXECUTIVE SUMMARY */}
                <TabsContent value="summary" className="space-y-6 pt-2">
                    <Card glow>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-indigo-700">
                                <Brain className="w-5 h-5 text-indigo-600" />
                                Executive Synopsis
                            </CardTitle>
                            <CardDescription>
                                High-level distillation synthesized by IntellMeet AI
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700 leading-relaxed text-base font-medium">
                                {mockSummary.summary}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Key Decisions Agreed Upon</CardTitle>
                            <CardDescription>Consensus items extracted from spoken discussion</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {mockSummary.keyDecisions.map((decision, i) => (
                                <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800 leading-normal">{decision}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: ACTION ITEMS */}
                <TabsContent value="actions" className="space-y-4 pt-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-lg">Extracted Action Items</CardTitle>
                                <CardDescription>Check off items or convert directly into Kanban tasks</CardDescription>
                            </div>
                            <Badge variant="success">
                                {actionItems.filter(a => a.completed).length}/{actionItems.length} Done
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {actionItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                                        item.completed
                                            ? 'bg-emerald-50/50 border-emerald-200 opacity-70'
                                            : 'bg-white/80 border-slate-200 hover:border-indigo-300 shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-start gap-3 mb-3 sm:mb-0">
                                        <button
                                            onClick={() => toggleActionItem(item.id)}
                                            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                                        >
                                            {item.completed ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-slate-400" />
                                            )}
                                        </button>
                                        <div>
                                            <p className={`text-sm font-bold ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                                {item.text}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
                                                <span>👤 {item.assignee}</span>
                                                <span>📅 {item.dueDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {item.convertedToTask ? (
                                            <Badge variant="cyan" className="text-xs">
                                                ✓ In Kanban
                                            </Badge>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => convertToTask(item)}
                                            >
                                                <Plus className="w-3.5 h-3.5 mr-1" /> To Kanban
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: FULL TRANSCRIPT */}
                <TabsContent value="transcript" className="space-y-4 pt-2">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div>
                                    <CardTitle className="text-lg">Speaker-Attributed Transcript</CardTitle>
                                    <CardDescription>Search timestamped quotes recorded during this session</CardDescription>
                                </div>
                                <div className="w-full sm:w-64">
                                    <Input
                                        value={transcriptFilter}
                                        onChange={(e) => setTranscriptFilter(e.target.value)}
                                        placeholder="Search transcript..."
                                        icon={<Search className="w-4 h-4" />}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {filteredTranscript.map((t, idx) => (
                                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-indigo-700">
                                            {t.speaker}
                                        </span>
                                        <span className="text-xs font-mono font-semibold text-slate-400">
                                            {t.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                        "{t.text}"
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
