// components/ComparisonTable/ComparisonTable.tsx
import React from 'react';
import type { Product } from '../../types';

interface ComparisonTableProps {
    products: Product[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ products }) => {
    // Calculate discounted price
    const getDiscountedPrice = (basePrice: string, discount: number) => {
        const price = parseFloat(basePrice);
        return (price - (price * discount / 100)).toFixed(0);
    };

    // Format price
    const formatPrice = (price: string) => {
        return `${parseFloat(price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان`;
    };

    return (
        <div className="bg-gray-50 rounded-lg p-6" dir="rtl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">مقایسه سریع</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-right py-3 px-4 font-semibold text-gray-900">ویژگی</th>
                            {products.map((product) => (
                                <th key={product.id} className="text-right py-3 px-4 font-semibold text-gray-900 min-w-[200px]">
                                    {product.title.length > 20 ? `${product.title.substring(0, 20)}...` : product.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium text-gray-700">قیمت</td>
                            {products.map((product) => (
                                <td key={product.id} className="py-3 px-4">
                                    {product.baseDiscount > 0 ? (
                                        <div>
                                            <span className="font-bold text-red-500">
                                                {formatPrice(getDiscountedPrice(product.basePrice, product.baseDiscount))}
                                            </span>
                                            <br />
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(product.basePrice)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="font-bold text-gray-900">
                                            {formatPrice(product.basePrice)}
                                        </span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium text-gray-700">دسته‌بندی</td>
                            {products.map((product) => (
                                <td key={product.id} className="py-3 px-4">
                                    {product.category ? product.category.title : 'نامشخص'}
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium text-gray-700">موجودی</td>
                            {products.map((product) => (
                                <td key={product.id} className="py-3 px-4">
                                    <span className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {product.stockQuantity > 0 ? `${product.stockQuantity} عدد موجود` : 'ناموجود'}
                                    </span>
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium text-gray-700">انواع مختلف</td>
                            {products.map((product) => (
                                <td key={product.id} className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-xs ${product.hasVariants
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {product.hasVariants ? 'دارد' : 'ندارد'}
                                    </span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="py-3 px-4 font-medium text-gray-700">تخفیف</td>
                            {products.map((product) => (
                                <td key={product.id} className="py-3 px-4">
                                    {product.baseDiscount > 0 ? (
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                                            {product.baseDiscount}% تخفیف
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">بدون تخفیف</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonTable;