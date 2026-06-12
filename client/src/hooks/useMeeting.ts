import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useMeetings = (status?: string) =>
    useQuery({
        queryKey: ['meetings', status],
        queryFn: async () => {
            const params = status ? { status } : {};
            const res = await api.get('/meetings', { params });
            return res.data;
        },
    });

export const useMeeting = (id: string) =>
    useQuery({
        queryKey: ['meeting', id],
        queryFn: async () => {
            const res = await api.get(`/meetings/${id}`);
            return res.data.meeting;
        },
        enabled: !!id,
    });

export const useCreateMeeting = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: { title: string; description?: string; agenda?: string }) => {
            const res = await api.post('/meetings', data);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['meetings'] });
            toast.success('Meeting created!');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
    });
};

export const useJoinMeeting = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post(`/meetings/${id}/join`);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['meetings'] }),
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to join'),
    });
};

export const useEndMeeting = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post(`/meetings/${id}/end`);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['meetings'] });
            toast.success('Meeting ended');
        },
    });
};

export const useDeleteMeeting = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/meetings/${id}`);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['meetings'] });
            toast.success('Meeting deleted');
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
    });
};
