import { useMediaQuery } from '@uidotdev/usehooks';
import React, { lazy, Suspense } from 'react';
import CategoryGrid2 from '../components/CategoryGrid2/CategoryGrid2';
import HeroSlider from '../components/HeroSlider/HeroSlider';
import MostDiscountedProductsSlider from '../components/MostDiscountedProductsSlider';
import NewestProductsSlider from '../components/NewestProductsSlider';
import ProductSlider from '../components/ProductSlider/ProductSlider';
import { Env } from '../env';
import { getFindManyApplicationBannersQueryQueryKey, useFindManyApplicationBannersQuery } from '../services/api/ecommerce--api';
// import PartnerCompanySection from '../components/PartnerCompanySection/PartnerCompanySection';
// import LatestArticles from '../components/BlogSection/LatestArticles';
// import Categories from '../components/Categories';
// import CompanyDescription from '../components/CompanyDescription';
// const MostDiscountedProductsSlider = lazy(() => import("../components/MostDiscountedProductsSlider"))
// const PartnerCompanySection = lazy(() => import("../components/PartnerCompanySection/PartnerCompanySection"))
// const LatestArticles = lazy(() => import("../components/BlogSection/LatestArticles"))
const Categories = lazy(() => import("../components/Categories"))
// const CompanyDescription = lazy(() => import("../components/CompanyDescription"))


const Home: React.FC = () => {
    const isSm = useMediaQuery("only screen and (max-width : 640px)")
    const isMd = useMediaQuery("only screen and (max-width : 768px)")
    const isLg = useMediaQuery("only screen and (max-width : 1024px)")
    const isXl = useMediaQuery("only screen and (max-width : 1280px)")

    const homeBanners1 = useFindManyApplicationBannersQuery({
        skip: 0,
        group: "home-banners-1"
    }, {
        query: {
            queryKey: getFindManyApplicationBannersQueryQueryKey({ group: "home-banners-1", skip: 0 }),
            retry: 2,
            refetchOnWindowFocus: false
        }
    })

    return (
        <div className='max-md:mt-20'>
            <HeroSlider />


            <section className='my-10'>
                <div className='grid grid-cols-2 gap-5'>
                    {
                        homeBanners1?.data?.data?.data?.slice(0, 2).map(banner => (
                            <a href={banner.linkUrl} key={banner.id}>
                                <img
                                    alt={banner.title || ""}
                                    src={Env.applicationBanners + banner.image}
                                    className='rounded-xl max-sm:min-h-28 object-cover object-center w-full h-full'
                                />
                            </a>
                        ))
                    }
                    
                    {/* Fallback: If no banners from API, show placeholder images */}
                    {(!homeBanners1?.data?.data?.data || homeBanners1?.data?.data?.data?.length === 0) && (
                        <>
                            <div className='bg-gray-200 rounded-xl min-h-28 flex items-center justify-center'>
                                <span className='text-gray-500 text-sm'>بنر 1</span>
                            </div>
                            <div className='bg-gray-200 rounded-xl min-h-28 flex items-center justify-center'>
                                <span className='text-gray-500 text-sm'>بنر 2</span>
                            </div>
                        </>
                    )}
                    
                    {/* If only one banner, show placeholder for second */}
                    {homeBanners1?.data?.data?.data?.length === 1 && (
                        <div className='bg-gray-200 rounded-xl min-h-28 flex items-center justify-center'>
                            <span className='text-gray-500 text-sm'>بنر 2</span>
                        </div>
                    )}
                </div>
            </section>

            <section className='max-w-[1500px] mx-auto px-3 xl:px-5'>
                {/* <AmazingSlider
                    slidesPerView={
                        isSm ? 2.15
                            : isMd ? 2.8
                                : isLg ? 3.8
                                    : isXl ? 5.4
                                        : 7.2
                    }
                    autoplay={false}
                /> */}

                {/* <ProductSlider
                    title='جدیدترین'
                    slidesPerView={
                        isSm ? 1
                            : isMd ? 1.8
                                : isLg ? 2.3
                                    : isXl ? 3.85
                                        : 4.8
                    }
                /> */}

                <NewestProductsSlider />

                {/* <CategoryGrid /> */}

                {/* <OffSlider
                    products={[
                        {
                            id: '1',
                            image: 'assets/image/products/1.webp',
                            title: 'لپ تاپ لنوو مدل Le740 s plus مخصوص گیم',
                            subtitle: 'Lenovo Le740 s plus gaming',
                            currentPrice: '24,400,000',
                            originalPrice: '27,600,000',
                            features: [
                                { icon: '', text: 'طراحی زیبا' },
                                { icon: '', text: 'کارت گرافیک قدرتمند' },
                                { icon: '', text: 'حافظه SSD' },
                                { icon: '', text: 'صفحه نمایش لمسی' }
                            ],
                            endDate: 'July 29, 2025 08:00:00',
                            href: '#'
                        },
                        {
                            id: '2',
                            image: 'assets/image/products/2.webp',
                            title: 'لپ تاپ لنوو مدل Le740 s plus مخصوص گیم',
                            subtitle: 'Lenovo Le740 s plus gaming',
                            currentPrice: '24,400,000',
                            originalPrice: '27,600,000',
                            features: [
                                { icon: '', text: 'طراحی زیبا' },
                                { icon: '', text: 'کارت گرافیک قدرتمند' },
                                { icon: '', text: 'حافظه SSD' },
                                { icon: '', text: 'صفحه نمایش لمسی' }
                            ],
                            endDate: 'July 29, 2025 12:00:00',
                            href: '#'
                        },
                        {
                            id: '3',
                            image: 'assets/image/products/3.webp',
                            title: 'لپ تاپ لنوو مدل Le740 s plus مخصوص گیم',
                            subtitle: 'Lenovo Le740 s plus gaming',
                            currentPrice: '24,400,000',
                            originalPrice: '27,600,000',
                            features: [
                                { icon: '', text: 'طراحی زیبا' },
                                { icon: '', text: 'کارت گرافیک قدرتمند' },
                                { icon: '', text: 'حافظه SSD' },
                                { icon: '', text: 'صفحه نمایش لمسی' }
                            ],
                            endDate: 'July 29, 2025 21:00:00',
                            href: '#'
                        },
                    ]}
                /> */}

              

                <CategoryGrid2
                    categories={[
                        {
                            id: '1',
                            name: 'لگو پسرانه',
                            image: 'https://asbab-bazi.com/wp-content/uploads/2021/11/lego-icon-8.png',
                            href: '#'
                        },
                        {
                            id: '2',
                            name: 'لگو دخترانه',
                            image: 'https://asbab-bazi.com/wp-content/uploads/2021/11/lego-icon-9.png',
                            href: '#'
                        },
                        {
                            id: '3',
                            name: 'ربات حرفه‌ای',
                            image: 'https://asbab-bazi.com/wp-content/uploads/2024/11/2-min-393x400-min.jpg',
                            href: '#'
                        },
                        {
                            id: '4',
                            name: 'تفنگ حرفه‌ای',
                            image: 'https://asbab-bazi.com/wp-content/uploads/2024/05/1-min.png',
                            href: '#'
                        },
                        {
                            id: '5',
                            name: 'اکشن فیگور',
                            image: 'https://asbab-bazi.com/wp-content/uploads/2024/05/5-min.png',
                            href: '#'
                        },
                        {
                            id: '6',
                            name: 'ماشین فلزی',
                            image: '	https://asbab-bazi.com/wp-content/uploads/2024/11/110-min-min.jpg',
                            href: '#'
                        },
                        {
                            id: '7',
                            name: 'ماشین کنترلی',
                            image: 'https://asbab-bazi.com/wp-content/uploads/2024/10/10.jpg',
                            href: '#'
                        },
                        {
                            id: '8',
                            name: 'کوادکوپتر',
                            image: 'https://asbab-bazi.com/wp-content/uploads/2024/10/9.jpg',
                            href: '#'
                        },
                        {
                            id: '9',
                            name: 'هلیکوپتر کنترلی',
                            image: 'https://asbab-bazi.com/wp-content/uploads/2024/11/65_71_11zon-1-min.jpg',
                            href: '#'
                        },
                        {
                            id: '10',
                            name: 'هواپیما کنترلی',
                            image: '	https://asbab-bazi.com/wp-content/uploads/2024/11/49-min-1-min-1.jpg',
                            href: '#'
                        },
                        {
                            id: '11',
                            name: 'قایق کنترلی',
                            image: '		https://asbab-bazi.com/wp-content/uploads/2024/10/8.jpg',
                            href: '#'
                        },
                        {
                            id: '12',
                            name: 'عروسک پولیشی',
                            image: 'https://asbab-bazi.com/wp-content/uploads/2024/05/0-min-400x400.png',
                            href: '#'
                        }
                    ]}
                />

                <Suspense>
                    <Categories />
                </Suspense>

                <ProductSlider
                    title='پرتخفیف ترین'
                    titleIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#dc2626" viewBox="0 0 256 256">
                            <path d="M204.24,60.23l-144,144a6,6,0,0,1-8.48-8.48l144-144a6,6,0,1,1,8.48,8.49ZM52,100A34,34,0,1,1,76,110,33.78,33.78,0,0,1,52,100Zm2-24a22,22,0,1,0,6.44-15.56A21.86,21.86,0,0,0,54,76ZM214,180A34,34,0,1,1,204,156,33.78,33.78,0,0,1,214,180Zm-12,0a21.87,21.87,0,0,0-6.44-15.56h0A22,22,0,1,0,202,180Z"></path>
                        </svg>
                    }
                    slidesPerView={
                        isSm ? 1
                            : isMd ? 1.8
                                : isLg ? 2.3
                                    : isXl ? 3.85
                                        : 4.8
                    }
                />

                <Suspense>
                    <MostDiscountedProductsSlider />
                </Suspense>

                {/* <BlogSection
                    posts={[
                        {
                            id: '1',
                            title: 'بررسی ساعت هوشمند گلوریمی M1 پرو',
                            category: 'ساعت هوشمند',
                            categoryHref: '#',
                            image: 'assets/image/blog/1.jpg',
                            date: {
                                day: '04',
                                month: 'فروردین'
                            },
                            href: '#',
                            readMoreText: 'مطالعه بیشتر'
                        },
                        {
                            id: '2',
                            title: 'پختن تاکو مثل خود مکزیکی ها',
                            category: 'غذا و نوشیدنی',
                            categoryHref: '#',
                            image: 'assets/image/blog/2.jpg',
                            date: {
                                day: '06',
                                month: 'فروردین'
                            },
                            href: '#'
                        },
                        {
                            id: '3',
                            title: 'فواید استفاده از چند مانیتور همزمان',
                            category: 'کالای دیجیتال',
                            categoryHref: '#',
                            image: 'assets/image/blog/3.jpg',
                            date: {
                                day: '12',
                                month: 'فروردین'
                            },
                            href: '#'
                        },
                        {
                            id: '4',
                            title: 'چه رنگی رو برای آشپزخانه استفاده کنیم؟',
                            category: 'خانه و آشپرخانه',
                            categoryHref: '#',
                            image: 'assets/image/blog/4.jpg',
                            date: {
                                day: '03',
                                month: 'اردیبهشت'
                            },
                            href: '#'
                        }
                    ]}
                /> */}

                {/* <section className='mt-10'>
                    <Suspense>
                        <LatestArticles />
                    </Suspense>
                </section>

                <Suspense>
                    <PartnerCompanySection />
                </Suspense>

                <section className='mb-3'>
                    <Suspense>
                        <CompanyDescription />
                    </Suspense>
                </section> */}
            </section>
        </div >
    );
};

export default Home;