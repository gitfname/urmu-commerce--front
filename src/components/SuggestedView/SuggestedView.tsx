import React from 'react';

// Types
interface SuggestedProduct {
    id: string;
    image: string;
    href: string;
    alt?: string;
}

interface SuggestedCategory {
    id: string;
    title: string;
    subtitle: string;
    products: SuggestedProduct[];
    viewAllHref: string;
    viewAllText?: string;
}

interface SuggestedViewProps {
    categories: SuggestedCategory[];
    className?: string;
}

// Individual Product Grid Item Component
interface ProductGridItemProps {
    product: SuggestedProduct;
    isLastRow: boolean;
    isLastColumn: boolean;
}

const ProductGridItem: React.FC<ProductGridItemProps> = ({
    product,
    isLastRow,
    isLastColumn
}) => {
    const borderClasses = `
    ${!isLastColumn ? 'border-l' : ''} 
    ${!isLastRow ? 'border-b' : ''} 
    py-2
  `.trim();

    return (
        <div className={borderClasses}>
            <a href={product.href}>
                <img
                    className="max-w-[130px] mx-auto"
                    src={product.image}
                    alt={product.alt || 'Product image'}
                />
            </a>
        </div>
    );
};

// Individual Category Card Component
interface CategoryCardProps {
    category: SuggestedCategory;
    index: number;
    totalCategories: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    category,
    index,
    totalCategories
}) => {
    // Determine the appropriate border and rounded corner classes based on position
    const getCardClasses = () => {
        const baseClasses = "bg-white p-3";
        let borderClasses = "";
        let roundedClasses = "";

        // First card (index 0)
        if (index === 0) {
            borderClasses = "rounded-tl-xl rounded-tr-xl sm:rounded-tl-none sm:rounded-tr-xl lg:rounded-r-xl sm:border-l border";
        }
        // Second card (index 1)
        else if (index === 1) {
            borderClasses = "sm:border-l border-x sm:border-r-0 sm:border-t sm:rounded-tl-xl border-b lg:border-l-0 lg:rounded-tl-none";
        }
        // Third card (index 2)
        else if (index === 2) {
            borderClasses = "border-x sm:border-l-0 sm:rounded-br-xl border-b lg:border-t lg:rounded-br-none";
        }
        // Fourth card (index 3) or last card
        else if (index === 3 || index === totalCategories - 1) {
            borderClasses = "rounded-bl-xl rounded-br-xl sm:rounded-br-none border-x border-b lg:border-t lg:rounded-tl-xl";
        }

        return `${baseClasses} ${borderClasses} ${roundedClasses}`.trim();
    };

    return (
        <div className={getCardClasses()}>
            <div className="flex flex-col gap-y-2 mb-5">
                <div className="text-zinc-700">{category.title}</div>
                <div className="text-zinc-400 text-xs">{category.subtitle}</div>
            </div>
            <div className="grid grid-cols-2">
                {category.products.map((product, productIndex) => (
                    <ProductGridItem
                        key={product.id}
                        product={product}
                        isLastRow={productIndex >= 2}
                        isLastColumn={productIndex % 2 === 1}
                    />
                ))}
            </div>
            <div className="flex justify-center text-sm text-red-500 hover:text-red-600 transition mt-5">
                <a href={category.viewAllHref}>
                    {category.viewAllText || 'مشاهده همه'}
                </a>
            </div>
        </div>
    );
};

// Main Suggested View Component
const SuggestedView: React.FC<SuggestedViewProps> = ({
    categories,
    className = ""
}) => {
    return (
        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 bg-white my-10 ${className}`}>
            {categories.map((category, index) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    index={index}
                    totalCategories={categories.length}
                />
            ))}
        </div>
    );
};

export default SuggestedView;