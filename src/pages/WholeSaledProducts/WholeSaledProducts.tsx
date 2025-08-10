import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQueryStrings } from '../../hooks/useQueryStrings';
import PriceRangeSlider from '../../components/PriceRangeSlider/PriceRangeSlider';
import {
    getFindManyAndCountProductsQueryQueryKey,
    useFindManyAndCountProductsQuery,
    type FindManyAndCountProductsQueryParams,
    type ProductsSerializer
} from '../../services/api/ecommerce--api';
import calculateFinalPrice from '../../utils/calculateFinalPrice';

// Updated Product interface to match the API response
interface Product extends ProductsSerializer {
    // Add any additional properties you need for the UI
    discount?: number;
    englishName?: string;
    rating?: number;
    reviewCount?: number;
    originalPrice?: string;
}

interface FilterState {
    onlyAvailable: boolean;
    onlySpecial: boolean;
    selectedBrands: string[];
    selectedCategories: string[];
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

const WholeSaledProductsSearch: React.FC = () => {
    // Constants
    const MIN_PRICE = 0;
    const MAX_PRICE = 100_000_000;
    const PRODUCTS_PER_PAGE = 12;

    // State management
    const [currentPage, setCurrentPage] = useState<number>(1);

    const queryStrings = useQueryStrings({
        q: ""
    });

    const [filters, setFilters] = useState<FilterState>({
        onlyAvailable: false,
        onlySpecial: false,
        selectedBrands: [],
        selectedCategories: [],
        selectedSellers: [],
        priceRange: { min: MIN_PRICE, max: MAX_PRICE },
        searchTerm: queryStrings.q
    });

    const [brandSearchTerm, setBrandSearchTerm] = useState<string>('');
    const [sortOptions, setSortOptions] = useState<SortOption[]>([
        { key: 'cheapest', label: 'ارزان ترین', active: false, priceOrder: 'ASC' },
        { key: 'expensive', label: 'گران ترین', active: false, priceOrder: 'DESC' },
        { key: 'newest', label: 'جدیدترین', active: false, order: 'DESC' },
    ]);

    // Build API query parameters
    const queryParams = useMemo((): FindManyAndCountProductsQueryParams => {
        const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const activeSort = sortOptions.find(option => option.active);

        const params: FindManyAndCountProductsQueryParams = {
            limit: PRODUCTS_PER_PAGE,
            skip: skip,
            isWholesale: true, // Filter for wholesale products
        };

        if (filters.searchTerm.trim()) {
            params.title = filters.searchTerm.trim();
        }

        if (activeSort?.order) {
            params.order = activeSort.order;
        }

        if (filters.priceRange.min > MIN_PRICE) {
            params.minPrice = filters.priceRange.min;
        }

        if (filters.priceRange.max < MAX_PRICE) {
            params.maxPrice = filters.priceRange.max;
        }

        if (filters.onlyAvailable) {
            params.available = true;
        }

        return params;
    }, [currentPage, filters, sortOptions]);

    // Use the generated API hook
    const {
        data: apiResponse,
        isLoading: loading,
        error: apiError,
        refetch: fetchProducts
    } = useFindManyAndCountProductsQuery(queryParams, {
        query: {
            queryKey: getFindManyAndCountProductsQueryQueryKey(queryParams),
            retry: false
        }
    });

    // Extract products and count from API response
    const products = useMemo(() => {
        return apiResponse?.data?.data || [];
    }, [apiResponse]);

    const totalCount = useMemo(() => {
        return apiResponse?.data?.count || 0;
    }, [apiResponse]);

    // Handle API errors
    const error = useMemo(() => {
        if (apiError) {
            return apiError.message || 'خطا در بارگذاری محصولات';
        }
        return null;
    }, [apiError]);

    // Apply client-side filters that aren't handled by the API
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Apply special products filter (hasVariants)
        if (filters.onlySpecial) {
            filtered = filtered.filter(product => product.hasVariants);
        }

        // Apply brand filter if brands are selected
        if (filters.selectedBrands.length > 0) {
            filtered = filtered.filter(product =>
                product.brand && filters.selectedBrands.includes(product.brand.id.toString())
            );
        }

        // Apply category filter if categories are selected
        if (filters.selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                product.category && filters.selectedCategories.includes(product.category.id.toString())
            );
        }

        return filtered;
    }, [products, filters]);

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
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    }, [currentPage, totalPages]);

    // Sample data for filters (you might want to fetch these from API as well)
    const categories = [
        { name: 'موبایل', href: '#' },
        { name: 'کالای دیجیتال', href: '#' },
        { name: 'آرایشی بهداشتی', href: '#' }
    ];

    const brands = [
        { id: 'nike', name: 'نایک', englishName: 'nike' },
        { id: 'adidas', name: 'آدیداس', englishName: 'adidas' },
        { id: 'samsung', name: 'سامسونگ', englishName: 'samsung' },
        { id: 'apple', name: 'اپل', englishName: 'apple' }
    ];

    const sellerTypes = [
        { id: 'medkala', name: 'بازرگانان بدون مرز - BBM' },
        { id: 'official', name: 'فروشنده رسمی' }
    ];

    // --- EVENT HANDLERS ---

    const handleWishlistClick = (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        alert(`Product ${productId} added to wishlist!`);
    };

    const handleCompareClick = (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        alert(`Product ${productId} added to comparison!`);
    };

    const handleBuyClick = (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        alert(`Buying product ${productId}!`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
        setCurrentPage(1);
    };

    const handlePriceRangeChange = useCallback((min: number, max: number) => {
        setFilters(prev => ({ ...prev, priceRange: { min, max } }));
        setCurrentPage(1);
    }, []);

    const handleClearAllFilters = () => {
        setFilters({
            onlyAvailable: false,
            onlySpecial: false,
            selectedBrands: [],
            selectedCategories: [],
            selectedSellers: [],
            priceRange: { min: MIN_PRICE, max: MAX_PRICE },
            searchTerm: ''
        });
        setBrandSearchTerm('');
        setCurrentPage(1);
        setSortOptions(prev => prev.map(option => ({ ...option, active: false })));
    };

    const handleToggleFilter = (filterType: keyof FilterState) => {
        if (filterType === 'onlyAvailable' || filterType === 'onlySpecial') {
            setFilters(prev => ({ ...prev, [filterType]: !prev[filterType] }));
            setCurrentPage(1);
        }
    };

    const handleBrandChange = (brandId: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            selectedBrands: checked
                ? [...prev.selectedBrands, brandId]
                : prev.selectedBrands.filter(id => id !== brandId)
        }));
        setCurrentPage(1);
    };

    const handleSellerChange = (sellerId: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            selectedSellers: checked
                ? [...prev.selectedSellers, sellerId]
                : prev.selectedSellers.filter(id => id !== sellerId)
        }));
        setCurrentPage(1);
    };

    const handleSortChange = (sortKey: string) => {
        setSortOptions(prev => prev.map(option => ({ ...option, active: option.key === sortKey })));
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.includes(brandSearchTerm) || brand.englishName.includes(brandSearchTerm)
    );

    // --- Utility Functions ---
    const formatPrice = (price: string | undefined) => {
        if (!price) return '0';
        return parseInt(price).toLocaleString('fa-IR');
    };

    const getImageUrl = (imageName: string) => {
        return `https://jahanzar2.storage.iran.liara.space/ecommerce/products/thumbnail/${imageName}`;
    };

    // Rest of your JSX remains the same...
    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-[5rem] md:mt-44" dir="rtl">
            {/* Search Bar */}
            <div className="mb-2">
                <div className="relative max-w-md mx-auto">
                    <input
                        type="text"
                        value={filters.searchTerm}
                        onChange={handleSearchChange}
                        placeholder="جستجوی محصولات..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        dir="rtl"
                    />
                    <svg
                        className="absolute top-3.5 left-3 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="my-8 max-md:mt-0 lg:my-10 py-5 lg:px-10 flex flex-col md:flex-row gap-5">
                {/* Filters Sidebar */}
                <div className="md:w-4/12 lg:w-3/12">
                    <div className="mb-4 rounded-2xl bg-white shadow-box-md">
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
                                                <ul className="space-y-2 rounded-lg">
                                                    {categories.map((category, index) => (
                                                        <li key={index}>
                                                            <a className="flex items-center gap-x-2 rounded-lg px-4 py-2 text-zinc-700" href={category.href}>
                                                                <span>{category.name}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
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

                                    {/* Brand Filter */}
                                    <li>
                                        <details className="group">
                                            <summary className="flex cursor-pointer items-center justify-between rounded-lg pt-3 text-zinc-700">
                                                <span>برند</span>
                                                <span className="shrink-0 transition duration-200 group-open:rotate-90">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256">
                                                        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                                                    </svg>
                                                </span>
                                            </summary>
                                            <div className="max-h-60 overflow-y-auto pr-1">
                                                <ul className="space-y-2 rounded-lg">
                                                    <li className="p-2 relative">
                                                        <input
                                                            value={brandSearchTerm}
                                                            onChange={(e) => setBrandSearchTerm(e.target.value)}
                                                            className="w-full pl-10 rounded-lg border border-none bg-gray-100 px-7 py-3 text-zinc-600 outline-none placeholder:text-sm placeholder:text-zinc-500 focus:ring-0 text-right"
                                                            placeholder="جستجوی برند ..."
                                                            type="text"
                                                            dir="rtl"
                                                        />
                                                        <svg className="absolute top-6 left-4 fill-zinc-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                                                            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                                                        </svg>
                                                    </li>
                                                    {filteredBrands.map((brand) => (
                                                        <li key={brand.id}>
                                                            <div className="flex w-full items-center gap-x-2 pl-4 bg-gray-50 rounded-md">
                                                                <input
                                                                    id={`brand-${brand.id}`}
                                                                    type="checkbox"
                                                                    checked={filters.selectedBrands.includes(brand.id)}
                                                                    onChange={(e) => handleBrandChange(brand.id, e.target.checked)}
                                                                    className="h-4 w-4 cursor-pointer rounded-xl border-gray-300 bg-gray-100"
                                                                />
                                                                <label htmlFor={`brand-${brand.id}`} className="flex w-full cursor-pointer items-center justify-between py-2 pr-4 font-medium text-zinc-600">
                                                                    <span className="text-gray-400 text-sm">{brand.englishName}</span>
                                                                    <span>{brand.name}</span>
                                                                </label>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </details>
                                    </li>

                                    {/* Seller Type Filter */}
                                    <li>
                                        <details className="group">
                                            <summary className="flex cursor-pointer items-center justify-between rounded-lg pt-3 text-zinc-700">
                                                <span>نوع فروشنده</span>
                                                <span className="shrink-0 transition duration-200 group-open:rotate-90">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256">
                                                        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                                                    </svg>
                                                </span>
                                            </summary>
                                            <div className="mt-2 max-h-60 overflow-y-auto pr-1">
                                                <ul className="space-y-2 rounded-lg">
                                                    {sellerTypes.map((seller) => (
                                                        <li key={seller.id}>
                                                            <div className="flex w-full items-center gap-x-2 pl-4">
                                                                <input
                                                                    id={`seller-${seller.id}`}
                                                                    type="checkbox"
                                                                    checked={filters.selectedSellers.includes(seller.id)}
                                                                    onChange={(e) => handleSellerChange(seller.id, e.target.checked)}
                                                                    className="h-4 w-4 cursor-pointer rounded-xl border-gray-300 bg-gray-100"
                                                                />
                                                                <label htmlFor={`seller-${seller.id}`} className="flex w-full cursor-pointer items-center py-2 pr-4 font-medium text-zinc-600">
                                                                    <span>{seller.name}</span>
                                                                </label>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </details>
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

                                    {/* Special Products Toggle */}
                                    <li>
                                        <label className="flex cursor-pointer items-center justify-between py-3" htmlFor="onlySpecialDesktop">
                                            <div className="text-zinc-700">
                                                فقط محصولات دارای تنوع
                                            </div>
                                            <div className="relative inline-flex cursor-pointer items-center">
                                                <input
                                                    className="peer sr-only"
                                                    id="onlySpecialDesktop"
                                                    type="checkbox"
                                                    checked={filters.onlySpecial}
                                                    onChange={() => handleToggleFilter('onlySpecial')}
                                                />
                                                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:right-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-400 peer-checked:after:-translate-x-full peer-focus:ring-red-400"></div>
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
                    {/* Sort Filter */}
                    <div className="bg-white shadow-box-sm rounded-2xl grid place-items-start p-5">
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
                                onClick={() => fetchProducts()}
                                className="mt-2 mx-auto block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                تلاش مجدد
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 mt-5">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="bg-white rounded-xl shadow-box hover:drop-shadow-lg transition-shadow px-4 py-4">
                                        <Link to={`/products/${product.id}`}>
                                            <div className="flex justify-between">
                                                <div className="flex gap-x-1 ml-auto">
                                                    <div>
                                                        <button
                                                            onClick={(e) => handleWishlistClick(e, product.id)}
                                                            className="bg-gray-200 rounded-full p-1 hover:fill-red-500 transition"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#2b2b2b" viewBox="0 0 256 256">
                                                                <path d="M178,34c-21,0-39.26,9.47-50,25.34C117.26,43.47,99,34,78,34A60.07,60.07,0,0,0,18,94c0,29.2,18.2,59.59,54.1,90.31a334.68,334.68,0,0,0,53.06,37,6,6,0,0,0,5.68,0,334.68,334.68,0,0,0,53.06-37C219.8,153.59,238,123.2,238,94A60.07,60.07,0,0,0,178,34ZM128,209.11C111.59,199.64,30,149.72,30,94A48.05,48.05,0,0,1,78,46c20.28,0,37.31,10.83,44.45,28.27a6,6,0,0,0,11.1,0C140.69,56.83,157.72,46,178,46a48.05,48.05,0,0,1,48,48C226,149.72,144.41,199.64,128,209.11Z"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={(e) => handleCompareClick(e, product.id)}
                                                            className="bg-gray-200 rounded-full p-1 hover:fill-zinc-500 transition"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#2b2b2b" viewBox="0 0 256 256">
                                                                <path d="M236.24,179.76a6,6,0,0,1,0,8.48l-24,24a6,6,0,0,1-8.48-8.48L217.52,190H200.94a70.16,70.16,0,0,1-57-29.31l-41.71-58.4A58.11,58.11,0,0,0,55.06,78H32a6,6,0,0,1,0-12H55.06a70.16,70.16,0,0,1,57,29.31l41.71,58.4A58.11,58.11,0,0,0,200.94,178h16.58l-13.76-13.76a6,6,0,0,1,8.48-8.48Zm-92.06-74.41a5.91,5.91,0,0,0,3.48,1.12,6,6,0,0,0,4.89-2.51l1.19-1.67A58.11,58.11,0,0,1,200.94,78h16.58L203.76,91.76a6,6,0,1,0,8.48,8.48l24-24a6,6,0,0,0,0-8.48l-24-24a6,6,0,0,0-8.48,8.48L217.52,66H200.94a70.16,70.16,0,0,0-57,29.31L142.78,97A6,6,0,0,0,144.18,105.35Zm-32.36,45.3a6,6,0,0,0-8.37,1.39l-1.19,1.67A58.11,58.11,0,0,1,55.06,178H32a6,6,0,0,0,0,12H55.06a70.16,70.16,0,0,0,57-29.31l1.19-1.67A6,6,0,0,0,111.82,150.65Z"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {product.baseDiscount > 0 && (
                                                    <div className="bg-red-200 rounded-lg px-2 py-1 text-red-500 flex items-center gap-x-1 text-xs">
                                                        <div>{product.baseDiscount}%</div>
                                                        <div>تخفیف</div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="image-box my-6">
                                                <img
                                                    className="max-w-52 h-48 object-contain mx-auto"
                                                    src={getImageUrl(product.thumbnailImage)}
                                                    alt={product.title}
                                                    loading="lazy"
                                                />
                                            </div>
                                        </Link>

                                        <div className="space-y-6">
                                            <Link to={`/products/${product.id}`} className="mb-2 h-10 flex justify-between">
                                                <div className="flex flex-col gap-y-2">
                                                    <span className="text-sm font-semibold text-zinc-800 line-clamp-1">{product.title}</span>
                                                    <span className="text-xs text-zinc-500 line-clamp-1">{product.brand?.title}</span>
                                                </div>
                                            </Link>

                                            <div className="bg-gray-100 rounded-xl py-3 px-2 flex justify-between items-center">
                                                {
                                                    product.baseDiscount
                                                        ?
                                                        <div>
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

                                                <div>
                                                    <Link
                                                        to={"/products/" + product.id}
                                                        className="flex items-center gap-x-1 text-sm py-2 px-2 rounded-lg text-white bg-red-500 hover:bg-red-400 transition shadow-lg shadow-red-500/50"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ededed" viewBox="0 0 256 256">
                                                            <path d="M136,120v56a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0ZM239.86,98.11,226,202.12A16,16,0,0,1,210.13,216H45.87A16,16,0,0,1,30,202.12l-13.87-104A16,16,0,0,1,32,80H68.37L122,18.73a8,8,0,0,1,12,0L187.63,80H224a16,16,0,0,1,15.85,18.11ZM89.63,80h76.74L128,36.15ZM224,96H32L45.87,200H210.13Zm-51.16,23.2-5.6,56A8,8,0,0,0,174.4,184a7.44,7.44,0,0,0,.81,0,8,8,0,0,0,7.95-7.2l5.6-56a8,8,0,0,0-15.92-1.6Zm-89.68,0a8,8,0,0,0-15.92,1.6l5.6,56a8,8,0,0,0,8,7.2,7.44,7.44,0,0,0,.81,0,8,8,0,0,0,7.16-8.76Z"></path>
                                                        </svg>
                                                        خرید محصول
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
        </main>
    );
};

export default WholeSaledProductsSearch;



















// BEFORE CONNECTING TO ORVAL
// import React, { useState, useCallback, useEffect, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import { useQueryStrings } from '../../hooks/useQueryStrings';
// import PriceRangeSlider from '../../components/PriceRangeSlider/PriceRangeSlider';

// // Types
// // NOTE: I've updated the Product interface to include the new fields
// // required by the new product card, like discount, rating, etc.
// interface Product {
//     id: number;
//     title: string;
//     slug: string;
//     summary: string;
//     basePrice: string;
//     stockQuantity: number;
//     hasVariants: boolean;
//     thumbnailImage: string;
//     images: string[];
//     createdAt: string;
//     updatedAt: string;
//     isWholesale: boolean; // Property to filter by
//     // New properties for the new card
//     discount?: number;
//     englishName?: string;
//     rating?: number;
//     reviewCount?: number;
//     originalPrice?: string;
// }

// interface ApiResponse {
//     data: Product[];
//     count: number;
// }

// interface FilterState {
//     onlyAvailable: boolean;
//     onlySpecial: boolean;
//     selectedBrands: string[];
//     selectedCategories: string[];
//     selectedSellers: string[];
//     priceRange: { min: number; max: number };
//     searchTerm: string;
// }

// interface SortOption {
//     key: string;
//     label: string;
//     active: boolean;
//     order?: 'ASC' | 'DESC';
//     priceOrder?: 'ASC' | 'DESC';
// }

// const WholeSaledProductsSearch: React.FC = () => {
//     // Constants
//     const MIN_PRICE = 0;
//     const MAX_PRICE = 100_000_0000;
//     const PRODUCTS_PER_PAGE = 12;
//     const API_BASE_URL = 'https://urmu-commerce-prod.runflare.run';
//     // const API_BASE_URL = 'https://urmu-commerce-prod.runflare.run';

//     // State management
//     const [products, setProducts] = useState<Product[]>([]);
//     const [totalCount, setTotalCount] = useState<number>(0);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     const queryStrings = useQueryStrings({
//         q: ""
//     })

//     const [filters, setFilters] = useState<FilterState>({
//         onlyAvailable: false,
//         onlySpecial: false,
//         selectedBrands: [],
//         selectedCategories: [],
//         selectedSellers: [],
//         priceRange: { min: MIN_PRICE, max: MAX_PRICE },
//         searchTerm: queryStrings.q
//     });

//     const [brandSearchTerm, setBrandSearchTerm] = useState<string>('');
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [sortOptions, setSortOptions] = useState<SortOption[]>([
//         { key: 'cheapest', label: 'ارزان ترین', active: false, priceOrder: 'ASC' },
//         { key: 'expensive', label: 'گران ترین', active: false, priceOrder: 'DESC' },
//         { key: 'newest', label: 'جدیدترین', active: false, order: 'DESC' },
//     ]);

//     // Sample data for filters (can be fetched from API in a real app)
//     const categories = [
//         { name: 'موبایل', href: '#' },
//         { name: 'کالای دیجیتال', href: '#' },
//         { name: 'آرایشی بهداشتی', href: '#' }
//     ];

//     const brands = [
//         { id: 'nike', name: 'نایک', englishName: 'nike' },
//         { id: 'adidas', name: 'آدیداس', englishName: 'adidas' },
//         { id: 'samsung', name: 'سامسونگ', englishName: 'samsung' },
//         { id: 'apple', name: 'اپل', englishName: 'apple' }
//     ];

//     const sellerTypes = [
//         { id: 'medkala', name: 'بازرگانان بدون مرز - BBM' },
//         { id: 'official', name: 'فروشنده رسمی' }
//     ];

//     // API call function
//     const fetchProducts = useCallback(async () => {
//         setLoading(true);
//         setError(null);

//         try {
//             const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;
//             const params = new URLSearchParams({
//                 limit: PRODUCTS_PER_PAGE.toString(),
//                 skip: skip.toString(),
//                 isWholesale: 'true'
//             });

//             if (filters.searchTerm.trim()) {
//                 params.append('title', filters.searchTerm.trim());
//             }

//             const activeSort = sortOptions.find(option => option.active);
//             if (activeSort) {
//                 if (activeSort.order) params.append('order', activeSort.order);
//                 if (activeSort.priceOrder) params.append('priceOrder', activeSort.priceOrder);
//             }

//             const response = await fetch(`${API_BASE_URL}/products?${params}`);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data: ApiResponse = await response.json();
//             setProducts(data.data);
//             setTotalCount(data.count);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'خطا در بارگذاری محصولات');
//             setProducts([]);
//             setTotalCount(0);
//         } finally {
//             setLoading(false);
//         }
//     }, [currentPage, filters.searchTerm, sortOptions]);

//     const filteredProducts = useMemo(() => {
//         let filtered = [...products];

//         if (filters.onlyAvailable) {
//             filtered = filtered.filter(product => product.stockQuantity > 0);
//         }
//         if (filters.onlySpecial) {
//             filtered = filtered.filter(product => product.hasVariants);
//         }
//         filtered = filtered.filter(product => {
//             const price = parseInt(product.basePrice);
//             return price >= filters.priceRange.min && price <= filters.priceRange.max;
//         });

//         return filtered;
//     }, [products, filters]);

//     const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

//     const paginationNumbers = useMemo(() => {
//         // ... (pagination logic remains the same)
//         const pages = [];
//         const maxVisible = 5;

//         if (totalPages <= maxVisible) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pages.push(i);
//             }
//         } else {
//             if (currentPage <= 3) {
//                 pages.push(1, 2, 3, 4, '...', totalPages);
//             } else if (currentPage >= totalPages - 2) {
//                 pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//             } else {
//                 pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
//             }
//         }
//         return pages;
//     }, [currentPage, totalPages]);


//     useEffect(() => {
//         fetchProducts();
//     }, [fetchProducts]);

//     // --- EVENT HANDLERS ---

//     // **NEW**: Placeholder handlers for new card buttons
//     const handleWishlistClick = (e: React.MouseEvent, productId: number) => {
//         e.preventDefault(); // Prevent link navigation
//         alert(`Product ${productId} added to wishlist!`);
//     };

//     const handleCompareClick = (e: React.MouseEvent, productId: number) => {
//         e.preventDefault(); // Prevent link navigation
//         alert(`Product ${productId} added to comparison!`);
//     };

//     const handleBuyClick = (e: React.MouseEvent, productId: number) => {
//         e.preventDefault(); // Prevent link navigation
//         alert(`Buying product ${productId}!`);
//     };

//     // Existing Handlers (no changes needed)
//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
//         setCurrentPage(1);
//     };
//     const handlePriceRangeChange = useCallback((min: number, max: number) => {
//         setFilters(prev => ({ ...prev, priceRange: { min, max } }));
//     }, []);
//     const handleClearAllFilters = () => {
//         setFilters({
//             onlyAvailable: false, onlySpecial: false, selectedBrands: [], selectedCategories: [],
//             selectedSellers: [], priceRange: { min: MIN_PRICE, max: MAX_PRICE }, searchTerm: ''
//         });
//         setBrandSearchTerm('');
//         setCurrentPage(1);
//         setSortOptions(prev => prev.map(option => ({ ...option, active: false })));
//     };
//     const handleToggleFilter = (filterType: keyof FilterState) => {
//         if (filterType === 'onlyAvailable' || filterType === 'onlySpecial') {
//             setFilters(prev => ({ ...prev, [filterType]: !prev[filterType] }));
//         }
//     };
//     const handleBrandChange = (brandId: string, checked: boolean) => {
//         setFilters(prev => ({ ...prev, selectedBrands: checked ? [...prev.selectedBrands, brandId] : prev.selectedBrands.filter(id => id !== brandId) }));
//     };
//     const handleSellerChange = (sellerId: string, checked: boolean) => {
//         setFilters(prev => ({ ...prev, selectedSellers: checked ? [...prev.selectedSellers, sellerId] : prev.selectedSellers.filter(id => id !== sellerId) }));
//     };
//     const handleSortChange = (sortKey: string) => {
//         setSortOptions(prev => prev.map(option => ({ ...option, active: option.key === sortKey })));
//         setCurrentPage(1);
//     };
//     const handlePageChange = (page: number) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         }
//     };
//     const filteredBrands = brands.filter(brand => brand.name.includes(brandSearchTerm) || brand.englishName.includes(brandSearchTerm));

//     // --- UTility Functions ---
//     const formatPrice = (price: string | undefined) => {
//         if (!price) return '0';
//         return parseInt(price).toLocaleString('fa-IR');
//     };
//     const getImageUrl = (imageName: string) => {
//         return `https://jahanzar2.storage.iran.liara.space/ecommerce/products/thumbnail/${imageName}`;
//     };

//     return (
//         <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-[5rem] md:mt-44" dir="rtl">
//             {/* Search Bar */}
//             <div className="mb-2">
//                 <div className="relative max-w-md mx-auto">
//                     <input
//                         type="text"
//                         value={filters.searchTerm}
//                         onChange={handleSearchChange}
//                         placeholder="جستجوی محصولات..."
//                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
//                         dir="rtl"
//                     />
//                     <svg
//                         className="absolute top-3.5 left-3 w-5 h-5 text-gray-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                 </div>
//             </div>

//             <div className="my-8 max-md:mt-0 lg:my-10 py-5 lg:px-10 flex flex-col md:flex-row gap-5">
//                 {/* Filters Sidebar */}
//                 <div className="md:w-4/12 lg:w-3/12">
//                     <div className="mb-4 rounded-2xl bg-white shadow-box-md">
//                         <div className="flex flex-col overflow-y-auto overflow-x-hidden px-4 py-3">
//                             <div>
//                                 {/* Filter Header */}
//                                 <div className="mb-6 flex items-center justify-between">
//                                     <h3 className="text-zinc-700">فیلتر ها</h3>
//                                     <button
//                                         onClick={handleClearAllFilters}
//                                         className="py-2 text-sm text-red-400 hover:text-red-500 transition"
//                                     >
//                                         حذف همه
//                                     </button>
//                                 </div>

//                                 <ul className="space-y-6 divide-y">
//                                     {/* Category Filter */}
//                                     <li>
//                                         <details className="group">
//                                             <summary className="flex cursor-pointer items-center justify-between rounded-lg py-3 text-zinc-700">
//                                                 <span>دسته بندی</span>
//                                                 <span className="shrink-0 transition duration-200 group-open:rotate-90">
//                                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256">
//                                                         <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
//                                                     </svg>
//                                                 </span>
//                                             </summary>
//                                             <div className="mt-2 max-h-60 overflow-y-auto pr-1">
//                                                 <ul className="space-y-2 rounded-lg">
//                                                     {categories.map((category, index) => (
//                                                         <li key={index}>
//                                                             <a className="flex items-center gap-x-2 rounded-lg px-4 py-2 text-zinc-700" href={category.href}>
//                                                                 <span>{category.name}</span>
//                                                             </a>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </details>
//                                     </li>

//                                     {/* Price Range Filter */}
//                                     <li>
//                                         <div className="pt-3">
//                                             <p className="mb-4 text-zinc-700">محدوده قیمت</p>
//                                             <div className="space-y-4">
//                                                 <PriceRangeSlider
//                                                     min={1000}
//                                                     max={100_000_000}
//                                                     defaultMinValue={filters.priceRange.min}
//                                                     defaultMaxValue={filters.priceRange.max}
//                                                     rtl={true}
//                                                     step={10_000}
//                                                     currency=''
//                                                     onMinFormat={(value) => value.toLocaleString("fa")}
//                                                     onMaxFormat={(value) => value.toLocaleString("fa")}
//                                                     onRangeChange={handlePriceRangeChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </li>

//                                     {/* Brand Filter */}
//                                     <li>
//                                         <details className="group">
//                                             <summary className="flex cursor-pointer items-center justify-between rounded-lg pt-3 text-zinc-700">
//                                                 <span>برند</span>
//                                                 <span className="shrink-0 transition duration-200 group-open:rotate-90">
//                                                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256">
//                                                         <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
//                                                     </svg>
//                                                 </span>
//                                             </summary>
//                                             <div className="max-h-60 overflow-y-auto pr-1">
//                                                 <ul className="space-y-2 rounded-lg">
//                                                     <li className="p-2 relative">
//                                                         <input
//                                                             value={brandSearchTerm}
//                                                             onChange={(e) => setBrandSearchTerm(e.target.value)}
//                                                             className="w-full pl-10 rounded-lg border border-none bg-gray-100 px-7 py-3 text-zinc-600 outline-none placeholder:text-sm placeholder:text-zinc-500 focus:ring-0 text-right"
//                                                             placeholder="جستجوی برند ..."
//                                                             type="text"
//                                                             dir="rtl"
//                                                         />
//                                                         <svg className="absolute top-6 left-4 fill-zinc-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
//                                                             <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
//                                                         </svg>
//                                                     </li>
//                                                     {filteredBrands.map((brand) => (
//                                                         <li key={brand.id}>
//                                                             <div className="flex w-full items-center gap-x-2 pl-4 bg-gray-50 rounded-md">
//                                                                 <input
//                                                                     id={`brand-${brand.id}`}
//                                                                     type="checkbox"
//                                                                     checked={filters.selectedBrands.includes(brand.id)}
//                                                                     onChange={(e) => handleBrandChange(brand.id, e.target.checked)}
//                                                                     className="h-4 w-4 cursor-pointer rounded-xl border-gray-300 bg-gray-100"
//                                                                 />
//                                                                 <label htmlFor={`brand-${brand.id}`} className="flex w-full cursor-pointer items-center justify-between py-2 pr-4 font-medium text-zinc-600">
//                                                                     <span className="text-gray-400 text-sm">{brand.englishName}</span>
//                                                                     <span>{brand.name}</span>
//                                                                 </label>
//                                                             </div>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </details>
//                                     </li>

//                                     {/* Seller Type Filter */}
//                                     <li>
//                                         <details className="group">
//                                             <summary className="flex cursor-pointer items-center justify-between rounded-lg pt-3 text-zinc-700">
//                                                 <span>نوع فروشنده</span>
//                                                 <span className="shrink-0 transition duration-200 group-open:rotate-90">
//                                                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256">
//                                                         <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
//                                                     </svg>
//                                                 </span>
//                                             </summary>
//                                             <div className="mt-2 max-h-60 overflow-y-auto pr-1">
//                                                 <ul className="space-y-2 rounded-lg">
//                                                     {sellerTypes.map((seller) => (
//                                                         <li key={seller.id}>
//                                                             <div className="flex w-full items-center gap-x-2 pl-4">
//                                                                 <input
//                                                                     id={`seller-${seller.id}`}
//                                                                     type="checkbox"
//                                                                     checked={filters.selectedSellers.includes(seller.id)}
//                                                                     onChange={(e) => handleSellerChange(seller.id, e.target.checked)}
//                                                                     className="h-4 w-4 cursor-pointer rounded-xl border-gray-300 bg-gray-100"
//                                                                 />
//                                                                 <label htmlFor={`seller-${seller.id}`} className="flex w-full cursor-pointer items-center py-2 pr-4 font-medium text-zinc-600">
//                                                                     <span>{seller.name}</span>
//                                                                 </label>
//                                                             </div>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </details>
//                                     </li>

//                                     {/* Available Products Toggle */}
//                                     <li>
//                                         <label className="flex cursor-pointer items-center justify-between py-3" htmlFor="onlyAvailableDesktop">
//                                             <div className="text-zinc-700">
//                                                 فقط کالا های موجود
//                                             </div>
//                                             <div className="relative inline-flex cursor-pointer items-center">
//                                                 <input
//                                                     className="peer sr-only"
//                                                     id="onlyAvailableDesktop"
//                                                     type="checkbox"
//                                                     checked={filters.onlyAvailable}
//                                                     onChange={() => handleToggleFilter('onlyAvailable')}
//                                                 />
//                                                 <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:right-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-400 peer-checked:after:-translate-x-full peer-focus:ring-red-400"></div>
//                                             </div>
//                                         </label>
//                                     </li>

//                                     {/* Special Products Toggle */}
//                                     <li>
//                                         <label className="flex cursor-pointer items-center justify-between py-3" htmlFor="onlySpecialDesktop">
//                                             <div className="text-zinc-700">
//                                                 فقط محصولات دارای تنوع
//                                             </div>
//                                             <div className="relative inline-flex cursor-pointer items-center">
//                                                 <input
//                                                     className="peer sr-only"
//                                                     id="onlySpecialDesktop"
//                                                     type="checkbox"
//                                                     checked={filters.onlySpecial}
//                                                     onChange={() => handleToggleFilter('onlySpecial')}
//                                                 />
//                                                 <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:right-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-400 peer-checked:after:-translate-x-full peer-focus:ring-red-400"></div>
//                                             </div>
//                                         </label>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="md:w-8/12 lg:w-9/12">
//                     {/* Sort Filter */}
//                     <div className="bg-white shadow-box-sm rounded-2xl grid place-items-start p-5">
//                         <div className="flex flex-wrap gap-5 justify-start items-center">
//                             <div className="text-zinc-600 text-sm">مرتب سازی:</div>
//                             {sortOptions.map((option) => (
//                                 <div
//                                     key={option.key}
//                                     onClick={() => handleSortChange(option.key)}
//                                     className={`text-xs hover:text-red-500 transition cursor-pointer ${option.active ? 'text-red-500' : 'text-zinc-500 hover:text-red-400'
//                                         }`}
//                                 >
//                                     {option.label}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Loading State */}
//                     {loading && (
//                         <div className="flex justify-center items-center py-12">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
//                             <span className="mr-3 text-zinc-600">در حال بارگذاری...</span>
//                         </div>
//                     )}

//                     {/* Error State */}
//                     {error && (
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-5">
//                             <p className="text-red-600 text-center">{error}</p>
//                             <button
//                                 onClick={fetchProducts}
//                                 className="mt-2 mx-auto block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
//                             >
//                                 تلاش مجدد
//                             </button>
//                         </div>
//                     )}

//                     {!loading && !error && (
//                         <>
//                             {/* **KEY CHANGE: Products Grid with new card component** */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 mt-5">
//                                 {filteredProducts.map((product) => (
//                                     <div key={product.id} className="bg-white rounded-xl shadow-box hover:drop-shadow-lg transition-shadow px-4 py-4">
//                                         <Link to={`/products/${product.id}`}>
//                                             <div className="flex justify-between">
//                                                 {product.discount && (
//                                                     <div className="bg-red-200 rounded-lg px-2 py-1 text-red-500 flex items-center gap-x-1 text-xs">
//                                                         <div>{product.discount}%</div>
//                                                         <div>تخفیف</div>
//                                                     </div>
//                                                 )}
//                                                 <div className="flex gap-x-1 ml-auto">
//                                                     <div>
//                                                         <button
//                                                             onClick={(e) => handleWishlistClick(e, product.id)}
//                                                             className="bg-gray-200 rounded-full p-1 hover:fill-red-500 transition"
//                                                         > <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#2b2b2b" viewBox="0 0 256 256"><path d="M178,34c-21,0-39.26,9.47-50,25.34C117.26,43.47,99,34,78,34A60.07,60.07,0,0,0,18,94c0,29.2,18.2,59.59,54.1,90.31a334.68,334.68,0,0,0,53.06,37,6,6,0,0,0,5.68,0,334.68,334.68,0,0,0,53.06-37C219.8,153.59,238,123.2,238,94A60.07,60.07,0,0,0,178,34ZM128,209.11C111.59,199.64,30,149.72,30,94A48.05,48.05,0,0,1,78,46c20.28,0,37.31,10.83,44.45,28.27a6,6,0,0,0,11.1,0C140.69,56.83,157.72,46,178,46a48.05,48.05,0,0,1,48,48C226,149.72,144.41,199.64,128,209.11Z"></path></svg>
//                                                         </button>
//                                                     </div>
//                                                     <div>
//                                                         <button
//                                                             onClick={(e) => handleCompareClick(e, product.id)}
//                                                             className="bg-gray-200 rounded-full p-1 hover:fill-zinc-500 transition"
//                                                         > <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#2b2b2b" viewBox="0 0 256 256"><path d="M236.24,179.76a6,6,0,0,1,0,8.48l-24,24a6,6,0,0,1-8.48-8.48L217.52,190H200.94a70.16,70.16,0,0,1-57-29.31l-41.71-58.4A58.11,58.11,0,0,0,55.06,78H32a6,6,0,0,1,0-12H55.06a70.16,70.16,0,0,1,57,29.31l41.71,58.4A58.11,58.11,0,0,0,200.94,178h16.58l-13.76-13.76a6,6,0,0,1,8.48-8.48Zm-92.06-74.41a5.91,5.91,0,0,0,3.48,1.12,6,6,0,0,0,4.89-2.51l1.19-1.67A58.11,58.11,0,0,1,200.94,78h16.58L203.76,91.76a6,6,0,1,0,8.48,8.48l24-24a6,6,0,0,0,0-8.48l-24-24a6,6,0,0,0-8.48,8.48L217.52,66H200.94a70.16,70.16,0,0,0-57,29.31L142.78,97A6,6,0,0,0,144.18,105.35Zm-32.36,45.3a6,6,0,0,0-8.37,1.39l-1.19,1.67A58.11,58.11,0,0,1,55.06,178H32a6,6,0,0,0,0,12H55.06a70.16,70.16,0,0,0,57-29.31l1.19-1.67A6,6,0,0,0,111.82,150.65Z"></path></svg>
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="image-box my-6">
//                                                 <img
//                                                     className="max-w-52 h-48 object-contain mx-auto"
//                                                     src={getImageUrl(product.thumbnailImage)}
//                                                     alt={product.title}
//                                                     loading="lazy"
//                                                 />
//                                             </div>
//                                         </Link>

//                                         <div className="space-y-6">
//                                             <Link to={`/products/${product.id}`} className="mb-2 h-10 flex justify-between">
//                                                 <div className="flex flex-col gap-y-2">
//                                                     <span className="text-sm font-semibold text-zinc-800 line-clamp-1">{product.title}</span>
//                                                     <span className="text-xs text-zinc-500 line-clamp-1">{product.englishName}</span>
//                                                 </div>
//                                                 {product.rating != null && (
//                                                     <div className="flex items-start gap-x-1 text-xs text-zinc-500">
//                                                         <span>
//                                                             <span>({product.reviewCount || 0}+)</span>
//                                                             <span>{product.rating}</span>
//                                                         </span>
//                                                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#f9bc00" viewBox="0 0 256 256"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path></svg>
//                                                     </div>
//                                                 )}
//                                             </Link>

//                                             <div className="bg-gray-100 rounded-xl py-3 px-2 flex justify-between items-center">
//                                                 <div className="flex justify-center gap-x-1 text-lg font-bold text-red-600">
//                                                     <div>{formatPrice(product.basePrice)}</div>
//                                                     <div>تومان</div>
//                                                 </div>

//                                                 <div>
//                                                     <Link
//                                                         to={"/products/" + product.id}
//                                                         className="flex items-center gap-x-1 text-sm py-2 px-2 rounded-lg text-white bg-red-500 hover:bg-red-400 transition shadow-lg shadow-red-500/50"
//                                                     >
//                                                         <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ededed" viewBox="0 0 256 256"><path d="M136,120v56a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0ZM239.86,98.11,226,202.12A16,16,0,0,1,210.13,216H45.87A16,16,0,0,1,30,202.12l-13.87-104A16,16,0,0,1,32,80H68.37L122,18.73a8,8,0,0,1,12,0L187.63,80H224a16,16,0,0,1,15.85,18.11ZM89.63,80h76.74L128,36.15ZM224,96H32L45.87,200H210.13Zm-51.16,23.2-5.6,56A8,8,0,0,0,174.4,184a7.44,7.44,0,0,0,.81,0,8,8,0,0,0,7.95-7.2l5.6-56a8,8,0,0,0-15.92-1.6Zm-89.68,0a8,8,0,0,0-15.92,1.6l5.6,56a8,8,0,0,0,8,7.2,7.44,7.44,0,0,0,.81,0,8,8,0,0,0,7.16-8.76Z"></path></svg>
//                                                         خرید محصول
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* No Products Found */}
//                             {filteredProducts.length === 0 && !loading && (
//                                 <div className="text-center py-12">
//                                     <p className="text-zinc-500">محصولی یافت نشد</p>
//                                 </div>
//                             )}

//                             {/* Pagination */}
//                             {totalPages > 1 && (
//                                 <div className="mt-8">
//                                     <ul className="flex items-center justify-center gap-x-2 md:gap-x-3 h-8 text-sm">
//                                         <li>
//                                             <button
//                                                 onClick={() => handlePageChange(currentPage - 1)}
//                                                 disabled={currentPage === 1}
//                                                 className={`flex items-center justify-center transition shadow-lg px-3 h-8 rounded-lg ${currentPage === 1
//                                                     ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
//                                                     : 'text-gray-500 bg-white hover:bg-red-100 hover:text-red-400'
//                                                     }`}
//                                             >
//                                                 <svg className="w-2.5 h-2.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 6 10">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"></path>
//                                                 </svg>
//                                             </button>
//                                         </li>

//                                         {paginationNumbers.map((page, index) => (
//                                             <li key={index}>
//                                                 {page === '...' ? (
//                                                     <span className="flex items-center justify-center px-3 h-8 text-gray-500">...</span>
//                                                 ) : (
//                                                     <button
//                                                         onClick={() => handlePageChange(page as number)}
//                                                         className={`flex items-center justify-center transition shadow-lg px-3 h-8 rounded-lg ${currentPage === page
//                                                             ? 'text-red-500 bg-red-200'
//                                                             : 'text-gray-500 bg-white hover:bg-red-100 hover:text-red-400'
//                                                             }`}
//                                                     >
//                                                         {page}
//                                                     </button>
//                                                 )}
//                                             </li>
//                                         ))}

//                                         <li>
//                                             <button
//                                                 onClick={() => handlePageChange(currentPage + 1)}
//                                                 disabled={currentPage === totalPages}
//                                                 className={`flex items-center justify-center transition shadow-lg px-3 h-8 rounded-lg ${currentPage === totalPages
//                                                     ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
//                                                     : 'text-gray-500 bg-white hover:bg-red-100 hover:text-red-400'
//                                                     }`}
//                                             >
//                                                 <svg className="w-2.5 h-2.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 6 10">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"></path>
//                                                 </svg>
//                                             </button>
//                                         </li>
//                                     </ul>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default WholeSaledProductsSearch;