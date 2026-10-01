import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Code2, TrendingUp, ShieldCheck, Briefcase, 
    ArrowRight, CheckCircle2, Sparkles, Zap, 
    FileText, CheckSquare, Users, Cpu, Lock, 
    Layers, Terminal, Globe, ChevronRight
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function Solutions() {
    const [activeTab, setActiveTab] = useState<'engineering' | 'sales' | 'leadership' | 'security'>('engineering');

    const solutionsData = {
        engineering: {
            title: "Engineering & Product Agile Teams",
            subtitle: "Automate sprint standups, architectural reviews, and backlog grooming without manual note-taking.",
            tag: "Agile & DevOps",
            metric: "4.8 hrs/week",
            metricLabel: "Time saved per engineer on administrative syncs",
            badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
            features: [
                {
                    title: "Automated Jira & Kanban Card Dispatch",
                    desc: "When engineers say 'I'll fix the Redis connection pool timeout by Thursday', GPT-4o automatically creates an assignable ticket with deadline & priority."
                },
                {
                    title: "Technical Code Snippet & PR Detection",
                    desc: "IntellMeet recognizes function names, Git branches, PR numbers, and repo paths spoken during architecture meetings."
                },
                {
                    title: "Asynchronous Standup Summaries",
                    desc: "Team members in different time zones receive 60-second TL;DR video digests and blocker lists."
                }
            ],
            codeExample: `// Dispatched from Standup Meeting #412
{
  "task": "Optimize WebRTC Mesh SFU packet aggregation",
  "assignee": "Alex Rivera",
  "priority": "HIGH",
  "source_timestamp": "14:32",
  "status": "IN_PROGRESS"
}`
        },
        sales: {
            title: "Sales & Customer Success",
            subtitle: "Close enterprise deals faster with instant objection analysis and automated CRM synchronizations.",
            tag: "Revenue Acceleration",
            metric: "+34%",
            metricLabel: "Increase in post-call action item follow-up speed",
            badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
            features: [
                {
                    title: "Live Sentiment & Objection Monitoring",
                    desc: "AI identifies competitor mentions, budget hesitations, and customer feature requests in real time."
                },
                {
                    title: "One-Click Follow-Up Email Generation",
                    desc: "Generate hyper-personalized client recap emails with exact agreed pricing, next steps, and demo deliverables."
                },
                {
                    title: "CRM Auto-Enrichment",
                    desc: "Sync deal stages, attendees, and key decision factors directly to Salesforce, HubSpot, and Pipedrive."
                }
            ],
            codeExample: `// CRM Auto-Sync Payload
{
  "opportunity": "Acme Corp Enterprise License",
  "sentiment": "POSITIVE (0.88)",
  "budget_confirmed": "$45,000/yr",
  "next_milestone": "Security Review Sign-off (Friday)"
}`
        },
        leadership: {
            title: "Executive Leadership & Board",
            subtitle: "High-level strategic summaries, executive briefs, and decisions ledger for senior leadership.",
            tag: "Executive Intelligence",
            metric: "100%",
            metricLabel: "Decision traceability across cross-functional departments",
            badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
            features: [
                {
                    title: "Executive 3-Minute Briefings",
                    desc: "Transform 90-minute quarterly board calls into crisp, bulleted executive memos categorized by Strategic, Operational, and Financial impacts."
                },
                {
                    title: "Centralized Decision Ledger",
                    desc: "Every major consensus decision is timestamped and recorded into an immutable audit trail for full organizational clarity."
                },
                {
                    title: "Attendance & Engagement Analytics",
                    desc: "Track department participation, speaking parity, and cross-team alignment trends over time."
                }
            ],
            codeExample: `// Executive Decision Item
{
  "decision_id": "DEC-2026-Q1-09",
  "topic": "Approve EMEA Data Center Expansion",
  "unanimous": true,
  "owner": "Sarah Lin (COO)",
  "effective_date": "2026-04-01"
}`
        },
        security: {
            title: "Enterprise IT & InfoSec",
            subtitle: "Military-grade encryption, role-based access control, and sovereign data residency compliance.",
            tag: "Zero Trust Security",
            metric: "SOC 2 Type II",
            metricLabel: "Certified compliance with ISO 27001 & HIPAA ready",
            badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
            features: [
                {
                    title: "End-to-End Encrypted WebRTC (DTLS-SRTP)",
                    desc: "Audio and video streams are encrypted at the peer level. No unencrypted media ever touches shared public relays."
                },
                {
                    title: "Custom LLM Boundary Isolation",
                    desc: "Your proprietary meeting transcripts and audio are never used for training foundation models. Fully isolated tenant encryption keys."
                },
                {
                    title: "SAML 2.0 / Okta SSO & SCIM Directory Sync",
                    desc: "Automate user onboarding and offboarding instantly with Better Auth enterprise authentication."
                }
            ],
            codeExample: `// Security & Compliance Profile
{
  "encryption": "AES-256-GCM / DTLS 1.3",
  "sso_provider": "Okta SAML 2.0",
  "retention_policy": "30-Day Auto-Purge Enforced",
  "audit_logging": "ENABLED"
}`
        }
    };

    const currentSolution = solutionsData[activeTab];

    return (
        <div className="min-h-screen bg-[#f8fbff] text-slate-900 relative overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
            <PublicNavbar />

            {/* ─── Hero Header ────────────────────────────────────────── */}
            <section className="relative pt-16 pb-20 px-6 sm:px-12 lg:px-16 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 opacity-40 pointer-events-none"
                    style={{ backgroundImage: `url('/bg.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-[#f8fbff] z-0 pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/90 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 fill-indigo-600" />
                        <span>Tailored Enterprise Solutions</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        AI Meeting Intelligence Built for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
                            High-Velocity Teams
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        Whether you are shipping code, closing high-value accounts, or steering organizational strategy, IntellMeet adapts to your exact workflow.
                    </p>

                    {/* Interactive Tab Selectors */}
                    <div className="flex flex-wrap justify-center gap-2 pt-4">
                        {[
                            { id: 'engineering', label: 'Engineering & Product', icon: Code2 },
                            { id: 'sales', label: 'Sales & Revenue', icon: TrendingUp },
                            { id: 'leadership', label: 'Executive Leadership', icon: Briefcase },
                            { id: 'security', label: 'IT & InfoSec', icon: ShieldCheck },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all shadow-sm ${
                                        isActive
                                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                                            : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 hover:border-indigo-300'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── Active Solution Showcase Section ───────────────────── */}
            <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left: Solution Details & Features */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="p-8 sm:p-10 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-slate-900/5 space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full border ${currentSolution.badgeColor}`}>
                                    {currentSolution.tag}
                                </span>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-indigo-600 block">{currentSolution.metric}</span>
                                    <span className="text-xs text-slate-500 font-medium">{currentSolution.metricLabel}</span>
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                {currentSolution.title}
                            </h2>

                            <p className="text-base text-slate-600 leading-relaxed font-medium">
                                {currentSolution.subtitle}
                            </p>

                            {/* Features list */}
                            <div className="space-y-4 pt-2">
                                {currentSolution.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-indigo-50/40 transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">{feat.title}</h3>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 flex flex-wrap items-center gap-4">
                                <Link to="/signup">
                                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all flex items-center gap-2">
                                        <span>Deploy for Your Team</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                                <Link to="/pricing" className="text-sm font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1">
                                    <span>View Pricing</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Interactive Mock / Code Terminal */}
                    <div className="lg:col-span-5">
                        <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl p-6 text-white space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                                </div>
                                <span className="text-xs font-mono text-slate-400">intellmeet-ai-pipeline.json</span>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950/90 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800/80">
                                <pre>{currentSolution.codeExample}</pre>
                            </div>

                            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                                <p className="text-xs text-indigo-200">
                                    Processed in <strong className="text-white">184ms</strong> via Whisper AI & GPT-4o Action Extractor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Enterprise Trust & Security Badges ─────────────────── */}
            <section className="bg-white py-16 px-6 sm:px-12 border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto space-y-10 text-center">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Enterprise-Grade Trust</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Compliant with Global Data Standards</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "SOC 2 Type II", desc: "Audited security controls" },
                            { name: "HIPAA Compliant", desc: "Protected health information safe" },
                            { name: "GDPR & CCPA", desc: "Data residency & privacy rights" },
                            { name: "AES-256 E2EE", desc: "Peer-level media encryption" }
                        ].map((item, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 text-center space-y-2 hover:border-indigo-300 transition-colors">
                                <ShieldCheck className="w-8 h-8 text-indigo-600 mx-auto" />
                                <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                                <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Bottom CTA ─────────────────────────────────────────── */}
            <section className="py-20 px-6 sm:px-12 lg:px-16 text-center max-w-5xl mx-auto">
                <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ready to transform your meetings?</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                        Experience IntellMeet with Your Team Today
                    </h2>

                    <p className="text-slate-300 max-w-xl mx-auto text-base">
                        Get started in less than 2 minutes. No credit card required. Free tier includes full AI transcription.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <Link to="/signup">
                            <button className="px-8 py-3.5 rounded-full bg-white text-indigo-950 hover:bg-slate-100 font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                <span>Get Started Free</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                        <Link to="/pricing">
                            <button className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all">
                                <span>Compare Plans</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
