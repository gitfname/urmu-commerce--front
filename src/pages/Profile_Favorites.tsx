import React, { useState, useEffect } from 'react';
import {
    useFindAllMyFavoriteProducts,
    useDeleteMyFavoriteProductMutation,
    useAddToCartMutation
} from '../services/api/ecommerce--api';
import type { FavoriteProductsSerializer } from '../services/api/ecommerce--api';
import { Env } from '../env';

interface FavoriteProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviewCount: number;
    isAvailable: boolean;
    category: string;
    productId: number;
}

const Profile__Favorites: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);

    // API hooks
    const { data: favoritesData, isLoading, error, refetch } = useFindAllMyFavoriteProducts({
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });
    const deleteFromFavoritesMutation = useDeleteMyFavoriteProductMutation({
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });
    const addToCartMutation = useAddToCartMutation({
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });

    // Transform API data to component format
    useEffect(() => {
        if (favoritesData?.data) {
            const transformedFavorites: FavoriteProduct[] = favoritesData.data.map((item: FavoriteProductsSerializer) => {
                const product = item.product;
                const basePrice = parseFloat(product.basePrice);
                const discountedPrice = basePrice * (1 - product.baseDiscount / 100);

                return {
                    id: item.id,
                    productId: product.id,
                    name: product.title,
                    image: `${Env.productThumbnailBaseUrl}${product.thumbnailImage}`,
                    price: discountedPrice,
                    originalPrice: product.baseDiscount > 0 ? basePrice : undefined,
                    discount: product.baseDiscount > 0 ? product.baseDiscount : undefined,
                    rating: 4.5, // Default rating since it's not in the API response
                    reviewCount: 0, // Default review count since it's not in the API response
                    isAvailable: product.stockQuantity > 0,
                    category: product.category?.title || 'محصول'
                };
            });
            setFavorites(transformedFavorites);
        }
    }, [favoritesData]);

    const removeFavorite = async (favoriteId: number) => {
        try {
            await deleteFromFavoritesMutation.mutateAsync({ id: favoriteId });
            // Remove from local state immediately for better UX
            setFavorites(prev => prev.filter(item => item.id !== favoriteId));
            // Optionally refetch to ensure consistency
            refetch();
        } catch (error) {
            console.error('Error removing from favorites:', error);
            // You might want to show a toast notification here
        }
    };

    const addToCart = async (product: FavoriteProduct) => {
        try {
            await addToCartMutation.mutateAsync({
                data: { quantity: 1 },
                params: { productId: product.productId }
            });
            console.log('Added to cart:', product.name);
            // You might want to show a success toast notification here
        } catch (error) {
            console.error('Error adding to cart:', error);
            // You might want to show an error toast notification here
        }
    };

    const formatPrice = (price: number): string => {
        return price.toLocaleString('fa-IR');
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`w-4 h-4 ${index < Math.floor(rating) ? 'fill-yellow-400' : 'fill-zinc-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
            >
                <path d="M128,20l24.49,74.69L226,94.69l-59.51,43.31L190,212,128,168,66,212l23.51-73.99L30,94.69l73.51,0Z" />
            </svg>
        ));
    };

    // Loading state
    if (isLoading) {
        return (
            <main className="max-w-[1500px] mx-auto px-3 md:px-5">
                <div className="my-5 lg:my-10">
                    <div className="bg-white rounded-2xl shadow-box-md p-12 text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-zinc-300 border-t-zinc-800 rounded-full mx-auto mb-4"></div>
                        <p className="text-zinc-600">در حال بارگذاری علاقه‌مندی‌های شما...</p>
                    </div>
                </div>
            </main>
        );
    }

    // Error state
    if (error) {
        return (
            <main className="max-w-[1500px] mx-auto px-3 md:px-5">
                <div className="my-5 lg:my-10">
                    <div className="bg-white rounded-2xl shadow-box-md p-12 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
                        </svg>
                        <h3 className="text-xl font-medium text-zinc-800 mb-3">خطا در بارگذاری</h3>
                        <p className="text-zinc-600 mb-6">متأسفانه در بارگذاری علاقه‌مندی‌های شما خطایی رخ داد</p>
                        <button
                            onClick={() => refetch()}
                            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                        >
                            تلاش مجدد
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5">
            <div className="my-5 lg:my-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">علاقه‌مندی‌های من</h1>
                        <p className="text-zinc-600">{favorites.length} محصول در لیست علاقه‌مندی‌های شما</p>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <span className="text-sm text-zinc-600 ml-2">نمایش:</span>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                }`}
                        >
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                                <path d="M104,48V80a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96A8,8,0,0,1,104,48Zm96-8H168a8,8,0,0,0-8,8V80a8,8,0,0,0,8,8h32a8,8,0,0,0,8-8V48A8,8,0,0,0,200,40Zm-104,128H64a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8H96a8,8,0,0,0,8-8V176A8,8,0,0,0,96,168Zm104,0H168a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8h32a8,8,0,0,0,8-8V176A8,8,0,0,0,200,168Z" />
                            </svg>
                        </button>

                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                }`}
                        >
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                                <path d="M40,128a8,8,0,0,1,8-8H208a8,8,0,0,1,0,16H48A8,8,0,0,1,40,128ZM48,72H208a8,8,0,0,0,0-16H48a8,8,0,0,0,0,16ZM208,184H48a8,8,0,0,0,0,16H208a8,8,0,0,0,0-16Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Favorites Content */}
                {favorites.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-box-md p-12 text-center">
                        <svg className="w-24 h-24 mx-auto mb-6 fill-zinc-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32Z" />
                        </svg>

                        <h3 className="text-xl font-medium text-zinc-800 mb-3">لیست علاقه‌مندی‌های شما خالی است</h3>

                        <p className="text-zinc-600 mb-6">محصولات مورد علاقه خود را به این لیست اضافه کنید</p>

                        <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors">
                            مشاهده محصولات
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }>
                        {favorites.map((product) => (
                            <div key={product.id} className={`bg-white rounded-2xl shadow-box-md overflow-hidden ${viewMode === 'list' ? 'flex' : ''
                                }`}>
                                {/* Product Image */}
                                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {product.discount && (
                                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                                            {product.discount} تخفیف
                                        </div>
                                    )}
                                    {!product.isAvailable && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="bg-white text-zinc-800 px-3 py-1 rounded-lg font-medium">ناموجود</span>
                                        </div>
                                    )}

                                    {/* Remove from favorites button */}
                                    <button
                                        onClick={() => removeFavorite(product.id)}
                                        disabled={deleteFromFavoritesMutation.isPending}
                                        className="absolute top-3 left-3 w-8 h-8 bg-white hover:bg-red-50 rounded-full flex items-center justify-center transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deleteFromFavoritesMutation.isPending ? (
                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <svg className="w-5 h-5 fill-red-500 group-hover:fill-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                                <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4 flex-1">
                                    <div className="mb-2">
                                        <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">{product.category}</span>
                                    </div>

                                    <h3 className="font-medium text-zinc-800 mb-3 line-clamp-2">{product.name}</h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex">{renderStars(product.rating)}</div>
                                        <span className="text-sm text-zinc-600">{product.rating}</span>
                                        <span className="text-xs text-zinc-500">({product.reviewCount} نظر)</span>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        {product.originalPrice && (
                                            <p className="text-sm text-zinc-400 line-through mb-1">{formatPrice(product.originalPrice)} تومان</p>
                                        )}
                                        <p className="text-lg font-bold text-zinc-800">{formatPrice(product.price)} تومان</p>
                                        {product.discount && (
                                            <p className="text-sm text-red-500 font-medium">{product.discount}% تخفیف</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {/* <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-col' : ''}`}>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={!product.isAvailable || addToCartMutation.isPending}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${product.isAvailable && !addToCartMutation.isPending
                                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                                : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                                                }`}
                                        >
                                            {addToCartMutation.isPending ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    در حال افزودن...
                                                </div>
                                            ) : product.isAvailable ? 'افزودن به سبد' : 'ناموجود'}
                                        </button>
                                        <button className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm transition-colors">
                                            مشاهده
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Profile__Favorites;