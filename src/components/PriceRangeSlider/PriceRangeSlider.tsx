import React, { useState, useEffect, useCallback } from 'react';

interface PriceRangeSliderProps {
    min?: number;
    max?: number;
    step?: number;
    defaultMinValue?: number;
    defaultMaxValue?: number;
    currency?: string;
    onRangeChange?: (minValue: number, maxValue: number) => void;
    onMinFormat?: (value: number) => string;
    onMaxFormat?: (value: number) => string;
    rtl?: boolean;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
    min = 0,
    max = 1000,
    step = 10,
    defaultMinValue = 0,
    defaultMaxValue = 1000,
    currency = '$',
    onRangeChange,
    onMinFormat,
    onMaxFormat,
    rtl = false,
}) => {
    const [minValue, setMinValue] = useState(defaultMinValue);
    const [maxValue, setMaxValue] = useState(defaultMaxValue);
    const [minInputValue, setMinInputValue] = useState('');
    const [maxInputValue, setMaxInputValue] = useState('');

    // Format values for display
    const formatMinValue = useCallback((value: number): string => {
        if (onMinFormat) {
            return onMinFormat(value);
        }
        return value.toString();
    }, [onMinFormat]);

    const formatMaxValue = useCallback((value: number): string => {
        if (onMaxFormat) {
            return onMaxFormat(value);
        }
        return value.toString();
    }, [onMaxFormat]);

    // Update input display values when slider values change
    useEffect(() => {
        setMinInputValue(formatMinValue(minValue));
    }, [minValue, formatMinValue]);

    useEffect(() => {
        setMaxInputValue(formatMaxValue(maxValue));
    }, [maxValue, formatMaxValue]);

    // Calculate percentage for slider fill
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Update the range fill style
    const [fillStyle, setFillStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        const minPercent = getPercent(minValue);
        const maxPercent = getPercent(maxValue);

        if (rtl) {
            setFillStyle({
                right: `${minPercent}%`,
                left: `${100 - maxPercent}%`,
            });
        } else {
            setFillStyle({
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`,
            });
        }
    }, [minValue, maxValue, getPercent, rtl]);

    // Handle min value change from slider
    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(event.target.value), maxValue - step);
        setMinValue(value);
        onRangeChange?.(value, maxValue);
    };

    // Handle max value change from slider
    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(event.target.value), minValue + step);
        setMaxValue(value);
        onRangeChange?.(minValue, value);
    };

    // Parse numeric value from formatted string
    const parseNumericValue = (formattedValue: string): number => {
        // Remove all non-numeric characters except decimal point and minus sign
        const numericString = formattedValue.replace(/[^0-9.-]/g, '');
        return Number(numericString) || 0;
    };

    // Handle min input field changes
    const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setMinInputValue(inputValue);
    };

    const handleMinInputBlur = () => {
        const numericValue = parseNumericValue(minInputValue);
        if (numericValue >= min && numericValue < maxValue) {
            setMinValue(numericValue);
            onRangeChange?.(numericValue, maxValue);
        } else {
            // Reset to current value if invalid
            setMinInputValue(formatMinValue(minValue));
        }
    };

    // Handle max input field changes
    const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setMaxInputValue(inputValue);
    };

    const handleMaxInputBlur = () => {
        const numericValue = parseNumericValue(maxInputValue);
        if (numericValue <= max && numericValue > minValue) {
            setMaxValue(numericValue);
            onRangeChange?.(minValue, numericValue);
        } else {
            // Reset to current value if invalid
            setMaxInputValue(formatMaxValue(maxValue));
        }
    };

    // Handle Enter key press
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, type: 'min' | 'max') => {
        if (event.key === 'Enter') {
            if (type === 'min') {
                handleMinInputBlur();
            } else {
                handleMaxInputBlur();
            }
        }
    };

    return (
        <div className="w-full px-4">
            <div className="mb-6">
                {/* Slider container */}
                <div className="relative h-2 mt-8 mb-8">
                    {/* Track */}
                    <div className="absolute w-full h-2 bg-gray-200 rounded-md"></div>

                    {/* Range fill */}
                    <div
                        className="absolute h-2 bg-blue-500 rounded-md"
                        style={fillStyle}
                    ></div>

                    {/* Min slider */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={minValue}
                        onChange={handleMinChange}
                        className="absolute w-full -top-1 h-4 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-blue-600 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-blue-600"
                        step={step}
                        dir={rtl ? 'rtl' : 'ltr'}
                    />

                    {/* Max slider */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        value={maxValue}
                        onChange={handleMaxChange}
                        className="absolute w-full -top-1 h-4 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-blue-600 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-blue-600"
                        step={step}
                        dir={rtl ? 'rtl' : 'ltr'}
                    />
                </div>

                {/* Price inputs */}
                <div className={`flex gap-4 mb-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            از قیمت
                        </label>
                        <div className="relative">
                            {!onMinFormat && (
                                <span className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${rtl ? 'right-3' : 'left-3'}`}>
                                    {currency}
                                </span>
                            )}
                            <input
                                type="text"
                                value={minInputValue}
                                onChange={handleMinInputChange}
                                onBlur={handleMinInputBlur}
                                onKeyPress={(e) => handleKeyPress(e, 'min')}
                                className={`w-full py-2 ${!onMinFormat ? 'px-8' : 'px-3'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${rtl ? 'text-right' : 'text-left'}`}
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            تا قیمت
                        </label>
                        <div className="relative">
                            {!onMaxFormat && (
                                <span className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${rtl ? 'right-3' : 'left-3'}`}>
                                    {currency}
                                </span>
                            )}
                            <input
                                type="text"
                                value={maxInputValue}
                                onChange={handleMaxInputChange}
                                onBlur={handleMaxInputBlur}
                                onKeyPress={(e) => handleKeyPress(e, 'max')}
                                className={`w-full py-2 ${!onMaxFormat ? 'px-8' : 'px-3'} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${rtl ? 'text-right' : 'text-left'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Min and max labels */}
                <div className={`flex justify-between text-sm text-gray-600 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <span>{currency}{min.toLocaleString()}</span>
                    <span>{currency}{max.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default PriceRangeSlider;