export interface Product {
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
    category: {
        id: number;
        title: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProductSearchResponse {
    data: Product[];
    count: number;
}