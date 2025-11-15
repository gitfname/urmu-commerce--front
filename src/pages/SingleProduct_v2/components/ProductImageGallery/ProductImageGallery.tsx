import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import TooltipWrapper from '../Tooltip/TooltipWrapper';
import { HeartIcon, CompareIcon, ShareIcon } from '../Icons/Icons';
import type { ProductImage } from '../../types/product.types';
import RenderIfLoggedIn from '../../../../components/RenderIfLoggedIn';

interface ProductImageGalleryProps {
    productImages: ProductImage[];
    currentImageIndex: number;
    onImageChange: (index: number) => void;
    hasDiscount: boolean;
    currentDiscount: number;
    productId: number;
    productTitle: string;
    thumbnailImage: string;
    isFavorite: boolean;
    favoriteLoading: boolean;
    onFavoriteToggle: () => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
    productImages,
    currentImageIndex,
    onImageChange,
    hasDiscount,
    currentDiscount,
    productId,
    productTitle,
    thumbnailImage,
    isFavorite,
    favoriteLoading,
    onFavoriteToggle
}) => {
    return (
        <div className="lg:w-full">
            <div className="flex gap-x-4 max-md:hidden">
                <RenderIfLoggedIn>
                    <TooltipWrapper text={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه مندی ها"}>
                        <button
                            onClick={onFavoriteToggle}
                            disabled={favoriteLoading}
                            className="relative transition-transform hover:scale-110 disabled:opacity-50"
                        >
                            <HeartIcon isFavorite={isFavorite} />
                        </button>
                    </TooltipWrapper>
                </RenderIfLoggedIn>

                <TooltipWrapper text="افزودن به مقایسه">
                    <Link to={"/compare?compare=" + productId} className="relative">
                        <CompareIcon />
                    </Link>
                </TooltipWrapper>

                <TooltipWrapper text="اشتراک گذاری">
                    <button onClick={() => navigator.share({ title: productTitle, url: location.href })} className="relative">
                        <ShareIcon />
                    </button>
                </TooltipWrapper>
            </div>

            <div className="relative">
                {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                        {currentDiscount}% تخفیف
                    </div>
                )}
                <img
                    className="w-10/12 lg:w-full mx-auto border-2 rounded-xl mt-3"
                    src={"https://narenjitoy--bucket.storage.c2.liara.space/ecommerce/products/images/" + (productImages[currentImageIndex]?.src || thumbnailImage)}
                    alt={productImages[currentImageIndex]?.alt || productTitle}
                />
            </div>

            {productImages.length > 1 && (
                <div className="flex mt-4 gap-2">
                    {productImages.map((image, index) => (
                        <div key={index} className="flex-shrink-0">
                            <img
                                className={`opacity-50 hover:opacity-95 transition-all cursor-pointer w-16 h-16 object-cover border-2 rounded-lg hover:border-red-400 ${currentImageIndex === index ? 'opacity-95 border-red-400' : ''}`}
                                src={"https://narenjitoy--bucket.storage.c2.liara.space/ecommerce/products/images/" + image.src}
                                alt={image.alt}
                                onClick={() => onImageChange(index)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageGallery;