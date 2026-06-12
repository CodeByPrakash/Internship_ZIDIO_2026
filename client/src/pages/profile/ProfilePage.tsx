import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { User, Camera, Save, Mail, Shield } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.patch('/users/profile', { name, bio });
            setUser(data.user);
            toast.success('Profile updated!');
        } catch { toast.error('Failed to update'); }
        setSaving(false);
    };

    const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?';

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '2rem' }}>Profile Settings</h1>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', position: 'relative' }}>
                        {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '1rem', objectFit: 'cover' }} /> : initials}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: 'white', fontSize: '1.125rem' }}>{user?.name}</div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Mail size={14} /> {user?.email}
                        </div>
                        <div style={{ marginTop: '0.25rem' }}>
                            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Shield size={12} /> {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Display Name</label>
                        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Bio</label>
                        <textarea className="input" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell us about yourself..." style={{ resize: 'vertical' }} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-end' }}>
                        <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
