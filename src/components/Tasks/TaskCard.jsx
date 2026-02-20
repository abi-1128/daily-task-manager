import React from 'react';
import {
    Calendar,
    Clock,
    MoreVertical,
    CheckCircle2,
    Circle,
    AlertCircle,
    Tag
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const TaskCard = ({ task, onUpdate, onDelete, categories }) => {
    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Completed';
    const category = categories.find(c => c.id === task.categoryId);

    const priorityColors = {
        High: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
        Medium: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
        Low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    };

    return (
        <div className="glass-card p-4 rounded-2xl hover:shadow-2xl hover:border-primary-200 dark:hover:border-primary-800 transition-all group animate-fade-in">
            <div className="flex items-start gap-3">
                <button
                    onClick={() => onUpdate(task.id, { status: task.status === 'Completed' ? 'Pending' : 'Completed' })}
                    className={cn(
                        "mt-1 transition-transform active:scale-90",
                        task.status === 'Completed' ? "text-primary-600" : "text-slate-300 hover:text-primary-400"
                    )}
                >
                    {task.status === 'Completed' ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className={cn(
                            "font-semibold text-slate-800 dark:text-slate-100 truncate transition-all",
                            task.status === 'Completed' && "line-through opacity-50"
                        )}>
                            {task.title}
                        </h3>
                        <span className={cn(
                            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
                            priorityColors[task.priority]
                        )}>
                            {task.priority}
                        </span>
                    </div>

                    {task.description && (
                        <p className={cn(
                            "text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2",
                            task.status === 'Completed' && "opacity-50"
                        )}>
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        {task.dueDate && (
                            <div className={cn(
                                "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg",
                                isOverdue
                                    ? "text-red-600 bg-red-50 dark:bg-red-900/20"
                                    : isToday(new Date(task.dueDate))
                                        ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                                        : "text-slate-500 bg-slate-100 dark:bg-slate-800"
                            )}>
                                <Calendar size={14} />
                                <span>{format(new Date(task.dueDate), 'MMM d, h:mm a')}</span>
                                {isOverdue && <AlertCircle size={12} className="ml-0.5" />}
                            </div>
                        )}

                        {category && (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                                <span>{category.name}</span>
                            </div>
                        )}

                        {task.recurring && (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                                <Clock size={14} />
                                <span>{task.recurring}</span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
