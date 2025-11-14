import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PriceRangeSlider from '../components/PriceRangeSlider/PriceRangeSlider';
import { Link, useSearchParams } from 'react-router-dom';
import { useQueryStrings } from '../hooks/useQueryStrings';
import {
    useFindManyAndCountProductsQuery,
    useFindThirdLevelProductCategoriesQuery,
    useFindManyProductBrandsQuery,
} from '../services/api/ecommerce--api';

// Types
interface FilterState {
    onlyAvailable: boolean;
    selectedCategory: number | null;
    selectedBrand: number | null;
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

const ProductSearch: React.FC = () => {
    // Constants
    const MIN_PRICE = 0;
    const MAX_PRICE = 100_000_000;
    const PRODUCTS_PER_PAGE = 12;

    const [searchParams, setSearchParams] = useSearchParams();
    const queryStrings = useQueryStrings({
        q: ""
    });

    // Get initial values from URL params
    const categoryFromUrl = searchParams.get('category');
    const brandFromUrl = searchParams.get('brand');
    const minPriceFromUrl = searchParams.get('minPrice');
    const maxPriceFromUrl = searchParams.get('maxPrice');

    const initialCategoryId = categoryFromUrl ? parseInt(categoryFromUrl, 10) : null;
    const initialBrandId = brandFromUrl ? parseInt(brandFromUrl, 10) : null;
    const initialMinPrice = minPriceFromUrl ? parseInt(minPriceFromUrl, 10) : MIN_PRICE;
    const initialMaxPrice = maxPriceFromUrl ? parseInt(maxPriceFromUrl, 10) : MAX_PRICE;

    // State management
    const [filters, setFilters] = useState<FilterState>({
        onlyAvailable: false,
        selectedCategory: initialCategoryId,
        selectedBrand: initialBrandId,
        selectedSellers: [],
        priceRange: { min: initialMinPrice, max: initialMaxPrice },
        searchTerm: queryStrings.q
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortOptions, setSortOptions] = useState<SortOption[]>([
        { key: 'oldest', label: 'قدیمی', active: false, priceOrder: 'ASC' },
        { key: 'newest', label: 'جدیدترین', active: false, order: 'DESC' },
    ]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

    // Update filters when URL parameters change
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        const brandFromUrl = searchParams.get('brand');
        const minPriceFromUrl = searchParams.get('minPrice');
        const maxPriceFromUrl = searchParams.get('maxPrice');

        const categoryId = categoryFromUrl ? parseInt(categoryFromUrl, 10) : null;
        const brandId = brandFromUrl ? parseInt(brandFromUrl, 10) : null;
        const minPrice = minPriceFromUrl ? parseInt(minPriceFromUrl, 10) : MIN_PRICE;
        const maxPrice = maxPriceFromUrl ? parseInt(maxPriceFromUrl, 10) : MAX_PRICE;

        setFilters(prev => ({
            ...prev,
            selectedCategory: categoryId,
            selectedBrand: brandId,
            priceRange: { min: minPrice, max: maxPrice }
        }));
    }, [searchParams, MIN_PRICE, MAX_PRICE]);

    // Fetch categories from API
    const {
        data: categoriesResponse,
        isLoading: categoriesLoading,
        error: categoriesError
    } = useFindThirdLevelProductCategoriesQuery();

    // Fetch brands from API
    const {
        data: brandsResponse,
        isLoading: brandsLoading,
        error: brandsError
    } = useFindManyProductBrandsQuery({
        skip: 0,
        limit: 35
    });



    const categories = categoriesResponse?.data || [];
    const brands = brandsResponse?.data?.data || [];

    // Build API query parameters
    const apiParams = useMemo(() => {
        const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const activeSort = sortOptions.find(option => option.active);

        const params: any = {
            limit: PRODUCTS_PER_PAGE,
            skip: skip,
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

        // Add parentCategory filter (single category ID)


        // Add brand filter
        if (filters.selectedBrand !== null) {
            params.brand = filters.selectedBrand;
        }

        // Add sorting
        if (activeSort) {
            if (activeSort.order) {
                params.order = activeSort.order;
            }
        }

        return params;
    }, [currentPage, filters, sortOptions, MIN_PRICE, MAX_PRICE]);

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
    const error = apiError ? 'خطا در بارگذاری محصولات' : null;

    // Apply client-side filters that aren't handled by the API
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Apply price-based sorting if needed (API might handle this)
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

    // Event handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters(prev => ({ ...prev, searchTerm: value }));
        setCurrentPage(1);
    };

    // Updated price range handler to update URL parameters
    const handlePriceRangeChange = useCallback((min: number, max: number) => {
        setFilters(prev => ({
            ...prev,
            priceRange: { min, max }
        }));

        // Update URL parameters
        const newSearchParams = new URLSearchParams(searchParams);

        if (min > MIN_PRICE) {
            newSearchParams.set('minPrice', min.toString());
        } else {
            newSearchParams.delete('minPrice');
        }

        if (max < MAX_PRICE) {
            newSearchParams.set('maxPrice', max.toString());
        } else {
            newSearchParams.delete('maxPrice');
        }

        setSearchParams(newSearchParams);
        setCurrentPage(1);
    }, [searchParams, setSearchParams, MIN_PRICE, MAX_PRICE]);

    const handleClearAllFilters = () => {
        setFilters({
            onlyAvailable: false,
            selectedCategory: null,
            selectedBrand: null,
            selectedSellers: [],
            priceRange: { min: MIN_PRICE, max: MAX_PRICE },
            searchTerm: ''
        });
        setCurrentPage(1);
        // Clear URL parameters
        setSearchParams({});
        // Clear sorting as well
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

    // Updated to handle single category selection and URL parameters
    const handleCategoryChange = (categoryId: number) => {
        const newCategoryId = filters.selectedCategory === categoryId ? null : categoryId;

        setFilters(prev => ({
            ...prev,
            selectedCategory: newCategoryId
        }));

        // Update URL parameters
        const newSearchParams = new URLSearchParams(searchParams);
        if (newCategoryId !== null) {
            newSearchParams.set('category', newCategoryId.toString());
        } else {
            newSearchParams.delete('category');
        }
        setSearchParams(newSearchParams);

        setCurrentPage(1);
    };



    // Brand change handler
    const handleBrandChange = (brandId: number) => {
        const newBrandId = filters.selectedBrand === brandId ? null : brandId;

        setFilters(prev => ({
            ...prev,
            selectedBrand: newBrandId
        }));

        // Update URL parameters
        const newSearchParams = new URLSearchParams(searchParams);
        if (newBrandId !== null) {
            newSearchParams.set('brand', newBrandId.toString());
        } else {
            newSearchParams.delete('brand');
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
        return `https://jahanzar2.storage.iran.liara.space/ecommerce/products/thumbnail/${imageName}`;
    };



    // Check if price range is custom (different from default)

    // Filter content component to reuse in sidebar and modal
    const FilterContent = () => (
        <div className="flex flex-col overflow-y-auto overflow-x-hidden px-4 py-3">
            <div>
                {/* Filter Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-zinc-700">فیلتر ها</h3>
                    <button
                        onClick={handleClearAllFilters}
                        className="py-2 text-sm text-red-400 hover:text-red-500 transition"
                    >
                        حذف همه
                    </button>
                </div>

                <ul className="space-y-6 divide-y">
                    {/* Category Filter */}
                    <li>
                        <details className="group">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg py-3 text-zinc-700">
                                <span>دسته بندی</span>
                                <span className="shrink-0 transition duration-200 group-open:rotate-90">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
                                        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                                    </svg>
                                </span>
                            </summary>
                            <div className="mt-2 max-h-60 overflow-y-auto pr-1">
                                {categoriesLoading ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mx-auto"></div>
                                        <span className="text-xs text-zinc-500 mt-2 block">در حال بارگذاری...</span>
                                    </div>
                                ) : categoriesError ? (
                                    <div className="text-center py-4">
                                        <span className="text-xs text-red-500">خطا در بارگذاری دسته‌بندی‌ها</span>
                                    </div>
                                ) : (
                                    <ul className="space-y-2 rounded-lg">
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <label className="flex items-center gap-x-2 rounded-lg px-4 py-2 text-zinc-700 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        checked={filters.selectedCategory === category.id}
                                                        onChange={() => handleCategoryChange(category.id)}
                                                        className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                                                    />
                                                    <span>{category.title}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </details>
                    </li>

                    {/* Brand Filter */}
                    <li>
                        <details className="group">
                            <summary className="flex cursor-pointer items-center justify-between rounded-lg py-3 text-zinc-700">
                                <span>برند</span>
                                <span className="shrink-0 transition duration-200 group-open:rotate-90">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
                                        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                                    </svg>
                                </span>
                            </summary>
                            <div className="mt-2 max-h-60 overflow-y-auto pr-1">
                                {brandsLoading ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                                        <span className="text-xs text-zinc-500 mt-2 block">در حال بارگذاری...</span>
                                    </div>
                                ) : brandsError ? (
                                    <div className="text-center py-4">
                                        <span className="text-xs text-red-500">خطا در بارگذاری برندها</span>
                                    </div>
                                ) : (
                                    <ul className="space-y-2 rounded-lg">
                                        {brands.map((brand) => (
                                            <li key={brand.id}>
                                                <label className="flex items-center gap-x-2 rounded-lg px-4 py-2 text-zinc-700 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="brand"
                                                        checked={filters.selectedBrand === brand.id}
                                                        onChange={() => handleBrandChange(brand.id)}
                                                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span>{brand.title}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </details>
                    </li>

                    {/* Price Range Filter */}
                    <li>
                        <div className="pt-3">
                            <p className="mb-4 text-zinc-700">محدوده قیمت</p>
                            <div className="space-y-4">
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

                    {/* Available Products Toggle */}
                    <li>
                        <label className="flex cursor-pointer items-center justify-between py-3" htmlFor="onlyAvailableDesktop">
                            <div className="text-zinc-700">
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
                                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:right-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-400 peer-checked:after:-translate-x-full peer-focus:ring-red-400"></div>
                            </div>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 " dir="rtl">
            <div className="mb-8 max-md:mt-0 lg:mb-10 py-5 lg:px-10 flex flex-col md:flex-row gap-5">
                {/* Filters Sidebar - Desktop Only */}
                <div className="hidden md:block md:w-4/12 lg:w-3/12">
                    <div className="mb-4 rounded-2xl bg-white shadow-box-md">
                        <FilterContent />
                    </div>
                </div>

                {/* Main Content */}
                <div className='md:w-8/12 lg:w-9/12'>
                    <div className="">
                        {/* Sort Filter with Mobile Filter Button */}
                        <div className="bg-white shadow-box-sm rounded-2xl p-5">
                            <div className="flex flex-wrap gap-5 justify-between items-center">
                                {/* Mobile Filter Button - Left side */}
                                <button
                                    onClick={() => setIsFilterModalOpen(true)}
                                    className="md:hidden flex items-center gap-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 text-zinc-700 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256">
                                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,144H32V64H224V192Z"></path>
                                    </svg>
                                    <span className="text-sm">فیلترها</span>
                                </button>
                                
                                {/* Sort Options */}
                                <div className="flex flex-wrap gap-5 justify-start items-center">
                                    <div className="text-zinc-600 text-sm">مرتب سازی:</div>
                                    {sortOptions.map((option) => (
                                        <div
                                            key={option.key}
                                            onClick={() => handleSortChange(option.key)}
                                            className={`text-xs hover:text-red-500 transition cursor-pointer ${option.active ? 'text-red-500' : 'text-zinc-500 hover:text-red-400'
                                                }`}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                                <span className="mr-3 text-zinc-600">در حال بارگذاری...</span>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-5">
                                <p className="text-red-600 text-center">{error}</p>
                                <button
                                    onClick={() => refetch()}
                                    className="mt-2 mx-auto block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    تلاش مجدد
                                </button>
                            </div>
                        )}

                        {/* Products Grid */}
                        {!loading && !error && (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
                                    {filteredProducts.map((product) => (
                                        <Link
                                            to={"/products/" + product.id}
                                            key={product.id}
                                            className="bg-white rounded-xl shadow-box hover:drop-shadow-lg transition px-4 py-4"
                                        >
                                            <img
                                                className="mx-auto w-full h-48 object-contain object-center rounded-lg"
                                                src={getImageUrl(product.thumbnailImage)}
                                                alt={product.title}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                            <div className="text-zinc-600 text-sm mt-3 line-clamp-2">
                                                {product.title}
                                            </div>
                                            <div className="text-zinc-500 text-xs mt-2 line-clamp-2">
                                                {product.summary}
                                            </div>
                                            {/* Show brand name if available */}
                                            {product.brand && (
                                                <div className="text-zinc-400 text-xs mt-1">
                                                    برند: {product.brand.title}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-2">
                                                    {product.hasVariants && (
                                                        <div className="bg-blue-500 rounded-full px-2 py-1 text-white text-xs">
                                                            تنوع
                                                        </div>
                                                    )}
                                                    {product.stockQuantity > 0 ? (
                                                        <div className="bg-green-500 rounded-full px-2 py-1 text-white text-xs">
                                                            موجود
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-500 rounded-full px-2 py-1 text-white text-xs">
                                                            ناموجود
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-center gap-x-1 text-sm text-zinc-700">
                                                    <div>{formatPrice(product.basePrice)}</div>
                                                    <div>تومان</div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* No Products Found */}
                                {filteredProducts.length === 0 && !loading && (
                                    <div className="text-center py-12">
                                        <p className="text-zinc-500">محصولی یافت نشد</p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8">
                                        <ul className="flex items-center justify-center gap-x-2 md:gap-x-3 h-8 text-sm">
                                            <li>
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`flex items-center justify-center transition shadow-lg px-3 h-8 rounded-lg ${currentPage === 1
                                                        ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                                        : 'text-gray-500 bg-white hover:bg-red-100 hover:text-red-400'
                                                        }`}
                                                >
                                                    <svg className="w-2.5 h-2.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 6 10">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"></path>
                                                    </svg>
                                                </button>
                                            </li>

                                            {paginationNumbers.map((page, index) => (
                                                <li key={index}>
                                                    {page === '...' ? (
                                                        <span className="flex items-center justify-center px-3 h-8 text-gray-500">...</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handlePageChange(page as number)}
                                                            className={`flex items-center justify-center transition shadow-lg px-3 h-8 rounded-lg ${currentPage === page
                                                                ? 'text-red-500 bg-red-200'
                                                                : 'text-gray-500 bg-white hover:bg-red-100 hover:text-red-400'
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
                                                    className={`flex items-center justify-center transition shadow-lg px-3 h-8 rounded-lg ${currentPage === totalPages
                                                        ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                                        : 'text-gray-500 bg-white hover:bg-red-100 hover:text-red-400'
                                                        }`}
                                                >
                                                    <svg className="w-2.5 h-2.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 6 10">
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
            </div>

            {/* Filter Modal for Mobile */}
            {isFilterModalOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                        onClick={() => setIsFilterModalOpen(false)}
                    />
                    {/* Modal */}
                    <div className="fixed right-0 top-0 z-50 h-screen w-80 overflow-y-auto bg-white shadow-xl md:hidden transition-transform duration-300">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
                            <h3 className="text-lg font-semibold text-zinc-700">فیلترها</h3>
                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="text-zinc-700 hover:text-zinc-900 transition-colors"
                                aria-label="بستن"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4d4d4d" viewBox="0 0 256 256">
                                    <path d="M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="rounded-2xl">
                            <FilterContent />
                        </div>
                        {/* Apply Button */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="w-full bg-red-500 text-white rounded-lg py-3 font-medium hover:bg-red-600 transition"
                            >
                                اعمال فیلترها
                            </button>
                        </div>
                    </div>
                </>
            )}
        </main >
    );
};

export default ProductSearch;