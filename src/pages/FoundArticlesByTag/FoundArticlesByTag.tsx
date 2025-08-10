import { useState } from "react";
import Pagination from "../Blog/Pagination";
import { getFindManyAndCountWeblogArticlesQueryQueryKey, useFindManyAndCountWeblogArticlesQuery } from "../../services/api/ecommerce--api";
import BlogCard from "../Blog/BlogCard";
import { Env } from "../../env";
import { estimateReadingTime } from "../../utils/estimateReadingTime";
import { useParams } from "react-router-dom";


function FoundArticlesByTag() {
    const { tag } = useParams<{ tag: string }>()
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // Calculate skip based on current page
    const skip = (currentPage - 1) * limit;

    const articles = useFindManyAndCountWeblogArticlesQuery({
        limit,
        skip,
        tag: tag?.replaceAll("-", " ")
        // other query params can be added here if needed:
        // order: "ASC" | "DESC"
        // title: str
    }, {
        query: {
            queryKey: getFindManyAndCountWeblogArticlesQueryQueryKey({ limit, skip, tag: tag?.replaceAll("-", " ") }),
            retry: 2,
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
        <div className="mt-20 md:mt-36">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5 mb-10">
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
}

export default FoundArticlesByTag