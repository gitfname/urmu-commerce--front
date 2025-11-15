import React, { useState } from 'react';
import type { ProductImage } from '../../types/product';
import { HeartIcon, CompareIcon, ShareIcon } from '../Icons';
import Tooltip from '../UI/Tooltip';

interface ProductGalleryProps {
    images: ProductImage[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleImageChange = (index: number) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="lg:w-4/12">
            <div className="flex gap-x-4 max-md:hidden">
                <Tooltip text="افزودن به علاقه مندی ها">
                    <a href="#" className="relative">
                        <HeartIcon />
                    </a>
                </Tooltip>

                <Tooltip text="افزودن به مقایسه">
                    <a href="#" className="relative">
                        <CompareIcon />
                    </a>
                </Tooltip>

                <Tooltip text="اشتراک گذاری">
                    <a href="#" className="relative">
                        <ShareIcon />
                    </a>
                </Tooltip>
            </div>

            {/* Main Image */}
            <img
                className="w-10/12 lg:w-full mx-auto border-2 rounded-xl mt-3"
                src={"https://narenjitoy--bucket.storage.c2.liara.space/ecommerce/products/images/" + images[currentImageIndex]?.src}
                alt={images[currentImageIndex]?.alt}
            />

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 mt-4">
                {images.map((image, index) => (
                    <div key={index} className="">
                        <img
                            className={`opacity-50 hover:opacity-95 transition-all cursor-pointer w-10/12 lg:w-12/12 border-2 rounded-lg hover:border-red-400 ${currentImageIndex === index ? 'opacity-95 border-red-400' : ''}`}
                            src={"https://narenjitoy--bucket.storage.c2.liara.space/ecommerce/products/images/" + image.src}
                            alt={image.alt}
                            onClick={() => handleImageChange(index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;