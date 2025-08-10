// SingleProductPage.tsx
import { useShoppingCart } from './hooks/useShoppingCart';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductImageGallery from './components/ProductImageGallery/ProductImageGallery';
import ProductInfo from './components/ProductInfo/ProductInfo';
import VariantSelector from './components/VariantSelector/VariantSelector';
import PurchaseBox from './components/PurchaseBox/PurchaseBox';
import ProductTabs from './components/ProductTabs/ProductTabs';
import { useProduct, useProductVariants, useFavorites } from './hooks/useProduct';
import { formatPrice, calculateFinalPrice, calculateDiscountAmount } from './utils/product.utils';
import type { SingleProductPageProps, VariantAvailability, ProductImage, ProductFeature } from './types/product.types';
import ServicesGrid from '../../components/ServicesGrid/ServicesGrid';

const API_BASE_URL = 'https://urmu-commerce-prod.runflare.run';

const SingleProductPage: React.FC<SingleProductPageProps> = ({
    breadcrumbs = [],
    reviews = [],
    questions = []
}) => {
    const { id } = useParams<{ id: string }>();

    const { addToCart, updateCartItem, cartLoading, cartItems } = useShoppingCart();

    // Custom hooks
    const { product, loading, error } = useProduct(id);
    const { variants, selectedVariants, setSelectedVariants } = useProductVariants(product);
    const { isFavorite, favoriteLoading, toggleFavorite } = useFavorites(product);

    // Local state
    const [currentVariantInfo, setCurrentVariantInfo] = useState<VariantAvailability | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'specifications' | 'comments' | 'questions'>('specifications');

    // Find existing cart item for current product/variant combination
    const existingCartItem = useMemo(() => {
        if (!product || !cartItems.length) return null;

        return cartItems.find(item => {
            // Check if product matches
            if (item.product.id !== product.id) return false;

            // For products without variants
            if (!product.hasVariants) {
                return !item.additionalProperties.variantId;
            }

            // For products with variants, check if variant matches
            if (currentVariantInfo?.variantId) {
                return item.additionalProperties.variantId === currentVariantInfo.variantId;
            }

            return false;
        });
    }, [product, cartItems, currentVariantInfo?.variantId]);

    // Check variant availability when selection changes
    useEffect(() => {
        const checkVariantAvailability = async () => {
            if (!product?.hasVariants || Object.keys(selectedVariants).length === 0) {
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
            if (prev[variantType] === value) {
                const newSelection = { ...prev };
                delete newSelection[variantType];
                return newSelection;
            } else {
                return {
                    ...prev,
                    [variantType]: value
                };
            }
        });
    };

    const handleAddToCart = async () => {
        if (!product || !currentVariantInfo?.available) return;

        try {
            const success = await addToCart(
                product.id,
                1, // quantity - you can make this dynamic later
                product.hasVariants ? selectedVariants : undefined
            );

            if (!success) {
                alert('خطا در افزودن به سبد خرید');
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('خطا در افزودن به سبد خرید');
        }
    };

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        try {
            const success = await updateCartItem(itemId, newQuantity);
            if (success) {
                // Success feedback could be shown here
                console.log('Cart updated successfully');
            } else {
                alert('خطا در بروزرسانی سبد خرید');
            }
        } catch (err) {
            console.error('Error updating cart:', err);
            alert('خطا در بروزرسانی سبد خرید');
        }
    };

    // Helper functions
    const getProductImages = (): ProductImage[] => {
        if (!product) return [];
        return product.images.map((img, index) => ({
            src: img,
            alt: `${product.title} - تصویر ${index + 1}`
        }));
    };

    const getProductFeatures = (): ProductFeature[] => {
        if (!product) return [];
        return [
            { label: 'دسته‌بندی', value: product.category?.title || 'نامشخص' },
            { label: 'کد محصول', value: product.id.toString() },
            { label: 'موجودی', value: currentStock.toString() || '0' }
        ];
    };

    if (loading) {
        return (
            <div className="max-w-[1500px] mx-auto px-3 md:px-5 mt-9 md:mt-44">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-gray-600">در حال بارگذاری...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-[1500px] mx-auto px-3 md:px-5 mt-9 md:mt-44">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-red-600">خطا در بارگذاری محصول: {error}</div>
                </div>
            </div>
        );
    }

    // Calculated values
    const currentStock = currentVariantInfo?.stockQuantity ?? product.stockQuantity;
    const currentPrice = currentVariantInfo?.price ?? product.basePrice;
    const hasSelectedVariants = product.hasVariants && Object.keys(selectedVariants).length > 0;
    const currentDiscount = hasSelectedVariants
        ? (currentVariantInfo?.discount ?? 0)
        : (product.baseDiscount || 0);
    const finalPrice = calculateFinalPrice(currentPrice, currentDiscount);
    const discountAmount = calculateDiscountAmount(currentPrice, currentDiscount);
    const hasDiscount = currentDiscount > 0;

    const productImages = getProductImages();
    const productFeatures = getProductFeatures();

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-9 md:mt-44">
            <div className="my-8 lg:my-10 lg:px-5">
                <div className="bg-white shadow-box-sm rounded-xl py-5 px-2 sm:px-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <ProductImageGallery
                            productImages={productImages}
                            currentImageIndex={currentImageIndex}
                            onImageChange={handleImageChange}
                            hasDiscount={hasDiscount}
                            currentDiscount={currentDiscount}
                            productId={product.id}
                            productTitle={product.title}
                            thumbnailImage={product.thumbnailImage}
                            isFavorite={isFavorite}
                            favoriteLoading={favoriteLoading}
                            onFavoriteToggle={toggleFavorite}
                        />

                        <ProductInfo
                            product={product}
                            breadcrumbs={[
                                { title: "خانه", href: "/" },
                                { title: "محصولات", href: "/search" },
                                { title: product?.title || "", href: location.href, isActive: true },
                            ]}
                            productFeatures={productFeatures}
                        />

                        <div className="lg:w-3/12">
                            <VariantSelector
                                variants={variants}
                                selectedVariants={selectedVariants}
                                onVariantSelect={handleVariantSelect}
                                hasVariants={product.hasVariants}
                            />

                            <PurchaseBox
                                hasDiscount={hasDiscount}
                                currentPrice={currentPrice}
                                finalPrice={finalPrice}
                                discountAmount={discountAmount}
                                currentStock={currentStock}
                                isAvailable={currentVariantInfo?.available ?? false}
                                onAddToCart={handleAddToCart}
                                isLoading={cartLoading}
                                existingCartItem={existingCartItem ? {
                                    id: existingCartItem.id,
                                    quantity: existingCartItem.quantity
                                } : null}
                                onUpdateQuantity={handleUpdateQuantity}
                            />

                            <PurchaseBox
                                hasDiscount={hasDiscount}
                                currentPrice={currentPrice}
                                finalPrice={finalPrice}
                                discountAmount={discountAmount}
                                currentStock={currentStock}
                                isAvailable={currentVariantInfo?.available ?? false}
                                onAddToCart={handleAddToCart}
                                isLoading={cartLoading}
                                isMobile={true}
                                existingCartItem={existingCartItem ? {
                                    id: existingCartItem.id,
                                    quantity: existingCartItem.quantity
                                } : null}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                        </div>
                    </div>

                    <ServicesGrid />

                    <ProductTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        product={product}
                        currentStock={currentStock}
                        currentDiscount={currentDiscount}
                        hasDiscount={hasDiscount}
                    />
                </div>
            </div>
        </main>
    );
};

export default SingleProductPage;