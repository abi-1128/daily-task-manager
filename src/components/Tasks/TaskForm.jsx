import React, { useState } from 'react';
import {
    X,
    Calendar,
    Tag as TagIcon,
    Flag,
    RefreshCw,
    Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const TaskForm = ({ onClose, onSubmit, categories }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        categoryId: categories[0]?.id || '',
        recurring: 'None'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title) return;
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div
                className="glass-card w-full max-w-xl rounded-3xl overflow-hidden animate-pop"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Task</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <input
                            autoFocus
                            type="text"
                            placeholder="What needs to be done?"
                            className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-slate-400 dark:text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Add description..."
                            className="w-full bg-transparent border-none outline-none resize-none min-h-[100px] text-slate-600 dark:text-slate-400"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <Calendar size={14} /> Due Date
                            </label>
                            <input
                                type="datetime-local"
                                className="input-field"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <Flag size={14} /> Priority
                            </label>
                            <select
                                className="input-field"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <TagIcon size={14} /> Category
                            </label>
                            <select
                                className="input-field"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <RefreshCw size={14} /> Recurring
                            </label>
                            <select
                                className="input-field"
                                value={formData.recurring}
                                onChange={(e) => setFormData({ ...formData, recurring: e.target.value })}
                            >
                                <option value="None">None</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <Plus size={18} /> Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
