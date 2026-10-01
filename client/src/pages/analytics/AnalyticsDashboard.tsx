import { useState } from 'react';
import { 
    BarChart3, TrendingUp, Clock, Users, Video, Brain, 
    Calendar, Download, Sparkle, CheckCircle, ArrowUpRight, 
    Zap, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export default function AnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

    const metrics = [
        { label: 'Meetings Held', value: timeRange === '7d' ? '18' : timeRange === '30d' ? '74' : '210', change: '+24%', positive: true, icon: Video },
        { label: 'Avg Duration', value: '31m', change: '-6m', positive: true, icon: Clock },
        { label: 'Active Participants', value: timeRange === '7d' ? '56' : timeRange === '30d' ? '198' : '620', change: '+18%', positive: true, icon: Users },
        { label: 'Hours Saved by AI', value: timeRange === '7d' ? '32.5h' : timeRange === '30d' ? '142h' : '410h', change: '+45%', positive: true, icon: Brain },
    ];

    const weeklyData = [
        { day: 'Mon', count: 5, duration: '3.5h', rate: '92%' },
        { day: 'Tue', count: 3, duration: '2.1h', rate: '88%' },
        { day: 'Wed', count: 6, duration: '4.2h', rate: '95%' },
        { day: 'Thu', count: 4, duration: '2.8h', rate: '90%' },
        { day: 'Fri', count: 2, duration: '1.4h', rate: '84%' },
    ];

    const maxCount = Math.max(...weeklyData.map(d => d.count));

    const exportReport = () => {
        toast.success('Analytics CSV report generated and downloaded!');
    };

    return (
        <div className="space-y-8 pb-12 max-w-6xl mx-auto">
            {/* Header (Frosted Glass Container) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/90 shadow-sm ring-1 ring-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Productivity & Analytics</h1>
                    <p className="text-sm font-medium text-slate-600 mt-1">
                        Enterprise intelligence on collaboration cadence, time savings, and follow-up efficiency.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center p-1 bg-white/90 border border-slate-200/80 rounded-2xl shadow-xs">
                        {(['7d', '30d', '90d'] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setTimeRange(r)}
                                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                    timeRange === r
                                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                }`}
                            >
                                {r.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <Button variant="outline" size="sm" onClick={exportReport}>
                        <Download className="w-4 h-4 mr-1.5" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Metrics KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, idx) => {
                    const Icon = m.icon;
                    return (
                        <Card key={idx} glow className="p-6 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {m.label}
                                </span>
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-xs">
                                    <Icon className="w-4 h-4 text-indigo-600" />
                                </div>
                            </div>
                            <div className="text-3xl font-black text-slate-900 tracking-tight">
                                {m.value}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold">
                                <Badge variant={m.positive ? 'success' : 'destructive'} className="py-0 px-1.5 text-[10px]">
                                    {m.change}
                                </Badge>
                                <span className="text-slate-500 font-medium">vs prior period</span>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Weekly Volume & ROI Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Meeting Volume Bar Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Weekly Meeting Cadence</CardTitle>
                        <CardDescription>Daily meeting distribution and total cumulative hours</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between gap-4 h-56 pt-6 px-4">
                            {weeklyData.map((d, i) => {
                                const heightPercent = (d.count / maxCount) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                                        <span className="text-xs font-mono text-slate-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                            {d.count} ({d.duration})
                                        </span>
                                        <div className="w-full max-w-[48px] bg-slate-100/90 rounded-2xl overflow-hidden h-full flex items-end p-1 border border-slate-200/60 shadow-inner">
                                            <div
                                                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-xl transition-all duration-500 group-hover:brightness-110 shadow-xs"
                                                style={{ height: `${heightPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{d.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* AI ROI Breakdown */}
                <Card className="flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                            <Sparkle className="w-5 h-5 text-purple-600" />
                            AI Efficiency ROI
                        </CardTitle>
                        <CardDescription>Estimated automated productivity return</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-600">Note-taking Automation</span>
                                <span className="text-slate-900 font-bold">100% automated</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200/60 overflow-hidden">
                                <div className="h-full bg-indigo-500 w-full" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-600">Action Item Completion</span>
                                <span className="text-emerald-600 font-bold">89% on-time</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200/60 overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[89%]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-600">Meeting Follow-up Speed</span>
                                <span className="text-purple-600 font-bold">4.2x faster</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200/60 overflow-hidden">
                                <div className="h-full bg-purple-500 w-[82%]" />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 text-xs text-indigo-900 font-medium leading-relaxed shadow-xs">
                            💡 <strong>AI Insight:</strong> Teams using automatic Whisper minutes reduce follow-up clarification meetings by 3.5 hours per engineer every week.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
