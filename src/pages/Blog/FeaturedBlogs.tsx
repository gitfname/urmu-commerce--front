import React from 'react';
import { getFindManyAndCountWeblogArticlesQueryQueryKey, useFindManyAndCountWeblogArticlesQuery } from '../../services/api/ecommerce--api';
import { Env } from '../../env';
import { convertIsoToJalali } from '../../utils/convertIsoToJalali';
import { BlogCard } from '../../components/BlogSection/BlogSection';

const FeaturedBlogs: React.FC = () => {
    const latestArticles = useFindManyAndCountWeblogArticlesQuery({
        limit: 4
    }, {
        query: {
            queryKey: getFindManyAndCountWeblogArticlesQueryQueryKey({ limit: 4 }),
            retry: 2,
            refetchOnWindowFocus: false
        }
    })

    return (
        <div className="rounded-2xl mx-auto text-gray-100 mt-5">
            <div className="flex flex-col md:flex-row gap-5">
                {latestArticles?.data?.data?.data?.map((post, index) => {
                    const date = convertIsoToJalali(post.createdAt)

                    return (
                        <BlogCard
                            post={{
                                id: post.id,
                                category: post?.category?.title,
                                date: {
                                    day: date.day,
                                    month: date.month
                                },
                                href: "/articles/" + post.slug,
                                image: Env.weblogArticleThumbnailBaseUrl + post.thumbnailImage,
                                title: post.title
                            }}
                        />
                    )
                })}
            </div>
        </div>
    );
};

export default FeaturedBlogs;