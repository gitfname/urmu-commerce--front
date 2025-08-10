// components/PurchaseBox/PurchaseBox.tsx
import React, { useState } from 'react';
import { formatPrice } from '../../utils/product.utils';
import myProfileStore from '../../../../stores/MyProfileStore';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

interface PurchaseBoxProps {
    hasDiscount: boolean;
    currentPrice: number | string;
    finalPrice: number;
    discountAmount: number;
    currentStock: number;
    isAvailable: boolean;
    onAddToCart: () => void;
    isMobile?: boolean;
    isLoading?: boolean;
    // New props for cart updates
    existingCartItem?: {
        id: number;
        quantity: number;
    } | null;
    onUpdateQuantity?: (itemId: number, newQuantity: number) => Promise<void>;
}

const PurchaseBox: React.FC<PurchaseBoxProps> = ({
    hasDiscount,
    currentPrice,
    finalPrice,
    discountAmount,
    currentStock,
    isAvailable,
    onAddToCart,
    isMobile = false,
    isLoading = false,
    existingCartItem = null,
    onUpdateQuantity
}) => {
    const [quantity, setQuantity] = useState(1);
    const isLoggedIn = myProfileStore.isLoggedIn

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > currentStock) return;
        setQuantity(newQuantity);
    };

    const handleUpdateCartQuantity = async (change: number) => {
        if (!existingCartItem || !onUpdateQuantity) return;

        const newQuantity = existingCartItem.quantity + change;
        if (newQuantity > currentStock) return;

        await onUpdateQuantity(existingCartItem.id, newQuantity);
    };

    const renderQuantitySelector = () => (
        <div className="flex items-center justify-center gap-2 mb-3">
            <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                -
            </button>
            <span className="px-3 py-1 border rounded-md min-w-[50px] text-center">
                {quantity}
            </span>
            <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= currentStock}
                className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                +
            </button>
        </div>
    );

    const renderCartUpdateControls = () => (
        <div className="flex items-center justify-between mb-3 p-2 bg-green-50 rounded-lg">
            <span className="text-sm text-green-700">در سبد خرید: {existingCartItem?.quantity} عدد</span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleUpdateCartQuantity(-1)}
                    disabled={isLoading || !existingCartItem}
                    className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                    -
                </button>
                <button
                    onClick={() => handleUpdateCartQuantity(1)}
                    disabled={isLoading || !existingCartItem || existingCartItem.quantity >= currentStock}
                    className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                    +
                </button>
            </div>
        </div>
    );

    const renderAddToCartButton = () => {
        const isDisabled = !isAvailable || currentStock === 0 || isLoading;

        return (
            isLoggedIn
                ?
                <button
                    className={`mx-auto w-full px-2 py-3 text-sm transition text-gray-100 rounded-lg flex items-center justify-center gap-2 ${isDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : existingCartItem
                            ? 'bg-green-500 hover:bg-green-400'
                            : 'bg-red-500 hover:bg-red-400'
                        }`}
                    onClick={() => existingCartItem ? handleUpdateCartQuantity(quantity) : onAddToCart()}
                    disabled={isDisabled}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            {existingCartItem ? 'در حال بروزرسانی...' : 'در حال افزودن...'}
                        </>
                    ) : currentStock > 0 ? (
                        existingCartItem ? 'افزودن به سبد خرید' : 'افزودن به سبد خرید'
                    ) : (
                        'موجود نیست'
                    )}
                </button>
                :
                <Link
                    to="/login-register"
                    target='_blank'
                    className="mx-auto w-full px-2 py-3 text-sm transition text-gray-100 rounded-lg
                    flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400"
                >
                    برای خرید وارد حساب کابری شوید
                </Link>
        );
    };

    const PriceSection = () => (
        <div className="text-zinc-600 text-left">
            {hasDiscount ? (
                <div className="space-y-1">
                    <div className="text-sm text-gray-400 line-through">
                        {formatPrice(currentPrice)} تومان
                    </div>
                    <div>
                        <span className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} text-red-600`}>
                            {formatPrice(finalPrice)}
                        </span>
                        <span className="text-xs">تومان</span>
                    </div>
                    {!isMobile && (
                        <div className="text-xs text-green-600">
                            شما {formatPrice(discountAmount)} تومان صرفه‌جویی می‌کنید
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <span className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>
                        {formatPrice(currentPrice)}
                    </span>
                    <span className="text-xs">تومان</span>
                </div>
            )}
        </div>
    );

    const StockInfo = () => (
        currentStock > 0 ? (
            <div className="text-xs text-red-400">
                تنها {currentStock} عدد در انبار باقی مانده
            </div>
        ) : (
            <div className="text-xs text-red-600">
                موجود نیست
            </div>
        )
    );

    if (isMobile) {
        return (
            <div className="fixed flex bottom-[4.25rem] right-0 lg:hidden bg-white shadow-box-md w-full px-5 py-3 gap-x-2">
                <div className="w-1/2 space-y-2">
                    {existingCartItem && renderCartUpdateControls()}
                    {renderAddToCartButton()}
                </div>
                <span className="flex flex-col justify-center items-end w-1/2">
                    <PriceSection />
                    <StockInfo />
                </span>
            </div>
        );
    }

    return (
        <div className="p-3 border rounded-xl mx-auto divide-y hidden lg:block">
            {/* ... existing warranty and shipping info ... */}
            <div className="flex flex-col justify-center py-5">
                <PriceSection />
                <StockInfo />
            </div>

            {existingCartItem && renderCartUpdateControls()}
            {/* {!existingCartItem && renderQuantitySelector()} */}
            {renderAddToCartButton()}
        </div>
    );
};

export default observer(PurchaseBox);