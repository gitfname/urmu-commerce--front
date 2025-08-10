
import { useMediaQuery } from "@uidotdev/usehooks"
import { getFindManyAndCountProductsQueryQueryKey, useFindManyAndCountProductsQuery } from "../services/api/ecommerce--api"
import ProductSlider from "./ProductSlider/ProductSlider"
import { Env } from "../env"


/**
 * Calculates the final price after applying a discount
 * @param price - The original price
 * @param discount - The discount amount (can be percentage 0-100 or fixed amount)
 * @param isPercentage - Whether the discount is a percentage (default: true)
 * @returns The final price after discount
 */
function calculateFinalPrice(
    price: number,
    discount: number,
    isPercentage: boolean = true
): number {
    if (price < 0) {
        throw new Error('Price cannot be negative');
    }

    if (discount < 0) {
        throw new Error('Discount cannot be negative');
    }

    let finalPrice: number;

    if (isPercentage) {
        if (discount > 100) {
            throw new Error('Percentage discount cannot exceed 100%');
        }
        finalPrice = price - (price * discount / 100);
    } else {
        // Fixed amount discount
        finalPrice = price - discount;
    }

    // Ensure final price doesn't go below 0
    return Math.max(0, Math.round(finalPrice * 100) / 100);
}

// Usage examples:
// console.log(calculateFinalPrice(100, 20)); // 80 (20% discount)
// console.log(calculateFinalPrice(100, 15, false)); // 85 (15 fixed amount discount)
// console.log(calculateFinalPrice(50, 10)); // 45 (10% discount)


function NewestProductsSlider() {
    const isSm = useMediaQuery("only screen and (max-width : 640px)")
    const isMd = useMediaQuery("only screen and (max-width : 768px)")
    const isLg = useMediaQuery("only screen and (max-width : 1024px)")
    const isXl = useMediaQuery("only screen and (max-width : 1280px)")

    const products = useFindManyAndCountProductsQuery({
        limit: 12,
        skip: 0
    }, {
        query: {
            queryKey: getFindManyAndCountProductsQueryQueryKey({ limit: 12, skip: 0 }),
            refetchOnWindowFocus: false,
            retry: false
        }
    })

    return <ProductSlider
        title='جدیدترین'
        showCompareButton={false}
        showHeartButton={false}
        autoplay={false}
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
            originalPrice: +product.basePrice,
            price: +product.basePrice,
            href: "/products/" + product.id,
            currency: "تومان",
            image: Env.productThumbnailBaseUrl + product.thumbnailImage,
            rating: 0,
            reviewCount: 0,
            category: product.category?.title || ""
        })) || []}
    />
}

export default NewestProductsSlider