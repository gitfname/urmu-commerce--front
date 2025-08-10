// src/components/cart/CartSummary.tsx
import React from 'react';
import { useShoppingCart } from '../../../SingleProduct_v2/hooks/useShoppingCart';
import { useNavigate } from 'react-router-dom';

const CartSummary: React.FC = () => {
    const { cartItems, getTotalItems, getTotalPrice } = useShoppingCart();

    const navigate = useNavigate()

    const calculateSummary = () => {
        const itemsPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const totalDiscount = cartItems.reduce((total, item) => total + (item.discount * item.quantity), 0);
        const finalTotal = getTotalPrice();

        return {
            itemsPrice,
            discount: totalDiscount,
            total: finalTotal,
            itemCount: getTotalItems()
        };
    };

    const summary = calculateSummary();

    const handleCheckout = () => {
        navigate("/checkout")
    };

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className="md:w-4/12 mt-8 md:mt-0">
            <div className="px-2 sm:px-6 py-3 bg-white rounded-xl shadow-box-sm">
                <div className="flex gap-x-1 items-center text-zinc-700">
                    <svg className="fill-red-500" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="" viewBox="0 0 256 256">
                        <path d="M216,66H174V64a46,46,0,0,0-92,0v2H40A14,14,0,0,0,26,80V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V80A14,14,0,0,0,216,66ZM94,64a34,34,0,0,1,68,0v2H94ZM218,200a2,2,0,0,1-2,2H40a2,2,0,0,1-2-2V80a2,2,0,0,1,2-2H216a2,2,0,0,1,2,2Z"></path>
                    </svg>
                    سبد شما
                </div>

                <div className="flex gap-x-1 justify-between items-center text-zinc-600 mt-5 bg-gray-100 rounded-lg px-2 py-3 text-sm">
                    <div>قیمت کالاها ({summary.itemCount})</div>
                    <div className="flex gap-x-1">
                        <div>{summary.itemsPrice.toLocaleString()}</div>
                        <div>تومان</div>
                    </div>
                </div>

                {summary.discount > 0 && (
                    <div className="flex gap-x-1 justify-between items-center text-zinc-600 mt-3 bg-gray-100 rounded-lg px-2 py-3 text-sm">
                        <div>تخفیف</div>
                        <div className="flex gap-x-1 text-red-500">
                            <div>-{summary.discount.toLocaleString()}</div>
                            <div>تومان</div>
                        </div>
                    </div>
                )}

                <div className="flex gap-x-1 justify-between items-center text-zinc-800 mt-3 bg-gray-100 rounded-lg px-2 py-3 text-sm font-semibold">
                    <div>جمع سبد خرید</div>
                    <div className="flex gap-x-1">
                        <div>{summary.total.toLocaleString()}</div>
                        <div>تومان</div>
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    className="mx-auto w-full px-2 py-3 mt-5 text-sm bg-red-500 hover:bg-red-400 transition text-gray-100 rounded-lg"
                >
                    تایید و تکمیل سفارش
                </button>
            </div>
        </div>
    );
};

export default CartSummary;