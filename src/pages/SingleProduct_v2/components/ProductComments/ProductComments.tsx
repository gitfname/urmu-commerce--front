// SingleProduct_v2/components/ProductComments/ProductComments.tsx
import React, { useState } from 'react';
import { useFindAcceptedCommentsByProductQuery, useFindMyCommentsByProductQuery } from '../../../../services/api/ecommerce--api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import MyComments from './MyComments';
import type { ProductCommentsProps } from './types';
import RenderIfLoggedIn from '../../../../components/RenderIfLoggedIn';

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
    const [activeSection, setActiveSection] = useState<'all' | 'my' | 'add'>('all');

    // Fetch accepted comments for the product (public)
    const {
        data: acceptedComments,
        isLoading: loadingAccepted,
        error: errorAccepted,
        refetch: refetchAccepted
    } = useFindAcceptedCommentsByProductQuery(productId);

    // Fetch user's own comments for this product
    const {
        data: myComments,
        isLoading: loadingMy,
        error: errorMy,
        refetch: refetchMy
    } = useFindMyCommentsByProductQuery(productId, {
        axios: {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            }
        }
    });

    const handleCommentSuccess = () => {
        // Refetch both lists when a comment is added/updated
        refetchAccepted();
        refetchMy();
        setActiveSection('all');
    };

    const handleCommentUpdate = () => {
        // Refetch user's comments when updated
        refetchMy();
    };

    const handleCommentDelete = () => {
        // Refetch user's comments when deleted
        refetchMy();
    };

    return (
        <div className="mt-6">
            {/* Section Navigation */}
            <div className="flex gap-4 mb-6 border-b">
                <button
                    onClick={() => setActiveSection('all')}
                    className={`pb-2 px-1 transition-colors ${activeSection === 'all'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    همه دیدگاه‌ها ({acceptedComments?.data?.length || 0})
                </button>

                <RenderIfLoggedIn>
                    <button
                        onClick={() => setActiveSection('my')}
                        className={`pb-2 px-1 transition-colors ${activeSection === 'my'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        دیدگاه‌های من ({myComments?.data?.length || 0})
                    </button>

                    <button
                        onClick={() => setActiveSection('add')}
                        className={`pb-2 px-1 transition-colors ${activeSection === 'add'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        افزودن دیدگاه
                    </button>
                </RenderIfLoggedIn>
            </div>

            {/* Content Sections */}
            {activeSection === 'all' && (
                <CommentList
                    comments={acceptedComments?.data || []}
                    loading={loadingAccepted}
                    error={errorAccepted}
                />
            )}

            {activeSection === 'my' && (
                <MyComments
                    comments={myComments?.data || []}
                    loading={loadingMy}
                    error={errorMy}
                    onUpdate={handleCommentUpdate}
                    onDelete={handleCommentDelete}
                />
            )}

            {activeSection === 'add' && (
                <CommentForm
                    productId={productId}
                    onSuccess={handleCommentSuccess}
                />
            )}
        </div>
    );
};

export default ProductComments;