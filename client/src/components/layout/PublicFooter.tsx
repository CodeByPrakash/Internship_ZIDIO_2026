import { Link } from 'react-router-dom';
import { Video, Github, Twitter, Linkedin, Sparkles, Shield, Cpu } from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="border-t border-slate-200/80 bg-white/90 backdrop-blur-xl pt-16 pb-12 px-6 sm:px-12 lg:px-16 text-slate-600 relative z-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
                    {/* Column 1: Brand & Bio */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
                                <Video className="w-4 h-4 text-white fill-white/20" />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tight">
                                Intell<span className="text-indigo-600">Meet</span>
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                                AI
                            </span>
                        </Link>
                        <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
                            The enterprise AI meeting and collaboration platform that converts discussions into live transcriptions, actionable summaries, and dispatched sprint tasks.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                All Systems Operational (99.99% SLA)
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Product */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/#features" className="hover:text-indigo-600 transition-colors">Real-Time WebRTC</Link></li>
                            <li><Link to="/#features" className="hover:text-indigo-600 transition-colors">Whisper Transcription</Link></li>
                            <li><Link to="/#features" className="hover:text-indigo-600 transition-colors">Smart Action Items</Link></li>
                            <li><Link to="/#features" className="hover:text-indigo-600 transition-colors">Kanban Board Sync</Link></li>
                            <li><Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing & Plans</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Solutions */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Solutions</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/solutions" className="hover:text-indigo-600 transition-colors">Engineering Teams</Link></li>
                            <li><Link to="/solutions" className="hover:text-indigo-600 transition-colors">Sales & Client Success</Link></li>
                            <li><Link to="/solutions" className="hover:text-indigo-600 transition-colors">Executive Briefs</Link></li>
                            <li><Link to="/solutions" className="hover:text-indigo-600 transition-colors">Global Remote Work</Link></li>
                            <li><Link to="/solutions" className="hover:text-indigo-600 transition-colors">Security & Compliance</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Resources */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/resources" className="hover:text-indigo-600 transition-colors">Developer API & SDK</Link></li>
                            <li><Link to="/resources" className="hover:text-indigo-600 transition-colors">Knowledge Base</Link></li>
                            <li><Link to="/resources" className="hover:text-indigo-600 transition-colors">WebRTC Whitepaper</Link></li>
                            <li><Link to="/resources" className="hover:text-indigo-600 transition-colors">Integration Guides</Link></li>
                            <li><Link to="/resources" className="hover:text-indigo-600 transition-colors">Community Discord</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© 2026 IntellMeet Collaboration Inc. Built for Enterprise Scale.</p>
                    <div className="flex items-center gap-6">
                        <a href="#privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
                        <a href="#terms" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
                        <a href="#security" className="hover:text-indigo-600 transition-colors">SOC2 Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
