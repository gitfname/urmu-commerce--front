import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FireIcon, RecentIcon, SearchIcon } from './icons/Icon';
import type { SearchResultItem, SuggestionItem } from './types';

interface SearchComponentProps {
    isMobile?: boolean;
    onFocusChange: (isFocused: boolean) => void;
    popularSearches: SuggestionItem[];
}

interface Product {
    id: number;
    title: string;
    slug: string;
    summary: string;
    basePrice: string;
    stockQuantity: number;
    hasVariants: boolean;
    thumbnailImage: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

interface SearchResponse {
    data: Product[];
    count: number;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
    isMobile = false,
    onFocusChange,
    popularSearches,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
    const [recentSearches, setRecentSearches] = useState<SuggestionItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<any>(null);

    // Base URL for images - adjust this to match your backend setup
    const IMAGE_BASE_URL = 'https://ur-commerce.runflare.run/uploads/'; // Adjust as needed

    // Load recent searches from localStorage on component mount
    useEffect(() => {
        loadRecentSearches();
    }, []);

    // Load recent searches from localStorage
    const loadRecentSearches = () => {
        try {
            const stored = localStorage.getItem('recentSearches');
            if (stored) {
                const parsed = JSON.parse(stored);
                setRecentSearches(parsed);
            }
        } catch (error) {
            console.error('Error loading recent searches:', error);
        }
    };

    // Save recent searches to localStorage
    const saveRecentSearch = (query: string) => {
        if (!query.trim()) return;

        try {
            const newSearch: SuggestionItem = {
                id: Date.now().toString(),
                label: query.trim(),
                href: `/search?q=${encodeURIComponent(query.trim())}`
            };

            setRecentSearches(prev => {
                // Remove duplicate if exists
                const filtered = prev.filter(item => item.label.toLowerCase() !== query.toLowerCase());
                // Add new search at the beginning and keep only last 6
                const updated = [newSearch, ...filtered].slice(0, 6);

                // Save to localStorage
                localStorage.setItem('recentSearches', JSON.stringify(updated));

                return updated;
            });
        } catch (error) {
            console.error('Error saving recent search:', error);
        }
    };

    // Format price for display
    const formatPrice = (price: string): string => {
        const numPrice = parseInt(price);
        return numPrice.toLocaleString('fa-IR') + ' تومان';
    };

    // Get full image URL
    const getImageUrl = (imageName: string): string => {
        // if (!imageName) return '/placeholder-image.jpg';
        return `${IMAGE_BASE_URL}${imageName}`;
    };

    // API call to search products
    const searchProducts = async (query: string): Promise<SearchResponse> => {
        const response = await fetch(
            `https://ur-commerce.runflare.run/products?limit=10&skip=0&title=${encodeURIComponent(query)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        (query: string) => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            debounceTimeoutRef.current = setTimeout(async () => {
                if (!query.trim()) {
                    setSearchResults([]);
                    setError(null);
                    return;
                }

                setIsLoading(true);
                setError(null);

                try {
                    const response = await searchProducts(query);

                    // Transform API response to SearchResultItem format
                    const results: SearchResultItem[] = response.data.map(product => ({
                        id: product.id.toString(),
                        name: product.title,
                        imageUrl: product.thumbnailImage,
                        href: `/products/${product.id}`, // Use slug if available, otherwise use ID
                        price: formatPrice(product.basePrice),
                        summary: product.summary,
                        stockQuantity: product.stockQuantity,
                        hasVariants: product.hasVariants
                    }));

                    setSearchResults(results);
                } catch (err) {
                    console.error('Search error:', err);
                    setError('خطا در جستجو. لطفاً دوباره تلاش کنید.');
                    setSearchResults([]);
                } finally {
                    setIsLoading(false);
                }
            }, 300); // 300ms debounce delay
        },
        []
    );

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    // Handle search result click
    const handleSearchResultClick = (query: string) => {
        saveRecentSearch(query);
        setIsFocused(false);
        onFocusChange(false);
    };

    // Handle recent search click
    const handleRecentSearchClick = (searchItem: SuggestionItem) => {
        setSearchQuery(searchItem.label);
        debouncedSearch(searchItem.label);
        // Move this search to the top of recent searches
        saveRecentSearch(searchItem.label);
    };

    // Handle popular search click
    const handlePopularSearchClick = (searchItem: SuggestionItem) => {
        setSearchQuery(searchItem.label);
        debouncedSearch(searchItem.label);
        saveRecentSearch(searchItem.label);
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            saveRecentSearch(searchQuery);
            // Navigate to search results page
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    // Clear recent searches
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
                onFocusChange(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onFocusChange]);

    // Cleanup debounce timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const handleFocus = () => {
        setIsFocused(true);
        onFocusChange(true);
    };

    return (
        <div className="relative max-w-xl flex-1" ref={searchRef}>
            <div className="flex items-center justify-between rounded-lg border-gray-200 border-b-transparent bg-gray-100 px-2">
                {!isMobile && (
                    <div>
                        <SearchIcon name="SearchIcon" />
                    </div>
                )}
                <input
                    className="flex grow rounded-lg border-none bg-gray-100 px-2 py-3 text-zinc-600 outline-none placeholder:text-xs placeholder:text-zinc-500 focus:ring-0"
                    placeholder="جستجو"
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyPress={handleKeyPress}
                />
                {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                )}
            </div>

            {isFocused && (
                <div className="absolute inset-x-0 top-full w-full overflow-hidden rounded-b-lg border border-gray-200 border-t-transparent bg-white z-50">
                    <div className="max-h-[450px] overflow-y-auto py-5">

                        {/* Error Message */}
                        {error && (
                            <div className="px-5 mb-4">
                                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Search Results */}
                        {searchQuery.trim() && searchResults.length > 0 && (
                            <div className="mb-8 px-5">
                                <div className="mb-2">
                                    <p className="text-sm text-zinc-600">نتایج جستجو ({searchResults.length} محصول)</p>
                                </div>
                                <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                                    {searchResults.map((item) => (
                                        <div key={item.id}>
                                            <a
                                                href={item.href}
                                                className="flex items-center gap-x-3 rounded-xl border border-gray-100 px-4 py-3 text-zinc-500 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                                                onClick={() => handleSearchResultClick(item.name)}
                                            >
                                                <img
                                                    src={"https://narenjitoy--bucket.storage.c2.liara.space/ecommerce/products/thumbnail/" + item.imageUrl}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/placeholder-image.jpg';
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-zinc-700 line-clamp-1 mb-1">{item.name}</p>
                                                    {item.summary && (
                                                        <p className="text-xs text-zinc-500 line-clamp-1 mb-2">{item.summary}</p>
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-red-500">{item.price}</span>
                                                        {item.stockQuantity !== undefined && (
                                                            <span className={`text-xs px-2 py-1 rounded-full ${item.stockQuantity > 0
                                                                ? 'bg-green-100 text-green-600'
                                                                : 'bg-red-100 text-red-600'
                                                                }`}>
                                                                {item.stockQuantity > 0 ? 'موجود' : 'ناموجود'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.hasVariants && (
                                                        <span className="text-xs text-blue-600 mt-1">دارای انواع مختلف</span>
                                                    )}
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Results Message */}
                        {searchQuery.trim() && !isLoading && searchResults.length === 0 && !error && (
                            <div className="px-5 mb-4">
                                <div className="text-zinc-500 text-sm text-center py-8">
                                    <div className="text-4xl mb-2">🔍</div>
                                    <p className="font-medium mb-1">نتیجه‌ای یافت نشد</p>
                                    <p className="text-xs">برای "{searchQuery}" محصولی پیدا نکردیم</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Recent searches */}
                            {recentSearches.length > 0 && (
                                <div className="px-5">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-x-2 text-zinc-600">
                                            <RecentIcon name="ClockCounterClockwiseIcon" />
                                            <p className="text-sm">جستجو های اخیر</p>
                                        </div>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-xs text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            پاک کردن
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {recentSearches.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleRecentSearchClick(item)}
                                                className="flex border rounded-xl border-gray-100 p-2 text-zinc-500 hover:border-gray-200 hover:bg-gray-50 text-right transition-all duration-200"
                                            >
                                                <p className="text-xs truncate">{item.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Popular searches */}
                            {popularSearches.length > 0 && (
                                <div className="px-5">
                                    <div className="mb-2 flex items-center gap-x-2 text-zinc-600">
                                        <FireIcon name="FireIcon" />
                                        <p className="text-sm">جستجو های پرطرفدار</p>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {popularSearches.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handlePopularSearchClick(item)}
                                                className="border rounded-xl border-gray-100 px-3 py-2 text-zinc-500 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 mb-2"
                                            >
                                                <p className="text-xs">{item.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchComponent;