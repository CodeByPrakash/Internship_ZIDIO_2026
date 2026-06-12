import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType = 'meeting-invite' | 'action-item' | 'mention' | 'system';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['meeting-invite', 'action-item', 'mention', 'system'],
            default: 'system',
        },
        title: {
            type: String,
            required: true,
            maxlength: 200,
        },
        body: {
            type: String,
            maxlength: 1000,
            default: '',
        },
        data: {
            type: Schema.Types.Mixed,
            default: {},
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
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

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
