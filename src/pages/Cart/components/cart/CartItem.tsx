// src/components/cart/CartItem.tsx
import React, { useState } from 'react';
import QuantitySelector from './QuantitySelector';
import ProductAttributes from './ProductAttributes';
import { useShoppingCart, type CartItem as CartItemType } from '../../../SingleProduct_v2/hooks/useShoppingCart';
import { Env } from '../../../../env';

interface CartItemProps {
    item: CartItemType;
    isLast?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ item, isLast = false }) => {
    const { updateCartItem, removeFromCart } = useShoppingCart();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity === item.quantity) return;

        setIsUpdating(true);
        try {
            await updateCartItem(item.id, newQuantity);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveItem = async () => {
        setIsUpdating(true);
        try {
            await removeFromCart(item.id);
        } catch (error) {
            console.error('Failed to remove item:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Extract variant properties for display
    const getVariantDisplay = () => {
        if (item.additionalProperties?.variantId && item.product.hasVariants) {
            // You might want to extract specific variant properties here
            // For now, we'll show that it has variants
            return 'محصول با ویژگی‌های خاص';
        }
        return null;
    };

    // Create attributes array from product and variant info
    const attributes = [
        'ارسال پست پیشتاز',
        'گارانتی اصالت و سلامت فیزیکی کالا',
        ...(getVariantDisplay() ? [getVariantDisplay()] : []),
    ].filter(Boolean) as string[];

    return (
        <div className={`mt-7 flex flex-col md:flex-row gap-y-5 ${!isLast ? 'border-b' : ''} pb-4 ${isUpdating ? 'opacity-50' : ''}`}>
            <div className="w-10/12 mx-auto md:max-w-32">
                <img
                    src={Env.productThumbnailBaseUrl + item.product.thumbnailImage || '/assets/image/products/default.webp'}
                    alt={item.product.title}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/image/products/default.webp';
                    }}
                />
                <QuantitySelector
                    quantity={item.quantity}
                    onQuantityChange={handleQuantityChange}
                    max={item.product.stockQuantity}
                    disabled={isUpdating}
                />
            </div>

            <div className="mr-2 md:mr-5 w-full">
                <div className="text-xs sm:text-sm text-zinc-700">{item.product.title}</div>

                <div className="w-full space-y-2 mt-5">
                    {/* Show variant info if available */}
                    {item.additionalProperties?.variantId && (
                        <div className="flex items-center gap-x-2 text-xs text-zinc-500">
                            <div className="flex items-center gap-x-2">
                                <span className="h-4 w-4 rounded-full bg-blue-500"></span>
                                <span>محصول با ویژگی‌های خاص</span>
                            </div>
                        </div>
                    )}

                    <ProductAttributes attributes={attributes} />

                    <div className="text-gray-700 pt-4">
                        {item.discount > 0 && (
                            <div className="text-sm text-gray-500 line-through">
                                {item.price.toLocaleString()} تومان
                            </div>
                        )}
                        <span className="text-xl font-bold">{item.finalPrice.toLocaleString()}</span>
                        <span className="text-sm">تومان</span>

                        {item.product.stockQuantity <= 5 && (
                            <div className="text-xs text-red-400 mt-3">
                                تنها {item.product.stockQuantity} عدد در انبار باقی مانده
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleRemoveItem}
                            disabled={isUpdating}
                            className="text-red-500 hover:text-red-400 transition text-sm flex items-center w-fit disabled:opacity-50"
                        >
                            حذف از سبد
                            <svg className="fill-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                                <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;