// src/pages/CartPage.tsx
import React from 'react';
import ProgressIndicator from './components/cart/ProgressIndicator';
import CartItems from './components/cart/CartItems';
import CartSummary from './components/cart/CartSummary';

const Cart: React.FC = () => {
    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-24 md:mt-40">
            <ProgressIndicator />

            <div className="my-8 lg:my-10 py-5 lg:px-20 md:flex gap-5">
                <CartItems />
                <CartSummary />
            </div>
        </main>
    );
};

export default Cart;