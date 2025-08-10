import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getFindManyHeroBannersQueryQueryKey, useFindManyHeroBannersQuery } from '../../services/api/ecommerce--api';
import { Env } from '../../env';

interface SlideData {
    id: number;
    desktopImage: string;
    mobileImage: string;
    alt: string;
    href?: string;
}

interface HeroSliderProps {
    slides?: SlideData[];
    autoplay?: boolean;
    autoplayDelay?: number;
}

const HeroSlider: React.FC<HeroSliderProps> = ({
    slides = defaultSlides,
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
const defaultSlides: SlideData[] = [
    {
        id: 1,
        desktopImage: "https://cdnfa.com/piccotoys/17bc/files/normal/12371531.jpg",
        mobileImage: "assets/image/heroSlider/1m.png",
        alt: "Hero Slide 1"
    },
    {
        id: 2,
        desktopImage: "assets/image/heroSlider/2.webp",
        mobileImage: "assets/image/heroSlider/2m.png",
        alt: "Hero Slide 2"
    },
    {
        id: 3,
        desktopImage: "assets/image/heroSlider/3.webp",
        mobileImage: "assets/image/heroSlider/3m.png",
        alt: "Hero Slide 3"
    },
    {
        id: 4,
        desktopImage: "assets/image/heroSlider/4.webp",
        mobileImage: "assets/image/heroSlider/4m.png",
        alt: "Hero Slide 4"
    },
    {
        id: 5,
        desktopImage: "assets/image/heroSlider/5.webp",
        mobileImage: "assets/image/heroSlider/5m.png",
        alt: "Hero Slide 5"
    }
];

export default HeroSlider;