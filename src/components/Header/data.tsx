import { EnvalopeIcon, HeartIcon, PersonIcon, ShoppingBagIcon, SignOutIcon, UserIcon } from "./icons/Icon";
import type { AccountMenuItem, CartItem, SearchResultItem, SuggestionItem } from "./types";

export const sampleSearchResultItems: SearchResultItem[] = [
    { id: 1, name: 'لپ تاپ لنوو مدل IdeaPad', imageUrl: '/assets/image/products/1.webp', href: '#' }, { id: 2, name: 'لپ تاپ لنوو مدل IdeaPad', imageUrl: '/assets/image/products/1.webp', href: '#' },
    { id: 3, name: 'لپ تاپ لنوو مدل IdeaPad', imageUrl: '/assets/image/products/1.webp', href: '#' },
];

export const sampleRecentSearches: SuggestionItem[] = [
    { id: 1, label: 'گوشی سامسونگ', href: '#' },
    { id: 2, label: 'گوشی اپل', href: '#' },
];

export const samplePopularSearches: SuggestionItem[] = [
    { id: 1, label: 'پاور بانک', href: '#' },
    { id: 2, label: 'شارژر 200 وات', href: '#' },
];

export const sampleAccountMenuItems: AccountMenuItem[] = [
    { id: 1, label: 'امیررضا کریمی', href: '/profile', icon: <UserIcon name="user" /> },
    { id: 2, label: 'سفارش ها', href: '/profile/my-orders', icon: <ShoppingBagIcon name="package" /> },
    { id: 3, label: 'علاقه مندی ها', href: '/profile/my-favorites', icon: <HeartIcon name="heart" /> },
    { id: 4, label: 'پیغام ها', href: '/profile/notifications', icon: <EnvalopeIcon name="envalop" />, notificationCount: 4 },
    { id: 5, label: 'خروج از حساب کاربری', href: '/logout', icon: <SignOutIcon name="sign-out" />, isDanger: true },
];

export const sampleCartItems: CartItem[] = [
    {
        id: 1,
        name: 'لپ تاپ مدل لنوو', imageUrl: '/assets/image/products/1.webp',
        href: '#',
        color: 'مشکی',
        deliveryMethod: 'ارسال پست پیشتاز',
        price: 1800000,
        quantity: 1,
    },
    {
        id: 2,
        name: 'لپ تاپ مدل لنوو',
        imageUrl: '/assets/image/products/1.webp',
        href: '#',
        color: 'مشکی',
        deliveryMethod: 'ارسال پست پیشتاز',
        price: 1800000,
        quantity: 1,
    },
];