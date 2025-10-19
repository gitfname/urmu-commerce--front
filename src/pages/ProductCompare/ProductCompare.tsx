// components/ProductCompare/ProductCompare.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from './types';
import ProductSearchContainer from './components/ProductSearch/ProductSearchContainer';
import ProductCard from './components/ProductCard/ProductCard';
import EmptyProductSlot from './components/ProductCard/EmptyProductSlot';
import ComparisonTable from './components/ComparisonTable/ComparisonTable';
import LoadingSpinner from './components/UI/LoadingSpinner';
import EmptyState from './components/UI/EmptyState';

const ProductCompare: React.FC = () => {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();

    // Get selected product IDs from URL
    const getSelectedIdsFromUrl = useCallback((): number[] => {
        const compareParam = searchParams.get('compare');
        if (!compareParam) return [];

        return compareParam
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id) && id > 0)
            .slice(0, 4); // Limit to 4 products
    }, [searchParams]);

    // Update URL with selected product IDs
    const updateUrlParams = useCallback((productIds: number[]) => {
        const newSearchParams = new URLSearchParams(searchParams);

        if (productIds.length > 0) {
            newSearchParams.set('compare', productIds.join(','));
        } else {
            newSearchParams.delete('compare');
        }

        setSearchParams(newSearchParams, { replace: true });
    }, [searchParams, setSearchParams]);

    // Fetch product by ID
    const fetchProduct = async (productId: number): Promise<Product | null> => {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch product ${productId}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
        }
    };

    // Load products from URL on component mount and URL changes
    useEffect(() => {
        const loadProductsFromUrl = async () => {
            const selectedIds = getSelectedIdsFromUrl();

            if (selectedIds.length === 0) {
                setSelectedProducts([]);
                return;
            }

            // Check if current products match URL
            const currentIds = selectedProducts.map(p => p.id).sort();
            const urlIds = selectedIds.sort();

            if (JSON.stringify(currentIds) === JSON.stringify(urlIds)) {
                return; // No change needed
            }

            setLoading(true);

            try {
                const productPromises = selectedIds.map(id => fetchProduct(id));
                const products = await Promise.all(productPromises);

                // Filter out null products (failed fetches) and maintain order
                const validProducts = products.filter((product: any): product is Product => product !== null);

                setSelectedProducts(validProducts);

                // Update URL if some products failed to load
                if (validProducts.length !== selectedIds.length) {
                    updateUrlParams(validProducts.map((p: any) => p.id));
                }
            } catch (error) {
                console.error('Error loading products from URL:', error);
                setSelectedProducts([]);
                updateUrlParams([]);
            } finally {
                setLoading(false);
            }
        };

        loadProductsFromUrl();
    }, [searchParams]); // Only depend on searchParams

    // Add product to comparison
    const addProduct = async (productId: number) => {
        if (selectedProducts.length >= 4) return;
        if (selectedProducts.some(p => p.id === productId)) return; // Prevent duplicates

        setLoading(true);
        try {
            const product = await fetchProduct(productId);
            if (product) {
                const newProducts = [...selectedProducts, product];
                setSelectedProducts(newProducts);
                updateUrlParams(newProducts.map(p => p.id));
            }
        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setLoading(false);
        }
    };

    // Remove product from comparison
    const removeProduct = (productId: number) => {
        const newProducts = selectedProducts.filter(product => product.id !== productId);
        setSelectedProducts(newProducts);
        updateUrlParams(newProducts.map(p => p.id));
    };

    // Clear all products
    const clearAllProducts = () => {
        setSelectedProducts([]);
        updateUrlParams([]);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white mt-32" dir="rtl">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">مقایسه محصولات</h1>

                    {/* Clear All Button */}
                    {selectedProducts.length > 0 && (
                        <button
                            onClick={clearAllProducts}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            پاک کردن همه ({selectedProducts.length})
                        </button>
                    )}
                </div>

                {/* Add Product Section */}
                <ProductSearchContainer
                    selectedProducts={selectedProducts}
                    onProductAdd={addProduct}
                    maxProducts={4}
                />
            </div>

            {/* Comparison Content */}
            {selectedProducts.length > 0 ? (
                <div className="overflow-x-auto">
                    <div className="min-w-full">
                        {/* Product Cards Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {selectedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onRemove={removeProduct}
                                />
                            ))}

                            {/* Empty Slots */}
                            {Array.from({ length: 4 - selectedProducts.length }).map((_, index) => (
                                <EmptyProductSlot key={`empty-${index}`} />
                            ))}
                        </div>

                        {/* Comparison Features Table */}
                        <ComparisonTable products={selectedProducts} />
                    </div>
                </div>
            ) : (
                <EmptyState />
            )}

            {loading && <LoadingSpinner />}
        </div>
    );
};

export default ProductCompare;