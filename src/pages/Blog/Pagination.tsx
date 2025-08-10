import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Generate an array of page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5; // Adjust this number to show more or fewer pages

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return { pages, startPage, endPage };
    };

    const { pages, startPage, endPage } = getPageNumbers();

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="mb-14">
            <ul className="flex items-center justify-center gap-x-2 md:gap-x-3 h-8 text-sm">
                {/* Previous Button */}
                <li>
                    <button
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center transition shadow-lg px-3 h-8 ms-0 rounded-lg ${currentPage === 1
                                ? 'text-gray-300 bg-white cursor-not-allowed'
                                : 'text-gray-500 bg-white hover:bg-red-100 hover:text-red-400'
                            }`}
                    >
                        <svg
                            className="w-2.5 h-2.5 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 1 1 5l4 4"
                            />
                        </svg>
                    </button>
                </li>

                {/* Show first page and ellipsis if needed */}
                {startPage > 1 && (
                    <>
                        <li>
                            <button
                                onClick={() => handlePageClick(1)}
                                className="flex items-center justify-center transition shadow-lg px-3 h-8 text-gray-500 bg-white rounded-lg hover:bg-red-100 hover:text-red-400"
                            >
                                1
                            </button>
                        </li>
                        {startPage > 2 && (
                            <li>
                                <span className="flex items-center justify-center shadow-lg px-3 h-8 text-gray-500 bg-white rounded-lg">
                                    ...
                                </span>
                            </li>
                        )}
                    </>
                )}

                {/* Page Numbers */}
                {pages.map((page) => (
                    <li key={page}>
                        <button
                            onClick={() => handlePageClick(page)}
                            className={`flex items-center justify-center transition shadow-lg px-3 h-8 rounded-lg ${currentPage === page
                                    ? 'text-red-500 bg-red-200 hover:bg-red-100'
                                    : 'text-gray-500 bg-white hover:bg-red-100 hover:text-red-400'
                                }`}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Show last page and ellipsis if needed */}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <li>
                                <span className="flex items-center justify-center shadow-lg px-3 h-8 text-gray-500 bg-white rounded-lg">
                                    ...
                                </span>
                            </li>
                        )}
                        <li>
                            <button
                                onClick={() => handlePageClick(totalPages)}
                                className="flex items-center justify-center transition shadow-lg px-3 h-8 text-gray-500 bg-white rounded-lg hover:bg-red-100 hover:text-red-400"
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}

                {/* Next Button */}
                <li>
                    <button
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center transition shadow-lg px-3 h-8 rounded-lg ${currentPage === totalPages
                                ? 'text-gray-300 bg-white cursor-not-allowed'
                                : 'text-gray-500 bg-white hover:bg-red-100 hover:text-red-400'
                            }`}
                    >
                        <svg
                            className="w-2.5 h-2.5 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;