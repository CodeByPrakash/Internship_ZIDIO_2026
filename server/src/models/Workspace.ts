import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkspaceMember {
    user: mongoose.Types.ObjectId;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
}

export interface IWorkspace extends Document {
    name: string;
    description?: string;
    owner: mongoose.Types.ObjectId;
    members: IWorkspaceMember[];
    createdAt: Date;
    updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>(
    {
        name: {
            type: String,
            required: [true, 'Workspace name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        description: {
            type: String,
            maxlength: 500,
            default: '',
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
                joinedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
