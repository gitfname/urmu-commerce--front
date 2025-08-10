// components/ProductSearch/ProductSearchInput.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface ProductSearchInputProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    placeholder?: string;
}

const ProductSearchInput: React.FC<ProductSearchInputProps> = ({
    searchQuery,
    onSearchChange,
    placeholder = "جستجوی محصولات..."
}) => {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

            <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-red-500 focus:border-transparent text-right outline-none"
                dir="rtl"
            />
        </div>
    );
};

export default ProductSearchInput;