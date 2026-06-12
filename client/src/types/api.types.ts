export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    avatar?: string;
    bio?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Meeting {
    _id: string;
    roomId: string;
    title: string;
    description?: string;
    host: User;
    participants: Participant[];
    status: 'scheduled' | 'active' | 'ended';
    startTime?: string;
    endTime?: string;
    isRecorded: boolean;
    agenda?: string;
    transcript?: string;
    aiSummary?: string;
    actionItems?: ActionItem[];
    createdAt: string;
    updatedAt: string;
}

export interface Participant {
    user: User;
    role: 'host' | 'presenter' | 'attendee';
    joinedAt?: string;
    leftAt?: string;
}

export interface ActionItem {
    text: string;
    assignee: string;
    dueDate: string;
    status: 'pending' | 'completed';
}

export interface ChatMessage {
    _id: string;
    meeting: string;
    sender: { _id: string; name: string; avatar?: string };
    content: string;
    type: 'text' | 'file' | 'system';
    createdAt: string;
}

export interface Notification {
    _id: string;
    type: 'meeting-invite' | 'action-item' | 'mention' | 'system';
    title: string;
    body: string;
    isRead: boolean;
    createdAt: string;
}

export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    owner: User;
    members: { user: User; role: string; joinedAt: string }[];
    createdAt: string;
}

export interface Project {
    _id: string;
    name: string;
    description?: string;
    workspace: string;
    columns: { name: string; order: number }[];
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    project: string;
    assignee?: User;
    reporter: User;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: string;
    column: string;
    dueDate?: string;
    order: number;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}
