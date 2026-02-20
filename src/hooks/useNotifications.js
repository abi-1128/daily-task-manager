import { useEffect, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';

export const useNotifications = () => {
    const { tasks, updateTask } = useTasks();

    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }, []);

    const showNotification = useCallback((title, options) => {
        if (Notification.permission === 'granted') {
            new Notification(title, options);
        }
    }, []);

    useEffect(() => {
        const checkTasks = () => {
            const now = new Date();
            tasks.forEach(task => {
                if (!task.dueDate || task.status === 'Completed') return;

                const dueDate = new Date(task.dueDate);
                const timeDiff = dueDate.getTime() - now.getTime();
                const minutesDiff = Math.floor(timeDiff / (1000 * 60));

                // Before due time (15 mins before)
                if (minutesDiff === 15 && !task.notified15m) {
                    showNotification(`Task Reminder: ${task.title}`, {
                        body: `Due in 15 minutes: ${task.description || ''}`,
                        icon: '/vite.svg'
                    });
                    updateTask(task.id, { notified15m: true });
                }

                // At exact due time
                if (minutesDiff === 0 && !task.notifiedDue) {
                    showNotification(`Task Due Now: ${task.title}`, {
                        body: task.description || '',
                        icon: '/vite.svg'
                    });
                    updateTask(task.id, { notifiedDue: true });
                }

                // Overdue (10 mins after)
                if (minutesDiff === -10 && !task.notifiedOverdue) {
                    showNotification(`Task Overdue: ${task.title}`, {
                        body: `This task was due 10 minutes ago.`,
                        icon: '/vite.svg'
                    });
                    updateTask(task.id, { notifiedOverdue: true, status: 'Overdue' });
                }
            });
        };

        const interval = setInterval(checkTasks, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [tasks, showNotification, updateTask]);

    return { requestPermission, showNotification };
};
