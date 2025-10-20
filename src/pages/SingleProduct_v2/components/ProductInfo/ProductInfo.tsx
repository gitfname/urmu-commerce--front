import React from 'react';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import type { ApiProduct, ProductFeature } from '../../types/product.types';

interface ProductInfoProps {
    product: ApiProduct;
    breadcrumbs: Array<{
        title: string;
        href: string;
        isActive?: boolean;
    }>;
    productFeatures: ProductFeature[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, breadcrumbs, productFeatures }) => {
    return (
        <div>
            <Breadcrumb breadcrumbs={breadcrumbs} />

            <div className="text-zinc-700 text-lg md:text-xl">
                {product.title}
            </div>
            <div className="text-zinc-400 text-xs mt-4">
                {product.slug}
            </div>

            <div className="mt-8 text-zinc-700">
                ویژگی های محصول:
            </div>
            <div className="grid grid-cols-3 max-w-md py-3 mb-5 gap-3">
                {productFeatures.map((feature, index) => (
                    <div key={index} className="flex flex-col gap-x-2 justufy-center bg-gray-100 rounded-md px-2 py-3">
                        <div className="text-zinc-500 text-xs">
                            {feature.label}
                        </div>
                        <div className="text-zinc-700 text-sm">
                            {feature.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-zinc-600 text-sm">
                {product.summary}
            </div>
        </div>
    );
};

export default ProductInfo;