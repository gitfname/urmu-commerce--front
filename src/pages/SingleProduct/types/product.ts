export interface ProductImage {
    src: string;
    alt: string;
}

export interface ProductFeature {
    label: string;
    value: string;
}

export interface ProductSpecification {
    label: string;
    value: string;
}

export interface ColorOption {
    id: string;
    name: string;
    colorClass: string;
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

export interface Product {
    id: string;
    title: string;
    englishTitle: string;
    rating: number;
    reviewCount: number;
    commentCount: number;
    price: number;
    stockCount: number;
    warranty: string;
    deliveryTime: string;
    images: ProductImage[];
    features: ProductFeature[];
    specifications: ProductSpecification[];
    colors: ColorOption[];
}

export interface Breadcrumb {
    title: string;
    href: string;
    isActive?: boolean;
}