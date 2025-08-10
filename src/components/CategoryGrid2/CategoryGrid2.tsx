import React from 'react';

// Types
interface Category {
    id: string;
    name: string;
    image: string;
    href: string;
}

interface CategoryGridProps {
    categories: Category[];
    className?: string;
}

// Individual Category Item Component
interface CategoryItemProps {
    category: Category;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
    return (
        <a href={category.href} className="max-w-28">
            <img
                className="w-full hover:rotate-6 transition"
                src={category.image}
                alt={category.name}
            />
            <div className="text-xs text-center text-zinc-800 mt-2">
                {category.name}
            </div>
        </a>
    );
};

// Main Category Grid Component
const CategoryGrid2: React.FC<CategoryGridProps> = ({
    categories,
    className = ""
}) => {
    return (
        <div className={`flex flex-wrap justify-center gap-x-5 sm:gap-x-16 gap-y-5 px-3 md:px-10 ${className}`}>
            {categories.map((category) => (
                <CategoryItem
                    key={category.id}
                    category={category}
                />
            ))}
        </div>
    );
};

export default CategoryGrid2;