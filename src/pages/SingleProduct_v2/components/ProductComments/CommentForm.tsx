// SingleProduct_v2/components/ProductComments/CommentForm.tsx
import React, { useState } from 'react';
import { useCreateProductCommentMutation } from '../../../../services/api/ecommerce--api';
import type { CommentFormProps } from './types';

const CommentForm: React.FC<CommentFormProps> = ({ productId, onSuccess }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createCommentMutation = useCreateProductCommentMutation({
        axios: {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        },
        mutation: {
            onSuccess: () => {
                setContent('');
                onSuccess();
                alert('دیدگاه شما با موفقیت ثبت شد و پس از بررسی نمایش داده خواهد شد');
            },
            onError(error, variables, context) {
                console.error('Error creating comment:', (error.response.data as any)?.message);
                alert((error.response.data as any)?.message || "مشکلی رخ داد");
            },
            onSettled(data, error, variables, context) {
                setIsSubmitting(false);
            },
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            alert('لطفاً متن دیدگاه را وارد کنید');
            return;
        }

        if (content.length > 1000) {
            alert('متن دیدگاه نباید بیش از 1000 کاراکتر باشد');
            return;
        }

        setIsSubmitting(true);

        createCommentMutation.mutate({
            data: {
                content: content.trim(),
                productId,
            },
        });
    };

    return (
        <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                افزودن دیدگاه جدید
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-2">
                        متن دیدگاه *
                    </label>
                    <textarea
                        id="comment-content"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="دیدگاه خود را در مورد این محصول بنویسید..."
                        maxLength={1000}
                        required
                    />
                    <div className="mt-1 text-sm text-gray-500 text-left">
                        {content.length}/1000
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                    <div className="text-sm text-blue-700">
                        <strong>نکته:</strong> دیدگاه شما پس از بررسی توسط مدیران سایت نمایش داده خواهد شد.
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'در حال ثبت...' : 'ثبت دیدگاه'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setContent('')}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        پاک کردن
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;