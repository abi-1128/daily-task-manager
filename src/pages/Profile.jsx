import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import {
    User,
    Mail,
    Shield,
    Camera,
    CheckCircle2,
    Clock,
    Calendar,
    Save,
    Bell
} from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const { tasks } = useTasks();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || 'Productivity enthusiast.'
    });
    const [isSaving, setIsSaving] = useState(false);

    // Stats
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    const pendingCount = tasks.filter(t => t.status !== 'Completed').length;

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            updateProfile(formData);
            setIsSaving(false);
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative h-48 rounded-t-[3rem] bg-gradient-to-r from-primary-600 to-indigo-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
            </div>

            <div className="px-8 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-900 p-2 shadow-2xl">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-4xl font-black text-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-primary-600 transition-transform hover:scale-110">
                            <Camera size={20} />
                        </button>
                    </div>
                    <div className="flex-1 pb-4">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{user?.name}</h1>
                        <p className="text-slate-500 font-medium">Member since {format(new Date(user?.createdAt || Date.now()), 'MMMM yyyy')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Display Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                className="input-field pl-10"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
                                        <div className="relative opacity-60">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input className="input-field pl-10" value={formData.email} disabled />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">Bio</label>
                                    <textarea
                                        className="input-field min-h-[100px] resize-none"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="btn-primary flex items-center gap-2" disabled={isSaving}>
                                        {isSaving ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="glass-card p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Push Notifications</p>
                                            <p className="text-xs text-slate-500">Get notified about upcoming tasks</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-3xl text-center">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Activity Snapshot</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="text-emerald-600" size={20} />
                                        <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100 text-opacity-80">Completed</span>
                                    </div>
                                    <span className="text-xl font-black text-emerald-600">{completedCount}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-primary-600" size={20} />
                                        <span className="text-sm font-bold text-primary-900 dark:text-primary-100 text-opacity-80">Pending</span>
                                    </div>
                                    <span className="text-xl font-black text-primary-600">{pendingCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-3xl bg-slate-900 text-white border-none shadow-2xl">
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <Shield className="text-primary-400" size={16} /> Data & Privacy
                            </h3>
                            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                                Your data is stored locally in your browser. Clearing your cookies or site data will remove your tasks.
                            </p>
                            <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-colors">
                                Download My Data (JSON)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
