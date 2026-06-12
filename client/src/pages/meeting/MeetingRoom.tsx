import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { meetingSocket, connectSockets } from '../../lib/socket';
import { useAuthStore } from '../../store/auth.store';
import {
    Mic, MicOff, Camera, CameraOff, Monitor, MonitorOff,
    PhoneOff, MessageSquare, Users, Copy, Check,
} from 'lucide-react';

interface PeerInfo {
    socketId: string;
    userId: string;
    name: string;
}

interface PeerState {
    info: PeerInfo;
    pc: RTCPeerConnection;
    stream: MediaStream | null;
}

const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ],
};

export default function MeetingRoom() {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const userName = user?.name || 'Guest';

    // Media state
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [sharing, setSharing] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [participantsOpen, setParticipantsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [connected, setConnected] = useState(false);

    // Refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const peersRef = useRef<Map<string, PeerState>>(new Map());
    const [peerList, setPeerList] = useState<Map<string, { info: PeerInfo; stream: MediaStream | null }>>(new Map());

    // Force re-render of peer list
    const syncPeerList = useCallback(() => {
        const newMap = new Map<string, { info: PeerInfo; stream: MediaStream | null }>();
        peersRef.current.forEach((p, key) => {
            newMap.set(key, { info: p.info, stream: p.stream });
        });
        setPeerList(new Map(newMap));
    }, []);

    // ─── Get local media ──────────────────────────────────────────────────────
    const getLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
            });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            return stream;
        } catch (err) {
            console.warn('Camera failed, trying audio only:', err);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                localStreamRef.current = stream;
                setCamOn(false);
                return stream;
            } catch {
                console.error('No media devices available');
                setCamOn(false);
                setMicOn(false);
                return null;
            }
        }
    }, []);

    // ─── Create peer connection ───────────────────────────────────────────────
    const createPeerConnection = useCallback((peerInfo: PeerInfo): RTCPeerConnection => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        // Add local tracks to the connection
        const localStream = localStreamRef.current;
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                pc.addTrack(track, localStream);
            });
        }

        // Send ICE candidates to remote peer
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                meetingSocket.emit('ice-candidate', { to: peerInfo.socketId, candidate: e.candidate });
            }
        };

        // Receive remote tracks
        pc.ontrack = (e) => {
            console.log(`Got track from ${peerInfo.name}:`, e.track.kind);
            const remoteStream = e.streams[0] || new MediaStream([e.track]);
            
            const existing = peersRef.current.get(peerInfo.socketId);
            if (existing) {
                existing.stream = remoteStream;
            }
            syncPeerList();
        };

        pc.oniceconnectionstatechange = () => {
            console.log(`ICE state for ${peerInfo.name}: ${pc.iceConnectionState}`);
        };

        pc.onconnectionstatechange = () => {
            console.log(`Connection state for ${peerInfo.name}: ${pc.connectionState}`);
            if (pc.connectionState === 'connected') {
                syncPeerList();
            }
        };

        peersRef.current.set(peerInfo.socketId, { info: peerInfo, pc, stream: null });
        syncPeerList();
        return pc;
    }, [syncPeerList]);

    // ─── Socket lifecycle ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!roomId) return;
        let mounted = true;

        const init = async () => {
            // 1. Get local media first
            await getLocalStream();

            // 2. Connect socket
            connectSockets();
            
            // Wait for connection
            const waitForConnect = () => new Promise<void>((resolve) => {
                if (meetingSocket.connected) { resolve(); return; }
                meetingSocket.once('connect', () => resolve());
                setTimeout(resolve, 3000); // timeout fallback
            });
            await waitForConnect();
            
            if (!mounted) return;
            setConnected(meetingSocket.connected);

            // 3. Join room with user info
            meetingSocket.emit('join-room', { roomId, userName });

            // ── Existing participants: create offers to each ──
            meetingSocket.on('existing-participants', async (peers: PeerInfo[]) => {
                if (!mounted) return;
                console.log('Existing participants:', peers);
                for (const peer of peers) {
                    try {
                        const pc = createPeerConnection(peer);
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);
                        meetingSocket.emit('offer', { to: peer.socketId, offer });
                        console.log(`Sent offer to ${peer.name}`);
                    } catch (err) {
                        console.error(`Failed to create offer for ${peer.name}:`, err);
                    }
                }
            });

            // ── New user connected: wait for their offer ──
            meetingSocket.on('user-connected', (peer: PeerInfo) => {
                if (!mounted) return;
                console.log('New user connected:', peer.name);
                createPeerConnection(peer);
            });

            // ── Receive offer → answer ──
            meetingSocket.on('offer', async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
                if (!mounted) return;
                console.log('Received offer from:', from);
                let peerState = peersRef.current.get(from);
                if (!peerState) {
                    // Unknown peer — create connection
                    const pc = createPeerConnection({ socketId: from, userId: '', name: 'Participant' });
                    peerState = peersRef.current.get(from)!;
                }
                try {
                    await peerState.pc.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peerState.pc.createAnswer();
                    await peerState.pc.setLocalDescription(answer);
                    meetingSocket.emit('answer', { to: from, answer });
                    console.log('Sent answer to:', from);
                } catch (err) {
                    console.error('Error handling offer:', err);
                }
            });

            // ── Receive answer ──
            meetingSocket.on('answer', async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
                const peerState = peersRef.current.get(from);
                if (peerState) {
                    try {
                        await peerState.pc.setRemoteDescription(new RTCSessionDescription(answer));
                        console.log('Set answer from:', from);
                    } catch (err) {
                        console.error('Error handling answer:', err);
                    }
                }
            });

            // ── ICE candidates ──
            meetingSocket.on('ice-candidate', async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
                const peerState = peersRef.current.get(from);
                if (peerState) {
                    try {
                        await peerState.pc.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (err) {
                        console.warn('ICE candidate error:', err);
                    }
                }
            });

            // ── User disconnected ──
            meetingSocket.on('user-disconnected', ({ socketId }: { socketId: string }) => {
                console.log('User disconnected:', socketId);
                const peerState = peersRef.current.get(socketId);
                if (peerState) {
                    peerState.pc.close();
                    peersRef.current.delete(socketId);
                    syncPeerList();
                }
            });

            // ── Chat messages ──
            meetingSocket.on('chat-message', (msg: { sender: string; text: string; time: string }) => {
                setChatMessages((prev) => [...prev, msg]);
            });
        };

        init();

        return () => {
            mounted = false;
            meetingSocket.off('existing-participants');
            meetingSocket.off('user-connected');
            meetingSocket.off('offer');
            meetingSocket.off('answer');
            meetingSocket.off('ice-candidate');
            meetingSocket.off('user-disconnected');
            meetingSocket.off('chat-message');

            peersRef.current.forEach((p) => p.pc.close());
            peersRef.current.clear();

            localStreamRef.current?.getTracks().forEach((t) => t.stop());
            screenStreamRef.current?.getTracks().forEach((t) => t.stop());
            
            meetingSocket.disconnect();
        };
    }, [roomId, userName, getLocalStream, createPeerConnection, syncPeerList]);

    // ─── Toggle mic ───────────────────────────────────────────────────────────
    const toggleMic = () => {
        const track = localStreamRef.current?.getAudioTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            setMicOn(track.enabled);
            meetingSocket.emit('media-toggle', { type: 'audio', enabled: track.enabled });
        }
    };

    // ─── Toggle camera ────────────────────────────────────────────────────────
    const toggleCam = () => {
        const track = localStreamRef.current?.getVideoTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            setCamOn(track.enabled);
            meetingSocket.emit('media-toggle', { type: 'video', enabled: track.enabled });
        }
    };

    // ─── Screen share ─────────────────────────────────────────────────────────
    const toggleScreenShare = async () => {
        if (sharing) {
            screenStreamRef.current?.getTracks().forEach((t) => t.stop());
            screenStreamRef.current = null;
            setSharing(false);
            const camTrack = localStreamRef.current?.getVideoTracks()[0];
            if (camTrack) {
                peersRef.current.forEach((p) => {
                    const sender = p.pc.getSenders().find((s) => s.track?.kind === 'video');
                    sender?.replaceTrack(camTrack);
                });
            }
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = screenStream;
                setSharing(true);
                const screenTrack = screenStream.getVideoTracks()[0];
                peersRef.current.forEach((p) => {
                    const sender = p.pc.getSenders().find((s) => s.track?.kind === 'video');
                    sender?.replaceTrack(screenTrack);
                });
                screenTrack.onended = () => {
                    setSharing(false);
                    screenStreamRef.current = null;
                    const camTrack = localStreamRef.current?.getVideoTracks()[0];
                    if (camTrack) {
                        peersRef.current.forEach((p) => {
                            const sender = p.pc.getSenders().find((s) => s.track?.kind === 'video');
                            sender?.replaceTrack(camTrack);
                        });
                    }
                };
            } catch { /* cancelled */ }
        }
    };

    // ─── Send chat ────────────────────────────────────────────────────────────
    const sendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const msg = { sender: userName, text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        meetingSocket.emit('send-message', { roomId, ...msg });
        setChatMessages((prev) => [...prev, msg]);
        setChatInput('');
    };

    // ─── Leave ────────────────────────────────────────────────────────────────
    const leaveMeeting = () => {
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        screenStreamRef.current?.getTracks().forEach((t) => t.stop());
        meetingSocket.disconnect();
        navigate('/dashboard');
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const remoteEntries = Array.from(peerList.entries());
    const totalParticipants = 1 + remoteEntries.length;

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#0a0a14', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ height: 52, padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', background: 'rgba(15,15,26,0.95)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? '#10b981' : '#ef4444', animation: connected ? 'pulse-glow 2s infinite' : 'none' }} />
                    <span style={{ fontWeight: 600, color: 'white' }}>Meeting Room</span>
                    <button onClick={copyRoomId} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-muted)', cursor: 'pointer' }}>
                        {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        {roomId?.slice(0, 8)}…
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>{totalParticipants} participant{totalParticipants > 1 ? 's' : ''}</span>
                    <span className="badge badge-success">Live</span>
                </div>
            </div>

            {/* Video Grid Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{
                    flex: 1, display: 'grid',
                    gridTemplateColumns: totalParticipants <= 1 ? '1fr' : totalParticipants <= 4 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '0.75rem', padding: '1rem', alignContent: 'center',
                }}>
                    {/* Local Video */}
                    <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', background: 'var(--color-surface)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(99,102,241,0.3)' }}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: camOn ? 'block' : 'none', transform: 'scaleX(-1)' }}
                        />
                        {!camOn && (
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>
                                {userName.charAt(0)}
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '0.25rem 0.625rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.7)', fontSize: '0.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            {!micOn && <MicOff size={12} color="#ef4444" />}
                            {userName} (You)
                        </div>
                    </div>

                    {/* Remote Peers */}
                    {remoteEntries.map(([socketId, { info, stream }]) => (
                        <div key={socketId} style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', background: 'var(--color-surface)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {stream ? (
                                <RemoteVideo stream={stream} />
                            ) : (
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>
                                    {info.name.charAt(0)}
                                </div>
                            )}
                            <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '0.25rem 0.625rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.7)', fontSize: '0.75rem', color: 'white' }}>
                                {info.name}
                            </div>
                        </div>
                    ))}

                    {/* Waiting message when alone */}
                    {remoteEntries.length === 0 && (
                        <div style={{ aspectRatio: '16/9', borderRadius: '1rem', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', border: '1px dashed var(--color-border)' }}>
                            <Users size={40} color="var(--color-muted)" />
                            <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem' }}>Waiting for others to join...</p>
                            <button onClick={copyRoomId} className="btn btn-secondary" style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                Copy Room ID to Invite
                            </button>
                        </div>
                    )}
                </div>

                {/* Chat Panel */}
                {chatOpen && (
                    <div style={{ width: 320, borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: 600, color: 'white' }}>Chat</div>
                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {chatMessages.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '2rem' }}>
                                    <MessageSquare size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                                    No messages yet
                                </div>
                            ) : (
                                chatMessages.map((msg, i) => (
                                    <div key={i} style={{ fontSize: '0.8125rem' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>{msg.sender}</span>
                                        <span style={{ color: 'var(--color-muted)', marginLeft: '0.5rem', fontSize: '0.75rem' }}>{msg.time}</span>
                                        <p style={{ color: 'var(--color-text)', marginTop: '0.125rem' }}>{msg.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <form onSubmit={sendChat} style={{ padding: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
                            <input className="input" placeholder="Type a message..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} style={{ flex: 1 }} />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 0.75rem' }}>Send</button>
                        </form>
                    </div>
                )}

                {/* Participants Panel */}
                {participantsOpen && (
                    <div style={{ width: 280, borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: 600, color: 'white' }}>Participants ({totalParticipants})</div>
                        <div style={{ flex: 1, padding: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>
                                    {userName.charAt(0)}
                                </div>
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text)', flex: 1 }}>{userName} (You)</span>
                                <span style={{ display: 'flex', gap: '0.25rem' }}>
                                    {micOn ? <Mic size={14} color="#10b981" /> : <MicOff size={14} color="#ef4444" />}
                                    {camOn ? <Camera size={14} color="#10b981" /> : <CameraOff size={14} color="#ef4444" />}
                                </span>
                            </div>
                            {remoteEntries.map(([socketId, { info }]) => (
                                <div key={socketId} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>
                                        {info.name.charAt(0)}
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>{info.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Controls Bar */}
            <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'rgba(15,15,26,0.95)', borderTop: '1px solid var(--color-border)' }}>
                <button onClick={toggleMic} className={`btn btn-icon ${micOn ? 'btn-secondary' : 'btn-danger'}`} title={micOn ? 'Mute' : 'Unmute'} style={{ width: 48, height: 48, borderRadius: '50%' }}>
                    {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                <button onClick={toggleCam} className={`btn btn-icon ${camOn ? 'btn-secondary' : 'btn-danger'}`} title={camOn ? 'Camera off' : 'Camera on'} style={{ width: 48, height: 48, borderRadius: '50%' }}>
                    {camOn ? <Camera size={20} /> : <CameraOff size={20} />}
                </button>
                <button onClick={toggleScreenShare} className={`btn btn-icon ${sharing ? 'btn-primary' : 'btn-secondary'}`} title="Screen share" style={{ width: 48, height: 48, borderRadius: '50%' }}>
                    {sharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
                </button>
                <button onClick={() => setChatOpen(!chatOpen)} className={`btn btn-icon ${chatOpen ? 'btn-primary' : 'btn-secondary'}`} title="Chat" style={{ width: 48, height: 48, borderRadius: '50%' }}>
                    <MessageSquare size={20} />
                </button>
                <button onClick={() => setParticipantsOpen(!participantsOpen)} className={`btn btn-icon ${participantsOpen ? 'btn-primary' : 'btn-secondary'}`} title="Participants" style={{ width: 48, height: 48, borderRadius: '50%' }}>
                    <Users size={20} />
                </button>
                <div style={{ width: 1, height: 32, background: 'var(--color-border)', margin: '0 0.5rem' }} />
                <button onClick={leaveMeeting} className="btn btn-danger" style={{ borderRadius: '9999px', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <PhoneOff size={18} /> Leave
                </button>
            </div>
        </div>
    );
}

// ─── Remote Video Component ───────────────────────────────────────────────────
function RemoteVideo({ stream }: { stream: MediaStream }) {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (ref.current && stream) {
            ref.current.srcObject = stream;
        }
    }, [stream]);
    return (
        <video
            ref={ref}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    );
}
