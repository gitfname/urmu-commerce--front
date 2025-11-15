import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PriceRangeSlider from '../../components/PriceRangeSlider/PriceRangeSlider';
import { Link, useSearchParams } from 'react-router-dom';
import { useQueryStrings } from '../../hooks/useQueryStrings';
import {
    useFindManyAndCountProductsQuery,
    useFindManyProductCategoriesQuery,
} from '../../services/api/ecommerce--api';
import calculateFinalPrice from '../../utils/calculateFinalPrice';
import { twMerge } from "tailwind-merge"

// Types
interface FilterState {
    onlyAvailable: boolean;
    selectedCategory: number | null;
    selectedSellers: string[];
    priceRange: { min: number; max: number };
    searchTerm: string;
}

interface SortOption {
    key: string;
    label: string;
    active: boolean;
    order?: 'ASC' | 'DESC';
    priceOrder?: 'ASC' | 'DESC';
}

const AmazingProducts: React.FC = () => {
    // Constants
    const MIN_PRICE = 0;
    const MAX_PRICE = 100_000_000;
    const PRODUCTS_PER_PAGE = 12;

    const [searchParams, setSearchParams] = useSearchParams();
    const queryStrings = useQueryStrings({
        q: ""
    });

    // Get category ID from URL params
    const categoryFromUrl = searchParams.get('category');
    const initialCategoryId = categoryFromUrl ? parseInt(categoryFromUrl, 10) : null;

    // State management
    const [filters, setFilters] = useState<FilterState>({
        onlyAvailable: false,
        selectedCategory: initialCategoryId,
        selectedSellers: [],
        priceRange: { min: MIN_PRICE, max: MAX_PRICE },
        searchTerm: queryStrings.q
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortOptions, setSortOptions] = useState<SortOption[]>([
        { key: 'oldest', label: 'قدیمی', active: false, priceOrder: 'ASC' },
        { key: 'newest', label: 'جدیدترین', active: false, order: 'DESC' },
        { key: 'price_high', label: 'گران‌ترین', active: false, priceOrder: 'DESC' },
        { key: 'price_low', label: 'ارزان‌ترین', active: false, priceOrder: 'ASC' },
    ]);

    // Update filters when URL parameters change
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        const categoryId = categoryFromUrl ? parseInt(categoryFromUrl, 10) : null;

        setFilters(prev => ({
            ...prev,
            selectedCategory: categoryId
        }));
    }, [searchParams]);

    // Fetch categories from API
    const {
        data: categoriesResponse,
        isLoading: categoriesLoading,
        error: categoriesError
    } = useFindManyProductCategoriesQuery({
        skip: 0,
        limit: 100
    });

    const categories = categoriesResponse?.data?.data || [];

    // Build API query parameters - Add amazing products filter
    const apiParams = useMemo(() => {
        const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const activeSort = sortOptions.find(option => option.active);

        const params: any = {
            limit: PRODUCTS_PER_PAGE,
            skip: skip,
            // Add filter for amazing/featured products
            isFeatured: true, // Assuming your API has a featured field
            // or you can use a specific category for amazing products
            // amazingProducts: true,
        };

        // Add search term
        if (filters.searchTerm.trim()) {
            params.title = filters.searchTerm.trim();
        }

        // Add price range filters
        if (filters.priceRange.min > MIN_PRICE) {
            params.minPrice = filters.priceRange.min;
        }
        if (filters.priceRange.max < MAX_PRICE) {
            params.maxPrice = filters.priceRange.max;
        }

        // Add availability filter
        if (filters.onlyAvailable) {
            params.available = true;
        }

        // Add category filter (single category ID)
        if (filters.selectedCategory !== null) {
            params.category = filters.selectedCategory.toString();
        }

        // Add sorting
        if (activeSort) {
            if (activeSort.order) {
                params.order = activeSort.order;
            }
        }

        return params;
    }, [currentPage, filters, sortOptions]);

    // Use the API hook
    const {
        data: apiResponse,
        isLoading: loading,
        error: apiError,
        refetch
    } = useFindManyAndCountProductsQuery(apiParams);

    // Extract data from API response
    const products = apiResponse?.data?.data || [];
    const totalCount = apiResponse?.data?.count || 0;
    const error = apiError ? 'خطا در بارگذاری محصولات فوق‌العاده' : null;

    // Apply client-side filters that aren't handled by the API
    const filteredProducts = useMemo(() => {
        const filtered = [...products];

        // Apply price-based sorting if needed
        const activeSort = sortOptions.find(option => option.active);
        if (activeSort?.priceOrder) {
            filtered.sort((a, b) => {
                const priceA = parseInt(a.basePrice);
                const priceB = parseInt(b.basePrice);
                return activeSort.priceOrder === 'ASC' ? priceA - priceB : priceB - priceA;
            });
        }

        return filtered;
    }, [products, sortOptions]);

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
    const paginationNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    }, [currentPage, totalPages]);

    // Event handlers (same as original)
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters(prev => ({ ...prev, searchTerm: value }));
        setCurrentPage(1);
    };

    const handlePriceRangeChange = useCallback((min: number, max: number) => {
        setFilters(prev => ({
            ...prev,
            priceRange: { min, max }
        }));
        setCurrentPage(1);
    }, []);

    const handleClearAllFilters = () => {
        setFilters({
            onlyAvailable: false,
            selectedCategory: null,
            selectedSellers: [],
            priceRange: { min: MIN_PRICE, max: MAX_PRICE },
            searchTerm: ''
        });
        setCurrentPage(1);
        setSearchParams({});
        setSortOptions(prev =>
            prev.map(option => ({ ...option, active: false }))
        );
    };

    const handleToggleFilter = (filterType: keyof FilterState) => {
        setFilters(prev => {
            if (filterType === 'onlyAvailable') {
                return { ...prev, [filterType]: !prev[filterType] };
            }
            return prev;
        });
        setCurrentPage(1);
    };

    const handleCategoryChange = (categoryId: number) => {
        const newCategoryId = filters.selectedCategory === categoryId ? null : categoryId;

        setFilters(prev => ({
            ...prev,
            selectedCategory: newCategoryId
        }));

        const newSearchParams = new URLSearchParams(searchParams);
        if (newCategoryId !== null) {
            newSearchParams.set('category', newCategoryId.toString());
        } else {
            newSearchParams.delete('category');
        }
        setSearchParams(newSearchParams);

        setCurrentPage(1);
    };

    const handleSortChange = (sortKey: string) => {
        setSortOptions(prev =>
            prev.map(option => ({
                ...option,
                active: option.key === sortKey
            }))
        );
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatPrice = (price: string) => {
        return parseInt(price).toLocaleString('fa-IR');
    };

    const getImageUrl = (imageName: string) => {
        return `https://narenjitoy--bucket.storage.c2.liara.space/ecommerce/products/thumbnail/${imageName}`;
    };

    // Get selected category title for display
    const selectedCategoryTitle = useMemo(() => {
        if (filters.selectedCategory === null) return null;
        const category = categories.find(cat => cat.id === filters.selectedCategory);
        return category?.title || null;
    }, [filters.selectedCategory, categories]);

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-[5rem] md:mt-10" dir="rtl">
            {/* Hero Section for Amazing Products */}
            <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 p-8 text-white">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <svg className="w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <h1 className="text-3xl md:text-4xl font-bold">محصولات فوق‌العاده</h1>
                        <svg className="w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <p className="text-lg md:text-xl opacity-90">بهترین و منحصربه‌فردترین محصولات را اینجا پیدا کنید</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                        <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                        <span className="text-sm">ویژه و محدود</span>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white border-opacity-30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white border-opacity-30 rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md mx-auto">
                    <input
                        type="text"
                        value={filters.searchTerm}
                        onChange={handleSearchChange}
                        placeholder="جستجو در محصولات فوق‌العاده..."
                        className="w-full pl-10 pr-4 py-4 border-2 border-red-300 rounded-2xl focus:ring-4 focus:ring-red-200 focus:border-red-500 outline-none shadow-lg transition-all duration-300"
                        dir="rtl"
                    />
                    <svg
                        className="absolute top-4 left-3 w-6 h-6 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Show selected category with enhanced styling */}
            {selectedCategoryTitle && (
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-6 py-3 rounded-2xl shadow-lg border border-red-200">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">دسته‌بندی: {selectedCategoryTitle}</span>
                        <button
                            onClick={() => handleCategoryChange(filters.selectedCategory!)}
                            className="text-red-500 hover:text-red-700 bg-white rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            title="حذف فیلتر دسته‌بندی"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="my-8 max-md:mt-0 lg:my-10 py-5 lg:px-10 flex flex-col md:flex-row gap-5">
                {/* Enhanced Filters Sidebar */}
                <div className="md:w-4/12 lg:w-3/12">
                    <div className="mb-4 rounded-3xl bg-gradient-to-br from-white to-red-50 shadow-xl border border-red-100">
                        <div className="flex flex-col overflow-y-auto overflow-x-hidden px-6 py-5">
                            <div>
                                {/* Enhanced Filter Header */}
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-zinc-700 font-bold text-lg flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                        </svg>
                                        فیلتر های ویژه
                                    </h3>
                                    <button
                                        onClick={handleClearAllFilters}
                                        className="py-2 px-3 text-sm text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200"
                                    >
                                        حذف همه
                                    </button>
                                </div>

                                <ul className="space-y-6 divide-y divide-red-100">
                                    {/* Enhanced Category Filter */}
                                    <li>
                                        <details className="group">
                                            <summary className="flex cursor-pointer items-center justify-between rounded-xl py-3 px-2 text-zinc-700 hover:bg-red-50 transition-colors">
                                                <span className="font-medium">دسته بندی</span>
                                                <span className="shrink-0 transition duration-300 group-open:rotate-90">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ef4444" viewBox="0 0 256 256">
                                                        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                                                    </svg>
                                                </span>
                                            </summary>
                                            <div className="mt-3 max-h-60 overflow-y-auto pr-1">
                                                {categoriesLoading ? (
                                                    <div className="text-center py-6">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
                                                        <span className="text-xs text-zinc-500 mt-3 block">در حال بارگذاری...</span>
                                                    </div>
                                                ) : categoriesError ? (
                                                    <div className="text-center py-6">
                                                        <span className="text-xs text-red-500">خطا در بارگذاری دسته‌بندی‌ها</span>
                                                    </div>
                                                ) : (
                                                    <ul className="space-y-3 rounded-xl">
                                                        {categories.map((category) => (
                                                            <li key={category.id}>
                                                                <label className="flex items-center gap-x-3 rounded-xl px-4 py-3 text-zinc-700 cursor-pointer hover:bg-red-50 transition-colors">
                                                                    <input
                                                                        type="radio"
                                                                        name="category"
                                                                        checked={filters.selectedCategory === category.id}
                                                                        onChange={() => handleCategoryChange(category.id)}
                                                                        className="rounded border-gray-300 text-red-500 focus:ring-red-500 w-4 h-4"
                                                                    />
                                                                    <span className="font-medium">{category.title}</span>
                                                                </label>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </details>
                                    </li>

                                    {/* Enhanced Price Range Filter */}
                                    <li>
                                        <div className="pt-4">
                                            <p className="mb-4 text-zinc-700 font-medium flex items-center gap-2">
                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                </svg>
                                                محدوده قیمت ویژه
                                            </p>
                                            <div className="space-y-4 bg-red-50 rounded-xl p-4">
                                                <PriceRangeSlider
                                                    min={1000}
                                                    max={100_000_000}
                                                    defaultMinValue={filters.priceRange.min}
                                                    defaultMaxValue={filters.priceRange.max}
                                                    rtl={true}
                                                    step={10_000}
                                                    currency=''
                                                    onMinFormat={(value) => value.toLocaleString("fa")}
                                                    onMaxFormat={(value) => value.toLocaleString("fa")}
                                                    onRangeChange={handlePriceRangeChange}
                                                />
                                            </div>
                                        </div>
                                    </li>

                                    {/* Enhanced Available Products Toggle */}
                                    <li>
                                        <label className="flex cursor-pointer items-center justify-between py-4 px-2 rounded-xl hover:bg-red-50 transition-colors" htmlFor="onlyAvailableDesktop">
                                            <div className="text-zinc-700 font-medium flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                فقط کالا های موجود
                                            </div>
                                            <div className="relative inline-flex cursor-pointer items-center">
                                                <input
                                                    className="peer sr-only"
                                                    id="onlyAvailableDesktop"
                                                    type="checkbox"
                                                    checked={filters.onlyAvailable}
                                                    onChange={() => handleToggleFilter('onlyAvailable')}
                                                />
                                                <div className="peer h-7 w-12 rounded-full bg-gray-200 after:absolute after:right-[2px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-500 peer-checked:after:-translate-x-full peer-focus:ring-red-400 shadow-inner"></div>
                                            </div>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:w-8/12 lg:w-9/12">
                    {/* Enhanced Sort Filter */}
                    <div className="bg-gradient-to-r from-white to-red-50 shadow-xl rounded-3xl grid place-items-start p-6 border border-red-100">
                        <div className="flex flex-wrap gap-5 justify-start items-center">
                            <div className="text-zinc-600 font-medium flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 000 2h11.586l-2.293 2.293a1 1 0 101.414 1.414L18.414 5.414a1 1 0 000-1.414L13.707.293a1 1 0 00-1.414 1.414L14.586 4H3zM17 16a1 1 0 100-2H5.414l2.293-2.293a1 1 0 00-1.414-1.414L1.586 14.586a1 1 0 000 1.414l4.707 4.707a1 1 0 001.414-1.414L5.414 16H17z" />
                                </svg>
                                مرتب سازی ویژه:
                            </div>
                            {sortOptions.map((option) => (
                                <div
                                    key={option.key}
                                    onClick={() => handleSortChange(option.key)}
                                    className={`text-sm hover:text-red-500 transition cursor-pointer px-3 py-2 rounded-lg ${option.active
                                        ? 'text-white bg-red-500 shadow-lg'
                                        : 'text-zinc-500 hover:text-red-400 hover:bg-red-50'
                                        }`}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-500"></div>
                            <span className="mr-4 text-zinc-600 text-lg">در حال بارگذاری محصولات فوق‌العاده...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mt-5">
                            <p className="text-red-600 text-center text-lg">{error}</p>
                            <button
                                onClick={() => refetch()}
                                className="mt-4 mx-auto block px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg"
                            >
                                تلاش مجدد
                            </button>
                        </div>
                    )}

                    {/* Enhanced Products Grid */}
                    {!loading && !error && (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                                {filteredProducts.map((product, index) => (
                                    <Link
                                        to={"/products/" + product.id}
                                        key={product.id}
                                        className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 px-5 py-5 relative overflow-hidden group border border-red-100 hover:border-red-300 transform hover:-translate-y-2"
                                    >
                                        {/* Special badge for amazing products */}
                                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                ویژه
                                            </div>

                                            {
                                                product.category?.title?.length
                                                    ?
                                                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                        {product.category?.title}
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>

                                        {/* Gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                                        <img
                                            className="mx-auto w-full h-48 object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-300"
                                            src={getImageUrl(product.thumbnailImage)}
                                            alt={product.title}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                        <div className="text-zinc-700 font-medium mt-4 line-clamp-2 group-hover:text-red-600 transition-colors">
                                            {product.title}
                                        </div>
                                        <div className="text-zinc-500 text-sm mt-2 line-clamp-2">
                                            {product.summary}
                                        </div>
                                        <div className={twMerge("flex items-center justify-between mt-4", product.baseDiscount && "flex-col items-start")}>
                                            <div className="flex items-center gap-2">
                                                {product.hasVariants && (
                                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full px-3 py-1 text-white text-xs shadow-md">
                                                        تنوع
                                                    </div>
                                                )}
                                                {product.stockQuantity > 0 ? (
                                                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full px-3 py-1 text-white text-xs shadow-md">
                                                        موجود
                                                    </div>
                                                ) : (
                                                    <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-full px-3 py-1 text-white text-xs shadow-md">
                                                        ناموجود
                                                    </div>
                                                )}
                                            </div>
                                            {
                                                product.baseDiscount
                                                    ?
                                                    <div className='mr-auto mt-2'>
                                                        <div className="flex justify-center gap-x-1 text-lg font-bold text-red-600">
                                                            <div>{formatPrice(calculateFinalPrice(+product.basePrice, product.baseDiscount).toString())}</div>
                                                            <div>تومان</div>
                                                        </div>

                                                        <div className="flex justify-center gap-x-1 text-sm line-through font-normal text-zinc-400">
                                                            <div>{formatPrice(product.basePrice)}</div>
                                                            <div>تومان</div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="flex justify-center gap-x-1 text-lg font-bold text-red-600">
                                                        <div>{formatPrice(calculateFinalPrice(+product.basePrice, product.baseDiscount).toString())}</div>
                                                        <div>تومان</div>
                                                    </div>
                                            }
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* No Products Found */}
                            {filteredProducts.length === 0 && !loading && (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 mx-auto mb-4 text-red-300">
                                        <svg fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-zinc-500 text-lg">محصول فوق‌العاده‌ای یافت نشد</p>
                                    {/* <p className="text-zinc-400 text-sm mt-2">لطفاً فیلترهای خود را تغییر دهید</p> */}
                                </div>
                            )}

                            {/* Enhanced Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12">
                                    <ul className="flex items-center justify-center gap-x-3 md:gap-x-4 h-10 text-sm">
                                        <li>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`flex items-center justify-center transition-all duration-200 shadow-lg px-4 h-10 rounded-xl ${currentPage === 1
                                                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                                    : 'text-gray-600 bg-white hover:bg-red-100 hover:text-red-500 hover:shadow-xl'
                                                    }`}
                                            >
                                                <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 6 10">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"></path>
                                                </svg>
                                            </button>
                                        </li>

                                        {paginationNumbers.map((page, index) => (
                                            <li key={index}>
                                                {page === '...' ? (
                                                    <span className="flex items-center justify-center px-4 h-10 text-gray-500">...</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePageChange(page as number)}
                                                        className={`flex items-center justify-center transition-all duration-200 shadow-lg px-4 h-10 rounded-xl ${currentPage === page
                                                            ? 'text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-xl'
                                                            : 'text-gray-600 bg-white hover:bg-red-100 hover:text-red-500 hover:shadow-xl'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                )}
                                            </li>
                                        ))}

                                        <li>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`flex items-center justify-center transition-all duration-200 shadow-lg px-4 h-10 rounded-xl ${currentPage === totalPages
                                                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                                    : 'text-gray-600 bg-white hover:bg-red-100 hover:text-red-500 hover:shadow-xl'
                                                    }`}
                                            >
                                                <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 6 10">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"></path>
                                                </svg>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default AmazingProducts;