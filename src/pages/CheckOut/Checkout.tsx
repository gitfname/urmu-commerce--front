import React, { useState } from 'react';
import {
    useGetCartSummaryQuery,
    useCreateOrderFromCartMutation,
    useCreatePaymentMutation,
    useFindActiveSendingWaysQuery,
    type CreateOrderDto,
    type CreatePaymentDto,
    type SendingWaysSerializer
} from "../../services/api/ecommerce--api";

interface FormData {
    firstName: string;
    lastName: string;
    province: string;
    city: string;
    street: string;
    plateNumber: string;
    phone: string;
    postalCode: string;
    additionalNotes: string;
    deliveryDay: string;
    shippingType: string;
    paymentMethod: string;
}

const Checkout: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        province: '',
        city: '',
        street: '',
        plateNumber: '',
        phone: '',
        postalCode: '',
        additionalNotes: '',
        deliveryDay: '',
        shippingType: '',
        paymentMethod: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // API hooks
    const { data: cartSummary, isLoading: isLoadingCart, error: cartError } = useGetCartSummaryQuery({
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });

    // Fetch active sending ways from API
    const {
        data: sendingWaysResponse,
        isLoading: isLoadingSendingWays,
        error: sendingWaysError
    } = useFindActiveSendingWaysQuery({
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });

    const createOrderMutation = useCreateOrderFromCartMutation({
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });

    const createPaymentMutation = useCreatePaymentMutation({
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token")
            }
        }
    });

    // Get sending ways from API response
    const sendingWays: SendingWaysSerializer[] = sendingWaysResponse?.data || [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
        if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
        if (!formData.province.trim()) newErrors.province = 'نام استان الزامی است';
        if (!formData.city.trim()) newErrors.city = 'نام شهر الزامی است';
        if (!formData.street.trim()) newErrors.street = 'آدرس الزامی است';
        if (!formData.plateNumber.trim()) newErrors.plateNumber = 'شماره پلاک الزامی است';
        if (!formData.phone.trim()) newErrors.phone = 'شماره تلفن الزامی است';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'کد پستی الزامی است';
        if (!formData.shippingType) newErrors.shippingType = 'انتخاب نوع ارسال الزامی است';

        // Validate phone number format (basic validation)
        if (formData.phone && !/^09\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'شماره تلفن معتبر نیست';
        }

        // Validate postal code format (basic validation)
        if (formData.postalCode && !/^\d{10}$/.test(formData.postalCode)) {
            newErrors.postalCode = 'کد پستی باید 10 رقم باشد';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare order data
            const orderData: CreateOrderDto = {
                sendingWayId: parseInt(formData.shippingType),
                shippingAddress: {
                    fullName: `${formData.firstName} ${formData.lastName}`,
                    phone: formData.phone,
                    address: `${formData.street}, پلاک ${formData.plateNumber}`,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    state: formData.province
                },
                notes: formData.additionalNotes || undefined
            };

            // Create order
            const orderResponse = await createOrderMutation.mutateAsync({ data: orderData });
            console.log('Order created:', orderResponse.data);

            // Create payment
            const paymentData: CreatePaymentDto = {
                orderId: orderResponse.data.id,
                description: `پرداخت سفارش شماره ${orderResponse.data.orderNumber}`,
                callbackUrl: `${window.location.origin}/payment/callback`
            };

            const paymentResponse = await createPaymentMutation.mutateAsync({ data: paymentData });
            console.log('Payment created:', paymentResponse.data);

            // Redirect to payment gateway
            if (paymentResponse.data.paymentUrl) {
                window.location.href = paymentResponse.data.paymentUrl;
            } else {
                throw new Error('Payment URL not received');
            }

        } catch (error) {
            console.error('Error processing order:', error);
            alert('خطا در پردازش سفارش. لطفا دوباره تلاش کنید.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSelectedShippingWay = () => {
        return sendingWays.find(way => way.id.toString() === formData.shippingType);
    };

    const formatPrice = (price: number | string) => {
        return new Intl.NumberFormat('fa-IR').format(Number(price));
    };

    const RequiredIcon = () => (
        <svg className="fill-red-500" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#4d4d4d" viewBox="0 0 256 256">
            <path d="M210.23,101.57l-72.6,29,51.11,65.71a6,6,0,0,1-9.48,7.36L128,137.77,76.74,203.68a6,6,0,1,1-9.48-7.36l51.11-65.71-72.6-29a6,6,0,1,1,4.46-11.14L122,119.14V40a6,6,0,0,1,12,0v79.14l71.77-28.71a6,6,0,1,1,4.46,11.14Z"></path>
        </svg>
    );

    const ErrorMessage = ({ message }: { message: string }) => (
        <span className="text-red-500 text-xs mt-1">{message}</span>
    );

    // Loading state
    if (isLoadingCart || isLoadingSendingWays) {
        return (
            <div className="max-w-[1500px] mx-auto px-3 md:px-5 mt-20 md:mt-36">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">در حال بارگذاری...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (cartError || sendingWaysError) {
        return (
            <div className="max-w-[1500px] mx-auto px-3 md:px-5 mt-20 md:mt-36">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-red-500">
                        {cartError ? 'خطا در بارگذاری اطلاعات سبد خرید' : 'خطا در بارگذاری روش‌های ارسال'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-20 md:mt-36">
            {/* Progress Bar - keeping your existing progress bar code */}
            <div className="container mx-auto w-full h-full pt-9">
                <div className="relative pl-3 h-full">
                    <div className="flex pt-3 *:border-2 md:*:border-4">
                        <div className="border-opacity-90 border-green-500 w-1/4"></div>
                        <div className="border-opacity-90 border-green-500 w-1/4"></div>
                        <div className="border-opacity-90 border-gray-300 w-1/4"></div>
                        <div className="border-opacity-90 border-gray-300 w-1/4"></div>
                    </div>

                    {/* Progress Labels */}
                    <div className="absolute -top-10 inline-flex w-full justify-between">
                        <div className="">
                            <div className="w-8 h-8"></div>
                        </div>
                        <div className="flex items-center">
                            <div className="z-20 flex items-center order-1">
                                <h1 className="mx-auto md:font-semibold text-zinc-500 pr-6 text-xs md:text-base">سبد خرید</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="z-20 flex items-center order-1">
                                <h1 className="mx-auto md:font-semibold text-zinc-700 pr-4 text-xs md:text-base">جزئیات پرداخت</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="z-20 flex items-center order-1">
                                <h1 className="mx-auto md:font-semibold text-zinc-500 pr-1 pl-2 text-xs md:text-base">تکمیل سفارش</h1>
                            </div>
                        </div>
                        <div className="pl-3">
                            <div className="w-8 h-8"></div>
                        </div>
                    </div>

                    {/* Progress Dots */}
                    <div className="absolute top-0 md:-top-1 inline-flex w-full justify-between">
                        <div className="flex items-center *:w-6 *:h-6 md:*:w-8 *:md:h-8">
                            <div className="z-20 flex items-center order-1 bg-gray-200 shadow-box-md rounded-full">
                                <h1 className="mx-auto font-semibold text-lg text-zinc-700"></h1>
                            </div>
                        </div>
                        <div className="flex items-center *:w-6 *:h-6 md:*:w-8 *:md:h-8">
                            <div className="z-20 flex items-center order-1 bg-white shadow-box-md rounded-full">
                                <h1 className="mx-auto font-semibold text-base md:text-lg text-zinc-700">1</h1>
                            </div>
                        </div>
                        <div className="flex items-center *:w-6 *:h-6 md:*:w-8 *:md:h-8">
                            <div className="z-20 flex items-center order-1 bg-green-400 shadow-box-md rounded-full">
                                <h1 className="mx-auto font-semibold text-base md:text-lg text-white">2</h1>
                            </div>
                        </div>
                        <div className="flex items-center *:w-6 *:h-6 md:*:w-8 *:md:h-8">
                            <div className="z-20 flex items-center order-1 bg-white shadow-box-md rounded-full">
                                <h1 className="mx-auto font-semibold text-base md:text-lg text-zinc-700">3</h1>
                            </div>
                        </div>
                        <div className="flex items-center pl-3 *:w-6 *:h-6 md:*:w-8 *:md:h-8">
                            <div className="z-20 flex items-center order-1 bg-gray-200 shadow-box-md rounded-full">
                                <h1 className="mx-auto font-semibold text-lg text-zinc-700"></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="my-8 lg:my-10 py-5 lg:px-20 md:flex gap-5">
                {/* Form Section */}
                <div className="md:w-8/12 bg-white shadow-box-md rounded-xl py-5 px-2 sm:px-6">
                    <div className="text-zinc-800 text-lg font-semibold">
                        جزئیات پرداخت
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name Fields */}
                        <div className="sm:flex gap-x-5 mt-5">
                            <div className="sm:w-1/2 mb-2 sm:mb-0 flex flex-col gap-y-1">
                                <label className="text-sm text-zinc-700 flex">
                                    نام
                                    <RequiredIcon />
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        } bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none`}
                                />
                                {errors.firstName && <ErrorMessage message={errors.firstName} />}
                            </div>
                            <div className="sm:w-1/2 flex flex-col gap-y-1">
                                <label className="text-sm text-zinc-700 flex">
                                    نام خانوادگی
                                    <RequiredIcon />
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        } bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none`}
                                />
                                {errors.lastName && <ErrorMessage message={errors.lastName} />}
                            </div>
                        </div>

                        {/* Province and City - Changed to text inputs */}
                        <div className="sm:flex gap-x-5 mt-7">
                            <div className="sm:w-1/2 mb-2 sm:mb-0 flex flex-col gap-y-1">
                                <label className="text-sm text-zinc-700 flex">
                                    استان
                                    <RequiredIcon />
                                </label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleInputChange}
                                    placeholder="نام استان را وارد کنید"
                                    className={`focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid ${errors.province ? 'border-red-500' : 'border-gray-300'
                                        } bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none`}
                                />
                                {errors.province && <ErrorMessage message={errors.province} />}
                            </div>
                            <div className="sm:w-1/2 flex flex-col gap-y-1">
                                <label className="text-sm text-zinc-700 flex">
                                    شهر
                                    <RequiredIcon />
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="نام شهر را وارد کنید"
                                    className={`focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid ${errors.city ? 'border-red-500' : 'border-gray-300'
                                        } bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none`}
                                />
                                {errors.city && <ErrorMessage message={errors.city} />}
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div className="mt-7">
                            <div className="flex flex-col gap-y-1">
                                <label className="text-sm text-zinc-700 flex">
                                    خیابان و کوچه
                                    <RequiredIcon />
                                </label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    className={`focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid ${errors.street ? 'border-red-500' : 'border-gray-300'
                                        } bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none`}
                                />
                                {errors.street && <ErrorMessage message={errors.street} />}
                            </div>
                            <div className="flex flex-col gap-y-1 mt-5">
                                <label className="text-sm text-zinc-700 flex">
                                    شماره پلاک و واحد
                                    <RequiredIcon />
                                </label>
                                <input
                                    type="text"
                                    name="plateNumber"
                                    value={formData.plateNumber}
                                    onChange={handleInputChange}
                                    className={`focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid ${errors.plateNumber ? 'border-red-500' : 'border-gray-300'
                                        } bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none`}
                                />
                                {errors.plateNumber && <ErrorMessage message={errors.plateNumber} />}
                            </div>
                        </div>

                        {/* Phone and Postal Code */}
                        <div className="sm:flex gap-x-5 mt-5">
                            <div className="sm:w-1/2 mb-2 sm:mb-0 flex flex-col gap-y-1">
                                <label className="text-sm text-zinc-700 flex">
                                    تلفن
                                    <RequiredIcon />
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="09123456789"
                                    className={`focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        } bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none`}
                                />
                                {errors.phone && <ErrorMessage message={errors.phone} />}
                            </div>
                            <div className="sm:w-1/2 flex flex-col gap-y-1">
                                <label className="text-sm text-zinc-700 flex">
                                    کد پستی
                                    <RequiredIcon />
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="1234567890"
                                    className={`focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                                        } bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none`}
                                />
                                {errors.postalCode && <ErrorMessage message={errors.postalCode} />}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="mt-5">
                            <div className="flex flex-col gap-y-1">
                                <label className="text-sm text-zinc-700 flex">
                                    توضیحات اضافه
                                </label>
                                <textarea
                                    placeholder="نکات مهم درباره تحویل محصول"
                                    name="additionalNotes"
                                    value={formData.additionalNotes}
                                    onChange={handleInputChange}
                                    cols={30}
                                    rows={7}
                                    className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-400 focus:outline-none"
                                ></textarea>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <div className="md:w-4/12 mt-8 md:mt-0">
                    {/* Shipping Type */}
                    <div className="px-2 sm:px-6 py-3 bg-white rounded-xl shadow-box-sm mb-5">
                        <div className="flex gap-x-1 items-center text-zinc-700 border-b pb-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#d02525" viewBox="0 0 256 256">
                                <path d="M240,120v64a8,8,0,0,1-8,8H208a24,24,0,0,0-32-22.63h0A24,24,0,0,0,160,192H96a24,24,0,0,0-48,0H24a8,8,0,0,1-8-8V144H176V120Z" opacity="0.2"></path>
                                <path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path>
                            </svg>
                            نوع ارسال
                        </div>

                        {/* Show loading state for sending ways */}
                        {isLoadingSendingWays ? (
                            <div className="text-center py-4">
                                <div className="text-sm text-gray-500">در حال بارگذاری روش‌های ارسال...</div>
                            </div>
                        ) : sendingWays.length === 0 ? (
                            <div className="text-center py-4">
                                <div className="text-sm text-gray-500">هیچ روش ارسالی در دسترس نیست</div>
                            </div>
                        ) : (
                            <ul className="grid w-full gap-3">
                                {sendingWays.map((item) => (
                                    <li key={item.id}>
                                        <input
                                            type="radio"
                                            id={item.id.toString()}
                                            name="shippingType"
                                            value={item.id.toString()}
                                            checked={formData.shippingType === item.id.toString()}
                                            onChange={handleInputChange}
                                            className="hidden peer"
                                            required
                                        />
                                        <label
                                            htmlFor={item.id.toString()}
                                            className="flex items-center justify-start gap-x-2 w-full p-2 text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-red-400 peer-checked:text-red-400 hover:text-gray-600 hover:bg-gray-100"
                                        >
                                            <div className="min-w-12 max-w-12 border rounded-md p-1 bg-gray-50 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium">{item.title}</span>
                                                    <span className="text-xs text-gray-500">{item.description}</span>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-semibold">{formatPrice(item.cost)} تومان</span>
                                                        <span className="text-xs text-gray-400">
                                                            {item.estimatedDeliveryDays} روز کاری
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errors.shippingType && <ErrorMessage message={errors.shippingType} />}
                    </div>

                    {/* Cart Summary */}
                    <div className="px-2 sm:px-6 py-3 bg-white rounded-xl shadow-box-sm">
                        <div className="flex gap-x-1 items-center text-zinc-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#d02525" viewBox="0 0 256 256">
                                <path d="M223.92,208H32.08a8,8,0,0,1-8-8.93l14.25-120a8.06,8.06,0,0,1,8-7.07H209.67a8.06,8.06,0,0,1,8,7.07l14.25,120A8,8,0,0,1,223.92,208Z" opacity="0.2"></path>
                                <path d="M239.89,198.12l-14.26-120a16,16,0,0,0-16-14.12H176a48,48,0,0,0-96,0H46.33a16,16,0,0,0-16,14.12l-14.26,120A16,16,0,0,0,20,210.6a16.13,16.13,0,0,0,12,5.4H223.92A16.13,16.13,0,0,0,236,210.6,16,16,0,0,0,239.89,198.12ZM128,32a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32ZM32,200,46.33,80H80v24a8,8,0,0,0,16,0V80h64v24a8,8,0,0,0,16,0V80h33.75l14.17,120Z"></path>
                            </svg>
                            سبد شما
                        </div>

                        <div className="flex gap-x-1 justify-between items-center text-zinc-600 mt-5 bg-gray-100 rounded-lg px-2 py-3 text-sm">
                            <div>قیمت کالاها ({cartSummary?.data?.itemsCount || 0})</div>
                            <div className="flex gap-x-1">
                                <div>{formatPrice(cartSummary?.data?.subtotal || 0)}</div>
                                <div>تومان</div>
                            </div>
                        </div>

                        <div className="flex gap-x-1 justify-between items-center text-zinc-600 mt-3 bg-gray-100 rounded-lg px-2 py-3 text-sm">
                            <div>تخفیف</div>
                            <div className="flex gap-x-1">
                                <div>{formatPrice(cartSummary?.data?.totalDiscount || 0)}</div>
                                <div>تومان</div>
                            </div>
                        </div>

                        {/* Shipping Cost */}
                        {getSelectedShippingWay() && (
                            <div className="flex gap-x-1 justify-between items-center text-zinc-600 mt-3 bg-gray-100 rounded-lg px-2 py-3 text-sm">
                                <div>هزینه ارسال</div>
                                <div className="flex gap-x-1">
                                    <div>{formatPrice(getSelectedShippingWay()!.cost)}</div>
                                    <div>تومان</div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-x-1 justify-between items-center text-zinc-800 mt-3 bg-gray-100 rounded-lg px-2 py-3 text-sm">
                            <div>جمع کل</div>
                            <div className="flex gap-x-1">
                                <div>
                                    {formatPrice(
                                        (cartSummary?.data?.total || 0) + Number(getSelectedShippingWay()?.cost || 0)
                                    )}
                                </div>
                                <div>تومان</div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !cartSummary?.data?.itemsCount || sendingWays.length === 0}
                            className="mx-auto w-full px-2 py-3 mt-5 text-sm bg-red-500 hover:bg-red-400 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-gray-100 rounded-lg"
                        >
                            {isSubmitting ? 'در حال پردازش...' : 'تایید و پرداخت'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Checkout;