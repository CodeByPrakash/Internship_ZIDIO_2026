import { useState } from 'react';
import { 
    FolderKanban, Plus, MoreVertical, CheckCircle2, 
    Clock, AlertCircle, Sparkles, Filter, Search, Trash2, 
    ArrowRight, ChevronRight, User, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../../components/ui/dialog';

interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignee: string;
    column: 'todo' | 'in_progress' | 'review' | 'done';
    dueDate?: string;
    meetingRef?: string;
}

export default function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Deploy Better Auth & Neon PostgreSQL adapter', description: 'Enable session caching and relational constraints', priority: 'high', assignee: 'Alex J.', column: 'todo', dueDate: 'Friday', meetingRef: 'Q3 Arch Sync' },
        { id: '2', title: 'Setup GitHub Actions CI/CD with Docker container build', priority: 'medium', assignee: 'Sarah C.', column: 'todo', dueDate: 'Oct 4' },
        { id: '3', title: 'Implement video grid layout with active speaker ring', description: 'Add floating reactions and screen share PIP', priority: 'urgent', assignee: 'Prakash S.', column: 'in_progress', dueDate: 'Tomorrow', meetingRef: 'Sprint Planning' },
        { id: '4', title: 'Better Auth middleware unit tests & session rotation', priority: 'low', assignee: 'Dev Lead', column: 'review', dueDate: 'Oct 6' },
        { id: '5', title: 'WebRTC mesh peer connection setup & STUN/TURN fallback', priority: 'high', assignee: 'Alex J.', column: 'done', dueDate: 'Done' },
        { id: '6', title: 'OpenAI Whisper audio chunk ingestion endpoint', priority: 'high', assignee: 'Sarah C.', column: 'done', dueDate: 'Done', meetingRef: 'AI Review' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPriority, setSelectedPriority] = useState<string>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
    const [newTaskAssignee, setNewTaskAssignee] = useState('Prakash S.');
    const [newTaskColumn, setNewTaskColumn] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo');

    const columns: { key: Task['column']; label: string; badgeVariant: 'default' | 'cyan' | 'warning' | 'success' }[] = [
        { key: 'todo', label: 'To Do', badgeVariant: 'default' },
        { key: 'in_progress', label: 'In Progress', badgeVariant: 'cyan' },
        { key: 'review', label: 'In Review', badgeVariant: 'warning' },
        { key: 'done', label: 'Done', badgeVariant: 'success' },
    ];

    const getPriorityVariant = (priority: Task['priority']): 'default' | 'warning' | 'destructive' | 'secondary' => {
        switch (priority) {
            case 'low': return 'secondary';
            case 'medium': return 'warning';
            case 'high': return 'destructive';
            case 'urgent': return 'destructive';
            default: return 'default';
        }
    };

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle.trim(),
            description: newTaskDesc.trim() || undefined,
            priority: newTaskPriority,
            assignee: newTaskAssignee,
            column: newTaskColumn,
            dueDate: 'Next sprint',
        };

        setTasks(prev => [newTask, ...prev]);
        setShowCreateModal(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        toast.success(`Task "${newTask.title}" added to ${newTask.column}`);
    };

    const moveTask = (taskId: string, targetColumn: Task['column']) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column: targetColumn } : t));
    };

    const deleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        toast.success('Task removed');
    };

    const filteredTasks = tasks.filter(t => {
        const matchesQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             t.assignee.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
        return matchesQuery && matchesPriority;
    });

    const completionRate = Math.round((tasks.filter(t => t.column === 'done').length / (tasks.length || 1)) * 100);

    return (
        <div className="space-y-8 pb-12">
            {/* Header with Title & Sprint Progress */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="cyan">Active Sprint #4</Badge>
                        <span className="text-xs text-slate-400">IntellMeet Core Workspace</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mt-1">Project Kanban Board</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10">
                        <span className="text-xs text-slate-400">Sprint Progress:</span>
                        <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" 
                                style={{ width: `${completionRate}%` }} 
                            />
                        </div>
                        <span className="text-xs font-bold text-emerald-400">{completionRate}%</span>
                    </div>

                    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                        <DialogTrigger asChild>
                            <Button variant="default">
                                <Plus className="w-4 h-4 mr-1.5" /> Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <form onSubmit={handleCreateTask}>
                                <DialogHeader>
                                    <DialogTitle>Create Sprint Task</DialogTitle>
                                    <DialogDescription>
                                        Add a task to the board or link it to a meeting decision.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Title</label>
                                        <Input
                                            required
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            placeholder="e.g. Implement WebSocket rate limiter"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Description</label>
                                        <Input
                                            value={newTaskDesc}
                                            onChange={(e) => setNewTaskDesc(e.target.value)}
                                            placeholder="Details, requirements, or meeting notes..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Priority</label>
                                            <select
                                                className="flex h-11 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 text-sm text-slate-100"
                                                value={newTaskPriority}
                                                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Column</label>
                                            <select
                                                className="flex h-11 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 text-sm text-slate-100"
                                                value={newTaskColumn}
                                                onChange={(e) => setNewTaskColumn(e.target.value as any)}
                                            >
                                                <option value="todo">To Do</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="review">In Review</option>
                                                <option value="done">Done</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Create Task
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                    {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
                        <Button
                            key={p}
                            variant={selectedPriority === p ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setSelectedPriority(p)}
                            className="capitalize"
                        >
                            {p === 'all' ? 'All Priorities' : p}
                        </Button>
                    ))}
                </div>

                <div className="w-full sm:w-72">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..."
                        icon={<Search className="w-4 h-4" />}
                    />
                </div>
            </div>

            {/* 4-Column Kanban Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {columns.map((col) => {
                    const colTasks = filteredTasks.filter(t => t.column === col.key);

                    return (
                        <div key={col.key} className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-white/10">
                                <div className="flex items-center gap-2">
                                    <Badge variant={col.badgeVariant}>
                                        {col.label}
                                    </Badge>
                                </div>
                                <span className="text-xs font-semibold text-slate-400">
                                    {colTasks.length}
                                </span>
                            </div>

                            <div className="space-y-3 min-h-[400px]">
                                {colTasks.map((task) => (
                                    <Card
                                        key={task.id}
                                        glow
                                        className="p-4 space-y-3 bg-slate-900/90"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <Badge variant={getPriorityVariant(task.priority)} className="text-[10px]">
                                                {task.priority}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-slate-400 hover:text-rose-400"
                                                onClick={() => deleteTask(task.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>

                                        <h4 className="text-sm font-semibold text-white leading-snug">
                                            {task.title}
                                        </h4>

                                        {task.description && (
                                            <p className="text-xs text-slate-400 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}

                                        {task.meetingRef && (
                                            <div className="flex items-center gap-1 text-[11px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                                                <Sparkles className="w-3 h-3" />
                                                From: {task.meetingRef}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3 text-slate-500" />
                                                {task.assignee}
                                            </span>
                                            <span>{task.dueDate}</span>
                                        </div>

                                        {/* Status Movement Pills */}
                                        <div className="grid grid-cols-4 gap-1 pt-1">
                                            {columns.map(c => (
                                                <button
                                                    key={c.key}
                                                    disabled={task.column === c.key}
                                                    onClick={() => moveTask(task.id, c.key)}
                                                    className={`py-1 text-[10px] rounded transition-all ${
                                                        task.column === c.key
                                                            ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40 cursor-default'
                                                            : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400'
                                                    }`}
                                                >
                                                    {c.label.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
