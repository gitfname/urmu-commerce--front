export interface ProductImage {
    src: string;
    alt: string;
}

export interface ProductFeature {
    label: string;
    value: string;
}

export interface Review {
    id: string;
    title: string;
    date: string;
    author: string;
    isRecommended: boolean;
    content: string;
    isPurchaser: boolean;
}

export interface Question {
    id: string;
    date: string;
    author: string;
    content: string;
}

export interface ApiProduct {
    id: number;
    title: string;
    slug: string;
    summary: string;
    basePrice: string;
    baseDiscount: number;
    stockQuantity: number;
    hasVariants: boolean;
    thumbnailImage: string;
    images: string[];
    category?: {
        id: number;
        title: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface FavoriteProduct {
    id: number;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        isPhoneVerified: number;
        role: string;
    };
    product: ApiProduct;
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariants {
    [key: string]: string[];
}

export interface VariantAvailability {
    available: boolean;
    price: number | string | null;
    discount: number;
    stockQuantity: number;
    variantId: number | null;
}

export interface SingleProductPageProps {
    breadcrumbs?: Array<{
        title: string;
        href: string;
        isActive?: boolean;
    }>;
    reviews?: Review[];
    questions?: Question[];
}