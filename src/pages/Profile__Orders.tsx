import React, { useState } from 'react';
import { getGetOrderWithItemsByIdQueryQueryKey, useGetMyOrdersQuery, useGetOrderWithItemsByIdQuery } from '../services/api/ecommerce--api';
import { Env } from '../env';

interface Order {
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: string;
    createdAt: string;
    items: OrderItem[];
    shippingAddress: any;
    deliveredAt?: string;
    shippedAt?: string;
}

interface OrderItem {
    id: number;
    product: {
        id: number;
        title: string;
        thumbnailImage: string;
    };
    quantity: number;
    unitPrice: string;
    totalPrice: string;
}

// Order Details Modal Component
const OrderDetailsModal: React.FC<{
    orderId: number;
    isOpen: boolean;
    onClose: () => void;
}> = ({ orderId, isOpen, onClose }) => {
    const { data: orderData, isLoading, error } = useGetOrderWithItemsByIdQuery(orderId, {
        query: {
            queryKey: getGetOrderWithItemsByIdQueryQueryKey(orderId),
            enabled: isOpen && !!orderId
        },
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });

    const order = orderData?.data;

    if (!isOpen) return null;

    const formatPersianDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fa-IR');
    };

    const formatPrice = (price: string) => {
        return `${parseInt(price).toLocaleString('fa-IR')} تومان`;
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'pending':
                return { text: 'درانتظار پرداخت', color: 'text-yellow-500' };
            case 'confirmed':
                return { text: 'تایید شده', color: 'text-blue-500' };
            case 'processing':
                return { text: 'در حال پردازش', color: 'text-blue-500' };
            case 'shipped':
                return { text: 'ارسال شده', color: 'text-indigo-500' };
            case 'delivered':
                return { text: 'تحویل داده شده', color: 'text-green-600' };
            case 'cancelled':
                return { text: 'لغو شده', color: 'text-red-500' };
            default:
                return { text: status, color: 'text-gray-500' };
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-zinc-200 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-zinc-800">جزئیات سفارش</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-800 mx-auto mb-4"></div>
                            <p className="text-zinc-600">در حال بارگذاری جزئیات...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 mb-4">خطا در بارگذاری جزئیات سفارش</p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                            >
                                بستن
                            </button>
                        </div>
                    ) : order ? (
                        <div className="space-y-6">
                            {/* Order Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-zinc-50 rounded-xl p-4">
                                    <h3 className="font-medium text-zinc-800 mb-3">اطلاعات سفارش</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>شماره سفارش:</span>
                                            <span className="font-medium">#{order.orderNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>تاریخ ثبت:</span>
                                            <span>{formatPersianDate(order.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>وضعیت:</span>
                                            <span className={getStatusDisplay(order.status).color}>
                                                {getStatusDisplay(order.status).text}
                                            </span>
                                        </div>
                                        {order.shippedAt && (
                                            <div className="flex justify-between">
                                                <span>تاریخ ارسال:</span>
                                                <span>{formatPersianDate(order.shippedAt)}</span>
                                            </div>
                                        )}
                                        {order.deliveredAt && (
                                            <div className="flex justify-between">
                                                <span>تاریخ تحویل:</span>
                                                <span>{formatPersianDate(order.deliveredAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-zinc-50 rounded-xl p-4">
                                    <h3 className="font-medium text-zinc-800 mb-3">آدرس ارسال</h3>
                                    <div className="text-sm text-zinc-600">
                                        <p><strong>نام:</strong> {order.shippingAddress?.fullName + ""}</p>
                                        <p><strong>تلفن:</strong> {order.shippingAddress?.phone + ""}</p>
                                        <p><strong>شهر:</strong> {order.shippingAddress?.city + ""}</p>
                                        <p><strong>آدرس:</strong> {order.shippingAddress?.address + ""}</p>
                                        <p><strong>کد پستی:</strong> {order.shippingAddress?.postalCode + ""}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-medium text-zinc-800 mb-4">محصولات سفارش</h3>
                                <div className="space-y-3">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex max-sm:flex-col gap-4 p-4 border border-zinc-200 rounded-xl">
                                            <img
                                                src={Env.productThumbnailBaseUrl + item.product.thumbnailImage}
                                                alt={item.product.title}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />

                                            <div className="flex-1">

                                                <h4 className="font-medium text-zinc-800 mb-2">{item.product.title}</h4>

                                                <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-600">
                                                    <div>
                                                        <span>تعداد: </span>
                                                        <span className="font-medium">{item.quantity}</span>
                                                    </div>
                                                    <div>
                                                        <span>قیمت واحد: </span>
                                                        <span className="font-medium">{formatPrice(item.unitPrice)}</span>
                                                    </div>
                                                    <div>
                                                        <span>تخفیف: </span>
                                                        <span className="font-medium">{item.discount}%</span>
                                                    </div>
                                                    <div>
                                                        <span>قیمت کل: </span>
                                                        <span className="font-medium text-zinc-800">{formatPrice(item.totalPrice)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-zinc-50 rounded-xl p-4">
                                <h3 className="font-medium text-zinc-800 mb-3">خلاصه مالی</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>جمع کل محصولات:</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>تخفیف کل:</span>
                                        <span className="text-red-500">-{formatPrice(order.totalDiscount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>هزینه ارسال:</span>
                                        <span>{formatPrice(order.shippingCost)}</span>
                                    </div>
                                    {order.sendingWay && (
                                        <div className="flex justify-between">
                                            <span>روش ارسال:</span>
                                            <span>{order.sendingWay.title}</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                        <span>مبلغ نهایی:</span>
                                        <span>{formatPrice(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {order.notes && (
                                <div className="bg-zinc-50 rounded-xl p-4">
                                    <h3 className="font-medium text-zinc-800 mb-2">یادداشت</h3>
                                    <p className="text-sm text-zinc-600">{order.notes}</p>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t border-zinc-200 p-6 rounded-b-2xl">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg transition-colors"
                        >
                            بستن
                        </button>
                        {/* {order && (
                            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                چاپ فاکتور
                            </button>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Profile__Orders: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all');
    const [skip, setSkip] = useState(0);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const limit = 10;

    // Map activeTab to API status
    const getApiStatus = (tab: typeof activeTab) => {
        switch (tab) {
            case 'pending':
                return 'pending';
            case 'delivered':
                return 'delivered';
            case 'cancelled':
                return 'cancelled';
            default:
                return undefined;
        }
    };

    // Fetch orders from API
    const { data: ordersData, isLoading, error } = useGetMyOrdersQuery({
        skip,
        limit,
        status: getApiStatus(activeTab)
    }, {
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });

    const orders = ordersData?.data?.data || [];
    const totalCount = ordersData?.data?.count || 0;

    // Modal handlers
    const openOrderDetails = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const closeOrderDetails = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    // Helper function to format Persian date
    const formatPersianDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fa-IR');
    };

    // Helper function to format price
    const formatPrice = (price: string) => {
        return `${parseInt(price).toLocaleString('fa-IR')} تومان`;
    };

    // Map API status to Persian text and color
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'pending':
                return { text: 'درانتظار پرداخت', color: 'text-yellow-500' };
            case 'confirmed':
                return { text: 'تایید شده', color: 'text-blue-500' };
            case 'processing':
                return { text: 'در حال پردازش', color: 'text-blue-500' };
            case 'shipped':
                return { text: 'ارسال شده', color: 'text-indigo-500' };
            case 'delivered':
                return { text: 'تحویل داده شده', color: 'text-green-600' };
            case 'cancelled':
                return { text: 'لغو شده', color: 'text-red-500' };
            default:
                return { text: status, color: 'text-gray-500' };
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <svg className="w-5 h-5 fill-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,0,1-12,12H116a8,8,0,0,1,0-16h12V96a8,8,0,0,1,16,0Z" />
                    </svg>
                );
            case 'delivered':
                return (
                    <svg className="w-5 h-5 fill-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                );
            case 'cancelled':
                return (
                    <svg className="w-5 h-5 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 fill-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
                    </svg>
                );
        }
    };

    // Count orders by status for tabs
    const getOrderCounts = () => {
        if (!orders.length) return { all: 0, pending: 0, delivered: 0, cancelled: 0 };
        return {
            all: totalCount,
            pending: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length
        };
    };

    const orderCounts = getOrderCounts();

    if (isLoading) {
        return (
            <main className="max-w-[1500px] mx-auto px-3 md:px-5">
                <div className="my-5 lg:my-10">
                    <div className="bg-white rounded-2xl shadow-box-md p-8 text-center">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                        <p className="text-zinc-600 mt-4">در حال بارگذاری سفارش ها...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-[1500px] mx-auto px-3 md:px-5">
                <div className="my-5 lg:my-10">
                    <div className="bg-white rounded-2xl shadow-box-md p-8 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 fill-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                        </svg>
                        <h3 className="text-lg font-medium text-zinc-800 mb-2">خطا در بارگذاری</h3>
                        <p className="text-zinc-600">امکان دریافت سفارش ها وجود ندارد. لطفا دوباره تلاش کنید.</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5">
            <div className="my-5 lg:my-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">سفارش های من</h1>
                    <p className="text-zinc-600">مشاهده و پیگیری سفارش های خود</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl shadow-box-md p-1 mb-6">
                    <div className="flex flex-wrap gap-1">
                        <button
                            onClick={() => {
                                setActiveTab('all');
                                setSkip(0);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'all'
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            همه سفارش ها ({orderCounts.all})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('pending');
                                setSkip(0);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'pending'
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            در انتظار ({orderCounts.pending})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('delivered');
                                setSkip(0);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'delivered'
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            تحویل شده ({orderCounts.delivered})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('cancelled');
                                setSkip(0);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'cancelled'
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            لغو شده ({orderCounts.cancelled})
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-box-md p-8 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 fill-zinc-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87Z" />
                            </svg>
                            <h3 className="text-lg font-medium text-zinc-800 mb-2">سفارشی یافت نشد</h3>
                            <p className="text-zinc-600">در این بخش سفارشی موجود نیست</p>
                        </div>
                    ) : (
                        orders.map((order) => {
                            const statusDisplay = getStatusDisplay(order.status);
                            return (
                                <div key={order.id} className="bg-white rounded-2xl shadow-box-md p-6">
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-zinc-200">
                                        <div className="flex items-center gap-3 mb-3 md:mb-0">
                                            {getStatusIcon(order.status)}
                                            <div>
                                                <h3 className="font-medium text-zinc-800">سفارش #{order.orderNumber}</h3>
                                                <p className="text-sm text-zinc-600">{formatPersianDate(order.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:items-end">
                                            <p className={`font-medium ${statusDisplay.color} mb-1`}>{statusDisplay.text}</p>
                                            <p className="text-lg font-bold text-zinc-800">{formatPrice(order.totalAmount)}</p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-3 mb-4">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex gap-4 p-3 bg-zinc-50 rounded-xl">
                                                <img
                                                    src={item.product.thumbnailImage}
                                                    alt={item.product.title}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-zinc-800 mb-1">{item.product.title}</h4>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-sm text-zinc-600">تعداد: {item.quantity}</p>
                                                        <p className="font-medium text-zinc-800">{formatPrice(item.totalPrice)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Actions */}
                                    <div className="flex flex-wrap gap-3">
                                        {order.status === 'delivered' && (
                                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                                                خرید مجدد
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openOrderDetails(order.id)}
                                            className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm transition-colors"
                                        >
                                            جزئیات سفارش
                                        </button>
                                        {(order.status === 'shipped' || order.status === 'delivered') && (
                                            <button className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm transition-colors">
                                                پیگیری مرسوله
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {totalCount > limit && (
                    <div className="flex justify-center mt-8">
                        <div className="flex gap-2">
                            {skip > 0 && (
                                <button
                                    onClick={() => setSkip(Math.max(0, skip - limit))}
                                    className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm transition-colors"
                                >
                                    قبلی
                                </button>
                            )}
                            {skip + limit < totalCount && (
                                <button
                                    onClick={() => setSkip(skip + limit)}
                                    className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm transition-colors"
                                >
                                    بعدی
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrderId && (
                    <OrderDetailsModal
                        orderId={selectedOrderId}
                        isOpen={isModalOpen}
                        onClose={closeOrderDetails}
                    />
                )}
            </div>
        </main>
    );
};

export default Profile__Orders;


















// import React, { useState } from 'react';
// import { useGetMyOrdersQuery, type OrdersSerializer } from '../services/api/ecommerce--api';

// interface OrderItem {
//     id: string;
//     name: string;
//     image: string;
//     price: string;
//     quantity: number;
// }

// const Profile__Orders: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all');
//     const [skip, setSkip] = useState(0);
//     const limit = 10;

//     // Map activeTab to API status
//     const getApiStatus = () => {
//         switch (activeTab) {
//             case 'pending':
//                 return 'pending' as const;
//             case 'delivered':
//                 return 'delivered' as const;
//             case 'cancelled':
//                 return 'cancelled' as const;
//             default:
//                 return undefined;
//         }
//     };

//     // Fetch orders from API
//     const { data: ordersResponse, isLoading, error } = useGetMyOrdersQuery({
//         skip,
//         limit,
//         status: getApiStatus()
//     }, {
//         axios: {
//             headers: {
//                 Authorization: "Bearer " + localStorage.getItem("access_token")
//             }
//         }
//     });

//     const orders = ordersResponse?.data?.data || [];
//     const totalCount = ordersResponse?.data?.count || 0;

//     // Transform API order to component format
//     const transformOrder = (apiOrder: OrdersSerializer) => {
//         const getStatusDisplay = (status: string) => {
//             switch (status) {
//                 case 'pending':
//                     return { text: 'درانتظار پرداخت', color: 'text-yellow-500' };
//                 case 'confirmed':
//                     return { text: 'تایید شده', color: 'text-blue-500' };
//                 case 'processing':
//                     return { text: 'در حال پردازش', color: 'text-blue-500' };
//                 case 'shipped':
//                     return { text: 'ارسال شده', color: 'text-purple-500' };
//                 case 'delivered':
//                     return { text: 'تحویل داده شده', color: 'text-green-600' };
//                 case 'cancelled':
//                     return { text: 'لغو شده', color: 'text-red-500' };
//                 default:
//                     return { text: status, color: 'text-gray-500' };
//             }
//         };

//         const statusDisplay = getStatusDisplay(apiOrder.status);

//         return {
//             id: apiOrder.orderNumber,
//             date: new Date(apiOrder.createdAt).toLocaleDateString('fa-IR'),
//             amount: `${parseInt(apiOrder.totalAmount).toLocaleString('fa-IR')} تومان`,
//             status: apiOrder.status as 'pending' | 'paid' | 'delivered' | 'cancelled' | 'processing',
//             statusText: statusDisplay.text,
//             statusColor: statusDisplay.color,
//             trackingCode: apiOrder.shippedAt ? `TR${apiOrder.id}` : undefined,
//             items: apiOrder.items?.map(item => ({
//                 id: item.id.toString(),
//                 name: item.product.title,
//                 image: item.product.thumbnailImage,
//                 price: `${parseInt(item.unitPrice).toLocaleString('fa-IR')} تومان`,
//                 quantity: item.quantity
//             }))
//         };
//     };

//     const transformedOrders = orders.map(transformOrder);

//     // Filter orders for tab counts (when showing all)
//     const getTabCounts = () => {
//         if (activeTab !== 'all') {
//             return {
//                 all: totalCount,
//                 pending: 0,
//                 delivered: 0,
//                 cancelled: 0
//             };
//         }

//         // When showing all orders, we need to count by status
//         const counts = {
//             all: totalCount,
//             pending: 0,
//             delivered: 0,
//             cancelled: 0
//         };

//         transformedOrders.forEach(order => {
//             if (order.status === 'pending' || order.status === 'processing') {
//                 counts.pending++;
//             } else if (order.status === 'delivered') {
//                 counts.delivered++;
//             } else if (order.status === 'cancelled') {
//                 counts.cancelled++;
//             }
//         });

//         return counts;
//     };

//     const tabCounts = getTabCounts();

//     const getStatusIcon = (status: string) => {
//         switch (status) {
//             case 'pending':
//             case 'processing':
//                 return (
//                     <svg className="w-5 h-5 fill-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                         <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,0,1-12,12H116a8,8,0,0,1,0-16h12V96a8,8,0,0,1,16,0Z" />
//                     </svg>
//                 );
//             case 'delivered':
//                 return (
//                     <svg className="w-5 h-5 fill-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                         <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
//                     </svg>
//                 );
//             case 'cancelled':
//                 return (
//                     <svg className="w-5 h-5 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                         <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
//                     </svg>
//                 );
//             default:
//                 return (
//                     <svg className="w-5 h-5 fill-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                         <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
//                     </svg>
//                 );
//         }
//     };

//     if (isLoading) {
//         return (
//             <main className="max-w-[1500px] mx-auto px-3 md:px-5">
//                 <div className="my-5 lg:my-10">
//                     <div className="mb-8">
//                         <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">سفارش های من</h1>
//                         <p className="text-zinc-600">مشاهده و پیگیری سفارش های خود</p>
//                     </div>
//                     <div className="bg-white rounded-2xl shadow-box-md p-8 text-center">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-800 mx-auto"></div>
//                         <p className="mt-4 text-zinc-600">در حال بارگذاری...</p>
//                     </div>
//                 </div>
//             </main>
//         );
//     }

//     if (error) {
//         return (
//             <main className="max-w-[1500px] mx-auto px-3 md:px-5">
//                 <div className="my-5 lg:my-10">
//                     <div className="mb-8">
//                         <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">سفارش های من</h1>
//                         <p className="text-zinc-600">مشاهده و پیگیری سفارش های خود</p>
//                     </div>
//                     <div className="bg-white rounded-2xl shadow-box-md p-8 text-center">
//                         <svg className="w-16 h-16 mx-auto mb-4 fill-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                             <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
//                         </svg>
//                         <h3 className="text-lg font-medium text-zinc-800 mb-2">خطا در بارگذاری</h3>
//                         <p className="text-zinc-600">مشکلی در دریافت سفارش‌ها رخ داده است</p>
//                     </div>
//                 </div>
//             </main>
//         );
//     }

//     return (
//         <main className="max-w-[1500px] mx-auto px-3 md:px-5">
//             <div className="my-5 lg:my-10">
//                 {/* Page Header */}
//                 <div className="mb-8">
//                     <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">سفارش های من</h1>
//                     <p className="text-zinc-600">مشاهده و پیگیری سفارش های خود</p>
//                 </div>

//                 {/* Filter Tabs */}
//                 <div className="bg-white rounded-2xl shadow-box-md p-1 mb-6">
//                     <div className="flex flex-wrap gap-1">
//                         <button
//                             onClick={() => setActiveTab('all')}
//                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'all'
//                                 ? 'bg-zinc-800 text-white'
//                                 : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
//                                 }`}
//                         >
//                             همه سفارش ها ({tabCounts.all})
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('pending')}
//                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'pending'
//                                 ? 'bg-zinc-800 text-white'
//                                 : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
//                                 }`}
//                         >
//                             در انتظار ({tabCounts.pending})
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('delivered')}
//                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'delivered'
//                                 ? 'bg-zinc-800 text-white'
//                                 : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
//                                 }`}
//                         >
//                             تحویل شده ({tabCounts.delivered})
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('cancelled')}
//                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'cancelled'
//                                 ? 'bg-zinc-800 text-white'
//                                 : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
//                                 }`}
//                         >
//                             لغو شده ({tabCounts.cancelled})
//                         </button>
//                     </div>
//                 </div>

//                 {/* Orders List */}
//                 <div className="space-y-4">
//                     {transformedOrders.length === 0 ? (
//                         <div className="bg-white rounded-2xl shadow-box-md p-8 text-center">
//                             <svg className="w-16 h-16 mx-auto mb-4 fill-zinc-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                                 <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87Z" />
//                             </svg>
//                             <h3 className="text-lg font-medium text-zinc-800 mb-2">سفارشی یافت نشد</h3>
//                             <p className="text-zinc-600">در این بخش سفارشی موجود نیست</p>
//                         </div>
//                     ) : (
//                         transformedOrders.map((order) => (
//                             <div key={order.id} className="bg-white rounded-2xl shadow-box-md p-6">
//                                 {/* Order Header */}
//                                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-zinc-200">
//                                     <div className="flex items-center gap-3 mb-3 md:mb-0">
//                                         {getStatusIcon(order.status)}
//                                         <div>
//                                             <h3 className="font-medium text-zinc-800">سفارش {order.id}</h3>
//                                             <p className="text-sm text-zinc-600">{order.date}</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col md:items-end">
//                                         <p className={`font-medium ${order.statusColor} mb-1`}>{order.statusText}</p>
//                                         <p className="text-lg font-bold text-zinc-800">{order.amount}</p>
//                                         {order.trackingCode && (
//                                             <p className="text-xs text-zinc-500 mt-1">کد پیگیری: {order.trackingCode}</p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Order Items */}
//                                 <div className="space-y-3 mb-4">
//                                     {order.items?.map((item) => (
//                                         <div key={item.id} className="flex gap-4 p-3 bg-zinc-50 rounded-xl">
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.name}
//                                                 className="w-16 h-16 object-cover rounded-lg"
//                                             />
//                                             <div className="flex-1">
//                                                 <h4 className="font-medium text-zinc-800 mb-1">{item.name}</h4>
//                                                 <div className="flex justify-between items-center">
//                                                     <p className="text-sm text-zinc-600">تعداد: {item.quantity}</p>
//                                                     <p className="font-medium text-zinc-800">{item.price}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Order Actions - Removed payment and cancel buttons */}
//                                 <div className="flex flex-wrap gap-3">
//                                     {order.status === 'delivered' && (
//                                         <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
//                                             خرید مجدد
//                                         </button>
//                                     )}
//                                     <button className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm transition-colors">
//                                         جزئیات سفارش
//                                     </button>
//                                     {order.trackingCode && (
//                                         <button className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm transition-colors">
//                                             پیگیری مرسوله
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 {/* Pagination could be added here if needed */}
//                 {totalCount > limit && (
//                     <div className="mt-6 flex justify-center gap-2">
//                         <button
//                             onClick={() => setSkip(Math.max(0, skip - limit))}
//                             disabled={skip === 0}
//                             className="px-4 py-2 border border-zinc-300 rounded-lg disabled:opacity-50"
//                         >
//                             قبلی
//                         </button>
//                         <button
//                             onClick={() => setSkip(skip + limit)}
//                             disabled={skip + limit >= totalCount}
//                             className="px-4 py-2 border border-zinc-300 rounded-lg disabled:opacity-50"
//                         >
//                             بعدی
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </main>
//     );
// };

// export default Profile__Orders;




























// import React, { useState } from 'react';

// interface Order {
//     id: string;
//     date: string;
//     amount: string;
//     status: 'pending' | 'paid' | 'delivered' | 'cancelled' | 'processing';
//     statusText: string;
//     statusColor: string;
//     items: OrderItem[];
//     trackingCode?: string;
// }

// interface OrderItem {
//     id: string;
//     name: string;
//     image: string;
//     price: string;
//     quantity: number;
// }

// const Profile__Orders: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all');

//     const orders: Order[] = [
//         {
//             id: '#1f3G4t',
//             date: '1402/11/11',
//             amount: '742,000 تومان',
//             status: 'pending',
//             statusText: 'درانتظار پرداخت',
//             statusColor: 'text-yellow-500',
//             items: [
//                 {
//                     id: '1',
//                     name: 'لپ تاپ اپل مک بوک ایر M2',
//                     image: '/assets/image/products/1.webp',
//                     price: '520,000 تومان',
//                     quantity: 1
//                 },
//                 {
//                     id: '2',
//                     name: 'ماوس لاجیتک MX Master 3',
//                     image: '/assets/image/products/2.webp',
//                     price: '222,000 تومان',
//                     quantity: 1
//                 }
//             ]
//         },
//         {
//             id: '#2H5Y5u',
//             date: '1402/11/08',
//             amount: '730,000 تومان',
//             status: 'delivered',
//             statusText: 'تحویل داده شده',
//             statusColor: 'text-green-600',
//             trackingCode: 'TR123456789',
//             items: [
//                 {
//                     id: '3',
//                     name: 'گوشی سامسونگ گلکسی S24',
//                     image: '/assets/image/products/3.webp',
//                     price: '730,000 تومان',
//                     quantity: 1
//                 }
//             ]
//         },
//         {
//             id: '#R34trU',
//             date: '1402/11/01',
//             amount: '1,900,000 تومان',
//             status: 'cancelled',
//             statusText: 'لغو شده',
//             statusColor: 'text-red-500',
//             items: [
//                 {
//                     id: '4',
//                     name: 'لپ تاپ دل XPS 13',
//                     image: '/assets/image/products/4.webp',
//                     price: '1,900,000 تومان',
//                     quantity: 1
//                 }
//             ]
//         },
//         {
//             id: '#K8L9M0',
//             date: '1402/10/25',
//             amount: '450,000 تومان',
//             status: 'processing',
//             statusText: 'در حال پردازش',
//             statusColor: 'text-blue-500',
//             items: [
//                 {
//                     id: '5',
//                     name: 'هدفون سونی WH-1000XM4',
//                     image: '/assets/image/products/5.webp',
//                     price: '450,000 تومان',
//                     quantity: 1
//                 }
//             ]
//         }
//     ];

//     const filteredOrders = orders.filter(order => {
//         if (activeTab === 'all') return true;
//         if (activeTab === 'pending') return order.status === 'pending' || order.status === 'processing';
//         if (activeTab === 'delivered') return order.status === 'delivered';
//         if (activeTab === 'cancelled') return order.status === 'cancelled';
//         return true;
//     });

//     const getStatusIcon = (status: Order['status']) => {
//         switch (status) {
//             case 'pending':
//                 return (
//                     <svg className="w-5 h-5 fill-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                         <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,0,1-12,12H116a8,8,0,0,1,0-16h12V96a8,8,0,0,1,16,0Z" />
//                     </svg>
//                 );
//             case 'delivered':
//                 return (
//                     <svg className="w-5 h-5 fill-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                         <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
//                     </svg>
//                 );
//             case 'cancelled':
//                 return (
//                     <svg className="w-5 h-5 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                         <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
//                     </svg>
//                 );
//             default:
//                 return (
//                     <svg className="w-5 h-5 fill-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                         <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
//                     </svg>
//                 );
//         }
//     };

//     return (
//         <main className="max-w-[1500px] mx-auto px-3 md:px-5">
//             <div className="my-5 lg:my-10">
//                 {/* Page Header */}
//                 <div className="mb-8">
//                     <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">سفارش های من</h1>
//                     <p className="text-zinc-600">مشاهده و پیگیری سفارش های خود</p>
//                 </div>

//                 {/* Filter Tabs */}
//                 <div className="bg-white rounded-2xl shadow-box-md p-1 mb-6">
//                     <div className="flex flex-wrap gap-1">
//                         <button
//                             onClick={() => setActiveTab('all')}
//                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'all'
//                                 ? 'bg-zinc-800 text-white'
//                                 : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
//                                 }`}
//                         >
//                             همه سفارش ها ({orders.length})
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('pending')}
//                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'pending'
//                                 ? 'bg-zinc-800 text-white'
//                                 : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
//                                 }`}
//                         >
//                             در انتظار ({orders.filter(o => o.status === 'pending' || o.status === 'processing').length})
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('delivered')}
//                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'delivered'
//                                 ? 'bg-zinc-800 text-white'
//                                 : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
//                                 }`}
//                         >
//                             تحویل شده ({orders.filter(o => o.status === 'delivered').length})
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('cancelled')}
//                             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'cancelled'
//                                 ? 'bg-zinc-800 text-white'
//                                 : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
//                                 }`}
//                         >
//                             لغو شده ({orders.filter(o => o.status === 'cancelled').length})
//                         </button>
//                     </div>
//                 </div>

//                 {/* Orders List */}
//                 <div className="space-y-4">
//                     {filteredOrders.length === 0 ? (
//                         <div className="bg-white rounded-2xl shadow-box-md p-8 text-center">
//                             <svg className="w-16 h-16 mx-auto mb-4 fill-zinc-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                                 <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87Z" />
//                             </svg>
//                             <h3 className="text-lg font-medium text-zinc-800 mb-2">سفارشی یافت نشد</h3>
//                             <p className="text-zinc-600">در این بخش سفارشی موجود نیست</p>
//                         </div>
//                     ) : (
//                         filteredOrders.map((order) => (
//                             <div key={order.id} className="bg-white rounded-2xl shadow-box-md p-6">
//                                 {/* Order Header */}
//                                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-zinc-200">
//                                     <div className="flex items-center gap-3 mb-3 md:mb-0">
//                                         {getStatusIcon(order.status)}
//                                         <div>
//                                             <h3 className="font-medium text-zinc-800">سفارش {order.id}</h3>
//                                             <p className="text-sm text-zinc-600">{order.date}</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col md:items-end">
//                                         <p className={`font-medium ${order.statusColor} mb-1`}>{order.statusText}</p>
//                                         <p className="text-lg font-bold text-zinc-800">{order.amount}</p>
//                                         {order.trackingCode && (
//                                             <p className="text-xs text-zinc-500 mt-1">کد پیگیری: {order.trackingCode}</p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Order Items */}
//                                 <div className="space-y-3 mb-4">
//                                     {order.items.map((item) => (
//                                         <div key={item.id} className="flex gap-4 p-3 bg-zinc-50 rounded-xl">
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.name}
//                                                 className="w-16 h-16 object-cover rounded-lg"
//                                             />
//                                             <div className="flex-1">
//                                                 <h4 className="font-medium text-zinc-800 mb-1">{item.name}</h4>
//                                                 <div className="flex justify-between items-center">
//                                                     <p className="text-sm text-zinc-600">تعداد: {item.quantity}</p>
//                                                     <p className="font-medium text-zinc-800">{item.price}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Order Actions */}
//                                 <div className="flex flex-wrap gap-3">
//                                     {order.status === 'pending' && (
//                                         <>
//                                             <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
//                                                 پرداخت سفارش
//                                             </button>
//                                             <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
//                                                 لغو سفارش
//                                             </button>
//                                         </>
//                                     )}
//                                     {order.status === 'delivered' && (
//                                         <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
//                                             خرید مجدد
//                                         </button>
//                                     )}
//                                     <button className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm transition-colors">
//                                         جزئیات سفارش
//                                     </button>
//                                     {order.trackingCode && (
//                                         <button className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm transition-colors">
//                                             پیگیری مرسوله
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default Profile__Orders;