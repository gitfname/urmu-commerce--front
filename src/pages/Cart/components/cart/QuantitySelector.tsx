// src/components/cart/QuantitySelector.tsx
import React from 'react';

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onQuantityChange,
    min = 1,
    max = 99,
    disabled = false
}) => {
    const handleIncrement = () => {
        if (quantity < max && !disabled) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > min && !disabled) {
            onQuantityChange(quantity - 1);
        }
    };

    return (
        <div className={`flex h-10 w-24 items-center justify-between rounded-lg border border-gray-100 px-2 py-1 mt-5 mx-auto ${disabled ? 'opacity-50' : ''}`}>
            <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= max || disabled}
                className="disabled:opacity-50"
            >
                <svg className="fill-green-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4d4d4d" viewBox="0 0 256 256">
                    <path d="M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z"></path>
                </svg>
            </button>

            <input
                value={quantity}
                disabled
                type="number"
                className="flex h-5 w-full grow select-none items-center justify-center bg-transparent text-center text-sm text-zinc-700 outline-none"
                readOnly
            />

            <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= min || disabled}
                className="disabled:opacity-50"
            >
                <svg className="fill-red-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="" viewBox="0 0 256 256">
                    <path d="M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128Z"></path>
                </svg>
            </button>
        </div>
    );
};

export default QuantitySelector;