import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    BarChart3,
    User,
    LogOut,
    Moon,
    Sun,
    Menu,
    X,
    Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const MainLayout = ({ children, isDarkMode, toggleDarkMode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 glass-card border-r transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                            <CheckSquare size={24} />
                        </div>
                        <h1 className="text-xl font-bold gradient-text">TaskFlow</h1>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 mt-auto"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 glass-card border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <button
                        className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="flex-1 lg:hidden"></div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
                            title="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-800 mx-1 hidden sm:block"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <section className="p-4 lg:p-8 animate-fade-in relative z-0 overflow-y-auto max-h-[calc(100vh-4rem)]">
                    {children}
                </section>
            </main>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default MainLayout;
