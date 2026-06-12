import mongoose, { Document, Schema } from 'mongoose';

export type MessageType = 'text' | 'file' | 'system';

export interface IReadReceipt {
    user: mongoose.Types.ObjectId;
    readAt: Date;
}

export interface IMessage extends Document {
    meeting: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    type: MessageType;
    readBy: IReadReceipt[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        meeting: {
            type: Schema.Types.ObjectId,
            ref: 'Meeting',
            required: true,
            index: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: [true, 'Message content is required'],
            maxlength: [5000, 'Message cannot exceed 5000 characters'],
        },
        type: {
            type: String,
            enum: ['text', 'file', 'system'],
            default: 'text',
        },
        readBy: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                readAt: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc: any, ret: any) => {
                delete ret.__v;
                return ret;
            },
        },
    }
);

MessageSchema.index({ meeting: 1, createdAt: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
