import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Check, ArrowRight, Sparkles, HelpCircle, 
    Shield, Zap, Star, ChevronDown, CheckCircle2,
    X as XIcon
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const plans = [
        {
            name: "Starter",
            tagline: "For individuals and small teams exploring AI meetings.",
            monthlyPrice: 0,
            annualPrice: 0,
            popular: false,
            badge: "Free Forever",
            ctaText: "Get Started Free",
            ctaLink: "/signup",
            features: [
                "Up to 45 minutes per meeting",
                "Up to 10 participants per room",
                "50 AI Whisper transcription mins/mo",
                "Basic AI Summary bullet points",
                "1 Active Kanban Workspace",
                "Standard 720p HD Video",
                "Community Support"
            ],
            missingFeatures: [
                "Automated Jira / GitHub sync",
                "Cloud recording storage",
                "Custom AI prompts & extraction",
                "SSO / SAML 2.0 Auth"
            ]
        },
        {
            name: "Pro Team",
            tagline: "For high-performing teams needing automated sprint syncs & summaries.",
            monthlyPrice: 19,
            annualPrice: 15,
            popular: true,
            badge: "Most Popular",
            ctaText: "Start 14-Day Free Trial",
            ctaLink: "/signup",
            features: [
                "Unlimited meeting duration",
                "Up to 100 participants per room",
                "Unlimited Whisper AI Transcription",
                "GPT-4o Action Item & Decision Extraction",
                "Unlimited Kanban Workspaces & Tasks",
                "Crisp 1080p Full HD Video & Screen Share",
                "Cloud Recording & Audio Downloads",
                "Custom AI Summary templates",
                "Priority Email & Chat Support"
            ],
            missingFeatures: [
                "Dedicated SFU Server Cluster",
                "SAML / Okta SSO & SCIM Sync",
                "Custom LLM Data Boundary"
            ]
        },
        {
            name: "Enterprise",
            tagline: "For organizations demanding military-grade security, custom SLAs, and dedicated compute.",
            monthlyPrice: 49,
            annualPrice: 39,
            popular: false,
            badge: "Enterprise Grade",
            ctaText: "Contact Sales",
            ctaLink: "/signup",
            features: [
                "Unlimited everything & up to 500 participants",
                "Dedicated WebRTC SFU streaming cluster",
                "Zero-data retention LLM privacy boundary",
                "Okta, Azure AD & Google SAML 2.0 SSO",
                "Custom SCIM directory provisioning",
                "Role-based workspace access & audit logs",
                "Custom CRM & Jira webhook pipelines",
                "99.99% Uptime SLA guarantee",
                "Dedicated Technical Account Manager"
            ],
            missingFeatures: []
        }
    ];

    const faqs = [
        {
            q: "Can I use IntellMeet for free?",
            a: "Yes! Our Starter plan is completely free forever with no credit card required. You get 50 AI transcription minutes every month and full access to meeting rooms and basic Kanban boards."
        },
        {
            q: "How does the AI transcription and task dispatch work?",
            a: "During and immediately after your video meeting, our speech pipeline runs OpenAI Whisper to generate high-accuracy transcripts with speaker labels. GPT-4o synthesizes decisions and automatically dispatches actionable tasks to your Kanban sprint board."
        },
        {
            q: "Are my meeting transcripts used to train AI models?",
            a: "No, never. We have zero-data retention agreements with model providers. Your transcripts, audio streams, and workspace tasks remain 100% private to your tenant and are encrypted at rest with AES-256."
        },
        {
            q: "Can I switch or cancel my plan anytime?",
            a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time with a single click in your workspace settings. If you cancel, your account remains active until the end of the billing cycle."
        },
        {
            q: "Do you offer custom onboarding for enterprise teams?",
            a: "Yes! For Enterprise customers, we offer white-glove onboarding, custom SSO/SAML configuration, dedicated SFU routing nodes, and direct Slack/Teams escalation channels."
        }
    ];

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
                        <Sparkles className="w-3.5 h-3.5 fill-indigo-600" />
                        <span>Simple, Transparent Pricing</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        Invest in Productive Meetings, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
                            Not Manual Note-Taking
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                        Choose the perfect plan for your team. Start free today and scale seamlessly as your collaboration demands grow.
                    </p>

                    {/* Monthly / Annual Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <span className={`text-sm font-bold ${!isAnnual ? 'text-indigo-600' : 'text-slate-500'}`}>
                            Monthly Billing
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-14 h-8 rounded-full bg-slate-900 p-1 relative transition-colors focus:outline-none"
                            aria-label="Toggle annual billing"
                        >
                            <div 
                                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                                    isAnnual ? 'translate-x-6 bg-gradient-to-r from-indigo-500 to-purple-500' : 'translate-x-0'
                                }`}
                            />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isAnnual ? 'text-indigo-600' : 'text-slate-500'}`}>
                                Annual Billing
                            </span>
                            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                                Save 20%
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Pricing Cards Grid ─────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, idx) => {
                        const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
                        return (
                            <div 
                                key={idx}
                                className={`rounded-3xl p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 relative ${
                                    plan.popular
                                        ? 'bg-white/90 backdrop-blur-2xl border-2 border-indigo-500 shadow-2xl shadow-indigo-500/15 ring-4 ring-indigo-500/10 scale-[1.02] z-20'
                                        : 'bg-white/75 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-900/5 hover:border-indigo-200'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-md uppercase tracking-wider">
                                        ★ {plan.badge}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                                            {!plan.popular && (
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                                    {plan.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed min-h-[36px]">
                                            {plan.tagline}
                                        </p>
                                    </div>

                                    {/* Price tag */}
                                    <div className="pt-2 pb-4 border-b border-slate-100">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-black text-slate-900 tracking-tight">
                                                ${price}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-500">
                                                {price === 0 ? '' : '/user /month'}
                                            </span>
                                        </div>
                                        {isAnnual && price > 0 && (
                                            <p className="text-xs text-indigo-600 font-semibold mt-1">
                                                Billed annually (${price * 12}/user/yr)
                                            </p>
                                        )}
                                    </div>

                                    {/* Feature Check List */}
                                    <div className="space-y-3 pt-2">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-900">What's included:</p>
                                        {plan.features.map((feat, fIdx) => (
                                            <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                                                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <span>{feat}</span>
                                            </div>
                                        ))}

                                        {plan.missingFeatures.map((mFeat, mIdx) => (
                                            <div key={mIdx} className="flex items-start gap-2.5 text-xs text-slate-400 font-medium line-through opacity-70">
                                                <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                                                    <XIcon className="w-2.5 h-2.5" />
                                                </div>
                                                <span>{mFeat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <Link to={plan.ctaLink} className="w-full block">
                                        <button 
                                            className={`w-full py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                                                plan.popular
                                                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]'
                                                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                                            }`}
                                        >
                                            <span>{plan.ctaText}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── Frequently Asked Questions Section ─────────────────── */}
            <section className="max-w-4xl mx-auto px-6 sm:px-12 pb-24 relative z-10">
                <div className="text-center space-y-3 pb-12">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Got Questions?</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                    <p className="text-sm text-slate-600 max-w-lg mx-auto">
                        Everything you need to know about IntellMeet billing, AI quotas, and enterprise guarantees.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div 
                                key={idx}
                                className="rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 overflow-hidden transition-all shadow-sm"
                            >
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                                >
                                    <span className="text-base">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                                </button>
                                {isOpen && (
                                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-medium">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
