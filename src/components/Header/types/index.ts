import type { ReactNode } from "react";

// types.ts
export interface SearchResultItem {
    id: number | string;
    name: string;
    imageUrl: string;
    href: string;
    price?: string;
    summary?: string;
    stockQuantity?: number;
    hasVariants?: boolean;
}

export interface SuggestionItem {
    id: number | string;
    label: string;
    href: string;
}

export interface AccountMenuItem {
    id: number | string;
    label: string;
    href: string;
    icon: ReactNode;
    isDanger?: boolean;
    notificationCount?: number;
}

export interface CartItem {
    id: number | string;
    name: string;
    imageUrl: string;
    href: string;
    color?: string;
    deliveryMethod?: string;
    price: number;
    quantity: number;
}