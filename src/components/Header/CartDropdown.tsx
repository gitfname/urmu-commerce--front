import React, { useState, useRef, useEffect } from 'react';
import { MinusIcon, PlusIcon, ShoppingBasket, TruckIcon } from './icons/Icon';
// import type { CartItem } from './types';
import { Link } from 'react-router-dom';
import { useShoppingCart, type CartItem } from '../../pages/SingleProduct_v2/hooks/useShoppingCart';
import { Env } from '../../env';

// interface CartDropdownProps {
//     items: CartItem[];
// }

const CartDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    // const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { cartItems, updateCartItem, cartLoading } = useShoppingCart()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleQuantityChange = (id: number, action: 'increment' | 'decrement', item: CartItem) => {
        if (action === "increment") {
            updateCartItem(id, item.quantity + 1)
        }
        else {
            updateCartItem(id, item.quantity - 1)
        }
        // setCartItems((prevItems) =>
        //     prevItems.map((item) => {
        //         if (item.id === id) {
        //             const newQuantity = action === 'increment' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        //             return { ...item, quantity: newQuantity };
        //         }
        //         return item;
        //     })
        // );
    };

    const totalItems = cartItems.length;
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="relative" ref={dropdownRef}>
            <Link to="/cart" className="flex items-center p-2 rounded-xl bg-red-500 hover:bg-red-400 transition shadow-lg shadow-red-500/50">
                <button className="group relative" type="button" onMouseEnter={() => setIsOpen(true)}>
                    <span className="cursor-pointer pointer-events-none">
                        <ShoppingBasket name="BasketIcon" />
                    </span>          {totalItems > 0 && (
                        <span className="absolute -right-3 -top-3 flex h-5 w-5 drop-shadow-lg cursor-pointer items-center justify-center rounded-lg bg-white text-sm font-semibold text-red-500">
                            {totalItems}
                        </span>
                    )}
                </button>
            </Link>

            {isOpen && (
                <div className="absolute z-50 mx-5 md:!ml-5 mt-2 hidden md:block w-auto md:w-[400px] rounded-lg bg-white shadow-lg translate-x-[95%]">
                    <div className="flex items-center justify-between p-4 pb-2 border-b mx-5">
                        <div className="text-sm text-zinc-500">{totalItems} کالا</div>
                    </div>
                    <div className="h-60">
                        <ul className="main-scroll h-full space-y-2 divide-y divide-gray-100 overflow-y-auto p-5 pl-2">
                            {cartItems.map((item) => (
                                <li key={item.id}>
                                    <div className="flex gap-x-2 py-5">
                                        <div className="relative min-w-fit">
                                            <div >
                                                <img
                                                    alt={""}
                                                    className="h-[120px] w-[120px]"
                                                    loading="lazy"
                                                    src={Env.productThumbnailBaseUrl + item.product.thumbnailImage}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full space-y-1.5">
                                            <p className='line-clamp-2 text-zinc-700'>{item.product.title}</p>
                                            {/* {item.color && (
                                                <div className="flex items-center gap-x-2 text-xs text-zinc-500">
                                                    <div className="flex items-center gap-x-2">
                                                        <span className="h-4 w-4 rounded-full bg-gray-900"></span>
                                                        <span>{item.color}</span>                              </div>
                                                </div>
                                            )}
                                            {item.deliveryMethod && (
                                                <div className="flex items-center gap-x-2 text-xs text-zinc-500">
                                                    <div className="flex items-center gap-x-2">
                                                        <TruckIcon name="TruckIcon" />
                                                        <span>{item.deliveryMethod}</span>
                                                    </div>
                                                </div>
                                            )} */}
                                            <div className="flex items-center justify-between gap-x-2">
                                                <div className="text-gray-700">
                                                    <span className="text-lg font-bold">{item.price.toLocaleString('fa-IR')}</span>
                                                    <span className="text-sm">تومان</span>
                                                </div>

                                                <div className="flex h-10 w-24 items-center justify-between rounded-lg border border-gray-100 px-2 py-1 relative">
                                                    {
                                                        cartLoading
                                                            ?
                                                            <div className='absolute top-0 left-0 bottom-0 w-full grid place-items-center bg-white/50'>
                                                                <div className='w-5 h-5 border-t-2 border-t-red-500 rounded-full animate-spin duration-1000'></div>
                                                            </div>
                                                            :
                                                            null
                                                    }

                                                    <button type="button" onClick={() => handleQuantityChange(+item.id, 'increment', item)}>
                                                        <PlusIcon name="PlusIcon" />
                                                    </button>

                                                    <span className="flex h-5 w-full grow select-none items-center justify-center bg-transparent text-center text-sm text-zinc-700 outline-none">{item.quantity}</span>

                                                    <button type="button" onClick={() => handleQuantityChange(+item.id, 'decrement', item)}>
                                                        <MinusIcon name="MinusIcon" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 p-5">
                        <div className="flex flex-col items-center gap-y-1">
                            <div className="text-sm text-zinc-600">مبلغ قابل پرداخت</div>

                            <div className="text-zinc-600">
                                <span className="font-bold">{totalPrice.toLocaleString('fa-IR')}</span>
                                <span className="text-xs">تومان</span>
                            </div>
                        </div>
                        <a href="#" className="w-28 py-3 text-sm bg-red-500 hover:bg-red-400 transition text-gray-100 rounded-xl text-center">
                            <button type="button">ثبت سفارش</button>            </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartDropdown;