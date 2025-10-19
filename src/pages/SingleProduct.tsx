import React, { useState, useEffect } from 'react';
import ServicesGrid from '../components/ServicesGrid/ServicesGrid';
import { Link, useParams } from 'react-router-dom';
import { HeartIcon as LucideHeartIcon } from "lucide-react"

// Types
interface ProductImage {
    src: string;
    alt: string;
}
interface ProductFeature {
    label: string;
    value: string;
}
interface Review {
    id: string;
    title: string;
    date: string;
    author: string;
    isRecommended: boolean;
    content: string;
    isPurchaser: boolean;
}
interface Question {
    id: string;
    date: string;
    author: string;
    content: string;
}

// API Response Types
interface ApiProduct {
    id: number;
    title: string;
    slug: string;
    summary: string;
    basePrice: string;
    baseDiscount: number;
    stockQuantity: number;
    hasVariants: boolean;
    thumbnailImage: string;
    images: string[];
    category?: {
        id: number;
        title: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

// NEW: Favorite Product API Response Type
interface FavoriteProduct {
    id: number;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        isPhoneVerified: number;
        role: string;
    };
    product: ApiProduct;
    createdAt: string;
    updatedAt: string;
}

interface ProductVariants {
    [key: string]: string[];
}
interface VariantAvailability {
    available: boolean;
    price: number | string | null;
    discount: number;
    stockQuantity: number;
    variantId: number | null;
}
interface SingleProductPageProps {
    breadcrumbs?: Array<{
        title: string;
        href: string;
        isActive?: boolean;
    }>;
    reviews?: Review[];
    questions?: Question[];
}

const SingleProductPage: React.FC<SingleProductPageProps> = ({
    breadcrumbs = [],
    reviews = [],
    questions = []
}) => {
    const { id } = useParams<{ id: string }>()

    // State
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [variants, setVariants] = useState<ProductVariants>({});
    const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
    const [currentVariantInfo, setCurrentVariantInfo] = useState<VariantAvailability | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'specifications' | 'comments' | 'questions'>('specifications');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // NEW: Favorites state
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState<number | null>(null);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    // API Base URL
    const API_BASE_URL = 'http://localhost:3000';

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/products/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const productData: ApiProduct = await response.json();
                setProduct(productData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchProduct();
        }
    }, [id]);

    // NEW: Check if product is in favorites
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!product?.id) return;

            try {
                const response = await fetch(`${API_BASE_URL}/favorite-products/check-is-my-favorite/${product.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    },
                });

                if (response.ok) {
                    const favoriteData: FavoriteProduct = await response.json();
                    setIsFavorite(true);
                    setFavoriteId(favoriteData.id);
                    console.log("yes it is favorites")
                } else if (response.status === 404) {
                    // Product is not in favorites
                    setIsFavorite(false);
                    setFavoriteId(null);
                    console.log("not it is not favorites")
                } else {
                    console.error('Error checking favorite status');
                }
            } catch (err) {
                console.error('Error checking favorite status:', err);
            }
        };

        checkFavoriteStatus();
    }, [product]);

    // Fetch product variants
    useEffect(() => {
        const fetchVariants = async () => {
            if (!product?.hasVariants) return;
            try {
                const response = await fetch(`${API_BASE_URL}/product-variants/properties?productId=${product.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch variants');
                }
                const variantsData: ProductVariants = await response.json();
                setVariants(variantsData);
                // Initialize selected variants with first option of each variant type
                const initialSelection: { [key: string]: string } = {};
                Object.keys(variantsData).forEach(key => {
                    if (variantsData[key].length > 0) {
                        initialSelection[key] = variantsData[key][0];
                    }
                });
                setSelectedVariants(initialSelection);
            } catch (err) {
                console.error('Error fetching variants:', err);
            }
        };
        if (product) {
            fetchVariants();
        }
    }, [product]);

    // Check variant availability when selection changes
    useEffect(() => {
        const checkVariantAvailability = async () => {
            if (!product?.hasVariants || Object.keys(selectedVariants).length === 0) {
                // For products without variants, use base product info
                if (product) {
                    setCurrentVariantInfo({
                        available: product.stockQuantity > 0,
                        price: product.basePrice,
                        discount: product.baseDiscount || 0,
                        stockQuantity: product.stockQuantity,
                        variantId: null
                    });
                }
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/product-variants/check-availability?productId=${product.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        properties: selectedVariants
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to check variant availability');
                }
                const availabilityData: VariantAvailability = await response.json();
                setCurrentVariantInfo(availabilityData);
            } catch (err) {
                console.error('Error checking variant availability:', err);
            }
        };
        checkVariantAvailability();
    }, [selectedVariants, product]);

    // Event handlers
    const handleImageChange = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleVariantSelect = (variantType: string, value: string) => {
        setSelectedVariants(prev => {
            // Check if the current variant option is already selected
            if (prev[variantType] === value) {
                // If it is, we want to unselect it by removing it from the state.
                const newSelection = { ...prev };
                delete newSelection[variantType];
                return newSelection;
            } else {
                // If it's a new selection or a different option for this type, update it.
                return {
                    ...prev,
                    [variantType]: value
                };
            }
        });
    };

    // NEW: Handle favorite toggle
    const handleFavoriteToggle = async () => {
        if (!product?.id || favoriteLoading) return;

        setFavoriteLoading(true);

        try {
            if (isFavorite && favoriteId) {
                // Remove from favorites
                const response = await fetch(`${API_BASE_URL}/favorite-products/my-favorites/${favoriteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    },
                });

                if (response.ok) {
                    setIsFavorite(false);
                    setFavoriteId(null);
                    // Optional: Show success message
                    console.log('محصول از علاقه‌مندی‌ها حذف شد');
                } else {
                    throw new Error('Failed to remove from favorites');
                }
            } else {
                // Add to favorites
                const response = await fetch(`${API_BASE_URL}/favorite-products/add-to-my-favorites?productId=${product.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + localStorage.getItem("access_token")
                    },
                });

                if (response.ok) {
                    const favoriteData: FavoriteProduct = await response.json();
                    setIsFavorite(true);
                    setFavoriteId(favoriteData.id);
                    // Optional: Show success message
                    console.log('محصول به علاقه‌مندی‌ها اضافه شد');
                } else {
                    throw new Error('Failed to add to favorites');
                }
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
            // Optional: Show error message to user
            alert('خطا در انجام عملیات');
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product || !currentVariantInfo?.available) return;
        try {
            // You can implement add to cart API call here
            console.log('Adding to cart:', {
                productId: product.id,
                variantId: currentVariantInfo.variantId,
                selectedVariants,
                price: currentVariantInfo.price,
                discount: currentVariantInfo.discount,
                finalPrice: calculateFinalPrice(currentVariantInfo.price || 0, currentVariantInfo.discount),
                stockQuantity: currentVariantInfo.stockQuantity
            });
            alert('محصول به سبد خرید اضافه شد');
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('خطا در افزودن به سبد خرید');
        }
    };

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return numPrice.toLocaleString('fa-IR');
    };

    const calculateFinalPrice = (price: number | string, discount: number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        const discountAmount = (numPrice * discount) / 100;
        return numPrice - discountAmount;
    };

    const calculateDiscountAmount = (price: number | string, discount: number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return (numPrice * discount) / 100;
    };

    // Helper function to convert product data to component format
    const getProductImages = (): ProductImage[] => {
        if (!product) return [];
        return product.images.map((img, index) => ({
            src: img,
            alt: `${product.title} - تصویر ${index + 1}`
        }));
    };

    const getColorClass = (colorName: string): string => {
        // Map color names to Tailwind CSS classes
        const colorMap: { [key: string]: string } = {
            'red': 'bg-red-500',
            'green': 'bg-green-500',
            'blue': 'bg-blue-500',
            'yellow': 'bg-yellow-500',
            'black': 'bg-black',
            'white': 'bg-white border',
            'gray': 'bg-gray-500',
            'purple': 'bg-purple-500',
        };
        return colorMap[colorName.toLowerCase()] || 'bg-gray-300';
    };

    // UPDATED: Heart Icon with dynamic styling
    const HeartIcon = (
        <LucideHeartIcon
            width={26}
            height={26}
            strokeWidth={1.35}
            className={isFavorite ? "fill-red-500 stroke-red-500" : "stroke-zinc-700 fill-transparent"}
        />
    );
    const CompareIcon = (
        <svg className="fill-zinc-700 hover:fill-zinc-800 transition" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#000000" viewBox="0 0 256 256">
            <path d="M112,152a8,8,0,0,0-8,8v28.69L75.72,160.4A39.71,39.71,0,0,1,64,132.12V95a32,32,0,1,0-16,0v37.13a55.67,55.67,0,0,0,16.4,39.6L92.69,200H64a8,8,0,0,0,0,16h48a8,8,0,0,0,8-8V160A8,8,0,0,0,112,152ZM40,64A16,16,0,1,1,56,80,16,16,0,0,1,40,64Zm168,97V123.88a55.67,55.67,0,0,0-16.4-39.6L163.31,56H192a8,8,0,0,0,0-16H144a8,8,0,0,0-8,8V96a8,8,0,0,0,16,0V67.31L180.28,95.6A39.71,39.71,0,0,1,192,123.88V161a32,32,0,1,0,16,0Zm-8,47a16,16,0,1,1,16-16A16,16,0,0,1,200,208Z"></path>
        </svg>
    );
    const ShareIcon = (
        <svg className="fill-zinc-700 hover:fill-zinc-800 transition" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#000000" viewBox="0 0 256 256">
            <path d="M176,160a39.89,39.89,0,0,0-28.62,12.09l-46.1-29.63a39.8,39.8,0,0,0,0-28.92l46.1-29.63a40,40,0,1,0-8.66-13.45l-46.1,29.63a40,40,0,1,0,0,55.82l46.1,29.63A40,40,0,1,0,176,160Zm0-128a24,24,0,1,1-24,24A24,24,0,0,1,176,32ZM64,152a24,24,0,1,1,24-24A24,24,0,0,1,64,152Zm112,72a24,24,0,1,1,24-24A24,24,0,0,1,176,224Z"></path>
        </svg>
    );
    const ArrowIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3d3d3d" viewBox="0 0 256 256">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
        </svg>
    );

    const TooltipWrapper: React.FC<{ children: React.ReactNode; text: string }> = ({ children, text }) => (
        <div className="group cursor-pointer relative inline-block text-center">
            {children}
            <div className="opacity-0 w-28 transition-all bg-zinc-800 text-white text-center text-xs rounded-lg py-2 absolute z-10 -left-11 group-hover:opacity-100 px-3 pointer-events-none">
                {text}
                <svg className="absolute text-black h-2 w-full left-0 bottom-full rotate-180" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                </svg>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="max-w-[1500px] mx-auto px-3 md:px-5 mt-9 ">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-600">در حال بارگذاری...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-[1500px] mx-auto px-3 md:px-5 mt-9 ">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-red-600">خطا در بارگذاری محصول: {error}</div>
                </div>
            </div>
        );
    }

    const currentStock = currentVariantInfo?.stockQuantity ?? product.stockQuantity;
    const currentPrice = currentVariantInfo?.price ?? product.basePrice;
    const hasSelectedVariants = product.hasVariants && Object.keys(selectedVariants).length > 0;
    const currentDiscount = hasSelectedVariants
        ? (currentVariantInfo?.discount ?? 0)
        : (product.baseDiscount || 0);
    const finalPrice = calculateFinalPrice(currentPrice, currentDiscount);
    const discountAmount = calculateDiscountAmount(currentPrice, currentDiscount);
    const hasDiscount = currentDiscount > 0;

    const getProductFeatures = (): ProductFeature[] => {
        if (!product) return [];
        return [
            { label: 'دسته‌بندی', value: product.category?.title || 'نامشخص' },
            { label: 'کد محصول', value: product.id.toString() },
            { label: 'موجودی', value: currentStock.toString() || '0' }
        ];
    };

    const productImages = getProductImages();
    const productFeatures = getProductFeatures();

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-9 ">
            <div className="my-8 lg:my-10 lg:px-5">
                <div className="bg-white shadow-box-sm rounded-xl py-5 px-2 sm:px-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Photo Section */}
                        <div className="lg:w-4/12">
                            <div className="flex gap-x-4 max-md:hidden">
                                {/* UPDATED: Favorite button with API integration */}
                                <TooltipWrapper text={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه مندی ها"}>
                                    <button
                                        onClick={handleFavoriteToggle}
                                        disabled={favoriteLoading}
                                        className="relative transition-transform hover:scale-110 disabled:opacity-50"
                                    >
                                        {HeartIcon}
                                    </button>
                                </TooltipWrapper>
                                <TooltipWrapper text="افزودن به مقایسه">
                                    <Link to={"/compare?compare=" + product.id} className="relative">
                                        {CompareIcon}
                                    </Link>
                                </TooltipWrapper>
                                <TooltipWrapper text="اشتراک گذاری">
                                    <a href="#" className="relative">
                                        {ShareIcon}
                                    </a>
                                </TooltipWrapper>
                            </div>
                            {/* Discount Badge on Image */}
                            <div className="relative">
                                {hasDiscount && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                                        {currentDiscount}% تخفیف
                                    </div>
                                )}
                                {/* Main Image */}
                                <img
                                    className="w-10/12 lg:w-full mx-auto border-2 rounded-xl mt-3"
                                    src={"https://jahanzar2.storage.iran.liara.space/ecommerce/products/images/" + (productImages[currentImageIndex]?.src || product.thumbnailImage)}
                                    alt={productImages[currentImageIndex]?.alt || product.title}
                                />
                            </div>
                            {/* Thumbnail Images */}
                            {productImages.length > 1 && (
                                <div className="flex mt-4 gap-2">
                                    {productImages.map((image, index) => (
                                        <div key={index} className="flex-shrink-0">
                                            <img
                                                className={`opacity-50 hover:opacity-95 transition-all cursor-pointer w-16 h-16 object-cover border-2 rounded-lg hover:border-red-400 ${currentImageIndex === index ? 'opacity-95 border-red-400' : ''}`}
                                                src={"https://jahanzar2.storage.iran.liara.space/ecommerce/products/images/" + image.src}
                                                alt={image.alt}
                                                onClick={() => handleImageChange(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Rest of your component remains the same... */}
                        {/* Info Section */}
                        <div className="lg:w-5/12">
                            {/* Breadcrumbs */}
                            <div className="mb-7 text-sm flex items-center gap-x-2 opacity-90">
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <React.Fragment key={index}>
                                        <a
                                            href={breadcrumb.href}
                                            className={`${breadcrumb.isActive ? 'text-red-400' : 'text-zinc-800 hover:text-red-400'} transition`}
                                        >
                                            {breadcrumb.title}
                                        </a>
                                        {index < breadcrumbs.length - 1 && (
                                            <div>{ArrowIcon}</div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                            {/* Product Title */}
                            <div className="text-zinc-700 text-lg md:text-xl">
                                {product.title}
                            </div>
                            <div className="text-zinc-400 text-xs mt-4">
                                {product.slug}
                            </div>
                            {/* Product Features */}
                            <div className="mt-8 text-zinc-700">
                                ویژگی های محصول:
                            </div>
                            <div className="grid grid-cols-3 max-w-md py-3 mb-5 gap-3">
                                {productFeatures.map((feature, index) => (
                                    <div key={index} className="flex flex-col gap-x-2 justufy-center bg-gray-100 rounded-md px-2 py-3">
                                        <div className="text-zinc-500 text-xs">
                                            {feature.label}
                                        </div>
                                        <div className="text-zinc-700 text-sm">
                                            {feature.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Product Summary */}
                            <div className="mt-4 text-zinc-600 text-sm">
                                {product.summary}
                            </div>
                        </div>

                        {/* Buy Section - Rest of your component continues unchanged... */}
                        <div className="lg:w-3/12">
                            {/* Variant Selection */}
                            {product.hasVariants && (
                                <div className="lg:mt-8 lg:mb-8 space-y-4">
                                    {Object.entries(variants).map(([variantType, options]) => (
                                        <div key={variantType}>
                                            <div className="text-zinc-700 mb-2 capitalize">
                                                {variantType}:
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {options.map((option, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleVariantSelect(variantType, option)}
                                                        className={`flex items-center justify-center gap-x-2 px-3 py-2 border rounded-lg text-sm transition-colors duration-200
 ${selectedVariants[variantType] === option
                                                                ? 'border-red-500 shadow-md shadow-red-500/20'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                                            }`}
                                                    >
                                                        {variantType === 'color' && (
                                                            <span className={`w-4 h-4 rounded-full ${getColorClass(option)} border`}></span>
                                                        )}
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Desktop Purchase Box */}
                            <div className="p-3 border rounded-xl mx-auto divide-y hidden lg:block">
                                <div className="flex gap-x-1 items-center text-zinc-600 text-sm pb-5 pt-3">
                                    <svg className="fill-zinc-700" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="" viewBox="0 0 256 256">
                                        <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
                                    </svg>
                                    <div>گارانتی اصالت و سلامت فیزیکی کالا</div>
                                </div>
                                <div className="flex gap-x-1 items-center text-zinc-600 text-sm py-5">
                                    <svg className="fill-zinc-700" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="" viewBox="0 0 256 256">
                                        <path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path>
                                    </svg>
                                    <div>ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان</div>
                                </div>
                                <div className="flex flex-col justify-center py-5">
                                    {/* Price section with discount display */}
                                    <div className="text-zinc-600 text-left">
                                        {hasDiscount ? (
                                            <div className="space-y-1">
                                                {/* Original price with strikethrough */}
                                                <div className="text-sm text-gray-400 line-through">
                                                    {formatPrice(currentPrice)} تومان
                                                </div>
                                                {/* Discounted price */}
                                                <div>
                                                    <span className="font-semibold text-xl text-red-600">{formatPrice(finalPrice)}</span>
                                                    <span className="text-xs">تومان</span>
                                                </div>
                                                {/* Discount amount */}
                                                <div className="text-xs text-green-600">
                                                    شما {formatPrice(discountAmount)} تومان صرفه‌جویی می‌کنید
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="font-semibold text-xl">{formatPrice(currentPrice)}</span>
                                                <span className="text-xs">تومان</span>
                                            </div>
                                        )}
                                    </div>
                                    {currentStock > 0 ? (
                                        <div className="text-xs text-red-400">
                                            تنها {currentStock} عدد در انبار باقی مانده
                                        </div>
                                    ) : (
                                        <div className="text-xs text-red-600">
                                            موجود نیست
                                        </div>
                                    )}
                                </div>
                                <button
                                    className={`mx-auto w-full px-2 py-3 text-sm transition text-gray-100 rounded-lg ${currentVariantInfo?.available && currentStock > 0
                                        ? 'bg-red-500 hover:bg-red-400'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    onClick={handleAddToCart}
                                    disabled={!currentVariantInfo?.available || currentStock === 0}
                                >
                                    {currentStock > 0 ? 'افزودن به سبد خرید' : 'موجود نیست'}
                                </button>
                            </div>

                            {/* Mobile Fixed Purchase Bar */}
                            <div className="fixed flex bottom-[4.25rem] right-0 lg:hidden bg-white shadow-box-md w-full px-5 py-3 gap-x-2">
                                <button
                                    className={`mx-auto w-1/2 px-2 py-3 text-sm transition text-gray-100 rounded-lg ${currentVariantInfo?.available && currentStock > 0
                                        ? 'bg-red-500 hover:bg-red-400'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    onClick={handleAddToCart}
                                    disabled={!currentVariantInfo?.available || currentStock === 0}
                                >
                                    {currentStock > 0 ? 'افزودن به سبد خرید' : 'موجود نیست'}
                                </button>
                                <span className="flex flex-col justify-center items-end w-1/2">
                                    {/* Mobile price section with discount display */}
                                    <div className="text-zinc-600 text-left">
                                        {hasDiscount ? (
                                            <div className="space-y-1">
                                                {/* Original price with strikethrough */}
                                                <div className="text-xs text-gray-400 line-through">
                                                    {formatPrice(currentPrice)} تومان
                                                </div>
                                                {/* Discounted price */}
                                                <div>
                                                    <span className="font-semibold text-lg text-red-600">{formatPrice(finalPrice)}</span>
                                                    <span className="text-xs">تومان</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="font-semibold text-lg">{formatPrice(currentPrice)}</span>
                                                <span className="text-xs">تومان</span>
                                            </div>
                                        )}
                                    </div>
                                    {currentStock > 0 ? (
                                        <div className="text-xs text-red-400">
                                            تنها {currentStock} عدد در انبار باقی مانده
                                        </div>
                                    ) : (
                                        <div className="text-xs text-red-600">
                                            موجود نیست
                                        </div>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Services Section */}
                    <ServicesGrid />
                    {/* Tabs Navigation */}
                    <div className="flex gap-x-8 mt-20 pb-2 border-b">
                        <a
                            className={`transition ${activeTab === 'specifications' ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
                            href="#proper"
                            onClick={() => setActiveTab('specifications')}
                        >
                            مشخصات
                        </a>
                        <a
                            className={`transition ${activeTab === 'comments' ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
                            href="#comments"
                            onClick={() => setActiveTab('comments')}
                        >
                            دیدگاه ها
                        </a>
                        <a
                            className={`transition ${activeTab === 'questions' ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
                            href="#quest"
                            onClick={() => setActiveTab('questions')}
                        >
                            پرسش ها
                        </a>
                    </div>
                    {/* Specifications Tab */}
                    {activeTab === 'specifications' && (
                        <div className="p-4" id="proper">
                            <span className="border-b-red-300 border-b text-zinc-800">
                                مشخصات محصول
                            </span>
                            <div className="text-gray-500 text-sm grid grid-cols-1 md:w-1/2">
                                <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                    <div className="text-xs text-zinc-700">نام محصول</div>
                                    <div className="text-xs text-zinc-700">{product.title}</div>
                                </div>
                                <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                    <div className="text-xs text-zinc-700">کد محصول</div>
                                    <div className="text-xs text-zinc-700">{product.id}</div>
                                </div>
                                {product.category && (
                                    <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                        <div className="text-xs text-zinc-700">دسته‌بندی</div>
                                        <div className="text-xs text-zinc-700">{product.category.title}</div>
                                    </div>
                                )}
                                <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                    <div className="text-xs text-zinc-700">موجودی</div>
                                    <div className="text-xs text-zinc-700">{currentStock} عدد</div>
                                </div>
                                {product.hasVariants && (
                                    <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                        <div className="text-xs text-zinc-700">دارای انواع مختلف</div>
                                        <div className="text-xs text-zinc-700">بله</div>
                                    </div>
                                )}
                                {hasDiscount && (
                                    <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                        <div className="text-xs text-zinc-700">تخفیف</div>
                                        <div className="text-xs text-red-600">{currentDiscount}%</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Comments Tab */}
                    {activeTab === 'comments' && (
                        <div className="p-4 border-b" id="comments">
                            <span className="border-b-red-300 border-b text-zinc-800">
                                دیدگاه ها
                            </span>
                            <div className="mt-4 text-center text-gray-500">
                                بخش دیدگاه‌ها در حال توسعه است
                            </div>
                        </div>
                    )}
                    {/* Questions Tab */}
                    {activeTab === 'questions' && (
                        <div className="p-4 border-b" id="quest">
                            <span className="border-b-red-300 border-b text-zinc-800">
                                پرسش ها
                            </span>
                            <div className="mt-4 text-center text-gray-500">
                                بخش پرسش‌ها در حال توسعه است
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default SingleProductPage;