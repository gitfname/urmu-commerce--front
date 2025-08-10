import React from 'react';

interface Category {
    name: string;
    icon: string;
}

const categories: Category[] = [
    { name: 'جدیدترین ها', icon: 'path-to-icon-1' },
    { name: 'تکنولوژی و کالای دیجیتال', icon: 'path-to-icon-2' },
    { name: 'بازی و سرگرمی', icon: 'path-to-icon-3' },
    { name: 'کتاب و ادبیات', icon: 'path-to-icon-4' },
    { name: 'فیلم و سریال', icon: 'path-to-icon-5' },
    { name: 'سبک زندگی', icon: 'path-to-icon-6' },
];

const BlogCategorySidebar: React.FC = () => {
    return (
        <div className="md:w-3/12">
            <div className="px-2 sm:px-3 py-3 bg-white rounded-xl shadow-box-sm">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        className="mx-auto flex gap-x-1 group items-center text-right w-full px-2 py-3 text-sm hover:bg-red-400 hover:text-white transition text-gray-700 rounded-lg mt-3"
                    >
                        <svg className="group-hover:fill-white transition-colors" width="20" height="20" fill="#3d3d3d">
                            <path d={category.icon} />
                        </svg>
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BlogCategorySidebar;