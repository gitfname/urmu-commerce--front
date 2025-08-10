import React from 'react';
import type { ProductVariants } from '../../types/product.types';
import { getColorClass } from '../../utils/product.utils';

interface VariantSelectorProps {
    variants: ProductVariants;
    selectedVariants: { [key: string]: string };
    onVariantSelect: (variantType: string, value: string) => void;
    hasVariants: boolean;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
    variants,
    selectedVariants,
    onVariantSelect,
    hasVariants
}) => {
    if (!hasVariants) return null;

    return (
        <div className="lg:mt-8 lg:mb-8 space-y-4">
            {Object.entries(variants).map(([variantType, options]) => (
                <div key={variantType}>
                    <div className="text-zinc-700 mb-2 capitalize">
                        {variantType}:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => onVariantSelect(variantType, option)}
                                className={`flex items-center justify-center gap-x-2 px-3 py-2 border rounded-lg text-sm transition-colors duration-200
                  ${selectedVariants[variantType] === option
                                        ? 'border-red-500 shadow-md shadow-red-500/20'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                    }`}
                            >
                                {variantType === 'color' && (
                                    <span className={`w-4 h-4 rounded-full ${getColorClass(option)} border`}></span>
                                )}
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VariantSelector;