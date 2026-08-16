import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import notificationService from '../../services/notificationService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Home,
    User,
    Hotel,
    Star,
    AlertTriangle,
    FileCheck,
    CalendarCheck,
    Info,
} from 'lucide-react';

export default function NotificationsList() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    const [unreadOnly, setUnreadOnly] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const fetchNotifications = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
            };

            if (unreadOnly) {
                params.unread = true;
            }

            const data =
                await notificationService.getNotifications(params);

            setNotifications(data.notifications ?? []);
            setUnreadCount(data.unread_count ?? 0);
            setMeta(data.meta ?? null);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load notifications.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(page);
    }, [page, unreadOnly]);

    const handleUnreadFilter = (value) => {
        setUnreadOnly(value);
        setPage(1);
    };

    const handleMarkAsRead = async (notification) => {
        if (notification.is_read) {
            return;
        }

        setActionLoading(`read-${notification.id}`);
        setError('');

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
            setError(
                err.response?.data?.message ??
                'Failed to mark notification as read.'
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        setActionLoading('all-read');
        setError('');

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
            setError(
                err.response?.data?.message ??
                'Failed to mark all notifications as read.'
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (notification) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this notification?'
        );

        if (!confirmed) {
            return;
        }

        setActionLoading(`delete-${notification.id}`);
        setError('');

        try {
            await notificationService.deleteNotification(
                notification.id
            );

            setNotifications((prev) =>
                prev.filter(
                    (item) =>
                        item.id !== notification.id
                )
            );

            if (!notification.is_read) {
                setUnreadCount((prev) =>
                    Math.max(prev - 1, 0)
                );
            }
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to delete notification.'
            );
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleString();
    };

    const getNotificationConfig = (notification) => {
        const type = String(
            notification.type ?? ''
        ).toLowerCase();

        if (
            type.includes('accommodation') &&
            type.includes('verified')
        ) {
            return {
                icon: Home,
                iconClass:
                    'bg-emerald-50 text-emerald-600 ring-emerald-200',
                title: 'Accommodation Verified',
            };
        }

        if (
            type.includes('accommodation') &&
            type.includes('rejected')
        ) {
            return {
                icon: Home,
                iconClass:
                    'bg-rose-50 text-rose-600 ring-rose-200',
                title: 'Accommodation Rejected',
            };
        }

        if (
            type.includes('accommodation') &&
            type.includes('booking')
        ) {
            return {
                icon: Hotel,
                iconClass:
                    'bg-indigo-50 text-indigo-600 ring-indigo-200',
                title: 'Accommodation Booking',
            };
        }

        if (
            type.includes('guide') &&
            (
                type.includes('verified') ||
                type.includes('verification')
            )
        ) {
            return {
                icon: FileCheck,
                iconClass:
                    'bg-teal-50 text-teal-600 ring-teal-200',
                title: 'Guide Verification',
            };
        }

        if (
            type.includes('review') ||
            type.includes('rating')
        ) {
            return {
                icon: Star,
                iconClass:
                    'bg-amber-50 text-amber-600 ring-amber-200',
                title: 'New Review',
            };
        }

        if (
            type.includes('report')
        ) {
            return {
                icon: AlertTriangle,
                iconClass:
                    'bg-rose-50 text-rose-600 ring-rose-200',
                title: 'New Report',
            };
        }

        if (
            type.includes('booking')
        ) {
            return {
                icon: CalendarCheck,
                iconClass:
                    'bg-blue-50 text-blue-600 ring-blue-200',
                title: 'New Booking',
            };
        }

        if (
            type.includes('user')
        ) {
            return {
                icon: User,
                iconClass:
                    'bg-violet-50 text-violet-600 ring-violet-200',
                title: 'User Notification',
            };
        }

        return {
            icon: Info,
            iconClass:
                'bg-slate-50 text-slate-600 ring-slate-200',
            title: 'Notification',
        };
    };

    const getMessage = (notification) => {
        return (
            notification.data?.message ??
            notification.data?.title ??
            'You have a new notification.'
        );
    };

    return (
        <div>
            <PageHeader
                title="Notifications"
                subtitle="View and manage your notifications."
            />

            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Bell className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Unread notifications
                            </p>

                            <p className="text-2xl font-semibold text-slate-900">
                                {unreadCount}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant={
                            !unreadOnly
                                ? 'primary'
                                : 'secondary'
                        }
                        onClick={() =>
                            handleUnreadFilter(false)
                        }
                    >
                        All
                    </Button>

                    <Button
                        variant={
                            unreadOnly
                                ? 'primary'
                                : 'secondary'
                        }
                        onClick={() =>
                            handleUnreadFilter(true)
                        }
                    >
                        Unread
                    </Button>

                    <Button
                        variant="secondary"
                        disabled={
                            unreadCount === 0 ||
                            actionLoading === 'all-read'
                        }
                        onClick={handleMarkAllAsRead}
                    >
                        <CheckCheck className="mr-1.5 h-4 w-4" />

                        {actionLoading === 'all-read'
                            ? 'Updating...'
                            : 'Mark all as read'}
                    </Button>
                </div>
            </div>

            <ErrorMessage message={error} />

            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="space-y-3">
                        {notifications.length === 0 ? (
                            <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                                    <Bell className="h-7 w-7" />
                                </div>

                                <h3 className="text-sm font-semibold text-slate-700">
                                    No notifications
                                </h3>

                                <p className="mt-1 text-sm text-slate-400">
                                    There are no notifications to display.
                                </p>
                            </div>
                        ) : (
                            notifications.map(
                                (notification) => {
                                    const config =
                                        getNotificationConfig(
                                            notification
                                        );

                                    const Icon =
                                        config.icon;

                                    return (
                                        <div
                                            key={
                                                notification.id
                                            }
                                            className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                                                notification.is_read
                                                    ? 'border-slate-200/70'
                                                    : 'border-indigo-200 bg-indigo-50/20'
                                            }`}
                                        >
                                            <div className="flex gap-4">
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${config.iconClass}`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="font-semibold text-slate-800">
                                                                    {
                                                                        config.title
                                                                    }
                                                                </h3>

                                                                {!notification.is_read && (
                                                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                                                                        Unread
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                                {getMessage(
                                                                    notification
                                                                )}
                                                            </p>
                                                        </div>

                                                        <span className="shrink-0 text-xs text-slate-400">
                                                            {formatDate(
                                                                notification.created_at
                                                            )}
                                                        </span>
                                                    </div>

                                                    {notification.data && (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {notification.data.accommodation_name && (
                                                                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                                                                    Accommodation:{' '}
                                                                    {
                                                                        notification
                                                                            .data
                                                                            .accommodation_name
                                                                    }
                                                                </span>
                                                            )}

                                                            {notification.data.guide_name && (
                                                                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                                                                    Guide:{' '}
                                                                    {
                                                                        notification
                                                                            .data
                                                                            .guide_name
                                                                    }
                                                                </span>
                                                            )}

                                                            {notification.data.booking_id && (
                                                                <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                                                                    Booking #{notification.data.booking_id}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                                        {!notification.is_read && (
                                                            <Button
                                                                variant="secondary"
                                                                disabled={
                                                                    actionLoading ===
                                                                    `read-${notification.id}`
                                                                }
                                                                onClick={() =>
                                                                    handleMarkAsRead(
                                                                        notification
                                                                    )
                                                                }
                                                            >
                                                                <Check className="mr-1.5 h-4 w-4" />

                                                                {actionLoading ===
                                                                `read-${notification.id}`
                                                                    ? 'Updating...'
                                                                    : 'Mark as read'}
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="secondary"
                                                            disabled={
                                                                actionLoading ===
                                                                `delete-${notification.id}`
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    notification
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-1.5 h-4 w-4 text-rose-600" />

                                                            {actionLoading ===
                                                            `delete-${notification.id}`
                                                                ? 'Deleting...'
                                                                : 'Delete'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}
                    </div>

                    {meta && meta.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Page{' '}
                                <span className="font-medium text-slate-700">
                                    {meta.current_page}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium text-slate-700">
                                    {meta.last_page}
                                </span>{' '}
                                <span className="text-slate-400">
                                    ({meta.total} total)
                                </span>
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    disabled={
                                        meta.current_page <=
                                        1
                                    }
                                    onClick={() =>
                                        setPage(
                                            (prev) =>
                                                prev - 1
                                        )
                                    }
                                >
                                    Previous
                                </Button>

                                <Button
                                    variant="secondary"
                                    disabled={
                                        meta.current_page >=
                                        meta.last_page
                                    }
                                    onClick={() =>
                                        setPage(
                                            (prev) =>
                                                prev + 1
                                        )
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
