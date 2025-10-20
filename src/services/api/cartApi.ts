import axios from 'axios';

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CartItem {
  id: number;
  product: {
    id: number;
    title: string;
    thumbnailImage: string;
    basePrice: number;
    baseDiscount: number;
  };
  quantity: number;
  createdAt: string;
}

export interface CartResponse {
  data: CartItem[];
  total: number;
}

// Add product to cart
export const addToCart = async (productId: number, quantity: number = 1): Promise<CartItem> => {
  const response = await axios.post('/shopping-cart-items', {
    productId,
    quantity
  });
  return response.data;
};

// Get cart items
export const getCartItems = async (): Promise<CartItem[]> => {
  const response = await axios.get('/shopping-cart-items');
  return response.data;
};

// Update cart item quantity
export const updateCartItemQuantity = async (itemId: number, quantity: number): Promise<CartItem> => {
  const response = await axios.put(`/shopping-cart-items/${itemId}`, {
    quantity
  });
  return response.data;
};

// Remove item from cart
export const removeFromCart = async (itemId: number): Promise<{ message: string }> => {
  const response = await axios.delete(`/shopping-cart-items/${itemId}`);
  return response.data;
};

// Clear cart
export const clearCart = async (): Promise<{ message: string }> => {
  const response = await axios.delete('/shopping-cart-items/clear');
  return response.data;
};
