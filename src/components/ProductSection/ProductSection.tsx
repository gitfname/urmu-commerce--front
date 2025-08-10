// components/ProductSection/ProductSection.tsx
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { mockProducts } from '../../data/mockData';
// import './ProductSection.css';

interface ProductSectionProps {
    title: string;
    subtitle?: string;
    sectionType: string;
    showViewAll?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
    title,
    subtitle,
    sectionType,
    showViewAll = true
}) => {
    // In a real app, you'd filter products based on sectionType
    const products = mockProducts.slice(0, 6);

    return (
        <section className="product-section py-8">
            <div className="container mx-auto px-4">
                <div className="section-header flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                        {subtitle && (
                            <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
                        )}
                    </div>

                    {showViewAll && (
                        <button className="view-all-btn text-blue-600 hover:text-blue-800 font-medium">
                            مشاهده همه
                        </button>
                    )}
                </div>

                <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;