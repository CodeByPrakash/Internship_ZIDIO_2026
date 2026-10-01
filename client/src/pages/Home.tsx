import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Video, Brain, Users, BarChart3, ArrowRight, Play, 
    Sparkles, Mic, VideoOff, MicOff, PhoneOff, Monitor, 
    Calendar, MessageSquare, CheckSquare, Sparkle, Check,
    Shield, FileText, ChevronRight, Zap, Star, CheckCircle2
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';

export default function Home() {
    const navigate = useNavigate();
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [activeDemoModal, setActiveDemoModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8fbff] text-slate-900 relative overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
            
            {/* ─── Top Navigation Bar (Seamless Floating Overlay) ──────── */}
            <header className="absolute top-0 left-0 right-0 z-50 px-6 sm:px-12 lg:px-16 py-5 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                        <Video className="w-5 h-5 text-white fill-white/20" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-black tracking-tight text-slate-900">
                            Intell<span className="text-indigo-600">Meet</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 tracking-wider">
                            AI
                        </span>
                    </div>
                </Link>

                {/* Nav Links (Centered) */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-800">
                    <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                    <a href="#solutions" className="hover:text-indigo-600 transition-colors">Solutions</a>
                    <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                    <a href="#resources" className="hover:text-indigo-600 transition-colors">Resources</a>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Link 
                        to="/login" 
                        className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors px-2 py-1"
                    >
                        Sign In
                    </Link>
                    <Link to="/signup">
                        <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                            <span>Get Started</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </header>

            {/* ─── Hero Section with Full Reference Composition ────────── */}
            <section className="relative w-full min-h-screen pt-24 sm:pt-28 pb-12 flex items-center overflow-hidden">
                {/* High-res Background Image */}
                <div 
                    className="absolute inset-0 bg-no-repeat bg-cover bg-center sm:bg-[80%_center] z-0 pointer-events-none"
                    style={{ 
                        backgroundImage: `url('/bg.png')`,
                    }}
                />
                
                {/* Ambient Soft Vignette for Enhanced Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-transparent sm:w-[60%] lg:w-[50%] z-0 pointer-events-none" />

                <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-8rem)]">
                        
                        {/* LEFT COLUMN: HERO CONTENT (Glassmorphic Container) */}
                        <div className="lg:col-span-6 max-w-xl space-y-6 text-left p-6 sm:p-8 lg:p-9 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-slate-900/10 ring-1 ring-white/60 transition-all">
                            
                            {/* Pill Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 backdrop-blur-md border border-purple-200/80 shadow-sm text-purple-700 text-xs font-bold tracking-wide">
                                <Sparkle className="w-3.5 h-3.5 fill-purple-600 text-purple-600 animate-pulse" />
                                <span>AI-Powered Meetings</span>
                            </div>

                            {/* Main Bold Headline */}
                            <h1 className="text-5xl sm:text-6xl xl:text-[64px] font-black text-slate-900 tracking-tight leading-[1.06]">
                                Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">Smarter</span><br />
                                Work Together
                            </h1>

                            {/* Description Subtitle */}
                            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
                                Transform every meeting into actionable results with real-time video, AI transcription, smart summaries, and seamless team collaboration.
                            </p>

                            {/* Action Buttons Row */}
                            <div className="flex flex-wrap items-center gap-4 pt-1">
                                <Link to="/signup">
                                    <button className="px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5">
                                        <span>Get Started Free</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>

                                <button 
                                    onClick={() => setActiveDemoModal(true)}
                                    className="px-6 py-3.5 rounded-full bg-white/95 hover:bg-white text-slate-800 font-bold text-sm sm:text-base shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5"
                                >
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <Play className="w-3 h-3 fill-current ml-0.5" />
                                    </div>
                                    <span>Watch Demo</span>
                                </button>
                            </div>

                            {/* 4 Feature Badges (Aligned 4-Column Grid) */}
                            <div className="grid grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-200/80 max-w-lg">
                                {/* Feature 1 */}
                                <div className="flex flex-col items-start gap-2 group cursor-pointer">
                                    <div className="w-11 h-11 rounded-2xl bg-rose-100/90 border border-rose-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                        <Video className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 leading-tight">
                                        HD Video<br />Meetings
                                    </span>
                                </div>

                                {/* Feature 2 */}
                                <div className="flex flex-col items-start gap-2 group cursor-pointer">
                                    <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 border border-emerald-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                        <Brain className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 leading-tight">
                                        AI<br />Summaries
                                    </span>
                                </div>

                                {/* Feature 3 */}
                                <div className="flex flex-col items-start gap-2 group cursor-pointer">
                                    <div className="w-11 h-11 rounded-2xl bg-blue-100/90 border border-blue-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 leading-tight">
                                        Team<br />Collaboration
                                    </span>
                                </div>

                                {/* Feature 4 */}
                                <div className="flex flex-col items-start gap-2 group cursor-pointer">
                                    <div className="w-11 h-11 rounded-2xl bg-amber-100/90 border border-amber-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                        <BarChart3 className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 leading-tight">
                                        Productivity<br />Analytics
                                    </span>
                                </div>
                            </div>

                            {/* Social Proof Avatars & Counter */}
                            <div className="flex items-center gap-3 pt-2">
                                <div className="flex -space-x-2.5 overflow-hidden">
                                    <img 
                                        className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm" 
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                                        alt="User" 
                                    />
                                    <img 
                                        className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm" 
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" 
                                        alt="User" 
                                    />
                                    <img 
                                        className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm" 
                                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80" 
                                        alt="User" 
                                    />
                                    <img 
                                        className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover shadow-sm" 
                                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" 
                                        alt="User" 
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-semibold text-slate-600">Trusted by teams worldwide</p>
                                    <p className="text-xs font-black text-indigo-700">10,000+ productive meetings</p>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Holographic 4-Person Video Call Floating Tablet */}
                        <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-start pointer-events-auto pb-8 lg:pb-0">
                            
                            {/* Outer Positioning Container (Adjusted further higher and to the right) */}
                            <div className="relative w-full max-w-[420px] xl:max-w-[460px] transform lg:-translate-y-16 lg:translate-x-16 xl:-translate-y-24 xl:translate-x-24 2xl:-translate-y-28 2xl:translate-x-32 transition-all duration-300">
                                
                                {/* 1. Floating AI Summary Card (Top Left) */}
                                <div className="absolute -top-7 -left-5 sm:-left-7 z-30 bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-xl shadow-indigo-500/15 border border-purple-200/80 animate-bounce" style={{ animationDuration: '4s' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-5 h-5 rounded-md bg-purple-600 flex items-center justify-center text-white text-[10px]">
                                            <Brain className="w-3 h-3" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-900">AI Summary</span>
                                    </div>
                                    <div className="w-28 space-y-1">
                                        <div className="h-1.5 bg-purple-100 rounded-full w-full" />
                                        <div className="h-1.5 bg-purple-200 rounded-full w-3/4" />
                                    </div>
                                </div>

                                {/* 2. Floating Calendar Widget (Mid Left) */}
                                <div className="absolute top-20 -left-6 sm:-left-8 z-30 bg-white/95 backdrop-blur-xl p-2.5 rounded-2xl shadow-lg border border-pink-200/80 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-200 flex items-center justify-center text-pink-600">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                                        +
                                    </div>
                                </div>

                                {/* 3. Floating Chat Bubble (Top Right) */}
                                <div className="absolute -top-5 -right-3 z-30 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-2xl shadow-xl border border-purple-200/80 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                </div>

                                {/* 4. Floating Action Items Checklist (Bottom Right) */}
                                <div className="absolute -bottom-7 -right-5 sm:-right-7 z-30 bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-indigo-200/80 space-y-1.5 text-left">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                                        <CheckSquare className="w-3.5 h-3.5" />
                                        <span>Action Items</span>
                                    </div>
                                    <div className="space-y-1 text-[10px] font-semibold text-slate-700">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3.5 h-3.5 rounded bg-emerald-500 text-white flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                            </div>
                                            <span>Deploy Better Auth</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3.5 h-3.5 rounded bg-emerald-500 text-white flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                            </div>
                                            <span>Sync Neon PostgreSQL</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ─── Main Holographic Video Call Window ─────────── */}
                                <div className="w-full bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-3.5 sm:p-4 border-2 border-indigo-400/30 shadow-[0_25px_60px_rgba(15,23,42,0.4)] relative z-20 transform hover:scale-[1.01] transition-transform duration-300">
                                    
                                    {/* Window Top Bar */}
                                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                            <span className="text-[11px] font-bold text-slate-300 ml-1.5">#strategy-sync</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-rose-500/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                            REC
                                        </div>
                                    </div>

                                    {/* 4 Video Tiles Grid */}
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        
                                        {/* Tile 1: Priya (Host) */}
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-slate-800 border border-white/10 group">
                                            <img 
                                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" 
                                                alt="Priya"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-white text-[10px] font-semibold">
                                                <span>Priya (Host)</span>
                                                <div className="flex items-center gap-0.5">
                                                    <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                                    <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tile 2: Alex */}
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-slate-800 border border-white/10 group">
                                            <img 
                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" 
                                                alt="Alex"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-white text-[10px] font-semibold">
                                                <span>Alex J.</span>
                                                <Mic className="w-2.5 h-2.5 text-emerald-400" />
                                            </div>
                                        </div>

                                        {/* Tile 3: Rahul */}
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-slate-800 border border-white/10 group">
                                            <img 
                                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" 
                                                alt="Rahul"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-white text-[10px] font-semibold">
                                                <span>Rahul K.</span>
                                                <Mic className="w-2.5 h-2.5 text-emerald-400" />
                                            </div>
                                        </div>

                                        {/* Tile 4: Maya */}
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-slate-800 border border-white/10 group">
                                            <img 
                                                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80" 
                                                alt="Maya"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-white text-[10px] font-semibold">
                                                <span>Maya S.</span>
                                                <Mic className="w-2.5 h-2.5 text-emerald-400" />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Bottom In-Call Controls */}
                                    <div className="flex items-center justify-center gap-2 pt-1">
                                        <button 
                                            onClick={() => setIsAudioMuted(!isAudioMuted)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                                isAudioMuted ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                                            }`}
                                        >
                                            {isAudioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                                        </button>

                                        <button 
                                            onClick={() => setIsVideoMuted(!isVideoMuted)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                                isVideoMuted ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                                            }`}
                                        >
                                            {isVideoMuted ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                                        </button>

                                        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                                            <Monitor className="w-3.5 h-3.5" />
                                        </button>

                                        <button 
                                            onClick={() => navigate('/dashboard')}
                                            className="px-3.5 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-bold text-[11px] shadow-md shadow-rose-600/30 transition-all"
                                        >
                                            <PhoneOff className="w-3 h-3 mr-1" />
                                            End
                                        </button>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* ─── Features Grid Section ─────────────────────────────────── */}
            <section id="features" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-200/80">
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
                    <Badge variant="outline" className="px-4 py-1 border-indigo-200 text-indigo-700 bg-indigo-50/50">
                        Enterprise Collaboration
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Engineered for High-Velocity Product Teams
                    </h2>
                    <p className="text-slate-600 text-base leading-relaxed">
                        Say goodbye to lost action items and fragmented meeting notes. IntellMeet unifies live video, speech intelligence, and automated task dispatch.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:border-indigo-100 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                            <Video className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Ultra Low Latency Video</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            WebRTC mesh and SFU architecture providing crisp 1080p video, screen sharing, and dynamic noise cancellation.
                        </p>
                    </Card>

                    <Card className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:border-purple-100 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                            <Brain className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">AI Transcript & Summaries</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Automatic Whisper transcription and GPT-4o executive summaries that categorize discussions into decisions and action items.
                        </p>
                    </Card>

                    <Card className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:border-blue-100 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <CheckSquare className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Kanban Dispatch</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Convert meeting decisions directly into assignable Kanban cards with priority tags, deadlines, and ownership.
                        </p>
                    </Card>
                </div>
            </section>

            {/* ─── Interactive Demo Modal ──────────────────────────────── */}
            {activeDemoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative border border-slate-100">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">IntellMeet Live Interactive Demo</h3>
                                    <p className="text-xs text-slate-500">Real-time WebRTC + Whisper Transcription + Kanban Dispatch</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setActiveDemoModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2 text-left">
                                <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                    Live Demonstration Steps:
                                </h4>
                                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                                    <li><strong>Instant Room Creation:</strong> Sub-180ms latency peer video connection with audio noise filtering.</li>
                                    <li><strong>Speech-to-Text:</strong> Real-time Whisper AI transcription attributing speech to each participant.</li>
                                    <li><strong>Action Extraction:</strong> GPT-4o synthesizes executive summaries and creates task tickets.</li>
                                    <li><strong>Kanban Sync:</strong> Automatically sends action items to your workspace sprint columns.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                onClick={() => setActiveDemoModal(false)}
                                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm"
                            >
                                Close
                            </button>
                            <Link to="/signup" onClick={() => setActiveDemoModal(false)}>
                                <button className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 flex items-center gap-2">
                                    <span>Try IntellMeet Now</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Footer ──────────────────────────────────────────────── */}
            <footer className="border-t border-slate-200/80 bg-white py-8 px-6 sm:px-12 text-slate-600">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                            <Video className="w-4 h-4 fill-white/20" />
                        </div>
                        <span className="font-bold text-slate-900">IntellMeet Enterprise</span>
                    </div>
                    <p className="text-xs text-slate-500">
                        © 2026 IntellMeet Collaboration Inc. Powered by Better Auth & Neon PostgreSQL.
                    </p>
                </div>
            </footer>
        </div>
    );
}


