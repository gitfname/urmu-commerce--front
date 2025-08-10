import React from 'react';
import type { Product } from '../../types/product';

interface PurchaseBoxProps {
    product: Product;
    onAddToCart: () => void;
}

const PurchaseBox: React.FC<PurchaseBoxProps> = ({ product, onAddToCart }) => {
    const formatPrice = (price: number) => {
        return price.toLocaleString('fa-IR');
    };

    return (
        <>
            {/* Desktop Purchase Box */}
            <div className="p-3 border rounded-xl mx-auto divide-y hidden lg:block">
                <div className="flex gap-x-1 items-center text-zinc-600 text-sm pb-5 pt-3">
                    <svg className="fill-zinc-700" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                        <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
                    </svg>
                    <div>{product.warranty}</div>
                </div>
                <div className="flex gap-x-1 items-center text-zinc-600 text-sm py-5">
                    <svg className="fill-zinc-700" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                        <path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path>
                    </svg>
                    <div>{product.deliveryTime}</div>
                </div>
                <div className="flex flex-col justify-center py-5">
                    <div className="text-zinc-600 text-left">
                        <span className="font-semibold text-xl">{formatPrice(product.price)}</span>
                        <span className="text-xs">تومان</span>
                    </div>
                    <div className="text-xs text-red-400">
                        تنها {product.stockCount} عدد در انبار باقی مانده
                    </div>
                </div>
                <button
                    className="mx-auto w-full px-2 py-3 text-sm bg-red-500 hover:bg-red-400 transition text-gray-100 rounded-lg"
                    onClick={onAddToCart}
                >
                    افزودن به سبد خرید
                </button>
            </div>

            {/* Mobile Fixed Purchase Bar */}
            <div className="fixed flex bottom-[4.25rem] right-0 lg:hidden bg-white shadow-box-md w-full px-5 py-3 gap-x-2">
                <button
                    className="mx-auto 5 w-1/2 px-2 py-3 text-sm bg-red-500 hover:bg-red-400 transition text-gray-100 rounded-lg"
                    onClick={onAddToCart}
                >
                    افزودن به سبد خرید
                </button>
                <span className="flex flex-col justify-center items-end w-1/2">
                    <div className="text-zinc-600 text-left">
                        <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
                        <span className="text-xs">تومان</span>
                    </div>
                    <div className="text-xs text-red-400">
                        تنها {product.stockCount} عدد در انبار باقی مانده
                    </div>
                </span>
            </div>
        </>
    );
};

export default PurchaseBox;