import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getFindProductCategoriesTreeQueryQueryKey,
    useFindProductCategoriesTreeQuery,
    type ProductCategoriesSerializer
} from '../../services/api/ecommerce--api';
import { twMerge } from 'tailwind-merge';

interface MenuSubItem {
    title: string;
    href: string;
}

interface MenuSection {
    title: string;
    href: string;
    items: MenuSubItem[];
}

interface CategoryChild {
    id: number;
    title: string;
    viewAllText: string;
    viewAllHref: string;
    sections: MenuSection[];
}

interface CategoryMegaMenuProps {
    className?: string;
}

const CategoryMegaMenu: React.FC<CategoryMegaMenuProps> = ({
    className = ""
}) => {
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [isMegaMenuVisible, setIsMegaMenuVisible] = useState(false);
    const [processedCategories, setProcessedCategories] = useState<CategoryChild[]>([]);

    // Use the tree query to get hierarchical categories
    const categoriesTreeQuery = useFindProductCategoriesTreeQuery({
        query: {
            queryKey: getFindProductCategoriesTreeQueryQueryKey(),
            retry: false,
            refetchOnWindowFocus: false
        }
    });

    // Process the tree data to match your component's expected structure
    useEffect(() => {
        if (categoriesTreeQuery?.data?.data) {
            const categories = categoriesTreeQuery.data.data;

            // Process categories to create the mega menu structure
            const processed = categories
                .filter(category => !category.parentId) // Get only root categories
                .slice(0, 16) // Limit to 16 categories as per your original query
                .map(category => transformCategoryToMegaMenu(category));

            setProcessedCategories(processed);
        }
    }, [categoriesTreeQuery?.data]);

    // Transform category tree to mega menu structure
    const transformCategoryToMegaMenu = (category: ProductCategoriesSerializer): CategoryChild => {
        const sections: MenuSection[] = [];

        if (category.children && category.children.length > 0) {
            // Group children by their level (max 3 levels deep)
            const level2Categories = category.children.filter(child => child.parentId === category.id);

            level2Categories.forEach(level2Cat => {
                const level3Items: MenuSubItem[] = [];

                if (level2Cat.children && level2Cat.children.length > 0) {
                    level2Cat.children.forEach(level3Cat => {
                        level3Items.push({
                            title: level3Cat.title,
                            href: `/search?category=${level3Cat.id}`
                        });
                    });
                }

                sections.push({
                    title: level2Cat.title,
                    href: `/search?parentCategoryId=${level2Cat.id}`,
                    items: level3Items
                });
            });
        }

        return {
            id: category.id,
            title: category.title,
            viewAllText: `مشاهده همه محصولات ${category.title}`,
            viewAllHref: `/search?category=${category.id}`,
            sections: sections
        };
    };

    const handleCategoryHover = (categoryId: number) => {
        setActiveCategoryId(categoryId);
    };

    const handleMegaMenuEnter = () => {
        setIsMegaMenuVisible(true);
    };

    const handleMegaMenuLeave = () => {
        setIsMegaMenuVisible(false);
        setActiveCategoryId(null);
    };

    const arrowIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#4d4d4d" viewBox="0 0 256 256">
            <path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path>
        </svg>
    );

    const hamburgerIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4d4d4d" viewBox="0 0 256 256">
            <path d="M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128ZM40,70H216a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12ZM216,186H40a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Z"></path>
        </svg>
    );

    // Show loading state
    if (categoriesTreeQuery.isLoading) {
        return (
            <div className={`group ${className}`}>
                <div className="relative flex cursor-pointer items-center gap-x-2 pb-2 text-zinc-700">
                    <div>{hamburgerIcon}</div>
                    <div className="text-sm">در حال بارگذاری...</div>
                </div>
            </div>
        );
    }

    // Show error state
    if (categoriesTreeQuery.isError) {
        return (
            <div className={`group ${className}`}>
                <div className="relative flex cursor-pointer items-center gap-x-2 pb-2 text-zinc-700">
                    <div>{hamburgerIcon}</div>
                    <div className="text-sm text-red-500">خطا در بارگذاری دسته‌بندی‌ها</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`group ${className}`} id="desktopMegamenuWrapper">
            <div
                className="relative flex cursor-pointer items-center gap-x-2 pb-2 text-zinc-700"
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
            >
                <div>{hamburgerIcon}</div>
                <div className="text-sm">دسته‌ بندی‌ ها</div>
                <div className="absolute bottom-0 flex w-full justify-center">
                    <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                </div>
            </div>

            {/* Mega Menu */}
            <div className="absolute top-[75%] w-full max-w-[1000px]">
                <div
                    className={`relative ${isMegaMenuVisible ? 'block' : 'hidden'} rounded-b-lg bg-white shadow-base`}
                    id="desktopMegamenu"
                    onMouseEnter={handleMegaMenuEnter}
                    onMouseLeave={handleMegaMenuLeave}
                >
                    <div className="flex h-[450px] max-h-[450px] w-full overflow-hidden rounded-b-lg pt-0.5">
                        {/* Right - Categories */}
                        <div className="main-scroll w-50 border-gray-100 bg-gray-100 border-l-2 overflow-y-auto">
                            <ul id="mega-menu-parents">
                                {processedCategories?.map((category) => (
                                    <li key={category.id}>
                                        <div
                                            className={twMerge(
                                                `flex items-center gap-x-1 py-4 pr-4 text-zinc-700
                                                hover:bg-white transition min-w-24 border-b hover:text-red-500`,
                                                activeCategoryId === category.id ? "bg-white text-red-500" : ""
                                            )}
                                            data-category-parent={category.id}
                                            // to={category.viewAllHref}
                                            onMouseEnter={() => handleCategoryHover(category.id)}
                                        >
                                            <span className="text-sm">{category.title}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Left - Category Content */}
                        <div className="main-scroll h-[450px] max-h-[450px] w-full overflow-auto" dir="ltr">
                            <div className="flex flex-grow" dir="rtl" id="mega-menu-childs">
                                {processedCategories?.map((category) => (
                                    <div
                                        key={category.id}
                                        className={`${activeCategoryId === category.id ? 'block' : 'hidden'} p-5`}
                                        data-category-child={category.id}
                                    >
                                        {/* Header */}
                                        <div className="mb-4">
                                            <Link
                                                className="flex items-center gap-x-1 py-2 text-xs text-red-400 hover:text-red-500 transition"
                                                to={category.viewAllHref}
                                            >
                                                <div>{category.viewAllText}</div>
                                                {arrowIcon}
                                            </Link>
                                        </div>

                                        {/* Sections */}
                                        <div className="flex flex-grow flex-wrap gap-x-14 gap-y-8">
                                            {category?.sections?.map((section, sectionIndex) => (
                                                <div key={sectionIndex} className="space-y-2">
                                                    <Link
                                                        className="flex items-center gap-x-1 text-zinc-700 hover:text-red-400"
                                                        to={section.href}
                                                    >
                                                        <span className="h-5 w-0.5 rounded-full bg-red-500"></span>
                                                        <div className="text-sm">{section.title}</div>
                                                        {arrowIcon}
                                                    </Link>
                                                    <ul>
                                                        {section?.items?.map((item, itemIndex) => (
                                                            <li key={itemIndex}>
                                                                <Link
                                                                    className="block py-2 text-xs text-zinc-600 hover:text-red-500"
                                                                    to={item.href}
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryMegaMenu;