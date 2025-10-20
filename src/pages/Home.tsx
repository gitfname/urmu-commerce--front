import React, { lazy, Suspense } from 'react';
// import CategoryGrid2 from '../components/CategoryGrid2/CategoryGrid2';
import HeroSlider from '../components/HeroSlider/HeroSlider';
import MostDiscountedProductsSlider from '../components/MostDiscountedProductsSlider';
import NewestProductsSlider from '../components/NewestProductsSlider';
import PopularProductsSlider from '../components/PopularProductsSlider';
import Story from '../components/Story';
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
  

    return (
        <div className=''>
            <Story />
            <HeroSlider />
            <section className='my-10'>
                
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





                <Suspense>
                    <Categories />
                </Suspense>

                {/* Categories moved above, sourced from API */}

                <PopularProductsSlider />

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