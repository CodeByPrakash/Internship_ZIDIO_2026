import { useState } from 'react';
import { 
    FolderKanban, Plus, MoreVertical, CheckCircle2, 
    Clock, AlertCircle, Sparkle, Filter, Search, Trash2, 
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
            title: newTaskTitle,
            description: newTaskDesc || undefined,
            priority: newTaskPriority,
            assignee: newTaskAssignee,
            column: newTaskColumn,
            dueDate: 'This Week',
        };

        setTasks([...tasks, newTask]);
        setShowCreateModal(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        toast.success('Task created successfully');
    };

    const moveTask = (taskId: string, targetColumn: Task['column']) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, column: targetColumn } : t));
        toast.success(`Task moved to ${targetColumn.replace('_', ' ').toUpperCase()}`);
    };

    const deleteTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
        toast.success('Task deleted');
    };

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
        return matchesSearch && matchesPriority;
    });

    const completionRate = Math.round((tasks.filter(t => t.column === 'done').length / (tasks.length || 1)) * 100);

    return (
        <div className="space-y-6 pb-12">
            {/* Top Control Panel */}
            <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/90 shadow-sm ring-1 ring-white/60 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="cyan">Active Sprint #4</Badge>
                            <span className="text-xs font-bold text-slate-500">IntellMeet Core Workspace</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-1">Project Kanban Board</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs">
                            <span className="text-xs font-bold text-slate-600">Sprint Progress:</span>
                            <div className="w-28 h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" 
                                    style={{ width: `${completionRate}%` }} 
                                />
                            </div>
                            <span className="text-xs font-black text-emerald-600">{completionRate}%</span>
                        </div>

                        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                            <DialogTrigger asChild>
                                <Button variant="default" className="shadow-md shadow-indigo-500/25">
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
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Title</label>
                                            <Input
                                                required
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                                placeholder="e.g. Implement WebSocket rate limiter"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                                            <Input
                                                value={newTaskDesc}
                                                onChange={(e) => setNewTaskDesc(e.target.value)}
                                                placeholder="Details, requirements, or meeting notes..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Priority</label>
                                                <select
                                                    className="flex h-11 w-full rounded-xl border border-slate-200/80 bg-white/90 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
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
                                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Column</label>
                                                <select
                                                    className="flex h-11 w-full rounded-xl border border-slate-200/80 bg-white/90 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 border border-slate-200/80 rounded-2xl overflow-x-auto w-full sm:w-auto">
                        {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setSelectedPriority(p)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize cursor-pointer ${
                                    selectedPriority === p
                                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                                }`}
                            >
                                {p === 'all' ? 'All Priorities' : p}
                            </button>
                        ))}
                    </div>

                    <div className="w-full sm:w-80">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks or descriptions..."
                            icon={<Search className="w-4 h-4" />}
                        />
                    </div>
                </div>
            </div>

            {/* 4-Column Kanban Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
                {columns.map((col) => {
                    const colTasks = filteredTasks.filter(t => t.column === col.key);

                    return (
                        <div 
                            key={col.key} 
                            className="flex flex-col space-y-3 p-3.5 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-sm ring-1 ring-white/60 min-h-[500px]"
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs">
                                <Badge variant={col.badgeVariant}>
                                    {col.label}
                                </Badge>
                                <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {colTasks.length}
                                </span>
                            </div>

                            {/* Task Cards Stack */}
                            <div className="space-y-3 flex-1">
                                {colTasks.length === 0 ? (
                                    <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200/80 flex items-center justify-center text-xs font-semibold text-slate-400">
                                        No tasks in this lane
                                    </div>
                                ) : (
                                    colTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all space-y-3"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <Badge variant={getPriorityVariant(task.priority)} className="text-[10px]">
                                                    {task.priority}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                    onClick={() => deleteTask(task.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>

                                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                                {task.title}
                                            </h4>

                                            {task.description && (
                                                <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                                                    {task.description}
                                                </p>
                                            )}

                                            {task.meetingRef && (
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200/60">
                                                    <Sparkle className="w-3 h-3 text-purple-600" />
                                                    <span>From: {task.meetingRef}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                                                <span className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="font-semibold text-slate-700">{task.assignee}</span>
                                                </span>
                                                <span className="font-semibold text-slate-500">{task.dueDate}</span>
                                            </div>

                                            {/* Status Movement Pills */}
                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Move:</span>
                                                <div className="flex items-center gap-1 flex-wrap justify-end">
                                                    {columns.map(c => {
                                                        const isCurrent = task.column === c.key;
                                                        return (
                                                            <button
                                                                key={c.key}
                                                                disabled={isCurrent}
                                                                onClick={() => moveTask(task.id, c.key)}
                                                                className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                                                                    isCurrent
                                                                        ? 'bg-indigo-600 text-white shadow-xs'
                                                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                                                }`}
                                                            >
                                                                {c.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
