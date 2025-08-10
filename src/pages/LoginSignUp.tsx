import React, { useState, useEffect } from 'react';
import { Env } from '../env';
import {
    useSendPhoneVerificationOtpCodeMutation,
    useVerifyPhoneVerificationOtpCodeMutation,
    useLogin,
    useSignupUserMutation,
    type SendOtpCodeToPhoneDto,
    type VerifyOtpCodeToPhoneDto,
    type SignUpDto
} from "../services/api/ecommerce--api"

type Step = 'phone' | 'otp' | 'signup';

interface SignupData {
    firstName: string;
    lastName: string;
}

// Configuration
const OTP_CONFIG = {
    WAIT_TIME: 60, // seconds
    MAX_ATTEMPTS: 3,
    OTP_EXPIRY: 90, // seconds
};

const LoginSignUp: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<Step>('phone');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otpCode, setOtpCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [signupData, setSignupData] = useState<SignupData>({
        firstName: '',
        lastName: '',
    });

    // OTP session management
    const [waitTime, setWaitTime] = useState<number>(0);
    const [canResend, setCanResend] = useState<boolean>(true);
    const [shortTermToken, setShortTermToken] = useState<string>('');
    const [isExistingUser, setIsExistingUser] = useState<boolean>(false);

    // API Mutations
    const sendOtpMutation = useSendPhoneVerificationOtpCodeMutation();
    const verifyOtpMutation = useVerifyPhoneVerificationOtpCodeMutation();

    const loginMutation = useLogin({
        axios: {
            headers: {
                Authorization: "Bearer " + shortTermToken
            }
        }
    });

    const signupMutation = useSignupUserMutation({
        axios: {
            headers: {
                Authorization: "Bearer " + shortTermToken
            }
        }
    });

    // Timer effect
    useEffect(() => {
        let interval: any;

        if (waitTime > 0) {
            interval = setInterval(() => {
                setWaitTime(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [waitTime]);

    // Format time display
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle phone number submission
    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phoneNumber || phoneNumber.length < 11) {
            setError('لطفا شماره موبایل معتبر وارد کنید');
            return;
        }

        try {
            await sendOtpMutation.mutateAsync({
                data: { phone: phoneNumber }
            });

            setCurrentStep('otp');
            setWaitTime(OTP_CONFIG.WAIT_TIME);
            setCanResend(false);
        } catch (error: any) {
            setError(error.response?.data?.message || 'خطا در ارسال کد تایید');
        }
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        setError('');

        try {
            await sendOtpMutation.mutateAsync({
                data: { phone: phoneNumber }
            });

            setWaitTime(OTP_CONFIG.WAIT_TIME);
            setCanResend(false);
            setOtpCode('');
        } catch (error: any) {
            setError(error.response?.data?.message || 'خطا در ارسال مجدد کد تایید');
        }
    };

    // Handle OTP verification
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!otpCode || otpCode.length !== 4) {
            setError('کد تایید باید 4 رقم باشد');
            return;
        }

        try {
            const response = await verifyOtpMutation.mutateAsync({
                data: { phone: phoneNumber, code: otpCode }
            });

            const { isLoggedIn, shortTermAccessToken } = response.data;

            localStorage.setItem("short_token", shortTermAccessToken)

            if (shortTermAccessToken) {
                setShortTermToken(shortTermAccessToken);
            }

            setIsExistingUser(isLoggedIn || false);

            if (isLoggedIn) {
                // User exists, proceed to login
                await handleLogin(shortTermAccessToken || '');
            } else {
                // New user, show signup form
                setCurrentStep('signup');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'کد تایید اشتباه است');
        }
    };

    // Handle login (get long-term token)
    const handleLogin = async (shortToken: string) => {
        try {
            const response = await new Promise(resolve => {
                setTimeout(async () => {
                    resolve(await loginMutation.mutateAsync(undefined))
                }, 75);
            })

            const accessToken = (response as any)?.data.access_token;
            
            // Save token to localStorage
            localStorage.setItem('access_token', accessToken);

            if (accessToken) {

                // Redirect to home page
                window.location.href = '/';
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'خطا در ورود');
        }
    };

    // Handle signup
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!signupData.firstName.trim()) {
            setError('لطفا نام خود را وارد کنید');
            return;
        }

        try {
            // First signup
            await signupMutation.mutateAsync({
                data: {
                    firstName: signupData.firstName,
                    lastName: signupData.lastName
                }
            });

            // Then login to get long-term token
            await handleLogin(shortTermToken);
        } catch (error: any) {
            setError(error.response?.data?.message || 'خطا در ثبت نام');
        }
    };

    const handleBackToPhone = () => {
        setCurrentStep('phone');
        setOtpCode('');
        setError('');
        setShortTermToken('');
    };

    // Get loading states from mutations
    const loading = sendOtpMutation.isPending ||
        verifyOtpMutation.isPending ||
        loginMutation.isPending ||
        signupMutation.isPending;

    const renderPhoneStep = () => (
        <form onSubmit={handlePhoneSubmit}>
            <div className="mt-5 text-lg text-zinc-700">
                ورود | ثبت نام
            </div>
            <div className="mt-8 mb-4 text-xs text-zinc-500">
                لطفا شماره موبایل خود را وارد کنید
            </div>
            <div className="flex flex-col gap-y-1">
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="09123456789"
                    className="focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-3 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none"
                    maxLength={11}
                    dir="ltr"
                />
                {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
            </div>
            <button
                type="submit"
                disabled={loading}
                className="mx-auto w-full px-2 py-3 mt-8 text-sm bg-red-500 hover:bg-red-400 transition text-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
            </button>
        </form>
    );

    const renderOtpStep = () => (
        <form onSubmit={handleOtpSubmit}>
            <div className="mt-5 text-lg text-zinc-700">
                تایید شماره موبایل
            </div>
            <div className="mt-8 mb-4 text-xs text-zinc-500">
                کد تایید ارسال شده به شماره {phoneNumber} را وارد کنید
            </div>
            <div className="flex flex-col gap-y-1">
                <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-3 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none text-center tracking-widest"
                    maxLength={6}
                    dir="ltr"
                />
                {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mx-auto w-full px-2 py-3 mt-8 text-sm bg-red-500 hover:bg-red-400 transition text-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'در حال بررسی...' : 'تایید'}
            </button>

            {/* Resend OTP section */}
            <div className="mt-4 text-center">
                {!canResend && waitTime > 0 ? (
                    <div className="text-sm text-zinc-500">
                        ارسال مجدد کد تا {formatTime(waitTime)} دیگر
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-sm text-red-500 hover:text-red-400 transition disabled:opacity-50"
                    >
                        {loading ? 'در حال ارسال...' : 'ارسال مجدد کد تایید'}
                    </button>
                )}
            </div>

            <button
                type="button"
                onClick={handleBackToPhone}
                className="mx-auto w-full px-2 py-2 mt-4 text-sm text-red-500 hover:text-red-400 transition"
            >
                تغییر شماره موبایل
            </button>
        </form>
    );

    const renderSignupStep = () => (
        <form onSubmit={handleSignupSubmit}>
            <div className="mt-5 text-lg text-zinc-700">
                تکمیل اطلاعات
            </div>
            <div className="mt-8 mb-4 text-xs text-zinc-500">
                لطفا اطلاعات خود را تکمیل کنید
            </div>
            <div className="flex flex-col gap-y-4">
                <input
                    type="text"
                    value={signupData.firstName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="نام"
                    className="focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-3 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none"
                />
                <input
                    type="text"
                    value={signupData.lastName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="نام خانوادگی (اختیاری)"
                    className="focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-3 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none"
                />
                {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>
            <button
                type="submit"
                disabled={loading}
                className="mx-auto w-full px-2 py-3 mt-8 text-sm bg-red-500 hover:bg-red-400 transition text-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
            </button>
        </form>
    );

    return (
        <div className="bg-[#fcfcfc] mt-8 md:mt-28">
            <div className="h-screen flex justify-center items-center">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-box-sm w-11/12 sm:w-7/12 md:w-6/12 lg:w-4/12 xl:w-3/12 h-auto py-5 px-4">
                    <img className="w-32 mx-auto" src="/logo.webp" alt="لوگو" />

                    {currentStep === 'phone' && renderPhoneStep()}
                    {currentStep === 'otp' && renderOtpStep()}
                    {currentStep === 'signup' && renderSignupStep()}

                    {currentStep === 'phone' && (
                        <div className="mt-8 mb-4 text-xs text-zinc-500">
                            ورود شما به معنای پذیرش{' '}
                            <a className="text-red-400 hover:text-red-500 transition" href="#">
                                قوانین و مقررات
                            </a>{' '}
                            بازرگانان بدون مرز - BBM میباشد.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginSignUp;