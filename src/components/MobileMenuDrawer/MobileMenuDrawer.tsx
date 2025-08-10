import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    getFindProductCategoriesTreeQueryQueryKey,
    useFindProductCategoriesTreeQuery,
    type ProductCategoriesSerializer
} from '../../services/api/ecommerce--api';

interface MenuItem {
    id: string;
    title: string;
    href: string;
    icon: React.ReactNode;
    isHighlighted?: boolean;
}

interface SubCategory {
    id: number;
    title: string;
    href: string;
    items?: SubCategory[];
}

interface Category {
    id: number;
    title: string;
    href?: string;
    subCategories?: SubCategory[];
}

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    logoSrc?: string;
    logoAlt?: string;
    logoHref?: string;
    menuItems?: MenuItem[];
    categories?: Category[];
    className?: string;
}

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
    isOpen,

    onClose,
    logoSrc = "/assets/image/Logo.jpg",
    logoAlt = "Logo",
    logoHref = "#",
    menuItems = [],
    categories,
    className = ""
}) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [processedCategories, setProcessedCategories] = useState<Category[]>([]);
    const drawerRef = useRef<HTMLDivElement>(null);

    const { pathname } = useLocation()

    // Use the tree query to get hierarchical categories
    const categoriesTreeQuery = useFindProductCategoriesTreeQuery({
        query: {
            queryKey: getFindProductCategoriesTreeQueryQueryKey(),
            retry: false,
            refetchOnWindowFocus: false
        }
    });

    useEffect(
        () => {
            onClose?.()
        }, [pathname]
    )

    // Process the tree data to match the mobile menu structure
    useEffect(() => {
        if (categoriesTreeQuery?.data?.data) {
            const categoryData = categoriesTreeQuery.data.data;

            // Process categories to create the mobile menu structure
            const processed = categoryData
                .filter(category => !category.parentId) // Get only root categories
                .slice(0, 16) // Limit to 16 categories as per your original query
                .map(category => transformCategoryToMobileMenu(category));

            setProcessedCategories(processed);
        }
    }, [categoriesTreeQuery?.data]);

    // Transform category tree to mobile menu structure
    const transformCategoryToMobileMenu = (category: ProductCategoriesSerializer): Category => {
        const subCategories: SubCategory[] = [];

        if (category.children && category.children.length > 0) {
            // Add "همه" option for the parent category
            subCategories.push({
                id: category.id,
                title: "همه",
                href: `/search?category=${category.id}`
            });

            // Group children by their level (max 3 levels deep)
            const level2Categories = category.children.filter(child => child.parentId === category.id);

            level2Categories.forEach(level2Cat => {
                const level3Items: SubCategory[] = [];

                if (level2Cat.children && level2Cat.children.length > 0) {
                    // Add "همه" option for the level 2 category
                    level3Items.push({
                        id: level2Cat.id,
                        title: "همه",
                        href: `/search?category=${level2Cat.id}`
                    });

                    level2Cat.children.forEach(level3Cat => {
                        level3Items.push({
                            id: level3Cat.id,
                            title: level3Cat.title,
                            href: `/search?category=${level3Cat.id}`
                        });
                    });
                }

                subCategories.push({
                    id: level2Cat.id,
                    title: level2Cat.title,
                    href: `/search?category=${level2Cat.id}`,
                    items: level3Items.length > 0 ? level3Items : undefined
                });
            });
        }

        return {
            id: category.id,
            title: category.title,
            href: `/search?category=${category.id}`,
            subCategories: subCategories
        };
    };

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isOpen) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    // Toggle category expansion
    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    // prevent the body scroll when drawer is open
    useEffect(
        () => {
            if (isOpen) {
                document.body.style.overflow = "hidden"
            }
            else {
                document.body.style.overflow = "visible"
            }
        }, [isOpen]
    )

    // Icons
    const CloseIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4d4d4d" viewBox="0 0 256 256">
            <path d="M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z"></path>
        </svg>
    );

    const ShopIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#878787" viewBox="0 0 256 256">
            <path d="M230,96a6.19,6.19,0,0,0-.22-1.65l-14.34-50.2A14.07,14.07,0,0,0,202,34H54A14.07,14.07,0,0,0,40.57,44.15L26.23,94.35A6.19,6.19,0,0,0,26,96v16A38,38,0,0,0,42,143V208a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V143A38,38,0,0,0,230,112ZM52.11,47.45A2,2,0,0,1,54,46H202a2,2,0,0,1,1.92,1.45L216.05,90H40ZM102,102h52v10a26,26,0,0,1-52,0Zm-64,0H90v10a26,26,0,0,1-52,0ZM202,208a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V148.66a38,38,0,0,0,42-16.21,37.95,37.95,0,0,0,64,0,38,38,0,0,0,42,16.21Zm-10-70a26,26,0,0,1-26-26V102h52v10A26,26,0,0,1,192,138Z"></path>
        </svg>
    );

    const ChevronDownIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#878787" viewBox="0 0 256 256">
            <path d="M212.24,100.24l-80,80a6,6,0,0,1-8.48,0l-80-80a6,6,0,0,1,8.48-8.48L128,167.51l75.76-75.75a6,6,0,0,1,8.48,8.48Z"></path>
        </svg>
    );

    const ChevronLeftIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#878787" viewBox="0 0 256 256">
            <path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path>
        </svg>
    );

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 h-screen bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed right-0 top-0 z-[200] h-screen w-80 overflow-y-auto bg-white p-4 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } ${className}`}
                tabIndex={-1}
                aria-labelledby="mobile-menu-drawer-navigation"
            >
                {/* Header */}
                <div className="mb-6 flex items-center justify-between gap-x-4 border-b border-gray-100 pb-5">
                    {/* Logo */}
                    <div>
                        <Link to={logoHref}>
                            <img alt={logoAlt} className="h-12 w-full rounded-lg" src={logoSrc} />
                        </Link>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="text-zinc-700 hover:text-zinc-900 transition-colors"
                        type="button"
                        aria-label="Close menu"
                    >
                        {CloseIcon}
                        <span className="sr-only">Close menu</span>
                    </button>
                </div>

                {/* Mobile Toggle Theme Placeholder */}
                <div className="mb-4">
                    {/* Theme toggle can be added here */}
                </div>

                <div className="overflow-y-auto">
                    <ul className="space-y-2">
                        {/* Menu Items */}
                        {menuItems.map((item) => {
                            if (typeof item === "undefined") return <></>;

                            return <li key={item.id}>
                                <Link
                                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-zinc-700 hover:text-red-500 hover:bg-gray-100 transition ${item.isHighlighted ? 'bg-gray-100 hover:bg-gray-200 border' : ''
                                        }`}
                                    to={item.href}
                                >
                                    <span className="flex items-center gap-x-2">
                                        {item.icon}
                                        <span className="text-sm">{item.title}</span>
                                    </span>
                                </Link>
                            </li>
                        })}

                        {/* Shop Divider */}
                        <li>
                            <div className="flex items-center">
                                <div className="h-px w-full flex-grow rounded-full bg-gray-100"></div>
                                <div className="p-2 text-gray-300">
                                    <span className="flex items-center gap-x-2">
                                        {ShopIcon}
                                    </span>
                                </div>
                                <div className="h-px w-full flex-grow rounded-full bg-gray-100"></div>
                            </div>
                        </li>

                        {/* Categories Loading State */}
                        {categoriesTreeQuery.isLoading && (
                            <li>
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-sm text-gray-500">در حال بارگذاری دسته‌بندی‌ها...</div>
                                </div>
                            </li>
                        )}

                        {/* Categories Error State */}
                        {categoriesTreeQuery.isError && (
                            <li>
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-sm text-red-500">خطا در بارگذاری دسته‌بندی‌ها</div>
                                </div>
                            </li>
                        )}

                        {/* Categories */}
                        {!categoriesTreeQuery.isLoading && !categoriesTreeQuery.isError && (categories || processedCategories).map((category) => (
                            <li key={category.id.toString()}>
                                <div className="border-b pb-2">
                                    <div className="space-y-2">
                                        <h2>
                                            <button
                                                onClick={() => toggleCategory(category.id.toString())}
                                                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-zinc-700 hover:bg-gray-100 transition"
                                                type="button"
                                                aria-expanded={expandedCategories.has(category.id.toString())}
                                            >
                                                <span className="flex items-center text-sm">{category.title}</span>
                                                <div className={`transition-transform duration-200 ${expandedCategories.has(category.id.toString()) ? 'rotate-180' : ''
                                                    }`}>
                                                    {ChevronDownIcon}
                                                </div>
                                            </button>
                                        </h2>

                                        {expandedCategories.has(category.id.toString()) && category.subCategories && (
                                            <div>
                                                <ul className="mr-4 space-y-2">
                                                    {category.subCategories.map((subCategory) => (
                                                        <li key={subCategory.id.toString()}>
                                                            {subCategory.items ? (
                                                                <div>
                                                                    <div className="space-y-2">
                                                                        <h3>
                                                                            <button
                                                                                onClick={() => toggleCategory(`${category.id}-${subCategory.id}`)}
                                                                                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-zinc-700 hover:bg-gray-100 transition"
                                                                                type="button"
                                                                                aria-expanded={expandedCategories.has(`${category.id}-${subCategory.id}`)}
                                                                            >
                                                                                <span className="line-clamp-1 flex items-center text-sm">
                                                                                    {subCategory.title}
                                                                                </span>
                                                                                <div className={`transition-transform duration-200 ${expandedCategories.has(`${category.id}-${subCategory.id}`) ? 'rotate-180' : ''
                                                                                    }`}>
                                                                                    {ChevronDownIcon}
                                                                                </div>
                                                                            </button>
                                                                        </h3>

                                                                        {expandedCategories.has(`${category.id}-${subCategory.id}`) && (
                                                                            <div>
                                                                                <ul className="mr-4 space-y-2">
                                                                                    {subCategory.items.map((item) => (
                                                                                        <li key={item.id.toString()}>
                                                                                            <Link
                                                                                                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-zinc-700 hover:bg-gray-100 transition"
                                                                                                to={item.href}
                                                                                            >
                                                                                                <span className="flex items-center gap-x-2">
                                                                                                    <span className="line-clamp-1 text-sm text-gray-700">
                                                                                                        {item.title}
                                                                                                    </span>
                                                                                                    {item.title === "همه" && ChevronLeftIcon}
                                                                                                </span>
                                                                                            </Link>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <Link
                                                                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-zinc-700 hover:bg-gray-100 transition"
                                                                    to={subCategory.href}
                                                                >
                                                                    <span className="flex items-center gap-x-2">
                                                                        <span className="line-clamp-1 text-sm text-gray-700">
                                                                            {subCategory.title}
                                                                        </span>
                                                                        {ChevronLeftIcon}
                                                                    </span>
                                                                </Link>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default MobileMenuDrawer;