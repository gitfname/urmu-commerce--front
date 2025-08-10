// src/components/cart/ProgressIndicator.tsx
import React from 'react';

interface Step {
    id: number;
    title: string;
    isActive: boolean;
    isCompleted: boolean;
}

const ProgressIndicator: React.FC = () => {
    const steps: Step[] = [
        { id: 1, title: 'سبد خرید', isActive: true, isCompleted: false },
        { id: 2, title: 'جزئیات پرداخت', isActive: false, isCompleted: false },
        { id: 3, title: 'تکمیل سفارش', isActive: false, isCompleted: false },
    ];

    return (
        <div className="container mx-auto w-full h-full pt-9 max-sm:px-0">
            <div className="relative pl-3 h-full">
                {/* Progress Lines */}
                <div className="flex pt-3 *:border-2 md:*:border-4">
                    <div className="border-opacity-90 border-green-500 w-1/4"></div>
                    <div className="border-opacity-90 border-gray-300 w-1/4"></div>
                    <div className="border-opacity-90 border-gray-300 w-1/4"></div>
                    <div className="border-opacity-90 border-gray-300 w-1/4"></div>
                </div>

                {/* Step Labels */}
                <div className="absolute -top-10 inline-flex w-full justify-between">
                    <div className="">
                        <div className="w-8 h-8"></div>
                    </div>

                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className="z-20 flex items-center order-1">
                                <h1 className={`mx-auto md:font-semibold ${step.isActive ? 'text-zinc-700' : 'text-zinc-500'
                                    } ${index === 0 ? 'pr-6' : index === 1 ? 'pr-4' : 'pr-1 pl-2'} text-xs md:text-base`}>
                                    {step.title}
                                </h1>
                            </div>
                        </div>
                    ))}

                    <div className="pl-3">
                        <div className="w-8 h-8"></div>
                    </div>
                </div>

                {/* Step Dots */}
                <div className="absolute top-0 md:-top-1 inline-flex w-full justify-between">
                    <div className="flex items-center *:w-6 *:h-6 md:*:w-8 *:md:h-8">
                        <div className="z-20 flex items-center order-1 bg-gray-200 shadow-box-md rounded-full">
                            <h1 className="mx-auto font-semibold text-lg text-zinc-700"></h1>
                        </div>
                    </div>

                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center *:w-6 *:h-6 md:*:w-8 *:md:h-8">
                            <div className={`z-20 flex items-center order-1 shadow-box-md rounded-full ${step.isActive ? 'bg-green-400' : 'bg-white'
                                }`}>
                                <h1 className={`mx-auto font-semibold text-base md:text-lg ${step.isActive ? 'text-white' : 'text-zinc-700'
                                    }`}>
                                    {step.id}
                                </h1>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center *:w-6 *:h-6 md:*:w-8 *:md:h-8">
                        <div className="z-20 flex items-center order-1 bg-gray-200 shadow-box-md rounded-full">
                            <h1 className="mx-auto font-semibold text-lg text-zinc-700"></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressIndicator;