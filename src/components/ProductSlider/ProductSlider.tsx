import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import calculateFinalPrice from '../../utils/calculateFinalPrice';

interface ProductData {
    id: number;
    name: string;
    englishName: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviewCount: number;
    currency: string;
    href?: string;
    alt?: string;
    category?: string;
}

interface ProductSliderProps {
    title?: string;
    titleIcon?: React.ReactNode;
    products?: ProductData[];
    viewAllHref?: string;
    viewAllText?: string;
    autoplay?: boolean;
    autoplayDelay?: number;
    slidesPerView?: number | 'auto';
    spaceBetween?: number;
    onWishlistClick?: (productId: number) => void;
    onCompareClick?: (productId: number) => void;
    onBuyClick?: (productId: number) => void;
    showCompareButton?: boolean;
    showHeartButton?: boolean;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
    title = 'پرفروش ترین',
    titleIcon,
    products = [],
    viewAllHref = '#',
    viewAllText = 'مشاهده همه',
    autoplay = true,
    autoplayDelay = 4000,
    slidesPerView = 'auto',
    spaceBetween = 16,
    onWishlistClick,
    onCompareClick,
    onBuyClick,
    showCompareButton = true,
    showHeartButton = true
}) => {
    const swiperConfig = {
        modules: [Navigation, Autoplay, FreeMode],
        navigation: {
            nextEl: '.swiper-btn-next',
            prevEl: '.swiper-btn-prev',
        },
        autoplay: autoplay ? {
            delay: autoplayDelay,
            disableOnInteraction: false,
        } : false,
        slidesPerView,
        spaceBetween,
        freeMode: true,
        grabCursor: true,
        loop: false,
        speed: 800,
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            768: {
                slidesPerView: 2.5,
                spaceBetween: 16,
            },
            1024: {
                slidesPerView: 5,
                spaceBetween: 16,
            },
        },
    };

    const formatPrice = (price: number): string => {
        return price.toLocaleString();
    };

    const handleWishlistClick = (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        e.stopPropagation();
        onWishlistClick?.(productId);
    };

    const handleCompareClick = (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        e.stopPropagation();
        onCompareClick?.(productId);
    };

    const handleBuyClick = (e: React.MouseEvent, productId: number) => {
        // e.preventDefault();
        // e.stopPropagation();
        onBuyClick?.(productId);
    };

    const defaultTitleIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#dc2626" viewBox="0 0 256 256">
            <path d="M222.72,67.91l-88-48.18a13.9,13.9,0,0,0-13.44,0l-88,48.18A14,14,0,0,0,26,80.18v95.64a14,14,0,0,0,7.28,12.27l88,48.18a13.92,13.92,0,0,0,13.44,0l88-48.18A14,14,0,0,0,230,175.82V80.18A14,14,0,0,0,222.72,67.91ZM127,30.25a2,2,0,0,1,1.92,0L212.51,76,178.57,94.57,94.05,48.31ZM122,223,39,177.57a2,2,0,0,1-1-1.75V86.66l84,46ZM43.49,76,81.56,55.15l84.51,46.26L128,122.24ZM218,175.82a2,2,0,0,1-1,1.75h0L134,223V132.64l36-19.71V152a6,6,0,0,0,12,0V106.37l36-19.71Z"></path>
        </svg>
    );

    return (
        <div className="mt-14">
            {/* TOP SLIDER */}
            <div className="flex justify-between px-1 md:px-10 items-center bg-white py-3 rounded-xl shadow-box">
                <div className="px-4 py-2 flex justify-center items-center gap-x-1 text-sm text-zinc-700">
                    {titleIcon || defaultTitleIcon}
                    <span className="text-red-500">
                        {title}
                    </span>
                    محصولات
                </div>
                <a href={viewAllHref}>
                    <div className="transition px-4 py-2 flex justify-center items-center text-sm text-zinc-700 hover:text-zinc-600">
                        {viewAllText}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#292929" viewBox="0 0 256 256">
                            <path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path>
                        </svg>
                    </div>
                </a>
            </div>

            {/* SLIDER */}
            <div className="containerPSlider swiper">
                <div className="product-slider1 px-1">
                    <Swiper {...swiperConfig} className="card-wrapper swiper-wrapper py-2">
                        {products.map((product) => (
                            <SwiperSlide key={product.id} className="card swiper-slide my-2 p-2 md:p-4 bg-white rounded-2xl drop-shadow-lg h-auto group hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 transition-all duration-500 ease-out hover:scale-[1.02]">
                                <a href={product.href || '#'} className='h-full grid grid-cols-1 lg:grid-rows-[max-content_1fr]'>
                                    {/* discount - category */}
                                    <div className="flex justify-between">
                                        <div className='flex items-center gap-1.5'>
                                            {
                                                product.discount === 0
                                                    ?
                                                    null
                                                    :
                                                    <div className="bg-red-200 rounded-lg px-2 py-1 text-red-500 flex items-center gap-x-1 text-xs">
                                                        <div>{product.discount}%</div>
                                                        <div>تخفیف</div>
                                                    </div>
                                            }
                                            {
                                                product.category?.length
                                                    ?
                                                    <div className="bg-red-200 rounded-lg px-2 py-1 text-red-500 flex items-center gap-x-1 text-xs">
                                                        <div>{product.category}</div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>

                                        <div className="flex gap-x-1">
                                            {
                                                showHeartButton
                                                    ?
                                                    <div>
                                                        <button
                                                            onClick={(e) => handleWishlistClick(e, product.id)}
                                                            className="bg-gray-200 rounded-full p-1 hover:fill-red-500 hover:bg-red-100 hover:scale-110 transition-all duration-300 ease-out"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#2b2b2b" viewBox="0 0 256 256">
                                                                <path d="M178,34c-21,0-39.26,9.47-50,25.34C117.26,43.47,99,34,78,34A60.07,60.07,0,0,0,18,94c0,29.2,18.2,59.59,54.1,90.31a334.68,334.68,0,0,0,53.06,37,6,6,0,0,0,5.68,0,334.68,334.68,0,0,0,53.06-37C219.8,153.59,238,123.2,238,94A60.07,60.07,0,0,0,178,34ZM128,209.11C111.59,199.64,30,149.72,30,94A48.05,48.05,0,0,1,78,46c20.28,0,37.31,10.83,44.45,28.27a6,6,0,0,0,11.1,0C140.69,56.83,157.72,46,178,46a48.05,48.05,0,0,1,48,48C226,149.72,144.41,199.64,128,209.11Z"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    :
                                                    null
                                            }

                                            {
                                                showCompareButton
                                                    ?
                                                    <div>
                                                        <button
                                                            onClick={(e) => handleCompareClick(e, product.id)}
                                                            className="bg-gray-200 rounded-full p-1 hover:fill-zinc-500 hover:bg-zinc-100 hover:scale-110 transition-all duration-300 ease-out"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#2b2b2b" viewBox="0 0 256 256">
                                                                <path d="M236.24,179.76a6,6,0,0,1,0,8.48l-24,24a6,6,0,0,1-8.48-8.48L217.52,190H200.94a70.16,70.16,0,0,1-57-29.31l-41.71-58.4A58.11,58.11,0,0,0,55.06,78H32a6,6,0,0,1,0-12H55.06a70.16,70.16,0,0,1,57,29.31l41.71,58.4A58.11,58.11,0,0,0,200.94,178h16.58l-13.76-13.76a6,6,0,0,1,8.48-8.48Zm-92.06-74.41a5.91,5.91,0,0,0,3.48,1.12,6,6,0,0,0,4.89-2.51l1.19-1.67A58.11,58.11,0,0,1,200.94,78h16.58L203.76,91.76a6,6,0,1,0,8.48,8.48l24-24a6,6,0,0,0,0-8.48l-24-24a6,6,0,0,0-8.48,8.48L217.52,66H200.94a70.16,70.16,0,0,0-57,29.31L142.78,97A6,6,0,0,0,144.18,105.35Zm-32.36,45.3a6,6,0,0,0-8.37,1.39l-1.19,1.67A58.11,58.11,0,0,1,55.06,178H32a6,6,0,0,0,0,12H55.06a70.16,70.16,0,0,0,57-29.31l1.19-1.67A6,6,0,0,0,111.82,150.65Z"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </div>

                                    {/* image */}
                                    <div className="image-box  overflow-hidden rounded-xl">
                                        <div className="group-hover:scale-110 transition-transform duration-500 ease-out">
                                            <img
                                                className="w-[120px] h-[120px] md:w-[200px] md:h-[200px] object-cover mx-auto"
                                                src={product.image}
                                                alt={product.alt || product.name}
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>

                                    {/* content */}
                                    <div className="space-y-10 flex flex-col justify-evenly ">
                                        <span className="mb-2 h-8 md:h-10 flex justify-between">
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-zinc-800 line-clamp-2">
                                                    {product.name}
                                                </p>

                                                <span className="text-xs text-zinc-500 line-clamp-2">
                                                    {product.englishName}
                                                </span>
                                            </div>
                                            {/* <div className="flex items-start gap-x-1 text-xs text-zinc-500">
                                                <span>
                                                    <span>({product.reviewCount}+)</span>
                                                    <span>{product.rating}</span>
                                                </span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#f9bc00" viewBox="0 0 256 256">
                                                    <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                                                </svg>
                                            </div> */}
                                        </span>

                                        <div className="bg-gray-100 rounded-xl py-2 px-2 flex  justify-between items-center group-hover:bg-gradient-to-r group-hover:from-gray-50 group-hover:to-gray-100 transition-all duration-500 ease-out">
                                            <div className="flex flex-col gap-y-2">
                                                {
                                                    product.discount
                                                        ?
                                                        <>
                                                            <div className="flex justify-center gap-x-1 font-semibold text-sm text-zinc-800">
                                                                <div>{formatPrice(calculateFinalPrice(+product.price, product.discount))}</div>
                                                                <div>{product.currency}</div>
                                                            </div>
                                                            <div className="flex justify-center gap-x-1 text-xs text-zinc-400">
                                                                <div className="line-through">{formatPrice(product.originalPrice)}</div>
                                                                <div className="line-through">{product.currency}</div>
                                                            </div>
                                                        </>
                                                        :
                                                        <div className="flex justify-center gap-x-1 font-semibold text-sm text-zinc-800">
                                                            <div>{formatPrice(product.originalPrice)}</div>
                                                            <div>{product.currency}</div>
                                                        </div>
                                                }
                                            </div>
                                            <div>
                                                <button
                                                    onClick={(e) => handleBuyClick(e, product.id)}
                                                    className="flex items-center gap-x-1 lg:text-sm text-xs py-2 px-2 rounded-lg text-white bg-red-500 hover:bg-red-400 hover:scale-105 hover:shadow-xl hover:shadow-red-500/60 transition-all duration-300 ease-out group-hover:animate-pulse"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ededed" viewBox="0 0 256 256">
                                                        <path d="M136,120v56a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0ZM239.86,98.11,226,202.12A16,16,0,0,1,210.13,216H45.87A16,16,0,0,1,30,202.12l-13.87-104A16,16,0,0,1,32,80H68.37L122,18.73a8,8,0,0,1,12,0L187.63,80H224a16,16,0,0,1,15.85,18.11ZM89.63,80h76.74L128,36.15ZM224,96H32L45.87,200H210.13Zm-51.16,23.2-5.6,56A8,8,0,0,0,174.4,184a7.44,7.44,0,0,0,.81,0,8,8,0,0,0,7.95-7.2l5.6-56a8,8,0,0,0-15.92-1.6Zm-89.68,0a8,8,0,0,0-15.92,1.6l5.6,56a8,8,0,0,0,8,7.2,7.44,7.44,0,0,0,.81,0,8,8,0,0,0,7.16-8.76Z"></path>
                                                    </svg>
                                                    <span className="hidden md:inline">خرید محصول</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="bg-red-400 w-full h-72 rounded-2xl -mt-60 relative"></div>

                <div className="hidden md:block">
                    <div className="swiper-btn-prev swiper-navbtn"></div>
                    <div className="swiper-btn-next swiper-navbtn"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductSlider;