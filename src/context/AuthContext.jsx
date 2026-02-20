import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = localStorage.getItem('task_manager_session');
        if (session) {
            setUser(JSON.parse(session));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('task_manager_users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            const { password, ...userWithoutPassword } = foundUser;
            localStorage.setItem('task_manager_session', JSON.stringify(userWithoutPassword));
            setUser(userWithoutPassword);
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const signup = (userData) => {
        const users = JSON.parse(localStorage.getItem('task_manager_users') || '[]');
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already exists' };
        }

        const newUser = {
            id: crypto.randomUUID(),
            ...userData,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem('task_manager_users', JSON.stringify(users));

        const { password, ...userWithoutPassword } = newUser;
        localStorage.setItem('task_manager_session', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);

        return { success: true };
    };

    const logout = () => {
        localStorage.removeItem('task_manager_session');
        setUser(null);
    };

    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('task_manager_session', JSON.stringify(updatedUser));

        const users = JSON.parse(localStorage.getItem('task_manager_users') || '[]');
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('task_manager_users', JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
