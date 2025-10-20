import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Env } from '../../env';
import { getFindManyProductBrandsQueryQueryKey, useFindManyPopularBrandsQuery } from '../../services/api/ecommerce--api';

// Types
interface PartnerCompany {
    id: string;
    name: string;
    image: string;
    href: string;
}

interface PartnerCompanySectionProps {
    companies?: PartnerCompany[];
    sectionTitle?: string;
    className?: string;
    autoplay?: boolean;
    autoplayDelay?: number;
}

// Star Icon Component
const StarIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <svg
        className={`fill-yellow-500 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="#121212"
        viewBox="0 0 256 256"
    >
        <path d="M196.89,130.94l-51.65-19a2,2,0,0,1-1.15-1.14l-19-51.66a13.92,13.92,0,0,0-26.12,0l-19,51.65a2,2,0,0,1-1.14,1.15l-51.66,19a13.92,13.92,0,0,0,0,26.12l51.65,19a2,2,0,0,1,1.15,1.14l19,51.66a13.92,13.92,0,0,0,26.12,0l19-51.65a2,2,0,0,1,1.14-1.15l51.66-19a13.92,13.92,0,0,0,0-26.12Zm-4.15,14.86-51.66,19a13.94,13.94,0,0,0-8.25,8.26l-19,51.65a1.92,1.92,0,0,1-3.6,0l-19-51.66a14,14,0,0,0-8.25-8.25h0l-51.65-19a1.92,1.92,0,0,1,0-3.6l51.66-19a13.94,13.94,0,0,0,8.25-8.26l19-51.65a1.92,1.92,0,0,1,3.6,0l19,51.66a13.94,13.94,0,0,0,8.26,8.25l51.65,19a1.92,1.92,0,0,1,0,3.6ZM146,40a6,6,0,0,1,6-6h18V16a6,6,0,0,1,12,0V34h18a6,6,0,0,1,0,12H182V64a6,6,0,0,1-12,0V46H152A6,6,0,0,1,146,40ZM246,88a6,6,0,0,1-6,6H230v10a6,6,0,0,1-12,0V94H208a6,6,0,0,1,0-12h10V72a6,6,0,0,1,12,0V82h10A6,6,0,0,1,246,88Z"></path>
    </svg>
);

// Individual Company Slide Component
interface CompanySlideProps {
    company: PartnerCompany;
    isLast: boolean;
}

const CompanySlide: React.FC<CompanySlideProps> = ({ company, isLast }) => {
    return (
        <Link
            to={company.href}
            className={`card swiper-slide my-2 ${!isLast ? 'border-l' : ''} p-2 sm:p-4`}
        >
            <img
                className="mx-auto"
                src={company.image}
                alt={company.name}
            />
        </Link>
    );
};

// Main Partner Company Section Component
const PartnerCompanySection: React.FC<PartnerCompanySectionProps> = ({
    companies,
    sectionTitle = 'محبوب ترین برند ها',
    className = '',
    autoplay = true,
    autoplayDelay = 3000
}) => {
    const swiperRef = useRef<SwiperType | undefined>(undefined);

    const swiperConfig = {
        modules: [FreeMode, Autoplay],
        spaceBetween: 0,
        slidesPerView: 'auto' as const,
        freeMode: true,
        loop: true,
        autoplay: autoplay ? {
            delay: autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        } : false,
        breakpoints: {
            320: {
                slidesPerView: 3,
            },
            640: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 5,
            },
            1024: {
                slidesPerView: 7,
            },
            1280: {
                slidesPerView: 9,
            }
        }
    };

    const brands = useFindManyPopularBrandsQuery({ skip: 0, limit: 12 }, {
        query: {
            queryKey: getFindManyProductBrandsQueryQueryKey({ skip: 0, limit: 12 }),
            retry: 2,
            refetchOnWindowFocus: false
        }
    })

    return (
        <div className={`bg-white my-10 rounded-2xl border ${className}`}>
            {/* Top companys header */}
            <div className="flex justify-center px-5 md:px-10 items-center bg-white py-3">
                <div className="px-4 py-2 flex justify-center items-center gap-x-2 text-lg text-zinc-700">
                    <StarIcon />
                    <span>{sectionTitle}</span>
                </div>
            </div>

            {/* Main companys slider */}
            <div className="containerPSlider swiper">
                <div className="partnetCompany px-1">
                    <Swiper
                        {...swiperConfig}
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        className="card-wrapper swiper-wrapper py-2 flex items-center"
                    >
                        {brands?.data?.data?.data?.map((company, index) => (
                            <SwiperSlide key={company.id} className='my-auto'>
                                <CompanySlide
                                    company={{
                                        id: company.id + "",
                                        href: company.linkUrl,
                                        image: Env.popularBrands + company.image,
                                        name: company.title
                                    }}
                                    isLast={index === companies?.length - 1}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default PartnerCompanySection;