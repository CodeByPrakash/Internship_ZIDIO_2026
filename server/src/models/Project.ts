import mongoose, { Document, Schema } from 'mongoose';

export interface IColumn {
    name: string;
    order: number;
}

export interface IProject extends Document {
    name: string;
    description?: string;
    workspace: mongoose.Types.ObjectId;
    columns: IColumn[];
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        description: {
            type: String,
            maxlength: 500,
            default: '',
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
            index: true,
        },
        columns: [
            {
                name: { type: String, required: true },
                order: { type: Number, default: 0 },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IProject>('Project', ProjectSchema);
