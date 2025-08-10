import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BottomNavItem {
    id: string;
    title: string;
    href: string;
    icon: React.ReactNode;
    isActive?: boolean;
    badge?: number | string | null;
}

interface BottomNavigationProps {
    items?: BottomNavItem[];
    activeItemId?: string;
    onItemClick?: (itemId: string, href: string) => void;
    className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
    items = [
        {
            id: "profile",
            title: "پروفایل",
            href: "/profile",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                </svg>
            ),
            badge: null
        },
        {
            id: "wishlist",
            title: "علاقه مندی ها",
            href: "/profile/my-favorites",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256">
                    <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                </svg>
            ),
            badge: null
        },
        {
            id: "home",
            title: "خانه",
            href: "/",
            isActive: true,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256">
                    <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.10Z"></path>
                </svg>
            ),
            badge: null
        },
        {
            id: "search",
            title: "جستجو",
            href: "/search",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
            ),
            badge: null
        },
        {
            id: "cart",
            title: "سبد خرید",
            href: "/cart",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256">
                    <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z"></path>
                </svg>
            ),
            badge: null
        }
    ],
    activeItemId,
    onItemClick,
    className = ""
}) => {
    const handleItemClick = (item: BottomNavItem, event: React.MouseEvent) => {
        if (onItemClick) {
            event.preventDefault();
            onItemClick(item.id, item.href);
        }
    };

    const { pathname } = useLocation()

    const isItemActive = (item: BottomNavItem) => {
        // return item.isActive || (activeItemId && activeItemId === item.id);
        return item.href === pathname;
    };

    return (
        <div className={`px-1 bg-white shadow-2xl w-full border fixed bottom-0 left-1/2 -translate-x-1/2 md:hidden z-[40] ${className}`}>
            <div className="grid grid-cols-5">
                {items.map((item) => {
                    const isActive = isItemActive(item);

                    return (
                        <div key={item.id} className="flex-1 group">
                            <Link
                                to={item.href}
                                onClick={(e) => handleItemClick(item, e)}
                                className={`flex items-center justify-center text-center mx-auto pt-2 w-full transition-colors ${isActive
                                    ? 'text-red-500'
                                    : 'text-gray-800 group-hover:text-red-500'
                                    }`}
                            >
                                <span className="pt-1 pb-1 relative flex items-center flex-col">
                                    {/* Icon with dynamic fill color */}
                                    <div className={`w-max transition-colors ${isActive
                                        ? '[&>svg]:fill-red-600'
                                        : '[&>svg]:fill-gray-800 group-hover:[&>svg]:fill-red-600'
                                        }`}>
                                        {item.icon}
                                    </div>

                                    {/* Badge */}
                                    {item?.badge && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                                            {item?.badge}
                                        </span>
                                    )}

                                    {/* Title */}
                                    <span className="block text-xs py-1">{item.title}</span>

                                    {/* Active Indicator */}
                                    <span
                                        className={`block w-5 mx-auto h-1 rounded-full transition-colors ${isActive
                                            ? 'bg-red-500'
                                            : 'group-hover:bg-red-500'
                                            }`}
                                    />
                                </span>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNavigation;