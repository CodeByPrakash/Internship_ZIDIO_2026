import { create } from 'zustand';

interface UiState {
    sidebarOpen: boolean;
    activeModal: string | null;
    chatPanelOpen: boolean;
    participantPanelOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    openModal: (id: string) => void;
    closeModal: () => void;
    toggleChatPanel: () => void;
    toggleParticipantPanel: () => void;
}

export const useUiStore = create<UiState>((set) => ({
    sidebarOpen: true,
    activeModal: null,
    chatPanelOpen: false,
    participantPanelOpen: false,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    openModal: (id) => set({ activeModal: id }),
    closeModal: () => set({ activeModal: null }),
    toggleChatPanel: () => set((s) => ({ chatPanelOpen: !s.chatPanelOpen, participantPanelOpen: false })),
    toggleParticipantPanel: () => set((s) => ({ participantPanelOpen: !s.participantPanelOpen, chatPanelOpen: false })),
}));
