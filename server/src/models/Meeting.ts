import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MeetingStatus = 'scheduled' | 'active' | 'ended';
export type ParticipantRole = 'host' | 'presenter' | 'attendee';

export interface IParticipant {
    user: mongoose.Types.ObjectId;
    role: ParticipantRole;
    joinedAt?: Date;
    leftAt?: Date;
}

export interface IRecording {
    url: string;
    publicId: string;
    duration: number; // seconds
}

export interface IMeeting extends Document {
    roomId: string;
    title: string;
    description?: string;
    host: mongoose.Types.ObjectId;
    participants: IParticipant[];
    status: MeetingStatus;
    startTime?: Date;
    endTime?: Date;
    passcode?: string;
    isRecorded: boolean;
    recording?: IRecording;
    agenda?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
            type: String,
            enum: ['host', 'presenter', 'attendee'],
            default: 'attendee',
        },
        joinedAt: { type: Date },
        leftAt: { type: Date },
    },
    { _id: false }
);

const MeetingSchema = new Schema<IMeeting>(
    {
        roomId: {
            type: String,
            default: uuidv4,
            unique: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Meeting title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters'],
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            default: '',
        },
        host: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        participants: {
            type: [ParticipantSchema],
            default: [],
        },
        status: {
            type: String,
            enum: ['scheduled', 'active', 'ended'],
            default: 'scheduled',
            index: true,
        },
        startTime: { type: Date },
        endTime: { type: Date },
        passcode: {
            type: String,
            select: false, // Hidden from queries  
        },
        isRecorded: {
            type: Boolean,
            default: false,
        },
        recording: {
            url: { type: String },
            publicId: { type: String },
            duration: { type: Number, default: 0 },
        },
        agenda: {
            type: String,
            maxlength: [2000, 'Agenda cannot exceed 2000 characters'],
            default: '',
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Compound index for fast user-meeting lookups
MeetingSchema.index({ host: 1, status: 1 });
MeetingSchema.index({ 'participants.user': 1, status: 1 });

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
