import React from 'react';
import type { Product, Breadcrumb as BreadcrumbType } from '../../types/product';
import { StarIcon } from '../Icons';
import Breadcrumb from '../UI/Breadcrumb';

interface ProductInfoProps {
    product: Product;
    breadcrumbs: BreadcrumbType[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, breadcrumbs }) => {
    return (
        <div className="lg:w-5/12">
            <Breadcrumb breadcrumbs={breadcrumbs} />

            {/* Product Title */}
            <div className="text-zinc-700 text-lg md:text-xl">
                {product.title}
            </div>
            <div className="text-zinc-400 text-xs mt-4">
                {product.englishTitle}
            </div>

            {/* Rating and Comments */}
            <div className="flex gap-x-4 mt-3">
                <div className="flex items-start gap-x-1 text-xs text-zinc-500">
                    <StarIcon />
                    <span>
                        <span>({product.reviewCount}+)</span>
                        <span>{product.rating}</span>
                    </span>
                </div>
                <a href="#comments" className="flex items-start gap-x-1 text-xs text-red-400">
                    <svg className="fill-red-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256">
                        <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path>
                    </svg>
                    <span>
                        <span>{product.commentCount}</span>
                        <span>دیدگاه</span>
                    </span>
                </a>
            </div>

            {/* Product Features */}
            <div className="mt-8 text-zinc-700">
                ویژگی های محصول:
            </div>
            <div className="grid grid-cols-3 max-w-md py-3 mb-5 gap-3">
                {product.features.map((feature, index) => (
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
        </div>
    );
};

export default ProductInfo;