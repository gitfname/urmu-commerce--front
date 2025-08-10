// components/ProductSearch/ProductSearchContainer.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import type { Product, ProductSearchResponse } from '../../types';
import ProductSearchInput from './ProductSearchInput';
import ProductSearchResults from './ProductSearchResults';

interface ProductSearchContainerProps {
    selectedProducts: Product[];
    onProductAdd: (productId: number) => void;
    maxProducts?: number;
}

const ProductSearchContainer: React.FC<ProductSearchContainerProps> = ({
    selectedProducts,
    onProductAdd,
    maxProducts = 4
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [showSearch, setShowSearch] = useState<boolean>(false);

    // Debounced search function
    const debounce = (func: Function, wait: number) => {
        let timeout: number;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Search products by title
    const searchProducts = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://urmu-commerce-prod.runflare.run/products?limit=10&skip=0&title=${encodeURIComponent(query)}`
            );
            const data: ProductSearchResponse = await response.json();

            // Filter out already selected products
            const filteredResults = data.data.filter((product: any) =>
                !selectedProducts.some(selected => selected.id === product.id)
            );

            setSearchResults(filteredResults);
        } catch (error) {
            console.error('Error searching products:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const debouncedSearch = useCallback(debounce(searchProducts, 300), [selectedProducts]);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    // Update search results when selected products change
    useEffect(() => {
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery);
        }
    }, [selectedProducts, debouncedSearch, searchQuery]);

    const handleProductSelect = (productId: number) => {
        onProductAdd(productId);
        setSearchQuery('');
        setSearchResults([]);
        setShowSearch(false);
    };

    const handleSearchToggle = () => {
        setShowSearch(!showSearch);
        if (showSearch) {
            // Reset search state when closing
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    if (selectedProducts.length >= maxProducts) return null;

    return (
        <div className="mb-6">
            <button
                onClick={handleSearchToggle}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                dir="rtl"
            >
                <Plus size={20} />
                افزودن محصول برای مقایسه ({selectedProducts.length}/{maxProducts})
            </button>

            {showSearch && (
                <div className="mt-4 relative">
                    <ProductSearchInput
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                    <ProductSearchResults
                        results={searchResults}
                        isSearching={isSearching}
                        onProductSelect={handleProductSelect}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductSearchContainer;