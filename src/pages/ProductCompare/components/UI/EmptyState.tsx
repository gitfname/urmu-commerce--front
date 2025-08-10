// components/UI/EmptyState.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = "هیچ محصولی انتخاب نشده",
    description = "محصولاتی را اضافه کنید تا بتوانید ویژگی‌ها و قیمت‌هایشان را مقایسه کنید."
}) => {
    return (
        <div className="text-center py-12" dir="rtl">
            <div className="text-gray-400 mb-4">
                <Search size={55} className="mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2 text-center">{title}</h2>
            <p className="text-gray-500 text-center">{description}</p>
        </div>
    );
};

export default EmptyState;