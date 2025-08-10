import { Link, useParams } from "react-router-dom"
import { getFindManyProductBrandsQueryQueryKey, useFindManyProductBrandsQuery } from "../services/api/ecommerce--api"
import { Env } from "../env"


const typeMappings = {
    phone: 31,
    "mobile-accessories": 50
}

function AvailableBrandOfCategory() {
    const { brandCategoryId, type } = useParams<{ brandCategoryId: string, type: string }>()

    const brands = useFindManyProductBrandsQuery({
        limit: 35,
        skip: 0,
        categoryIds: [brandCategoryId]
    }, {
        query: {
            queryKey: getFindManyProductBrandsQueryQueryKey({
                limit: 35,
                skip: 0,
                categoryIds: [brandCategoryId]
            }),
            retry: 2,
            refetchOnWindowFocus: false
        }
    })

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-20 md:mt-40 px-2">
            {
                brands?.data?.data?.data?.map(brand => (
                    <Link to={"/search?brand=" + brand.id + "&category=" + typeMappings[type]}>
                        <img
                            alt=""
                            loading="lazy"
                            src={Env.productBrands + brand.secondImage}
                            className="rounded-md"
                        />
                    </Link>

                ))
            }
        </div>
    )
}

export default AvailableBrandOfCategory