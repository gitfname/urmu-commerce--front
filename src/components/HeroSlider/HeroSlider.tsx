import React from 'react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Env } from '../../env';
import { getFindManyHeroBannersQueryQueryKey, useFindManyHeroBannersQuery } from '../../services/api/ecommerce--api';



interface HeroSliderProps {
    autoplay?: boolean;
    autoplayDelay?: number;
}

const HeroSlider: React.FC<HeroSliderProps> = ({
    autoplay = true,
    autoplayDelay = 500000000
}) => {
    const swiperConfig = {
        modules: [Navigation, Pagination, Autoplay, EffectFade],
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        autoplay: autoplay ? {
            delay: autoplayDelay,
            disableOnInteraction: false,
        } : false,
        loop: true,
        speed: 1000,
        grabCursor: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    };

    const slidesQuery = useFindManyHeroBannersQuery(undefined, {
        query: {
            queryKey: getFindManyHeroBannersQueryQueryKey(undefined),
            retry: 3,
            refetchOnWindowFocus: false
        }
    })

    const animatedSlideStyles = "transition-all duration-700 ease-in-out";
    const slideContentStyles = "absolute inset-0 flex flex-col justify-center items-start ";
    const slideTextStyles = "transform transition-transform duration-700 delay-300";
    
    return (
        <div className="relative w-full lg:w-[95%] mx-auto">
            
            {/* Desktop Slider */}
            <div className="heroSlider hidden md:block overflow-hidden">
                <Swiper {...swiperConfig} className="swiper h-[31.25rem]">
                    {slidesQuery?.data?.data?.data?.map((slide) => (
                        <SwiperSlide key={`desktop-${slide.id}`} className="swiper-slide h-[31.25rem] rounded-lg overflow-hidden">
                            <a href={slide.linkUrl || "#"} className="relative w-full h-full block rounded-lg overflow-hidden">
                                <div className="relative w-full h-full">
                                    <img
                                        src={Env.heroBanners + slide.image}
                                        alt={slide.linkUrl}
                                        loading="lazy"
                                        className={`lg:object-cover object-fill w-full h-full ${animatedSlideStyles} hover:scale-105`}
                                    />
                                    <div className={`${slideContentStyles}`}>
                                        <div className={`${slideTextStyles} translate-x-[50px] opacity-0 swiper-slide-active:translate-x-0 swiper-slide-active:opacity-100`}>
                                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                                {"پیشنهاد ویژه"}
                                            </h2>
                                            <p className="text-lg text-white/80 mb-6">
                                                {"محصولات با کیفیت و قیمت مناسب"}
                                            </p>
                                            <div className="inline-block bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all transform hover:-translate-y-1">
                                                خرید کنید
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}

                    <div className="swiper-button-next after:text-red-500 after:text-2xl"></div>
                    <div className="swiper-button-prev after:text-red-500 after:text-2xl"></div>
                    <div className="swiper-pagination"></div>
                </Swiper>
            </div>

            {/* Mobile Slider */}
            <div className="heroSlider md:hidden overflow-hidden">
                <Swiper {...swiperConfig} className="swiper h-[200px]">
                    {slidesQuery?.data?.data?.data?.map((slide) => (
                        <SwiperSlide key={`mobile-${slide.id}`} className="swiper-slide px-4 h-[200px] overflow-hidden">
                            <a href={slide.linkUrl || "#"} className="relative w-full h-full block rounded-lg overflow-hidden">
                                <div className="relative w-full h-full">
                                    <img
                                        src={Env.heroBanners + slide.image}
                                        alt={slide.linkUrl}
                                        loading="lazy"
                                        className={`rounded-lg object-fill w-full h-full ${animatedSlideStyles}`}
                                    />
                                    <div className={`${slideContentStyles}`}>
                                        <div className={`${slideTextStyles} translate-x-[30px] opacity-0 swiper-slide-active:translate-x-0 swiper-slide-active:opacity-100`}>
                                            <h2 className="text-2xl font-bold text-white mb-2">
                                                {"پیشنهاد ویژه"}
                                            </h2>
                                            <p className="text-sm text-white/80 mb-4">
                                                {"محصولات با کیفیت و قیمت مناسب"}
                                            </p>
                                            <div className="inline-block bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-lg text-sm">
                                                خرید کنید
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}

                    <div className="swiper-button-next after:text-red-500 after:text-xl"></div>
                    <div className="swiper-button-prev after:text-red-500 after:text-xl"></div>
                    <div className="swiper-pagination"></div>
                </Swiper>
            </div>
        </div>
    );
};

// Default slides data


export default HeroSlider;