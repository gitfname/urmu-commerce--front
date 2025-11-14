// SingleProduct_v2/components/ProductTabs/ProductTabs.tsx
import React from 'react';
import ProductComments from '../ProductComments/ProductComments';
import type { ApiProduct } from '../../types/product.types';

interface ProductTabsProps {
    activeTab: 'specifications' | 'comments' | 'questions';
    onTabChange: (tab: 'specifications' | 'comments' | 'questions') => void;
    product: ApiProduct;
    currentStock: number;
    currentDiscount: number;
    hasDiscount: boolean;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
    activeTab,
    onTabChange,
    product,
    currentStock,
    currentDiscount,
    hasDiscount
}) => {
    return (
        <>
            {/* Tabs Navigation */}
            <div className="flex gap-x-8 mt-20 pb-2 border-b">
                <button
                    className={`transition max-md:hidden ${activeTab === 'specifications' ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
                    onClick={() => onTabChange('specifications')}
                >
                    مشخصات
                </button>
                
                <button
                    className={`transition ${activeTab === 'comments' ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
                    onClick={() => onTabChange('comments')}
                >
                    دیدگاه ها
                </button>

                {/* <button
                    className={`transition ${activeTab === 'questions' ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
                    onClick={() => onTabChange('questions')}
                >
                    پرسش ها
                </button> */}
            </div>

            {/* Tab Content */}
            {activeTab === 'specifications' && (
                <div className="p-4 max-md:hidden " id="proper">
                    <span className="border-b-red-300 border-b text-zinc-800">
                        مشخصات محصول
                    </span>
                    <div className="text-gray-500 text-sm grid grid-cols-1 md:w-1/2">
                        <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                            <div className="text-xs text-zinc-700">نام محصول</div>
                            <div className="text-xs text-zinc-700">{product.title}</div>
                        </div>
                        <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                            <div className="text-xs text-zinc-700">کد محصول</div>
                            <div className="text-xs text-zinc-700">{product.id}</div>
                        </div>
                        {product.category && (
                            <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                <div className="text-xs text-zinc-700">دسته‌بندی</div>
                                <div className="text-xs text-zinc-700">{product.category.title}</div>
                            </div>
                        )}
                        <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                            <div className="text-xs text-zinc-700">موجودی</div>
                            <div className="text-xs text-zinc-700">{currentStock} عدد</div>
                        </div>
                        {product.hasVariants && (
                            <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                <div className="text-xs text-zinc-700">دارای انواع مختلف</div>
                                <div className="text-xs text-zinc-700">بله</div>
                            </div>
                        )}
                        {hasDiscount && (
                            <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
                                <div className="text-xs text-zinc-700">تخفیف</div>
                                <div className="text-xs text-red-600">{currentDiscount}%</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'comments' && (
                <div className="p-4" id="comments">
                    <span className="border-b-red-300 border-b text-zinc-800 block mb-4">
                        دیدگاه ها
                    </span>
                    <ProductComments productId={product.id} />
                </div>
            )}

            {activeTab === 'questions' && (
                <div className="p-4 border-b" id="quest">
                    <span className="border-b-red-300 border-b text-zinc-800">
                        پرسش ها
                    </span>
                    <div className="mt-4 text-center text-gray-500">
                        بخش پرسش‌ها در حال توسعه است
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductTabs;


















// import React from 'react';
// import type { ApiProduct } from '../../types/product.types';

// interface ProductTabsProps {
//     activeTab: 'specifications' | 'comments' | 'questions';
//     onTabChange: (tab: 'specifications' | 'comments' | 'questions') => void;
//     product: ApiProduct;
//     currentStock: number;
//     currentDiscount: number;
//     hasDiscount: boolean;
// }

// const ProductTabs: React.FC<ProductTabsProps> = ({
//     activeTab,
//     onTabChange,
//     product,
//     currentStock,
//     currentDiscount,
//     hasDiscount
// }) => {
//     return (
//         <>
//             {/* Tabs Navigation */}
//             <div className="flex gap-x-8 mt-20 pb-2 border-b">
//                 <a
//                     className={`transition ${activeTab === 'specifications' ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
//                     href="#proper"
//                     onClick={() => onTabChange('specifications')}
//                 >
//                     مشخصات
//                 </a>
//                 <a
//                     className={`transition ${activeTab === 'comments' ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
//                     href="#comments"
//                     onClick={() => onTabChange('comments')}
//                 >
//                     دیدگاه ها
//                 </a>
//                 <a
//                     className={`transition ${activeTab === 'questions' ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
//                     href="#quest"
//                     onClick={() => onTabChange('questions')}
//                 >
//                     پرسش ها
//                 </a>
//             </div>

//             {/* Tab Content */}
//             {activeTab === 'specifications' && (
//                 <div className="p-4" id="proper">
//                     <span className="border-b-red-300 border-b text-zinc-800">
//                         مشخصات محصول
//                     </span>
//                     <div className="text-gray-500 text-sm grid grid-cols-1 md:w-1/2">
//                         <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
//                             <div className="text-xs text-zinc-700">نام محصول</div>
//                             <div className="text-xs text-zinc-700">{product.title}</div>
//                         </div>
//                         <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
//                             <div className="text-xs text-zinc-700">کد محصول</div>
//                             <div className="text-xs text-zinc-700">{product.id}</div>
//                         </div>
//                         {product.category && (
//                             <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
//                                 <div className="text-xs text-zinc-700">دسته‌بندی</div>
//                                 <div className="text-xs text-zinc-700">{product.category.title}</div>
//                             </div>
//                         )}
//                         <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
//                             <div className="text-xs text-zinc-700">موجودی</div>
//                             <div className="text-xs text-zinc-700">{currentStock} عدد</div>
//                         </div>
//                         {product.hasVariants && (
//                             <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
//                                 <div className="text-xs text-zinc-700">دارای انواع مختلف</div>
//                                 <div className="text-xs text-zinc-700">بله</div>
//                             </div>
//                         )}
//                         {hasDiscount && (
//                             <div className="flex items-center justify-between border p-3 w-full my-3 mx-auto rounded-xl">
//                                 <div className="text-xs text-zinc-700">تخفیف</div>
//                                 <div className="text-xs text-red-600">{currentDiscount}%</div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {activeTab === 'comments' && (
//                 <div className="p-4 border-b" id="comments">
//                     <span className="border-b-red-300 border-b text-zinc-800">
//                         دیدگاه ها
//                     </span>
//                     <div className="mt-4 text-center text-gray-500">
//                         بخش دیدگاه‌ها در حال توسعه است
//                     </div>
//                 </div>
//             )}

//             {activeTab === 'questions' && (
//                 <div className="p-4 border-b" id="quest">
//                     <span className="border-b-red-300 border-b text-zinc-800">
//                         پرسش ها
//                     </span>
//                     <div className="mt-4 text-center text-gray-500">
//                         بخش پرسش‌ها در حال توسعه است
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ProductTabs;