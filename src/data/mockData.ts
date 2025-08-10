// data/mockData.ts
export interface Product {
    id: string;
    title: string;
    englishTitle?: string;
    image: string;
    currentPrice: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    discount?: number;
    features?: string[];
}

export const mockProducts: Product[] = [
    {
        id: '1',
        title: 'مانیتور ایسوس a342 ASUS a342 plus for work',
        image: '/images/monitor-asus.jpg',
        currentPrice: 1100000,
        originalPrice: 1350000,
        rating: 4.3,
        reviewCount: 28,
        discount: 10
    },
    {
        id: '2',
        title: 'لپ تاپ ایسوس مدل a12 ASUS a12',
        image: '/images/laptop-asus.jpg',
        currentPrice: 12000000,
        originalPrice: 12700000,
        rating: 4.4,
        reviewCount: 21,
        discount: 12
    },
    {
        id: '3',
        title: 'مک بوک ایر mac book air AX12',
        image: '/images/macbook-air.jpg',
        currentPrice: 29800000,
        originalPrice: 35500000,
        rating: 4.7,
        reviewCount: 13,
        discount: 30
    },
    {
        id: '4',
        title: 'کیبورد تسکو 15F TSCO F15s',
        image: '/images/keyboard-tsco.jpg',
        currentPrice: 1200000,
        originalPrice: 1750000,
        rating: 4.7,
        reviewCount: 35,
        discount: 17
    },
    {
        id: '5',
        title: 'موس گیمینگ مکس MAX mouse for game',
        image: '/images/mouse-max.jpg',
        currentPrice: 760000,
        originalPrice: 850000,
        rating: 4.2,
        reviewCount: 10,
        discount: 7
    },
    {
        id: '6',
        title: 'گینر مخصوص بدن GAIN VIT',
        image: '/images/gainer.jpg',
        currentPrice: 3000000,
        originalPrice: 3850000,
        rating: 4.7,
        reviewCount: 17,
        discount: 5
    }
];