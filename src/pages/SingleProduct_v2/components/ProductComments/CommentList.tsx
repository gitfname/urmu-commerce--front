// SingleProduct_v2/components/ProductComments/CommentList.tsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';
import type { CommentListProps } from './types';

const CommentList: React.FC<CommentListProps> = ({ comments, loading, error }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">در حال بارگذاری دیدگاه‌ها...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500">خطا در بارگذاری دیدگاه‌ها</div>
            </div>
        );
    }

    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500">هنوز دیدگاهی برای این محصول ثبت نشده است</div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        const statusMap = {
            accepted: { text: 'تایید شده', class: 'bg-green-100 text-green-800' },
            pending: { text: 'در انتظار تایید', class: 'bg-yellow-100 text-yellow-800' },
            rejected: { text: 'رد شده', class: 'bg-red-100 text-red-800' },
        };

        const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;

        return (
            <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.class}`}>
                {statusInfo.text}
            </span>
        );
    };

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                {comment.user.firstName.charAt(0)}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">
                                    {comment.user.firstName} {comment.user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                                </div>
                            </div>
                        </div>
                        {getStatusBadge(comment.status)}
                    </div>

                    <div className="text-gray-700 leading-relaxed">
                        {comment.content}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentList;