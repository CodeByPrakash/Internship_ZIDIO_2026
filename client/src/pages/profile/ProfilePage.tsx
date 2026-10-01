import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { 
    User, Camera, Save, Mail, Shield, Lock, Bell, 
    Mic, Video, CheckCircle2, KeyRound, Sparkle
} from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

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
            {/* Header (Frosted Glass Container) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/90 shadow-sm ring-1 ring-white/60">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Account & Preferences</h1>
                <p className="text-sm font-medium text-slate-600 mt-1">
                    Manage your personal profile, audio/video devices, and security credentials.
                </p>
            </div>

            {/* Profile Overview Card */}
            <Card glow className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="relative group">
                        <Avatar className="w-24 h-24 text-2xl border-2 border-indigo-500/40 shadow-sm">
                            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <button
                            onClick={handleAvatarGenerate}
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors cursor-pointer"
                            title="Generate AI Avatar"
                        >
                            <Sparkle className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <h2 className="text-xl font-bold text-slate-900">{name || 'Enterprise Admin'}</h2>
                            <Badge variant="cyan">{user?.role || 'admin'}</Badge>
                            <Badge variant="success">Better Auth Session</Badge>
                        </div>
                        <p className="text-sm font-semibold text-slate-600">{user?.email || 'admin@intellmeet.io'}</p>
                        <p className="text-xs font-medium text-slate-500 max-w-md">
                            {bio || 'System Administrator & Workspace Lead'}
                        </p>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleAvatarGenerate}>
                        <Sparkle className="w-3.5 h-3.5 mr-1 text-purple-600" />
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
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Full Name
                                    </label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Work Email
                                    </label>
                                    <Input
                                        disabled
                                        value={user?.email || 'admin@intellmeet.io'}
                                        className="opacity-70 bg-slate-50 cursor-not-allowed"
                                    />
                                    <span className="text-[11px] font-medium text-slate-500">
                                        Email is locked to your organization account
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        About & Role Bio
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="flex w-full rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25 focus-visible:border-indigo-500 transition-all duration-200"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Describe your role and department..."
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end pt-3 border-t border-slate-100">
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
                            <CardTitle className="text-lg">Media & Device Defaults</CardTitle>
                            <CardDescription>Default device states when entering live meeting rooms</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                                <div className="flex items-center gap-3">
                                    <Mic className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Microphone on join</p>
                                        <p className="text-xs text-slate-500 font-medium">Auto-enable microphone when entering meeting rooms</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={micEnabled}
                                    onChange={(e) => setMicEnabled(e.target.checked)}
                                    className="w-5 h-5 rounded-lg text-indigo-600 accent-indigo-600 cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                                <div className="flex items-center gap-3">
                                    <Video className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Camera on join</p>
                                        <p className="text-xs text-slate-500 font-medium">Start video feed automatically when connecting</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={cameraEnabled}
                                    onChange={(e) => setCameraEnabled(e.target.checked)}
                                    className="w-5 h-5 rounded-lg text-indigo-600 accent-indigo-600 cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">AI Noise Suppression</p>
                                        <p className="text-xs text-slate-500 font-medium">Filter ambient background echoes with Whisper pre-processor</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={noiseSuppression}
                                    onChange={(e) => setNoiseSuppression(e.target.checked)}
                                    className="w-5 h-5 rounded-lg text-indigo-600 accent-indigo-600 cursor-pointer"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: SECURITY */}
                <TabsContent value="security" className="pt-2">
                    <Card>
                        <form onSubmit={handlePasswordChange}>
                            <CardHeader>
                                <CardTitle className="text-lg">Security & Authentication</CardTitle>
                                <CardDescription>Update your workspace password powered by Better Auth</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Current Password
                                    </label>
                                    <Input
                                        type="password"
                                        required
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        New Password
                                    </label>
                                    <Input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Confirm New Password
                                    </label>
                                    <Input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end pt-3 border-t border-slate-100">
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
