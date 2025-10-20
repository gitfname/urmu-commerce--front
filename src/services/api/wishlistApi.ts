import axios from 'axios';

export interface WishlistItem {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
  };
  product: {
    id: number;
    title: string;
    slug: string;
    summary: string;
    basePrice: number;
    baseDiscount: number;
    stockQuantity: number;
    thumbnailImage: string;
    images: string[];
    hasVariants: boolean;
    isWholeSale: boolean;
    isFeatured: boolean;
    category?: {
      id: number;
      title: string;
    };
    brand?: {
      id: number;
      title: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  data: WishlistItem[];
  total: number;
}

export interface CheckWishlistResponse {
  isInWishlist: boolean;
}

export interface WishlistCountResponse {
  count: number;
}

// Add product to wishlist
export const addToWishlist = async (productId: number): Promise<WishlistItem> => {
  const response = await axios.post(`/wishlist/add/${productId}`);
  return response.data;
};

// Remove product from wishlist
export const removeFromWishlist = async (productId: number): Promise<{ message: string }> => {
  const response = await axios.delete(`/wishlist/remove/${productId}`);
  return response.data;
};

// Get user's wishlist
export const getMyWishlist = async (): Promise<WishlistItem[]> => {
  const response = await axios.get('/wishlist/my-wishlist');
  return response.data;
};

// Check if product is in wishlist
export const checkInWishlist = async (productId: number): Promise<CheckWishlistResponse> => {
  const response = await axios.get(`/wishlist/check/${productId}`);
  return response.data;
};

// Get wishlist count
export const getWishlistCount = async (): Promise<WishlistCountResponse> => {
  const response = await axios.get('/wishlist/count');
  return response.data;
};

// Admin: Get all wishlists
export const getAllWishlists = async (page: number = 1, limit: number = 10): Promise<WishlistResponse> => {
  const response = await axios.get(`/wishlist/admin/all?page=${page}&limit=${limit}`);
  return response.data;
};

// Admin: Get user's wishlist
export const getUserWishlistForAdmin = async (userId: number): Promise<WishlistItem[]> => {
  const response = await axios.get(`/wishlist/admin/user/${userId}`);
  return response.data;
};

// Admin: Delete wishlist item
export const deleteWishlistItem = async (id: number): Promise<{ message: string }> => {
  const response = await axios.delete(`/wishlist/admin/${id}`);
  return response.data;
};
