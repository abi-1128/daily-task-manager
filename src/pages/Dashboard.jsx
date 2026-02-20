import React, { useState } from 'react';
import { useTasks as useTaskContext } from '../context/TaskContext';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    Plus,
    Calendar as CalendarIcon
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import TaskCard from '../components/Tasks/TaskCard';
import TaskForm from '../components/Tasks/TaskForm';
import { useNotifications } from '../hooks/useNotifications';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));


const Dashboard = () => {
    const { tasks, categories, addTask, updateTask, deleteTask } = useTaskContext();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { requestPermission } = useNotifications();

    // Stats
    const completedToday = tasks.filter(t => t.status === 'Completed' && isSameDay(new Date(t.createdAt), new Date())).length;
    const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
    const overdueTasks = tasks.filter(t => t.status === 'Overdue' || (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed')).length;

    // Weekly Data for Chart
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const day = addDays(weekStart, i);
        const completedOnDay = tasks.filter(t =>
            t.status === 'Completed' && isSameDay(new Date(t.updatedAt || t.createdAt), day)
        ).length;
        return {
            day: format(day, 'EEE'),
            count: completedOnDay,
            fullDate: format(day, 'MMM d')
        };
    });

    const handleAddTask = (taskData) => {
        addTask(taskData);
        requestPermission(); // Proactively ask for notification permission when a task is added
    };

    const upcomingTasks = tasks
        .filter(t => t.status !== 'Completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Here's what's happening today.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="btn-primary flex items-center justify-center gap-2 px-6"
                >
                    <Plus size={20} />
                    <span>New Task</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Completed Today"
                    value={completedToday}
                    icon={CheckCircle2}
                    color="text-emerald-600"
                    bg="bg-emerald-50 dark:bg-emerald-900/20"
                />
                <StatCard
                    label="Pending Tasks"
                    value={pendingTasks}
                    icon={Clock}
                    color="text-primary-600"
                    bg="bg-primary-50 dark:bg-primary-900/20"
                />
                <StatCard
                    label="Overdue"
                    value={overdueTasks}
                    icon={AlertCircle}
                    color="text-red-600"
                    bg="bg-red-50 dark:bg-red-900/20"
                />
                <StatCard
                    label="Productivity"
                    value={`${completedToday > 0 ? 'Up' : '--'}`}
                    icon={TrendingUp}
                    color="text-indigo-600"
                    bg="bg-indigo-50 dark:bg-indigo-900/20"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Productivity Chart */}
                <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 italic">Weekly Productivity</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarIcon size={16} />
                            <span>This Week</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-xl border border-slate-800">
                                                    <p className="font-bold">{payload[0].payload.fullDate}</p>
                                                    <p>{payload[0].value} tasks completed</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.count > 0 ? '#3b82f6' : '#E2E8F0'}
                                            className="transition-all duration-300"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Upcoming Tasks */}
                <div className="glass-card p-6 rounded-3xl flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Upcoming</h3>
                    <div className="space-y-4 flex-1">
                        {upcomingTasks.length > 0 ? (
                            upcomingTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    categories={categories}
                                    onUpdate={updateTask}
                                    onDelete={deleteTask}
                                />
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-12">
                                <CheckCircle2 size={48} className="mb-4 text-slate-300" />
                                <p className="text-slate-500">All caught up!</p>
                            </div>
                        )}
                    </div>
                    <button className="text-primary-600 dark:text-primary-400 text-sm font-semibold mt-6 hover:underline">
                        View all tasks
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <TaskForm
                    categories={categories}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleAddTask}
                />
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className="glass-card p-5 rounded-3xl flex items-center gap-4 group hover:scale-[1.02] transition-transform">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", bg, color)}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export default Dashboard;
