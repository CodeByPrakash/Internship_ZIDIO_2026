import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

// Mock AI transcription — returns realistic transcript
const mockTranscribe = (): string[] => [
    'Welcome everyone to today\'s standup meeting.',
    'Let\'s go around and share our updates.',
    'I\'ve completed the authentication module and started on the meeting dashboard.',
    'The WebRTC integration is looking good, we should have video calls working by end of day.',
    'We need to prioritize the chat feature for the next sprint.',
    'Action item: Review the API documentation before Friday.',
    'Let\'s schedule a follow-up for next week to check on progress.',
];

// Mock AI summary
const mockSummarize = (transcript: string[]) => ({
    summary: 'The team discussed progress on the IntellMeet platform. Key updates include completion of the authentication module, ongoing WebRTC integration for video calls, and plans to prioritize the chat feature in the next sprint. A follow-up meeting was scheduled for next week.',
    keyDecisions: [
        'Prioritize chat feature in next sprint',
        'Schedule follow-up meeting for next week',
    ],
    actionItems: [
        { text: 'Review API documentation', assignee: 'Team', dueDate: 'Friday', status: 'pending' },
        { text: 'Complete WebRTC video call integration', assignee: 'Dev Lead', dueDate: 'End of day', status: 'pending' },
        { text: 'Prepare chat feature sprint plan', assignee: 'PM', dueDate: 'Next Monday', status: 'pending' },
    ],
});

export const transcribeMeeting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const transcript = mockTranscribe();
        const meetingId = req.params.meetingId;

        if (meetingId) {
            const meeting = await prisma.meeting.findFirst({
                where: { OR: [{ id: meetingId }, { roomId: meetingId }] },
            });

            if (meeting) {
                await prisma.meeting.update({
                    where: { id: meeting.id },
                    data: {
                        agenda: transcript,
                    },
                });
            }
        }

        res.status(200).json({ success: true, transcript });
    } catch (err) {
        next(err);
    }
};

export const summarizeMeeting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const meetingId = req.params.meetingId;
        const meeting = await prisma.meeting.findFirst({
            where: { OR: [{ id: meetingId }, { roomId: meetingId }] },
        });

        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        const transcript = (Array.isArray(meeting.agenda) ? (meeting.agenda as string[]) : mockTranscribe());
        const result = mockSummarize(transcript);

        await prisma.meeting.update({
            where: { id: meeting.id },
            data: {
                aiSummary: result.summary,
                keyDecisions: result.keyDecisions,
            },
        });

        // Store action items
        for (const item of result.actionItems) {
            await prisma.actionItem.create({
                data: {
                    meetingId: meeting.id,
                    text: item.text,
                    assignee: item.assignee,
                    dueDate: item.dueDate,
                    status: item.status,
                },
            }).catch(() => null);
        }

        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

export const getAiSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const meetingId = req.params.meetingId;
        const meeting = await prisma.meeting.findFirst({
            where: { OR: [{ id: meetingId }, { roomId: meetingId }] },
            include: { actionItems: true },
        });

        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        res.status(200).json({
            success: true,
            summary: meeting.aiSummary || null,
            keyDecisions: meeting.keyDecisions || [],
            actionItems: meeting.actionItems || [],
        });
    } catch (err) {
        next(err);
    }
};
