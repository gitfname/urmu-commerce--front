import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import BlogCard from './BlogCard';
import { getFindManyAndCountWeblogArticlesQueryQueryKey, useFindManyAndCountWeblogArticlesQuery } from '../../services/api/ecommerce--api';
import { Env } from '../../env';

const blogPosts = Array(6).fill({
    title: 'مزیت های یک ساعت هوشمند',
    image: 'assets/image/blog/3.jpg',
    readingTime: '2 دقیقه',
});

const BlogSlider: React.FC = () => {
    const latestArticles = useFindManyAndCountWeblogArticlesQuery({
        limit: 12,
        skip: 4
    }, {
        query: {
            queryKey: getFindManyAndCountWeblogArticlesQueryQueryKey({ limit: 12, skip: 4 }),
            retry: false,
            refetchOnWindowFocus: false
        }
    })

    return (
        <div className="mt-10 px-2 sm:px-6 md:px-16">
            <div className="flex justify-between px-5 md:px-10 items-center bg-white py-3 rounded-xl shadow-box">
                <div className="px-4 py-2 flex justify-center items-center gap-x-1 text-sm text-zinc-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#dc2626" viewBox="0 0 256 256">
                        <path d="M100,56H40A16,16,0,0,0,24,72v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,100,56Zm0,80H40V72h60ZM216,56H156a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,216,56Zm0,80H156V72h60Z"></path>
                    </svg>
                    <span className="text-red-500">جدیدترین مقالات</span>
                </div>
                {/* <a href="#">
                    <div className="transition px-4 py-2 flex justify-center items-center text-sm text-zinc-700 hover:text-zinc-600">
                        مشاهده همه
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#292929" viewBox="0 0 256 256">
                            <path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path>
                        </svg>
                    </div>
                </a> */}
            </div>
            <div className="containerPSlider swiper mb-10">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={1}
                    slidesPerView={1}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1.15 },
                        768: { slidesPerView: 3.5 },
                        1024: { slidesPerView: 4.5 },
                    }}
                    className="blog-slider px-1"
                >
                    {latestArticles?.data?.data?.data?.map((post, index) => (
                        <SwiperSlide key={index} className="my-2 p-2">
                            <BlogCard
                                title={post.title}
                                image={Env.weblogArticleThumbnailBaseUrl + post.thumbnailImage}
                                readingTime={"2 min"}
                                href={"/articles/" + post.slug}
                                summary=''
                            />
                        </SwiperSlide>
                    )) || <></>}
                </Swiper>

                <div className="bg-red-400 w-full h-72 rounded-2xl -mt-60 relative"></div>
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
            </div>
        </div>
    );
};

export default BlogSlider;