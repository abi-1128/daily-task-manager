import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (user) {
            const storedTasks = localStorage.getItem(`tasks_${user.id}`);
            const storedCategories = localStorage.getItem(`categories_${user.id}`);

            setTasks(storedTasks ? JSON.parse(storedTasks) : []);
            setCategories(storedCategories ? JSON.parse(storedCategories) : [
                { id: '1', name: 'Work', color: '#3b82f6' },
                { id: '2', name: 'Personal', color: '#10b981' },
                { id: '3', name: 'Health', color: '#ef4444' },
            ]);
        } else {
            setTasks([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
        }
    }, [tasks, user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`categories_${user.id}`, JSON.stringify(categories));
        }
    }, [categories, user]);

    const addTask = (task) => {
        const newTask = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: 'Pending',
            ...task,
        };
        setTasks(prev => [newTask, ...prev]);
        return newTask;
    };

    const updateTask = (id, updates) => {
        setTasks(prev => {
            const taskToUpdate = prev.find(t => t.id === id);
            if (!taskToUpdate) return prev;

            const updatedTasks = prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t);

            // Recurring task logic
            if (updates.status === 'Completed' && taskToUpdate.recurring && taskToUpdate.recurring !== 'None') {
                const nextDueDate = new Date(taskToUpdate.dueDate || new Date());
                if (taskToUpdate.recurring === 'Daily') nextDueDate.setDate(nextDueDate.getDate() + 1);
                else if (taskToUpdate.recurring === 'Weekly') nextDueDate.setDate(nextDueDate.getDate() + 7);
                else if (taskToUpdate.recurring === 'Monthly') nextDueDate.setMonth(nextDueDate.getMonth() + 1);

                const nextTask = {
                    ...taskToUpdate,
                    id: crypto.randomUUID(),
                    status: 'Pending',
                    dueDate: nextDueDate.toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    notified15m: false,
                    notifiedDue: false,
                    notifiedOverdue: false
                };
                return [nextTask, ...updatedTasks];
            }

            return updatedTasks;
        });
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const addCategory = (category) => {
        const newCat = { id: crypto.randomUUID(), ...category };
        setCategories(prev => [...prev, newCat]);
    };

    const deleteCategory = (id) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    const reorderTasks = (newOrder) => {
        setTasks(newOrder);
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            categories,
            addTask,
            updateTask,
            deleteTask,
            addCategory,
            deleteCategory,
            reorderTasks
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);
