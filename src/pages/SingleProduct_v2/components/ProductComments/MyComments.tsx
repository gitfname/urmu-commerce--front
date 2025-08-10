// SingleProduct_v2/components/ProductComments/MyComments.tsx
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { useUpdateMyCommentMutation, useDeleteMyCommentMutation } from '../../../../services/api/ecommerce--api';
import type { MyCommentsProps } from './types';

const MyComments: React.FC<MyCommentsProps> = ({
    comments,
    loading,
    error,
    onUpdate,
    onDelete
}) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');

    const updateCommentMutation = useUpdateMyCommentMutation({
        axios: {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        },
    });

    const deleteCommentMutation = useDeleteMyCommentMutation({
        axios: {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
        },
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">در حال بارگذاری دیدگاه‌های شما...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500">خطا در بارگذاری دیدگاه‌های شما</div>
            </div>
        );
    }

    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500">شما هنوز دیدگاهی برای این محصول ثبت نکرده‌اید</div>
            </div>
        );
    }

    const handleEdit = (comment: any) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    const handleSaveEdit = async (commentId: number) => {
        if (!editContent.trim()) {
            alert('لطفاً متن دیدگاه را وارد کنید');
            return;
        }

        try {
            await updateCommentMutation.mutateAsync({
                id: commentId,
                data: { content: editContent.trim() },
            });

            setEditingId(null);
            setEditContent('');
            onUpdate();
            alert('دیدگاه شما با موفقیت بروزرسانی شد');
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('خطا در بروزرسانی دیدگاه');
        }
    };

    const handleDelete = async (commentId: number) => {
        if (!confirm('آیا از حذف این دیدگاه اطمینان دارید؟')) {
            return;
        }

        try {
            await deleteCommentMutation.mutateAsync({ id: commentId });
            onDelete();
            alert('دیدگاه شما با موفقیت حذف شد');
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('خطا در حذف دیدگاه');
        }
    };

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
                        <div className="flex items-center gap-2">
                            {getStatusBadge(comment.status)}
                        </div>
                    </div>

                    {editingId === comment.id ? (
                        <div className="space-y-3">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows={3}
                                maxLength={1000}
                            />
                            <div className="text-sm text-gray-500 text-left">
                                {editContent.length}/1000
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSaveEdit(comment.id)}
                                    disabled={updateCommentMutation.isPending}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
                                >
                                    {updateCommentMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                                >
                                    لغو
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-gray-700 leading-relaxed mb-3">
                                {comment.content}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(comment)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                    ویرایش
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    disabled={deleteCommentMutation.isPending}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
                                >
                                    {deleteCommentMutation.isPending ? 'در حال حذف...' : 'حذف'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyComments;