// components/ProductSearch/ProductSearchResults.tsx
import React from 'react';
import type { Product } from '../../types';
import { Env } from '../../../../env';

interface ProductSearchResultsProps {
    results: Product[];
    isSearching: boolean;
    onProductSelect: (productId: number) => void;
}

const ProductSearchResults: React.FC<ProductSearchResultsProps> = ({
    results,
    isSearching,
    onProductSelect
}) => {
    const formatPrice = (price: string) => {
        return `${parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان`;
    };

    if (!results.length && !isSearching) return null;

    return (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isSearching ? (
                <div className="p-4 text-center text-gray-500">در حال جستجو...</div>
            ) : (
                results.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => onProductSelect(product.id)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                    >
                        <img
                            src={Env.productThumbnailBaseUrl + product.thumbnailImage}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 text-right">
                            <h4 className="font-medium text-gray-900">{product.title}</h4>
                            <p className="text-sm text-gray-500">{formatPrice(product.basePrice)}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductSearchResults;