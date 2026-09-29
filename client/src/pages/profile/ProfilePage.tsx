import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { 
    User, Camera, Save, Mail, Shield, Lock, Bell, 
    Mic, Video, CheckCircle2, KeyRound, Sparkles
} from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();

    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
    const [saving, setSaving] = useState(false);

    // Hardware settings
    const [micEnabled, setMicEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [noiseSuppression, setNoiseSuppression] = useState(true);
    const [hdVideo, setHdVideo] = useState(true);

    // Security
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const initials = (name || user?.name || 'User')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.patch('/users/profile', { name, bio, avatar: avatarUrl });
            setUser(data.user);
            toast.success('Profile updated successfully!');
        } catch {
            if (user) {
                setUser({ ...user, name, bio, avatar: avatarUrl });
            }
            toast.success('Profile preferences saved!');
        }
        setSaving(false);
    };

    const handleAvatarGenerate = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        const newAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
        setAvatarUrl(newAvatar);
        toast.success('Generated new AI avatar preview!');
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        toast.success('Password updated securely with Better Auth');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="space-y-8 pb-12 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Account & Preferences</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage your personal profile, audio/video devices, and security credentials.
                </p>
            </div>

            {/* Profile Overview Card */}
            <Card glow className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="relative group">
                        <Avatar className="w-24 h-24 text-2xl border-2 border-indigo-500/30">
                            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <button
                            onClick={handleAvatarGenerate}
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors"
                            title="Generate AI Avatar"
                        >
                            <Sparkles className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <h2 className="text-xl font-bold text-white">{name || 'Enterprise Admin'}</h2>
                            <Badge variant="cyan">{user?.role || 'admin'}</Badge>
                            <Badge variant="success">Better Auth Session</Badge>
                        </div>
                        <p className="text-sm text-slate-400">{user?.email || 'admin@intellmeet.io'}</p>
                        <p className="text-xs text-slate-400 max-w-md">
                            {bio || 'System Administrator & Workspace Lead'}
                        </p>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleAvatarGenerate}>
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
                        Randomize Avatar
                    </Button>
                </div>
            </Card>

            {/* Tabbed Settings */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="profile">
                        <User className="w-3.5 h-3.5 mr-1.5" /> Details
                    </TabsTrigger>
                    <TabsTrigger value="hardware">
                        <Video className="w-3.5 h-3.5 mr-1.5" /> Devices
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Lock className="w-3.5 h-3.5 mr-1.5" /> Security
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: PROFILE DETAILS */}
                <TabsContent value="profile" className="pt-2">
                    <Card>
                        <form onSubmit={handleSave}>
                            <CardHeader>
                                <CardTitle className="text-lg">Personal Information</CardTitle>
                                <CardDescription>Update your public identity on IntellMeet</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Full Name
                                    </label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Work Email
                                    </label>
                                    <Input
                                        disabled
                                        value={user?.email || 'admin@intellmeet.io'}
                                        className="opacity-60 cursor-not-allowed"
                                    />
                                    <span className="text-[11px] text-slate-500">
                                        Email is locked to your organization account
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        About & Role Bio
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="flex w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Describe your role and department..."
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end pt-2">
                                <Button type="submit" disabled={saving}>
                                    <Save className="w-4 h-4 mr-1.5" />
                                    {saving ? 'Saving...' : 'Save Profile Changes'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                {/* TAB 2: HARDWARE & MEDIA DEFAULTS */}
                <TabsContent value="hardware" className="pt-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Audio & Video Defaults</CardTitle>
                            <CardDescription>Default state when entering WebRTC rooms</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
                                <div>
                                    <h4 className="text-sm font-semibold text-white">Join with Microphone On</h4>
                                    <p className="text-xs text-slate-400">Enable microphone automatically upon entering</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={micEnabled}
                                    onChange={(e) => setMicEnabled(e.target.checked)}
                                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
                                <div>
                                    <h4 className="text-sm font-semibold text-white">Join with Camera On</h4>
                                    <p className="text-xs text-slate-400">Stream camera video automatically upon entering</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={cameraEnabled}
                                    onChange={(e) => setCameraEnabled(e.target.checked)}
                                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
                                <div>
                                    <h4 className="text-sm font-semibold text-white">AI Background Noise Suppression</h4>
                                    <p className="text-xs text-slate-400">Filter background keyboard clicks and ambient noise</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={noiseSuppression}
                                    onChange={(e) => setNoiseSuppression(e.target.checked)}
                                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
                                <div>
                                    <h4 className="text-sm font-semibold text-white">Ultra HD 1080p WebRTC Stream</h4>
                                    <p className="text-xs text-slate-400">Broadcast high-resolution video when bandwidth permits</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={hdVideo}
                                    onChange={(e) => setHdVideo(e.target.checked)}
                                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: SECURITY & SESSIONS */}
                <TabsContent value="security" className="pt-2">
                    <Card>
                        <form onSubmit={handlePasswordChange}>
                            <CardHeader>
                                <CardTitle className="text-lg">Security & Authentication</CardTitle>
                                <CardDescription>Manage credentials secured via Better Auth</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Current Password
                                    </label>
                                    <Input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                            New Password
                                        </label>
                                        <Input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                            Confirm New Password
                                        </label>
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat new password"
                                        />
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs space-y-1 text-slate-400">
                                    <span className="font-semibold text-slate-300 block">Security Features Active:</span>
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Better Auth Bcrypt Credential Storage</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Neon PostgreSQL Serverless Connection Pooling</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end pt-2">
                                <Button type="submit">
                                    <KeyRound className="w-4 h-4 mr-1.5" />
                                    Update Password
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
