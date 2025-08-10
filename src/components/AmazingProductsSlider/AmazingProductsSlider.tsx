import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';

interface Product {
    id: number;
    image: string;
    price: number;
    originalPrice?: number;
    currency: string;
    href?: string;
    alt?: string;
}

interface AmazingSliderProps {
    products?: Product[];
    autoplay?: boolean;
    autoplayDelay?: number;
    slidesPerView?: number | 'auto';
    spaceBetween?: number;
    showViewAllButton?: boolean;
    viewAllText?: string;
    viewAllHref?: string;
}

const AmazingSlider: React.FC<AmazingSliderProps> = ({
    products = defaultProducts,
    autoplay = true,
    autoplayDelay = 3000,
    slidesPerView = 'auto',
    spaceBetween = 16,
    showViewAllButton = true,
    viewAllText = 'مشاهده همه',
    viewAllHref = '#'
}) => {
    const swiperConfig = {
        modules: [Navigation, Autoplay],
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: autoplay ? {
            delay: autoplayDelay,
            disableOnInteraction: false,
        } : false,
        slidesPerView,
        spaceBetween,
        loop: false,
        speed: 800,
        freeMode: true,
        grabCursor: true,
    };

    const formatPrice = (price: number): string => {
        return price.toLocaleString();
    };

    return (
        <div className="swiper mySwiper bg-red-500 rounded-2xl my-10">
            <Swiper {...swiperConfig} className="swiper">
                <div className="swiper-wrapper items-center">
                    {/* Featured Promo Slide */}
                    <SwiperSlide className="card swiper-slide flex flex-col justify-center items-center">
                        <img className="w-5/12" src="assets/image/FeaturedPromos.svg" alt="Featured Promos" />
                        <img className="w-10/12" src="assets/image/box.webp" alt="Box" />
                    </SwiperSlide>

                    {/* Product Slides */}
                    {products.map((product) => (
                        <SwiperSlide key={product.id} className="card swiper-slide my-2 p-2 md:p-3 bg-white rounded-xl">
                            <Link to={product.href || '#'}>
                                {/* Logo */}
                                <img alt='' loading='lazy' src='/amazing-suggestions.png' />

                                <div className="image-box mb-6">
                                    <div>
                                        <img
                                            className="hover:scale-105 transition rounded-3xl w-full mx-auto"
                                            src={product.image}
                                            alt={product.alt || `Product ${product.id}`}
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-right">
                                    <div className="flex justify-end mt-1 mb-1 text-sm text-zinc-800">
                                        <div>{formatPrice(product.price)}</div>
                                        <div>{product.currency}</div>
                                    </div>
                                    {product.originalPrice && (
                                        <div className="flex justify-end text-xs opacity-65">
                                            <div className="line-through">{formatPrice(product.originalPrice)}</div>
                                            <div className="line-through">{product.currency}</div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}

                    {/* View All Button Slide */}
                    {showViewAllButton && (
                        <SwiperSlide className="swiper-slide flex flex-col justify-center items-center h-max my-auto">
                            <a href={viewAllHref} className="flex flex-col justify-center items-center">
                                <div className="text-gray-100">
                                    {viewAllText}
                                </div>
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="44"
                                        height="44"
                                        fill="#f2f2f2"
                                        viewBox="0 0 256 256"
                                    >
                                        <path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm46-90a6,6,0,0,1-6,6H102.49l21.75,21.76a6,6,0,1,1-8.48,8.48l-32-32a6,6,0,0,1,0-8.48l32-32a6,6,0,0,1,8.48,8.48L102.49,122H168A6,6,0,0,1,174,128Z"></path>
                                    </svg>
                                </div>
                            </a>
                        </SwiperSlide>
                    )}
                </div>

                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
            </Swiper>
        </div>
    );
};

// Default products data
const defaultProducts: Product[] = [
    {
        id: 1,
        image: "assets/image/products/1.webp",
        price: 1100000,
        originalPrice: 1350000,
        currency: "تومان",
        alt: "Product 1",
        href: "/products/123"
    },
    {
        id: 2,
        image: "assets/image/products/2.webp",
        price: 1100000,
        originalPrice: 1350000,
        currency: "تومان",
        alt: "Product 2",
        href: "/products/123"
    },
    {
        id: 3,
        image: "assets/image/products/3.webp",
        price: 1100000,
        originalPrice: 1350000,
        currency: "تومان",
        alt: "Product 3",
        href: "/products/123"
    },
    {
        id: 4,
        image: "assets/image/products/4.webp",
        price: 1100000,
        originalPrice: 1350000,
        currency: "تومان",
        alt: "Product 4",
        href: "/products/123"
    },
    {
        id: 5,
        image: "assets/image/products/5.webp",
        price: 1100000,
        originalPrice: 1350000,
        currency: "تومان",
        alt: "Product 5",
        href: "/products/123"
    },
    {
        id: 6,
        image: "assets/image/products/6.webp",
        price: 1100000,
        originalPrice: 1350000,
        currency: "تومان",
        alt: "Product 6",
        href: "/products/123"
    },
    {
        id: 7,
        image: "assets/image/products/7.webp",
        price: 1100000,
        originalPrice: 1350000,
        currency: "تومان",
        alt: "Product 7",
        href: "/products/123"
    },
    {
        id: 8,
        image: "assets/image/products/8.webp",
        price: 1100000,
        originalPrice: 1350000,
        currency: "تومان",
        alt: "Product 8",
        href: "/products/123"
    }
];

export default AmazingSlider;