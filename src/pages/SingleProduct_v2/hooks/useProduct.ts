import { useState, useEffect } from 'react';
import type { ApiProduct, ProductVariants, VariantAvailability } from '../types/product.types';

const API_BASE_URL = 'https://urmu-commerce-prod.runflare.run';

export const useProduct = (id: string | undefined) => {
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/products/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const productData: ApiProduct = await response.json();
                setProduct(productData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    return { product, loading, error };
};

export const useProductVariants = (product: ApiProduct | null) => {
    const [variants, setVariants] = useState<ProductVariants>({});
    const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchVariants = async () => {
            if (!product?.hasVariants) return;
            try {
                const response = await fetch(`${API_BASE_URL}/product-variants/properties?productId=${product.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch variants');
                }
                const variantsData: ProductVariants = await response.json();
                setVariants(variantsData);

                const initialSelection: { [key: string]: string } = {};
                Object.keys(variantsData).forEach(key => {
                    if (variantsData[key].length > 0) {
                        initialSelection[key] = variantsData[key][0];
                    }
                });
                setSelectedVariants(initialSelection);
            } catch (err) {
                console.error('Error fetching variants:', err);
            }
        };

        if (product) {
            fetchVariants();
        }
    }, [product]);

    return { variants, selectedVariants, setSelectedVariants };
};

export const useFavorites = (product: ApiProduct | null) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState<number | null>(null);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!product?.id) return;

            try {
                const response = await fetch(`${API_BASE_URL}/favorite-products/check-is-my-favorite/${product.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    },
                });

                if (response.ok) {
                    const favoriteData = await response.json();
                    setIsFavorite(true);
                    setFavoriteId(favoriteData.id);
                } else if (response.status === 404) {
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            } catch (err) {
                console.error('Error checking favorite status:', err);
            }
        };

        checkFavoriteStatus();
    }, [product]);

    const toggleFavorite = async () => {
        if (!product?.id || favoriteLoading) return;

        setFavoriteLoading(true);

        try {
            if (isFavorite && favoriteId) {
                const response = await fetch(`${API_BASE_URL}/favorite-products/my-favorites/${favoriteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    },
                });

                if (response.ok) {
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            } else {
                const response = await fetch(`${API_BASE_URL}/favorite-products/add-to-my-favorites?productId=${product.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    },
                });

                if (response.ok) {
                    const favoriteData = await response.json();
                    setIsFavorite(true);
                    setFavoriteId(favoriteData.id);
                }
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
        } finally {
            setFavoriteLoading(false);
        }
    };

    return { isFavorite, favoriteLoading, toggleFavorite };
};