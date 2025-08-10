// components/ProductCard/EmptyProductSlot.tsx
import React from 'react';
import { Plus } from 'lucide-react';

const EmptyProductSlot: React.FC = () => {
    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center text-gray-400" dir="rtl">
                <Plus size={48} className="mx-auto mb-2" />
                <p>افزودن محصول</p>
            </div>
        </div>
    );
};

export default EmptyProductSlot;