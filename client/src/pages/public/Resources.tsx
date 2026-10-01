import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    BookOpen, Terminal, Sparkles, FileCode, 
    ArrowRight, ExternalLink, Download, CheckCircle2, 
    Layers, Cpu, Shield, MessageSquare, Play, 
    Code2, HelpCircle, Search
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function Resources() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLang, setActiveLang] = useState<'javascript' | 'python' | 'curl'>('javascript');

    const codeSnippets = {
        javascript: `// Initialize IntellMeet WebRTC & AI Session
import { IntellMeetClient } from '@intellmeet/sdk';

const client = new IntellMeetClient({
  apiKey: process.env.INTELLMEET_API_KEY,
  roomId: 'sprint-standup-404'
});

// Join meeting with real-time Whisper transcription stream
await client.join({
  video: true,
  audio: true,
  onTranscriptionChunk: (event) => {
    console.log(\`[\${event.speaker}]: \${event.text}\`);
  },
  onActionItemDetected: (task) => {
    console.log('New task dispatched to Kanban:', task.title);
  }
});`,
        python: `# IntellMeet Python AI Analysis Client
from intellmeet import IntellMeetSession

session = IntellMeetSession(api_key="sk_live_enterprise_99812")

# Fetch and synthesize meeting decisions
meeting = session.get_meeting("meet_891823901")
summary = meeting.generate_summary(model="gpt-4o", format="executive_bullet")

for task in summary.action_items:
    print(f"Task: {task.title} -> Assignee: {task.assignee}")`,
        curl: `# Dispatch Task Directly to IntellMeet Workspace API
curl -X POST https://api.intellmeet.com/v1/workspaces/ws_401/tasks \\
  -H "Authorization: Bearer sk_live_demo" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Optimize WebRTC video bitrate for mobile participants",
    "priority": "HIGH",
    "column": "TODO",
    "meetingId": "meet_891823901"
  }'`
    };

    const guides = [
        {
            title: "WebRTC Mesh & SFU Scalability Architecture",
            desc: "Comprehensive deep dive on peer discovery, ICE/STUN/TURN negotiation, and jitter buffer optimization under 180ms latency.",
            category: "Architecture",
            badge: "Deep Dive",
            readTime: "8 min read",
            icon: Cpu
        },
        {
            title: "Whisper AI Diarization & Real-Time Streaming",
            desc: "How IntellMeet segments multi-party audio streams to deliver 99.2% accurate speaker-attributed meeting transcripts.",
            category: "AI & ML",
            badge: "Tutorial",
            readTime: "6 min read",
            icon: Sparkles
        },
        {
            title: "Automating Sprint Standups into Kanban Cards",
            desc: "Step-by-step guide to connecting your meeting rooms with real-time Kanban boards and developer tickets.",
            category: "Productivity",
            badge: "Guide",
            readTime: "5 min read",
            icon: BookOpen
        },
        {
            title: "Enterprise Zero-Data Retention Security Whitepaper",
            desc: "Technical specification on our AES-256 E2EE DTLS media pipeline, tenant isolation, and SOC2 Type II compliance.",
            category: "Security",
            badge: "Whitepaper",
            readTime: "12 min read",
            icon: Shield
        }
    ];

    const filteredGuides = guides.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fbff] text-slate-900 relative overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
            <PublicNavbar />

            {/* ─── Hero Header ────────────────────────────────────────── */}
            <section className="relative pt-16 pb-16 px-6 sm:px-12 lg:px-16 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 opacity-40 pointer-events-none"
                    style={{ backgroundImage: `url('/bg.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-[#f8fbff] z-0 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/90 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-sm">
                        <BookOpen className="w-3.5 h-3.5 fill-indigo-600" />
                        <span>Documentation & Developer Hub</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        Build, Integrate, and Master <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
                            AI-Powered Collaboration
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                        Explore SDK reference docs, WebRTC architecture blueprints, integration tutorials, and production deployment guides.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative pt-2">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 mt-1" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search guides, WebRTC specs, API references..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-lg shadow-slate-900/5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </section>

            {/* ─── Interactive Developer SDK Code Box ─────────────────── */}
            <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-20 relative z-10">
                <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border-2 border-slate-800 text-white shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-indigo-400" />
                                <h3 className="text-lg font-black text-white">IntellMeet Developer SDK</h3>
                            </div>
                            <p className="text-xs text-slate-400">Embed real-time AI transcription & WebRTC rooms into your custom stack in 5 lines of code.</p>
                        </div>

                        {/* Language Selector */}
                        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                            {(['javascript', 'python', 'curl'] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveLang(lang)}
                                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                                        activeLang === lang
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/90 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800">
                        <pre>{codeSnippets[activeLang]}</pre>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Compatible with React, Next.js, Node.js, Python FastAPI, & WebSockets</span>
                        </div>
                        <Link to="/signup">
                            <button className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all">
                                <span>Get Your Free API Key</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Guides & Whitepapers Grid ──────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-24 relative z-10">
                <div className="space-y-4 pb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Knowledge Base</span>
                            <h2 className="text-3xl font-black text-slate-900">Featured Guides & Tutorials</h2>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{filteredGuides.length} articles</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredGuides.map((guide, idx) => {
                        const Icon = guide.icon;
                        return (
                            <div 
                                key={idx}
                                className="p-7 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:border-indigo-200 transition-all group flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                                                {guide.badge}
                                            </span>
                                            <span className="text-xs text-slate-400 font-semibold">{guide.readTime}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {guide.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                            {guide.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 flex items-center justify-between border-t border-slate-100 mt-6">
                                    <span className="text-xs font-bold text-indigo-600">{guide.category}</span>
                                    <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 flex items-center gap-1">
                                        <span>Read Article</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
