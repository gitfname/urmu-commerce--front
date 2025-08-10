import React, { useState } from 'react';

interface Notification {
    id: string;
    type: 'order' | 'promotion' | 'system' | 'payment';
    title: string;
    message: string;
    date: string;
    time: string;
    isRead: boolean;
    actionUrl?: string;
    icon: React.ReactNode;
}

const Profile__Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'order',
            title: 'سفارش شما ارسال شد',
            message: 'سفارش #1f3G4t با موفقیت ارسال شد و در مسیر رسیدن به شماست',
            date: '1403/04/15',
            time: '14:30',
            isRead: false,
            actionUrl: '/orders/1f3G4t',
            icon: (
                <svg className="w-6 h-6 fill-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <path d="M230.33,141.06a24.43,24.43,0,0,0-21.24-4.23l-41.84,9.62A28,28,0,0,0,140,112H89.94a31.82,31.82,0,0,0-22.63,9.37L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56Z" />
                </svg>
            )
        },
        {
            id: '2',
            type: 'promotion',
            title: 'تخفیف ویژه برای شما!',
            message: '30% تخفیف روی تمام محصولات الکترونیکی تا پایان هفته',
            date: '1403/04/14',
            time: '10:15',
            isRead: false,
            actionUrl: '/products?category=electronics',
            icon: (
                <svg className="w-6 h-6 fill-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <path d="M246,98.73l-56-64A8,8,0,0,0,184,32H72a8,8,0,0,0-6,2.73l-56,64a8,8,0,0,0,.17,10.73l112,120a8,8,0,0,0,11.7,0l112-120A8,8,0,0,0,246,98.73Z" />
                </svg>
            )
        },
        {
            id: '3',
            type: 'payment',
            title: 'پرداخت موفق',
            message: 'پرداخت سفارش #2H5Y5u به مبلغ 730,000 تومان با موفقیت انجام شد',
            date: '1403/04/13',
            time: '16:45',
            isRead: true,
            actionUrl: '/orders/2H5Y5u',
            icon: (
                <svg className="w-6 h-6 fill-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                </svg>
            )
        },
        {
            id: '4',
            type: 'system',
            title: 'به‌روزرسانی سیستم',
            message: 'سیستم فروشگاه به‌روزرسانی شد. امکانات جدیدی اضافه شده است',
            date: '1403/04/12',
            time: '09:00',
            isRead: true,
            icon: (
                <svg className="w-6 h-6 fill-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,0,1-12,12H116a8,8,0,0,1,0-16h12V96a8,8,0,0,1,16,0Z" />
                </svg>
            )
        },
        {
            id: '5',
            type: 'order',
            title: 'سفارش لغو شد',
            message: 'سفارش #R34trU به دلیل عدم پرداخت لغو شد. مبلغ به کیف پول شما بازگردانده شد',
            date: '1403/04/10',
            time: '11:20',
            isRead: true,
            actionUrl: '/wallet',
            icon: (
                <svg className="w-6 h-6 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                </svg>
            )
        },
        {
            id: '6',
            type: 'promotion',
            title: 'محصول جدید اضافه شد',
            message: 'آیفون 15 پرو مکس به فروشگاه اضافه شد. اولین نفر باشید که سفارش می‌دهید!',
            date: '1403/04/08',
            time: '08:30',
            isRead: true,
            actionUrl: '/products/iphone-15-pro-max',
            icon: (
                <svg className="w-6 h-6 fill-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z" />
                </svg>
            )
        }
    ]);

    const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'promotion' | 'system' | 'payment'>('all');

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notif.isRead;
        return notif.type === filter;
    });

    const unreadCount = notifications.filter(notif => !notif.isRead).length;

    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'order': return 'bg-blue-100 text-blue-800';
            case 'promotion': return 'bg-red-100 text-red-800';
            case 'system': return 'bg-gray-100 text-gray-800';
            case 'payment': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeName = (type: Notification['type']) => {
        switch (type) {
            case 'order': return 'سفارش';
            case 'promotion': return 'تبلیغات';
            case 'system': return 'سیستم';
            case 'payment': return 'پرداخت';
            default: return 'عمومی';
        }
    };

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5">
            <div className="my-5 lg:my-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">اعلان‌ها</h1>
                        <p className="text-zinc-600">
                            {unreadCount > 0 ? `${unreadCount} اعلان خوانده نشده دارید` : 'همه اعلان‌ها خوانده شده'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 md:mt-0">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                            >
                                همه را خوانده علامت بزن
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={clearAllNotifications}
                                className="px-4 py-2 border border-red-300 hover:border-red-400 text-red-600 rounded-lg text-sm transition-colors"
                            >
                                پاک کردن همه
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl shadow-box-md p-1 mb-6">
                    <div className="flex flex-wrap gap-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all'
                                    ? 'bg-red-500 text-white'
                                    : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            همه ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'unread'
                                    ? 'bg-red-500 text-white'
                                    : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            خوانده نشده ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilter('order')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'order'
                                    ? 'bg-red-500 text-white'
                                    : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            سفارشات ({notifications.filter(n => n.type === 'order').length})
                        </button>
                        <button
                            onClick={() => setFilter('promotion')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'promotion'
                                    ? 'bg-red-500 text-white'
                                    : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            تبلیغات ({notifications.filter(n => n.type === 'promotion').length})
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-box-md p-12 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 fill-zinc-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06Z" />
                            </svg>
                            <h3 className="text-lg font-medium text-zinc-800 mb-2">اعلانی یافت نشد</h3>
                            <p className="text-zinc-600">در این بخش اعلانی موجود نیست</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-2xl shadow-box-md p-5 transition-all hover:shadow-lg ${!notification.isRead ? 'border-l-4 border-red-500' : ''
                                    }`}
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                                            {notification.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-medium ${!notification.isRead ? 'text-zinc-900' : 'text-zinc-700'}`}>
                                                    {notification.title}
                                                </h3>
                                                <span className={`px-2 py-1 rounded text-xs ${getTypeColor(notification.type)}`}>
                                                    {getTypeName(notification.type)}
                                                </span>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-red-500 hover:text-red-600 text-sm"
                                                        title="علامت خوانده شده"
                                                    >
                                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                                                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="text-zinc-400 hover:text-red-500 text-sm"
                                                    title="حذف اعلان"
                                                >
                                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                                                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-zinc-600 mb-3 text-sm leading-relaxed">
                                            {notification.message}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                                <span>{notification.date}</span>
                                                <span>{notification.time}</span>
                                            </div>

                                            {notification.actionUrl && (
                                                <button className="text-red-500 hover:text-red-600 text-sm font-medium">
                                                    مشاهده جزئیات
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default Profile__Notifications;