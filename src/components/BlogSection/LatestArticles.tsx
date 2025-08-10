import { Env } from "../../env"
import { getFindManyAndCountWeblogArticlesQueryQueryKey, useFindManyAndCountWeblogArticlesQuery } from "../../services/api/ecommerce--api"
import { convertIsoToJalali } from "../../utils/convertIsoToJalali"
import BlogSection from "./BlogSection"

function LatestArticles() {
    const latestArticles = useFindManyAndCountWeblogArticlesQuery({
        limit: 8
    }, {
        query: {
            queryKey: getFindManyAndCountWeblogArticlesQueryQueryKey({ limit: 8 }),
            retry: false,
            refetchOnWindowFocus: false
        }
    })

    return (
        <BlogSection
            posts={latestArticles?.data?.data?.data?.map(article => {
                const date = convertIsoToJalali(article.createdAt)

                return {
                    id: article.id,
                    title: article.title,
                    image: Env.weblogArticleThumbnailBaseUrl + article.thumbnailImage,
                    category: article.category?.title,
                    href: "/articles/" + article.slug,
                    date: {
                        day: date.day,
                        month: date.month
                    }
                }
            }) || []}
        />
    )
}

export default LatestArticles