import { Env } from "../env"
import { getFindManyProductCategoriesQueryQueryKey, useFindManyProductCategoriesQuery } from "../services/api/ecommerce--api"
import CategoryGrid2 from "./CategoryGrid2/CategoryGrid2"

function Categories() {
    const categories = useFindManyProductCategoriesQuery({
        limit: 12,
        skip: 0,
        isPrimary: true
    }, {
        query: {
            queryKey: getFindManyProductCategoriesQueryQueryKey({ limit: 12, skip: 0, isPrimary: true }),
            retry: 1,
            refetchOnWindowFocus: false
        }
    })

    return (
        <CategoryGrid2
            categories={categories?.data?.data?.data?.map(category => ({
                id: category.id + "",
                href: "/search?category=" + category.id,
                image: Env.productCategoryImage + category.image,
                name: category.title
            })) || []}
        />
    )
}

export default Categories