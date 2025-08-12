import React from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Env } from '../../env';
import { getFindManyHeroBannersQueryQueryKey, useFindManyHeroBannersQuery } from '../../services/api/ecommerce--api';



interface HeroSliderProps {
    autoplay?: boolean;
    autoplayDelay?: number;
}

const HeroSlider: React.FC<HeroSliderProps> = ({
    autoplay = true,
    autoplayDelay = 5000
}) => {
    const swiperConfig = {
        modules: [Navigation, Pagination, Autoplay],
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: autoplay ? {
            delay: autoplayDelay,
            disableOnInteraction: false,
        } : false,
        loop: true,
        speed: 800,
    };

    const slidesQuery = useFindManyHeroBannersQuery(undefined, {
        query: {
            queryKey: getFindManyHeroBannersQueryQueryKey(undefined),
            retry: 3,
            refetchOnWindowFocus: false
        }
    })

    return (
        <div className="mt-9 ">
            {/* Desktop Slider */}
            <div className="heroSlider hidden md:block">
                <Swiper {...swiperConfig} className="swiper">
                    {slidesQuery?.data?.data?.data?.map((slide) => (
                        <SwiperSlide key={`desktop-${slide.id}`} className="swiper-slide">
                            <a href={slide.linkUrl || "#"}>
                                <img
                                    src={Env.heroBanners + slide.image}
                                    alt={slide.linkUrl}
                                    loading="lazy"
                                    className=' object-cover w-full'
                                />
                            </a>
                        </SwiperSlide>
                    ))}

                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-pagination"></div>
                </Swiper>
            </div>

            {/* Mobile Slider */}
            <div className="heroSlider md:hidden">
                <Swiper {...swiperConfig} className="swiper">
                    {slidesQuery?.data?.data?.data?.map((slide) => (
                        <SwiperSlide key={`mobile-${slide.id}`} className="swiper-slide px-4">
                            <a href={slide.linkUrl || "#"}>
                                <img
                                    className="rounded-lg min-h-28 object-cover"
                                    src={Env.heroBanners + slide.image}
                                    alt={slide.linkUrl}
                                    loading="lazy"
                                />
                            </a>
                        </SwiperSlide>
                    ))}

                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-pagination"></div>
                </Swiper>
            </div>
        </div>
    );
};

    // Default slides data


export default HeroSlider;