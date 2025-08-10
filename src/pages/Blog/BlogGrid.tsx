import React, { useState } from 'react';
import BlogCard from './BlogCard';
import Pagination from './Pagination';
import { getFindManyAndCountWeblogArticlesQueryQueryKey, useFindManyAndCountWeblogArticlesQuery } from '../../services/api/ecommerce--api';
import { Env } from '../../env';
import { estimateReadingTime } from '../../utils/estimateReadingTime';

const BlogGrid: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // Calculate skip based on current page
    const skip = (currentPage - 1) * limit;

    const articles = useFindManyAndCountWeblogArticlesQuery({
        limit,
        skip,
        // other query params can be added here if needed:
        // order: "ASC" | "DESC"
        // title: str
    }, {
        query: {
            queryKey: getFindManyAndCountWeblogArticlesQueryQueryKey({ limit, skip }),
            retry: false,
            refetchOnWindowFocus: false
        }
    });

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // window.scrollTo(0, 0); // Scroll to top on page change
    };

    // Extract total count for pagination (adjust based on your API response structure)
    const totalItems = articles?.data?.data?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5 mt-5 mb-10">
                {articles?.data?.data?.data?.length > 0 ? (
                    articles.data.data.data.map((post, index) => (
                        <BlogCard
                            key={index}
                            title={post.title}
                            image={Env.weblogArticleThumbnailBaseUrl + post.thumbnailImage}
                            readingTime={estimateReadingTime(post.content)}
                            summary={post.summary}
                            href={"/articles/" + post.slug}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        مقاله ای یافت نشد
                    </p>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default BlogGrid;


















// import React from 'react';
// import BlogCard from './BlogCard';
// import Pagination from './Pagination';
// import { getFindManyAndCountWeblogArticlesQueryQueryKey, useFindManyAndCountWeblogArticlesQuery } from '../../services/api/ecommerce--api';
// import { Env } from '../../env';

// const BlogGrid: React.FC = () => {
//     const articles = useFindManyAndCountWeblogArticlesQuery({
//         limit: 10,

//         // other query params :
//         // order: "ASC" | "DESC"
//         // skip: int
//         // title: str
//     }, {
//         query: {
//             queryKey: getFindManyAndCountWeblogArticlesQueryQueryKey({ limit: 10 }),
//             retry: 2,
//             refetchOnWindowFocus: false
//         }
//     })

//     return (
//         <div>
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5 mt-5 mb-10">
//                 {articles?.data?.data?.data?.map((post, index) => (
//                     <BlogCard
//                         key={index}
//                         title={post.title}
//                         image={Env.weblogArticleThumbnailBaseUrl + post.thumbnailImage}
//                         readingTime={""}
//                     />
//                 ))}
//             </div>

//             <Pagination />
//         </div>
//     );
// };

// export default BlogGrid;