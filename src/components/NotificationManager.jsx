import React, { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationManager = () => {
    const { requestPermission } = useNotifications();

    useEffect(() => {
        // Just initialize the hook to start the periodic check
        // Also pro-actively request permission if user is logged in
        if (Notification.permission === 'default') {
            requestPermission();
        }
    }, [requestPermission]);

    return null; // This component doesn't render anything
};

export default NotificationManager;
