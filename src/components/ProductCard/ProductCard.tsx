// components/ProductCard/ProductCard.tsx
import React from 'react';
import './ProductCard.module.css';

interface ProductCardProps {
    id: string;
    title: string;
    englishTitle?: string;
    image: string;
    currentPrice: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    discount?: number;
    features?: string[];
    className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    title,
    englishTitle,
    image,
    currentPrice,
    originalPrice,
    rating,
    reviewCount,
    discount,
    features,
    className = ''
}) => {
    const formatPrice = (price: number): string => {
        return price.toLocaleString('fa-IR');
    };

    return (
        <div className={`product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 ${className}`}>
            {discount && (
                <div className="discount-badge absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                    {discount}% تخفیف
                </div>
            )}

            <div className="product-image mb-4">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover rounded-lg"
                />
            </div>

            <div className="product-info">
                <h3 className="product-title text-lg font-semibold mb-2 line-clamp-2">
                    {title}
                </h3>

                {englishTitle && (
                    <p className="english-title text-gray-500 text-sm mb-2">
                        {englishTitle}
                    </p>
                )}

                <div className="rating flex items-center mb-2">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm text-gray-600 mr-1">
                        {rating} ({reviewCount}+)
                    </span>
                </div>

                {features && (
                    <div className="features mb-3">
                        {features.map((feature, index) => (
                            <span key={index} className="feature-tag inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {feature}
                            </span>
                        ))}
                    </div>
                )}

                <div className="price-section">
                    <div className="current-price text-lg font-bold text-green-600 mb-1">
                        {formatPrice(currentPrice)} تومان
                    </div>

                    {originalPrice && (
                        <div className="original-price text-sm text-gray-500 line-through">
                            {formatPrice(originalPrice)} تومان
                        </div>
                    )}
                </div>

                <button className="add-to-cart w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    افزودن به سبد خرید
                </button>
            </div>
        </div>
    );
};

export default ProductCard;