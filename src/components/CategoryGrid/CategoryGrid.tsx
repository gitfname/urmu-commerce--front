import React from 'react';

interface CategoryItem {
    id: number;
    name: string;
    href: string;
    icon: React.ReactNode;
}

interface CategoryGridProps {
    categories?: CategoryItem[];
    onCategoryClick?: (categoryId: number, categoryName: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
    categories = defaultCategories,
    onCategoryClick
}) => {
    const handleCategoryClick = (e: React.MouseEvent, category: CategoryItem) => {
        if (onCategoryClick) {
            e.preventDefault();
            onCategoryClick(category.id, category.name);
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-x-5 sm:gap-x-12 gap-y-5 px-3 md:px-10 my-10">
            {categories.map((category) => (
                <a
                    key={category.id}
                    href={category.href}
                    onClick={(e) => handleCategoryClick(e, category)}
                    className="max-w-28 bg-gray-100 hover:bg-red-500 transition flex flex-col justify-between rounded-full p-2 h-32 w-20 group"
                >
                    <div className="w-full group-hover:rotate-6 transition fill-red-600 bg-gray-50 rounded-full p-2 grid place-items-center">
                        {category.icon}
                    </div>
                    <div className="text-xs text-center text-zinc-800 group-hover:text-gray-50 mt-2 mb-4">
                        {category.name}
                    </div>
                </a>
            ))}
        </div>
    );
};

// Default categories data with icons
const defaultCategories: CategoryItem[] = [
    {
        id: 1,
        name: 'موبایل',
        href: '/categories/mobile',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M176,18H80A22,22,0,0,0,58,40V216a22,22,0,0,0,22,22h96a22,22,0,0,0,22-22V40A22,22,0,0,0,176,18Zm10,198a10,10,0,0,1-10,10H80a10,10,0,0,1-10-10V40A10,10,0,0,1,80,30h96a10,10,0,0,1,10,10ZM138,60a10,10,0,1,1-10-10A10,10,0,0,1,138,60Z"></path>
            </svg>
        )
    },
    {
        id: 2,
        name: 'لوازم منزل',
        href: '/categories/home-appliances',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M214,90.48V72a38,38,0,0,0-38-38H80A38,38,0,0,0,42,72V90.48a38,38,0,0,0,0,75.05V200a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V165.53a38,38,0,0,0,0-75ZM80,46h96a26,26,0,0,1,26,26V90.48A38.05,38.05,0,0,0,170,128v2H86v-2A38.05,38.05,0,0,0,54,90.48V72A26,26,0,0,1,80,46ZM208.35,154H208a6,6,0,0,0-6,6v40a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V160h0a6,6,0,0,0-6-6h-.35A26,26,0,1,1,74,128v40a6,6,0,0,0,12,0V142h84v26a6,6,0,0,0,12,0V128a26,26,0,1,1,26.35,26Z"></path>
            </svg>
        )
    },
    {
        id: 3,
        name: 'اسباب بازی',
        href: '/categories/toys',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M92,138a10,10,0,1,1,10-10A10,10,0,0,1,92,138Zm72-20a10,10,0,1,0,10,10A10,10,0,0,0,164,118Zm-11.2,44.92a47,47,0,0,1-49.6,0,6,6,0,0,0-6.4,10.16,59,59,0,0,0,62.4,0,6,6,0,1,0-6.4-10.16ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90.11,90.11,0,0,0-87.07-89.95C118.3,55.23,118,71.85,118,72a10,10,0,0,0,20,0,6,6,0,0,1,12,0,22,22,0,0,1-44,0c0-.75.15-15.82,10.14-33.22A90,90,0,1,0,218,128Z"></path>
            </svg>
        )
    },
    {
        id: 4,
        name: 'وسایل ورزش',
        href: '/categories/sports',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26ZM60,69.09A89.23,89.23,0,0,1,81.78,122H38.2A89.65,89.65,0,0,1,60,69.09ZM38.2,134H81.78A89.23,89.23,0,0,1,60,186.91,89.65,89.65,0,0,1,38.2,134ZM122,217.8a89.66,89.66,0,0,1-53.5-22.34A101.18,101.18,0,0,0,93.82,134H122Zm0-95.8H93.82A101.18,101.18,0,0,0,68.5,60.54,89.66,89.66,0,0,1,122,38.2Zm95.8,0H174.22A89.23,89.23,0,0,1,196,69.09,89.65,89.65,0,0,1,217.8,122ZM134,38.2a89.66,89.66,0,0,1,53.5,22.34A101.18,101.18,0,0,0,162.18,122H134Zm0,179.6V134h28.18a101.18,101.18,0,0,0,25.32,61.46A89.66,89.66,0,0,1,134,217.8Zm62-30.89A89.23,89.23,0,0,1,174.22,134H217.8A89.65,89.65,0,0,1,196,186.91Z"></path>
            </svg>
        )
    },
    {
        id: 5,
        name: 'غذای پت',
        href: '/categories/pet-food',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M230.14,62.17A33.88,33.88,0,0,0,206,50a34,34,0,1,0-62.81,20,2,2,0,0,1-.23,2.54L72.56,143a2.06,2.06,0,0,1-2.55.23A34,34,0,1,0,50,206a34,34,0,1,0,62.81-20,2,2,0,0,1,.23-2.54l70.4-70.4a2,2,0,0,1,2.54-.23,34,34,0,0,0,44.15-50.65ZM220.6,98.48a22,22,0,0,1-28.24,4.17,14,14,0,0,0-17.4,1.92L104.57,175a14,14,0,0,0-1.92,17.4,22,22,0,1,1-40.41,8.26,6,6,0,0,0-5.93-6.93,7.28,7.28,0,0,0-.93.07,22,22,0,1,1,8.26-40.41A14,14,0,0,0,81,151.43L151.43,81a14,14,0,0,0,1.92-17.4,22,22,0,1,1,40.41-8.26,6,6,0,0,0,6.86,6.86,22,22,0,0,1,20,36.24Z"></path>
            </svg>
        )
    },
    {
        id: 6,
        name: 'سوپرمارکت',
        href: '/categories/supermarket',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M232,66H198.48l29.76-29.76a6,6,0,1,0-8.48-8.48L190,57.52V24a6,6,0,0,0-12,0V60.15a62,62,0,0,0-77.8,8l0,0h0C60.17,107.4,30.05,201.45,27.38,210a14,14,0,0,0,18.67,18.67c8.5-2.67,102.62-32.81,141.79-72.77a62,62,0,0,0,8-77.84H232a6,6,0,0,0,0-12Zm-52.69,81.41C170,157,157,166,142.69,174.24l-26.46-26.47a6,6,0,1,0-8.49,8.49l24,24c-41.69,22-89,36.82-89.73,37a6.57,6.57,0,0,0-1.06.44,2,2,0,0,1-2.7-2.7A6.57,6.57,0,0,0,38.7,214C39,213,67.55,121.72,104.48,81l35.27,35.26a6,6,0,1,0,8.48-8.48l-35.1-35.1a50,50,0,0,1,66.18,74.74Z"></path>
            </svg>
        )
    },
    {
        id: 7,
        name: 'پوشاک',
        href: '/categories/clothing',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M240.37,172.8,138,96l25.59-19.2A6,6,0,0,0,166,72a38,38,0,1,0-76,0,6,6,0,0,0,12,0,26,26,0,0,1,51.82-2.88l-29.32,22-.21.16L15.63,172.8A14,14,0,0,0,24,198H232a14,14,0,0,0,8.39-25.2Zm-6.5,11.83A1.85,1.85,0,0,1,232,186H24a2,2,0,0,1-1.19-3.6L128,103.5l105.17,78.9A1.85,1.85,0,0,1,233.87,184.63Z"></path>
            </svg>
        )
    },
    {
        id: 8,
        name: 'هدفون',
        href: '/categories/headphones',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M200.47,64.07A101.37,101.37,0,0,0,128.77,34H128A102,102,0,0,0,26,136v56a22,22,0,0,0,22,22H64a22,22,0,0,0,22-22V152a22,22,0,0,0-22-22H38.2A90.12,90.12,0,0,1,192,72.52,89.41,89.41,0,0,1,217.81,130H192a22,22,0,0,0-22,22v40a22,22,0,0,0,22,22h16a22,22,0,0,0,22-22V136A101.44,101.44,0,0,0,200.47,64.07ZM64,142a10,10,0,0,1,10,10v40a10,10,0,0,1-10,10H48a10,10,0,0,1-10-10V142Zm154,50a10,10,0,0,1-10,10H192a10,10,0,0,1-10-10V152a10,10,0,0,1,10-10h26Z"></path>
            </svg>
        )
    },
    {
        id: 9,
        name: 'لوازم آرایش',
        href: '/categories/cosmetics',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M200.12,55.87A102,102,0,1,0,55.88,200.12,102,102,0,1,0,200.12,55.87ZM94,211.37V152a2,2,0,0,1,2-2h64a2,2,0,0,1,2,2v59.37a90.49,90.49,0,0,1-68,0ZM146,138H110V99.71l36-18Zm45.64,53.64h0A90.93,90.93,0,0,1,174,205.39V152a14,14,0,0,0-14-14h-2V72a6,6,0,0,0-8.68-5.37l-48,24A6,6,0,0,0,98,96v42H96a14,14,0,0,0-14,14v53.39a90.93,90.93,0,0,1-17.64-13.75,90,90,0,1,1,127.28,0Z"></path>
            </svg>
        )
    }
];

export default CategoryGrid;