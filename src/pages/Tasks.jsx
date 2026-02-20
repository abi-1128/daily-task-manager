import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import {
    Plus,
    Search,
    Filter,
    ChevronDown,
    ListFilter,
    ArrowUpDown,
    GripVertical
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from '../components/Tasks/TaskCard';
import TaskForm from '../components/Tasks/TaskForm';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const SortableTaskItem = ({ task, ...props }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-start gap-2">
            <div {...attributes} {...listeners} className="mt-6 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                <GripVertical size={20} />
            </div>
            <div className="flex-1">
                <TaskCard task={task} {...props} />
            </div>
        </div>
    );
};

const Tasks = () => {
    const { tasks, categories, addTask, updateTask, deleteTask, reorderTasks } = useTasks();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setBy] = useState('dueDate'); // dueDate, priority, createdAt

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const filteredTasks = useMemo(() => {
        return tasks
            .filter(t => {
                const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                    t.description?.toLowerCase().includes(search.toLowerCase());
                const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === 'dueDate') return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
                if (sortBy === 'priority') {
                    const p = { High: 0, Medium: 1, Low: 2 };
                    return p[a.priority] - p[b.priority];
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }, [tasks, search, filterStatus, sortBy]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex(t => t.id === active.id);
            const newIndex = tasks.findIndex(t => t.id === over.id);
            reorderTasks(arrayMove(tasks, oldIndex, newIndex));
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Tasks</h1>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="btn-primary flex items-center justify-center gap-2 px-6"
                >
                    <Plus size={20} />
                    <span>Add Task</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="input-field pl-10 h-11"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <div className="relative group">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="input-field pl-10 pr-10 appearance-none h-11 min-w-[140px]"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                        <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>

                    <div className="relative group">
                        <select
                            value={sortBy}
                            onChange={(e) => setBy(e.target.value)}
                            className="input-field pl-10 pr-10 appearance-none h-11 min-w-[140px]"
                        >
                            <option value="dueDate">By Date</option>
                            <option value="priority">By Priority</option>
                            <option value="createdAt">By Newest</option>
                        </select>
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={filteredTasks.map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {filteredTasks.map(task => (
                                    <SortableTaskItem
                                        key={task.id}
                                        task={task}
                                        categories={categories}
                                        onUpdate={updateTask}
                                        onDelete={deleteTask}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="glass-card flex flex-col items-center justify-center py-20 text-center rounded-3xl opacity-60">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Search size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No tasks found</h3>
                        <p className="text-slate-500 max-w-xs mt-2">Adjust your filters or add a new task to get started.</p>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <TaskForm
                    categories={categories}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={addTask}
                />
            )}
        </div>
    );
};

export default Tasks;
