// PaymentCallback.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyPaymentMutation } from '../../services/api/ecommerce--api';

const PaymentCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [details, setDetails] = useState('');

    const verifyPaymentMutation = useVerifyPaymentMutation({
        mutation: {
            retry: 1
        },
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                setStatus('loading');
                setMessage('در حال بررسی پرداخت...');

                // Get URL parameters
                const trackId = searchParams.get('trackId');
                const success = searchParams.get('success');
                const paymentStatus = searchParams.get('status');
                const paymentId = searchParams.get('paymentId');

                console.log('Callback params:', { trackId, success, paymentStatus, paymentId });

                if (!trackId) {
                    throw new Error('اطلاعات پرداخت نامعتبر است');
                }

                // Always verify payment regardless of callback parameters
                const response = await verifyPaymentMutation.mutateAsync({
                    data: { trackId: parseInt(trackId) }
                });

                console.log('Verification response:', response.data);

                if (response.data.status === 'completed') {
                    setStatus('success');
                    setMessage('پرداخت با موفقیت انجام شد');
                    setDetails('سفارش شما تایید شد و به زودی ارسال خواهد شد');

                    // Redirect after 3 seconds
                    setTimeout(() => {
                        navigate('/profile/my-orders');
                    }, 3000);
                } else {
                    throw new Error('پرداخت تایید نشد');
                }

            } catch (error: any) {
                console.error('Payment verification error:', error);
                setStatus('error');

                if (error.response?.status === 400) {
                    const errorMessage = error.response.data?.message || 'خطا در تایید پرداخت';
                    setMessage(errorMessage);
                } else {
                    setMessage('خطا در ارتباط با سرور');
                }

                setDetails('میتوانید از صفحه سفارشات وضعیت پرداخت را بررسی کنید');
            }
        };

        // Add delay to ensure callback is processed first
        const timeoutId = setTimeout(() => {
            verifyPayment();
        }, 2500);

        return () => clearTimeout(timeoutId);
    }, [searchParams, navigate, verifyPaymentMutation]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <h2 className="text-lg font-semibold mb-2">بررسی پرداخت</h2>
                        <p className="text-gray-600">{message}</p>
                        <div className="mt-4 text-sm text-gray-500">
                            این فرآیند چند ثانیه طول می‌کشد...
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h2 className="text-lg font-semibold text-green-700 mb-2">پرداخت موفق</h2>
                        <p className="text-gray-600 mb-2">{message}</p>
                        <p className="text-sm text-gray-500 mb-4">{details}</p>
                        <div className="text-xs text-gray-400">
                            در حال انتقال به صفحه سفارشات...
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-red-500 text-6xl mb-4">✗</div>
                        <h2 className="text-lg font-semibold text-red-700 mb-2">خطا در پرداخت</h2>
                        <p className="text-gray-600 mb-2">{message}</p>
                        <p className="text-sm text-gray-500 mb-4">{details}</p>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => navigate('/cart')}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                            >
                                بازگشت به سبد خرید
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition text-sm"
                            >
                                مشاهده سفارشات
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentCallback;


















// // PaymentCallback.tsx
// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { useVerifyPaymentMutation } from '../../services/api/ecommerce--api';

// const PaymentCallback: React.FC = () => {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
//     const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
//     const [message, setMessage] = useState('');

//     const verifyPaymentMutation = useVerifyPaymentMutation();

//     useEffect(() => {
//         const verifyPayment = async () => {
//             const trackId = searchParams.get('trackId');
//             const success = searchParams.get('success');
//             const status = searchParams.get('status');

//             if (!trackId) {
//                 setStatus('error');
//                 setMessage('اطلاعات پرداخت نامعتبر است');
//                 return;
//             }

//             if (success === '1' && status === '1') {
//                 try {
//                     await verifyPaymentMutation.mutateAsync({
//                         data: { trackId: parseInt(trackId) }
//                     });
//                     setStatus('success');
//                     setMessage('پرداخت با موفقیت انجام شد');

//                     // Redirect to success page after 3 seconds
//                     setTimeout(() => {
//                         navigate('/orders');
//                     }, 3000);
//                 } catch (error) {
//                     setStatus('error');
//                     setMessage('خطا در تایید پرداخت');
//                 }
//             } else {
//                 setStatus('error');
//                 setMessage('پرداخت ناموفق بود');
//             }
//         };

//         verifyPayment();
//     }, [searchParams, navigate, verifyPaymentMutation]);

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//             <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
//                 {status === 'loading' && (
//                     <>
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                         <h2 className="text-lg font-semibold mb-2">در حال بررسی پرداخت...</h2>
//                         <p className="text-gray-600">لطفاً منتظر بمانید</p>
//                     </>
//                 )}

//                 {status === 'success' && (
//                     <>
//                         <div className="text-green-500 text-6xl mb-4">✓</div>
//                         <h2 className="text-lg font-semibold text-green-700 mb-2">پرداخت موفق</h2>
//                         <p className="text-gray-600 mb-4">{message}</p>
//                         <p className="text-sm text-gray-500">در حال انتقال به صفحه سفارشات...</p>
//                     </>
//                 )}

//                 {status === 'error' && (
//                     <>
//                         <div className="text-red-500 text-6xl mb-4">✗</div>
//                         <h2 className="text-lg font-semibold text-red-700 mb-2">خطا در پرداخت</h2>
//                         <p className="text-gray-600 mb-4">{message}</p>
//                         <button
//                             onClick={() => navigate('/cart')}
//                             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//                         >
//                             بازگشت به سبد خرید
//                         </button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PaymentCallback;