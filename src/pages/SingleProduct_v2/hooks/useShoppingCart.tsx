import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

const API_BASE_URL = 'https://ur-commerce.runflare.run';

export interface CartItem {
    id: number;
    product: {
        id: number;
        title: string;
        slug: string;
        summary: string;
        basePrice: string;
        baseDiscount: number;
        stockQuantity: number;
        hasVariants: boolean;
        thumbnailImage: string;
        images: string[];
        category?: {
            id: number;
            name: string;
        };
    };
    price: number;
    discount: number;
    quantity: number;
    finalPrice: number;
    additionalProperties: {
        variantId?: number;
        [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
}

interface CartContextType {
    cartItems: CartItem[];
    cartLoading: boolean;
    cartError: string | null;
    addToCart: (productId: number, quantity: number, variantProperties?: Record<string, string>) => Promise<boolean>;
    updateCartItem: (itemId: number, quantity: number) => Promise<boolean>;
    removeFromCart: (itemId: number) => Promise<boolean>;
    refreshCart: () => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useShoppingCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useShoppingCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });

    const fetchCartItems = async () => {
        try {
            setCartLoading(true);
            setCartError(null);

            const response = await fetch(`${API_BASE_URL}/shopping-cart-items/my-items`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const items: CartItem[] = await response.json();
            setCartItems(items);
        } catch (err) {
            setCartError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching cart items:', err);
        } finally {
            setCartLoading(false);
        }
    };

    const addToCart = async (
        productId: number,
        quantity: number = 1,
        variantProperties?: Record<string, string>
    ): Promise<boolean> => {
        try {
            setCartLoading(true);
            setCartError(null);

            let url = `${API_BASE_URL}/shopping-cart-items/add-to-cart?productId=${productId}`;

            if (variantProperties && Object.keys(variantProperties).length > 0) {
                const encodedVariants = encodeURIComponent(JSON.stringify(variantProperties));
                url += `&variantProperties=${encodedVariants}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ quantity }),
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            // Refresh cart after successful addition
            await fetchCartItems();
            return true;
        } catch (err) {
            setCartError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error adding to cart:', err);
            return false;
        } finally {
            setCartLoading(false);
        }
    };

    const updateCartItem = async (itemId: number, quantity: number): Promise<boolean> => {
        try {
            setCartLoading(true);
            setCartError(null);

            const response = await fetch(`${API_BASE_URL}/shopping-cart-items/${itemId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ quantity }),
            });

            if (!response.ok) {
                throw new Error('Failed to update cart item');
            }

            // Refresh cart after successful update
            await fetchCartItems();
            return true;
        } catch (err) {
            setCartError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error updating cart item:', err);
            return false;
        } finally {
            setCartLoading(false);
        }
    };

    const removeFromCart = async (itemId: number): Promise<boolean> => {
        return await updateCartItem(itemId, 0);
    };

    const refreshCart = async () => {
        await fetchCartItems();
    };

    const getTotalItems = (): number => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = (): number => {
        return cartItems.reduce((total, item) => total + item.finalPrice, 0);
    };

    useEffect(() => {
        // Check if user is authenticated before fetching cart
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchCartItems();
        }
    }, []);

    const value: CartContextType = {
        cartItems,
        cartLoading,
        cartError,
        addToCart,
        updateCartItem,
        removeFromCart,
        refreshCart,
        getTotalItems,
        getTotalPrice,
    };

    return (
        <CartContext.Provider value={value} >
            {children}
        </CartContext.Provider>
    );
};