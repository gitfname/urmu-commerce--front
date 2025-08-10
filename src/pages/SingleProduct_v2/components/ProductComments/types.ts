// SingleProduct_v2/components/ProductComments/types.ts
import type { ProductCommentsSerializer } from '../../../../services/api/ecommerce--api';

export interface ProductCommentsProps {
    productId: number;
}

export interface CommentListProps {
    comments: ProductCommentsSerializer[];
    loading: boolean;
    error: any;
}

export interface CommentFormProps {
    productId: number;
    onSuccess: () => void;
}

export interface MyCommentsProps {
    comments: ProductCommentsSerializer[];
    loading: boolean;
    error: any;
    onUpdate: () => void;
    onDelete: () => void;
}