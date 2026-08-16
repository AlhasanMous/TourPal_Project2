import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Bell,
    Check,
    CheckCheck,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import notificationService from '../../services/notificationService';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const notificationRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'A';

    // =========================
    // Load latest notifications
    // =========================

    const loadNotifications = async () => {
        try {
            setLoadingNotifications(true);

            const data =
                await notificationService.getNotifications();

            setNotifications(
                (data.notifications ?? []).slice(0, 5)
            );

            setUnreadCount(data.unread_count ?? 0);
        } catch (err) {
            console.error(
                'Failed to load notifications:',
                err
            );
        } finally {
            setLoadingNotifications(false);
        }
    };

    useEffect(() => {
        loadNotifications();

        // Refresh unread count periodically
        const interval = setInterval(() => {
            loadNotifications();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // =========================
    // Close dropdown when clicking outside
    // =========================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    // =========================
    // Mark notification as read
    // =========================

    const handleMarkAsRead = async (notification) => {
        if (notification.is_read) {
            return;
        }

        try {
            await notificationService.markAsRead(
                notification.id
            );

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === notification.id
                        ? {
                              ...item,
                              is_read: true,
                              read_at: new Date().toISOString(),
                          }
                        : item
                )
            );

            setUnreadCount((prev) =>
                Math.max(prev - 1, 0)
            );
        } catch (err) {
            console.error(
                'Failed to mark notification as read:',
                err
            );
        }
    };

    // =========================
    // Mark all as read
    // =========================

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        try {
            await notificationService.markAllAsRead();

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    is_read: true,
                    read_at:
                        notification.read_at ??
                        new Date().toISOString(),
                }))
            );

            setUnreadCount(0);
        } catch (err) {
            console.error(
                'Failed to mark all notifications as read:',
                err
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return '';
        }

        return new Date(date).toLocaleString();
    };

    const getNotificationMessage = (notification) => {
        const data = notification.data;

        if (!data) {
            return notification.type ?? 'New notification';
        }

        return (
            data.message ??
            data.title ??
            notification.type ??
            'New notification'
        );
    };

    return (
        <header className="fixed left-64 right-0 top-0 z-10 h-16 border-b bg-white">
            <div className="flex h-full items-center justify-between px-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Dashboard
                </h2>

                <div className="flex items-center gap-4">

                    {/* =========================
                        Notifications
                    ========================== */}

                    <div
                        ref={notificationRef}
                        className="relative"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setShowNotifications(
                                    (prev) => !prev
                                )
                            }
                            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-800"
                        >
                            <Bell className="h-5 w-5" />

                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                    {unreadCount > 99
                                        ? '99+'
                                        : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                                {/* Header */}

                                <div className="flex items-center justify-between border-b px-4 py-3">
                                    <div>
                                        <h3 className="font-semibold text-slate-800">
                                            Notifications
                                        </h3>

                                        {unreadCount > 0 && (
                                            <p className="text-xs text-slate-400">
                                                {unreadCount}{' '}
                                                unread
                                            </p>
                                        )}
                                    </div>

                                    {unreadCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleMarkAllAsRead
                                            }
                                            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            <CheckCheck className="h-4 w-4" />
                                            Mark all as read
                                        </button>
                                    )}
                                </div>

                                {/* Notifications */}

                                <div className="max-h-96 overflow-y-auto">
                                    {loadingNotifications ? (
                                        <div className="px-4 py-8 text-center text-sm text-slate-400">
                                            Loading notifications...
                                        </div>
                                    ) : notifications.length ===
                                      0 ? (
                                        <div className="px-4 py-8 text-center">
                                            <Bell className="mx-auto mb-2 h-8 w-8 text-slate-300" />

                                            <p className="text-sm text-slate-400">
                                                No notifications
                                            </p>
                                        </div>
                                    ) : (
                                        notifications.map(
                                            (notification) => (
                                                <button
                                                    key={
                                                        notification.id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleMarkAsRead(
                                                            notification
                                                        )
                                                    }
                                                    className={`flex w-full gap-3 border-b px-4 py-3 text-left transition hover:bg-slate-50 ${
                                                        notification.is_read
                                                            ? 'bg-white'
                                                            : 'bg-indigo-50/50'
                                                    }`}
                                                >
                                                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                        <Bell className="h-4 w-4" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-sm font-medium text-slate-700">
                                                                {getNotificationMessage(
                                                                    notification
                                                                )}
                                                            </p>

                                                            {!notification.is_read && (
                                                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                                                            )}
                                                        </div>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {formatDate(
                                                                notification.created_at
                                                            )}
                                                        </p>
                                                    </div>

                                                    {notification.is_read && (
                                                        <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                                                    )}
                                                </button>
                                            )
                                        )
                                    )}
                                </div>

                                {/* Footer */}

                                <div className="border-t bg-slate-50 px-4 py-3">
                                    <Link
                                        to="/notifications"
                                        onClick={() =>
                                            setShowNotifications(
                                                false
                                            )
                                        }
                                        className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        View All Notifications
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logout */}

                    <Button
                        variant="secondary"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>

                    {/* Profile */}

                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                            {initials}
                        </div>

                        <span className="font-medium text-gray-700">
                            {user?.name ?? 'Admin'}
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
