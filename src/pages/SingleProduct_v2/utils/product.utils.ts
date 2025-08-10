export const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('fa-IR');
};

export const calculateFinalPrice = (price: number | string, discount: number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const discountAmount = (numPrice * discount) / 100;
    return numPrice - discountAmount;
};

export const calculateDiscountAmount = (price: number | string, discount: number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return (numPrice * discount) / 100;
};

export const getColorClass = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
        'red': 'bg-red-500',
        'green': 'bg-green-500',
        'blue': 'bg-blue-500',
        'yellow': 'bg-yellow-500',
        'black': 'bg-black',
        'white': 'bg-white border',
        'gray': 'bg-gray-500',
        'purple': 'bg-purple-500',
    };
    return colorMap[colorName.toLowerCase()] || 'bg-gray-300';
};