import React from 'react';
import type { ProductSpecification } from '../../types/product';

interface SpecificationsTabProps {
    specifications: ProductSpecification[];
}

const SpecificationsTab: React.FC<SpecificationsTabProps> = ({ specifications }) => {
    return (
        <div className="p-4" id="proper">
            <span className="border-b-red-300 border-b text-zinc-800">
                مشخصات محصول
            </span>
            <div className="text-gray-500 text-sm grid grid-cols-1 md:w-1/2">
                {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                        <div className="text-xs text-zinc-700">
                            {spec.label}
                        </div>
                        <div className="text-xs text-zinc-700">
                            {spec.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpecificationsTab;