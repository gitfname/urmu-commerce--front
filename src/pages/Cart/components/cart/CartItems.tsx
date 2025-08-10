// src/components/cart/CartItems.tsx
import React from 'react';
import CartItem from './CartItem';
import { useShoppingCart } from '../../../SingleProduct_v2/hooks/useShoppingCart';

const CartItems: React.FC = () => {
    const { cartItems, cartLoading, cartError } = useShoppingCart();

    if (cartLoading) {
        return (
            <div className="md:w-8/12 bg-white shadow-box-md rounded-xl py-5 px-2 sm:px-6">
                <div className="flex justify-center items-center h-32">
                    <div className="text-zinc-500">در حال بارگذاری...</div>
                </div>
            </div>
        );
    }

    if (cartError) {
        return (
            <div className="md:w-8/12 bg-white shadow-box-md rounded-xl py-5 px-2 sm:px-6">
                <div className="flex justify-center items-center h-32">
                    <div className="text-red-500">خطا در بارگذاری سبد خرید: {cartError}</div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="md:w-8/12 bg-white shadow-box-md rounded-xl py-5 px-2 sm:px-6">
                <div className="text-zinc-700">سبد خرید شما</div>
                <div className="flex justify-center items-center h-32">
                    <div className="text-zinc-500">سبد خرید شما خالی است</div>
                </div>
            </div>
        );
    }

    return (
        <div className="md:w-8/12 bg-white shadow-box-md rounded-xl py-5 px-2 sm:px-6">
            <div className="text-zinc-700">سبد خرید شما</div>
            <div className="text-zinc-400 text-xs mt-2">{cartItems.length} کالا</div>

            {cartItems.map((item, index) => (
                <CartItem
                    key={item.id}
                    item={item}
                    isLast={index === cartItems.length - 1}
                />
            ))}
        </div>
    );
};

export default CartItems;