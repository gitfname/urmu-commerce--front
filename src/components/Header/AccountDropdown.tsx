import { useState, useRef, useEffect } from 'react';
import { EnvalopeIcon, HeartIcon, PersonIcon, ShoppingBagIcon, SignOutIcon, UserIcon } from './icons/Icon';
import type { AccountMenuItem } from './types';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import myProfileStore from '../../stores/MyProfileStore';

const AccountDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [accountMMenuItems, setAccountMMenuItems] = useState<AccountMenuItem[]>([])

    const isLoggedIn = myProfileStore.isLoggedIn
    const isFetching = myProfileStore.isFetching
    const role = myProfileStore.profile?.role

    useEffect(
        () => {
            if ((!isLoggedIn && isFetching) || !isLoggedIn) {
                setAccountMMenuItems([
                    { id: 1, label: "ورود / ثبت نام", href: "/login-register", icon: <UserIcon name='' /> }
                ])
                return
            }

            if (isLoggedIn) {
                setAccountMMenuItems([
                    { id: 1, label: myProfileStore.profile.firstName + " " + myProfileStore.profile.lastName, href: '/profile', icon: <UserIcon name="user" /> },
                    { id: 2, label: 'سفارش ها', href: '/profile/my-orders', icon: <ShoppingBagIcon name="package" /> },
                    { id: 3, label: 'علاقه مندی ها', href: '/profile/my-favorites', icon: <HeartIcon name="heart" /> },
                    // { id: 4, label: 'پیغام ها', href: '/profile/notifications', icon: <EnvalopeIcon name="envalop" />, notificationCount: 4 },
                    { id: 5, label: 'خروج از حساب کاربری', href: '/logout', icon: <SignOutIcon name="sign-out" />, isDanger: true },
                ])
                return
            }
        }, [isFetching, isLoggedIn]
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center py-2 px-2 rounded-xl bg-red-500 hover:bg-red-400 transition shadow-lg shadow-red-500/50">
                <button
                    className="text-gray-100 flex gap-x-1"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <PersonIcon name="UserIcon" />
                    <span className="hidden md:block text-sm">حساب کاربری</span>
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-50 !-ml-5 mt-2 hidden md:block w-full min-w-60 rounded-lg bg-white shadow-lg left-10">
                    <ul className="space-y-2 p-2">
                        {accountMMenuItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.href}
                                    className={`flex items-center justify-between gap-x-2 rounded-lg p-2 transition hover:bg-gray-100 ${item.isDanger
                                        ? 'text-red-500 hover:text-red-600 hover:bg-red-100'
                                        : 'text-zinc-700 hover:text-zinc-800'
                                        }`}
                                >
                                    <span className="flex items-center gap-x-2">
                                        <span>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm">{item.label}</span>
                                    </span>
                                    {item.notificationCount && item.notificationCount > 0 && (
                                        <span className="relative flex h-5 w-5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75"></span>
                                            <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-sm text-white">
                                                {item.notificationCount}
                                            </span>
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}

                        {
                            role === "admin" || role === "super-admin"
                                ?
                                <>
                                    <hr className='w-full border-t border-t-black/10' />

                                    <li>
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center justify-between gap-x-2 rounded-lg p-2 transition
                                hover:bg-gray-100 text-zinc-700 hover:text-zinc-800"
                                        >
                                            <span className="flex items-center gap-x-2">
                                                <span className="text-sm">داشبورد</span>
                                            </span>
                                        </Link>
                                    </li>
                                </>
                                :
                                null
                        }
                    </ul>
                </div>
            )}
        </div>
    );
};

export default observer(AccountDropdown);