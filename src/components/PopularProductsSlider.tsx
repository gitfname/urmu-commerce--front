import { useMediaQuery } from "@uidotdev/usehooks"
import { getFindManyAndCountProductsQueryQueryKey, useFindManyAndCountProductsQuery } from "../services/api/ecommerce--api"
import ProductSlider from "./ProductSlider/ProductSlider"
import { Env } from "../env"

function PopularProductsSlider() {
    const isSm = useMediaQuery("only screen and (max-width : 640px)")
    const isMd = useMediaQuery("only screen and (max-width : 768px)")
    const isLg = useMediaQuery("only screen and (max-width : 1024px)")
    const isXl = useMediaQuery("only screen and (max-width : 1280px)")

    const products = useFindManyAndCountProductsQuery({
        limit: 10,
        skip: 0,
        isFeatured: true
    }, {
        query: {
            queryKey: getFindManyAndCountProductsQueryQueryKey({ limit: 10, skip: 0, isFeatured: true }),
            refetchOnWindowFocus: false,
            retry: false
        }
    })

    // Don't render if no products or still loading
    if (products.isLoading || !products?.data?.data?.data || products.data.data.data.length === 0) {
        return null;
    }

    return <ProductSlider
        title='محصولات پرطرفدار'
        titleIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#dc2626" viewBox="0 0 256 256">
                <path d="M204.24,60.23l-144,144a6,6,0,0,1-8.48-8.48l144-144a6,6,0,1,1,8.48,8.49ZM52,100A34,34,0,1,1,76,110,33.78,33.78,0,0,1,52,100Zm2-24a22,22,0,1,0,6.44-15.56A21.86,21.86,0,0,0,54,76ZM214,180A34,34,0,1,1,204,156,33.78,33.78,0,0,1,214,180Zm-12,0a21.87,21.87,0,0,0-6.44-15.56h0A22,22,0,1,0,202,180Z"></path>
            </svg>
        }
        showCompareButton={false}
        showHeartButton={false}
        slidesPerView={
            isSm ? 1
                : isMd ? 1.8
                    : isLg ? 2.3
                        : isXl ? 3.85
                            : 4.8
        }
        products={products?.data?.data?.data?.map(product => ({
            id: product.id,
            name: product.title,
            discount: product.baseDiscount,
            englishName: product.summary,
            price: +product.basePrice,
            href: "/products/" + product.id,
            currency: "تومان",
            image: Env.productThumbnailBaseUrl + product.thumbnailImage,
            originalPrice: +product.basePrice,
            rating: 0,
            reviewCount: 0,
            category:  product.category?.title || ""
        })) || []}
    />
}

export default PopularProductsSlider
