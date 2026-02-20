import React from 'react';
import { useTasks } from '../context/TaskContext';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip as ChartTooltip,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import {
    BarChart3,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar
} from 'lucide-react';

const Analytics = () => {
    const { tasks, categories } = useTasks();

    // Status Distribution
    const statusData = [
        { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: '#10b981' },
        { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length, color: '#3b82f6' },
        { name: 'Overdue', value: tasks.filter(t => t.status === 'Overdue').length, color: '#ef4444' },
    ].filter(d => d.value > 0);

    // Priority Distribution
    const priorityData = [
        { name: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#ef4444' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#f59e0b' },
        { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#10b981' },
    ].filter(d => d.value > 0);

    // Productivity Trend (Last 30 days)
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const days = eachDayOfInterval({ start, end });

    const trendData = days.map(day => ({
        date: format(day, 'MMM d'),
        completed: tasks.filter(t => t.status === 'Completed' && isSameDay(new Date(t.updatedAt || t.createdAt), day)).length,
        added: tasks.filter(t => isSameDay(new Date(t.createdAt), day)).length,
    }));

    const totalCompleted = tasks.filter(t => t.status === 'Completed').length;
    const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <BarChart3 size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Productivity Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400">Insights into your performance.</p>
                </div>
            </div>

            {/* Completion Score */}
            <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500"></div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Total Completion Rate</p>
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            className="text-slate-100 dark:text-slate-800"
                            strokeWidth="12"
                            stroke="currentColor"
                            fill="transparent"
                            r="70"
                            cx="96"
                            cy="96"
                        />
                        <circle
                            className="text-primary-600 transition-all duration-1000 ease-out"
                            strokeWidth="12"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * completionRate) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="70"
                            cx="96"
                            cy="96"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-slate-900 dark:text-white">{completionRate}%</span>
                        <span className="text-xs font-medium text-slate-500">of all tasks</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-md">
                    <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
                        <p className="text-xs text-slate-500">Total Tasks</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-emerald-600">{totalCompleted}</p>
                        <p className="text-xs text-slate-500">Completed</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-500">{tasks.filter(t => t.status === 'Overdue').length}</p>
                        <p className="text-xs text-slate-500">Overdue</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status Chart */}
                <div className="glass-card p-6 rounded-3xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Status Breakdown</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority Chart */}
                <div className="glass-card p-6 rounded-3xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Priority Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <ChartTooltip />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="glass-card p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Monthly Trend</h3>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary-500 rounded-full"></div><span>Added</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span>Completed</span></div>
                    </div>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <YAxis hide />
                            <ChartTooltip />
                            <Area type="monotone" dataKey="added" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAdded)" strokeWidth={3} />
                            <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
