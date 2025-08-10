// components/ProductCard/ProductCard.tsx
import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types';
import { Env } from '../../../../env';

interface ProductCardProps {
    product: Product;
    onRemove: (productId: number) => void;
    showRemoveButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onRemove,
    showRemoveButton = true
}) => {
    // Calculate discounted price
    const getDiscountedPrice = (basePrice: string, discount: number) => {
        const price = parseFloat(basePrice);
        return (price - (price * discount / 100)).toFixed(0);
    };

    // Format price
    const formatPrice = (price: string) => {
        return `${parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان`;
    };

    return (
        <div className="relative border border-gray-200 rounded-lg overflow-hidden">
            {/* Remove Button */}
            {showRemoveButton && (
                <button
                    onClick={() => onRemove(product.id)}
                    className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                    <X size={16} />
                </button>
            )}

            {/* Product Image */}
            <div className="aspect-square overflow-hidden">
                <img
                    src={Env.productThumbnailBaseUrl + product.thumbnailImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="p-4 text-right" dir="rtl">
                <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2">
                    {product.title}
                </h3>

                {/* Price */}
                <div className="mb-5">
                    {product.baseDiscount > 0 ? (
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-lg font-bold text-red-500 flex-1">
                                {formatPrice(getDiscountedPrice(product.basePrice, product.baseDiscount))}
                            </span>

                            <div className='flex flex-col gap-1 flex-shrink-0'>
                                <span className="text-xs text-gray-500 line-through">
                                    {formatPrice(product.basePrice)}
                                </span>
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                    {product.baseDiscount}% تخفیف
                                </span>
                            </div>
                        </div>
                    ) : (
                        <span className="text-xl font-medium text-gray-900">
                            {formatPrice(product.basePrice)}
                        </span>
                    )}
                </div>

                {/* Category */}
                {product.category && (
                    <div className="mb-2">
                        <span className="text-sm text-gray-600">دسته‌بندی: </span>
                        <span className="text-sm font-medium text-gray-900">
                            {product.category.title}
                        </span>
                    </div>
                )}

                {/* Stock */}
                <div className="mb-3">
                    <span className="text-sm text-gray-600">موجودی: </span>
                    <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} عدد موجود` : 'ناموجود'}
                    </span>
                </div>

                {/* Variants */}
                {product.hasVariants && (
                    <div className="mb-3">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            دارای انواع مختلف
                        </span>
                    </div>
                )}

                {/* Summary */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {product.summary}
                </p>

                {/* Add to Cart Button */}
                <button
                    disabled={product.stockQuantity === 0}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${product.stockQuantity > 0
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <ShoppingCart size={16} />
                    {product.stockQuantity > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;