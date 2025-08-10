/**
 * Calculates the final price after applying a discount
 * @param price - The original price
 * @param discount - The discount amount (can be percentage 0-100 or fixed amount)
 * @param isPercentage - Whether the discount is a percentage (default: true)
 * @returns The final price after discount
 */
export default function calculateFinalPrice(
    price: number,
    discount: number,
    isPercentage: boolean = true
): number {
    if (price < 0) {
        throw new Error('Price cannot be negative');
    }

    if (discount < 0) {
        throw new Error('Discount cannot be negative');
    }

    let finalPrice: number;

    if (isPercentage) {
        if (discount > 100) {
            throw new Error('Percentage discount cannot exceed 100%');
        }
        finalPrice = price - (price * discount / 100);
    } else {
        // Fixed amount discount
        finalPrice = price - discount;
    }

    // Ensure final price doesn't go below 0
    return Math.max(0, Math.round(finalPrice * 100) / 100);
}

// Usage examples:
// console.log(calculateFinalPrice(100, 20)); // 80 (20% discount)
// console.log(calculateFinalPrice(100, 15, false)); // 85 (15 fixed amount discount)
// console.log(calculateFinalPrice(50, 10)); // 45 (10% discount)