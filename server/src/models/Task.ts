import mongoose, { Document, Schema } from 'mongoose';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface ITask extends Document {
    title: string;
    description?: string;
    project: mongoose.Types.ObjectId;
    assignee?: mongoose.Types.ObjectId;
    reporter: mongoose.Types.ObjectId;
    priority: TaskPriority;
    status: TaskStatus;
    column: string;
    dueDate?: Date;
    meetingRef?: mongoose.Types.ObjectId;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            maxlength: 2000,
            default: '',
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
            index: true,
        },
        assignee: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reporter: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'review', 'done'],
            default: 'todo',
        },
        column: {
            type: String,
            default: 'To Do',
        },
        dueDate: Date,
        meetingRef: {
            type: Schema.Types.ObjectId,
            ref: 'Meeting',
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

TaskSchema.index({ project: 1, column: 1, order: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
