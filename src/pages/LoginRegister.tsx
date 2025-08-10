import React, { useState } from 'react';

type Step = 'phone' | 'otp' | 'signup';

interface User {
    id: string;
    phone: string;
    name?: string;
    email?: string;
}

// Mock data for demonstration
const mockUsers: User[] = [
    { id: '1', phone: '09123456789', name: 'علی احمدی', email: 'ali@example.com' },
    { id: '2', phone: '09987654321', name: 'مریم محمدی', email: 'maryam@example.com' },
];

const LoginRegister: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<Step>('phone');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otpCode, setOtpCode] = useState<string>('');
    const [generatedOtp, setGeneratedOtp] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [signupData, setSignupData] = useState({
        name: '',
        email: ''
    });

    // Mock function to check if user exists
    const checkUserExists = (phone: string): User | null => {
        return mockUsers.find(user => user.phone === phone) || null;
    };

    // Mock function to generate OTP
    const generateOtp = (): string => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phoneNumber || phoneNumber.length < 11) {
            setError('لطفا شماره موبایل معتبر وارد کنید');
            return;
        }

        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const otp = generateOtp();
            setGeneratedOtp(otp);
            setCurrentStep('otp');
            setLoading(false);

            // In real implementation, you would send OTP via SMS
            console.log(`OTP sent to ${phoneNumber}: ${otp}`);
            alert(`کد تایید برای نمایش: ${otp}`); // Remove this in production
        }, 1000);
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!otpCode || otpCode.length !== 6) {
            setError('کد تایید باید 6 رقم باشد');
            return;
        }

        if (otpCode !== generatedOtp) {
            setError('کد تایید اشتباه است');
            return;
        }

        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const existingUser = checkUserExists(phoneNumber);

            if (existingUser) {
                // User exists, redirect to home
                alert('ورود موفق! در حال انتقال به صفحه اصلی...');
                // In real implementation: navigate('/home') or window.location.href = '/home'
                console.log('Redirecting to home page...');
            } else {
                // New user, show signup form
                setCurrentStep('signup');
            }

            setLoading(false);
        }, 1000);
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!signupData.name.trim()) {
            setError('لطفا نام خود را وارد کنید');
            return;
        }

        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            // In real implementation, you would create the user account
            console.log('Creating new user:', { ...signupData, phone: phoneNumber });
            alert('ثبت نام موفق! در حال انتقال به صفحه اصلی...');
            // navigate('/home') or window.location.href = '/home'
            setLoading(false);
        }, 1000);
    };

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
                    placeholder="123456"
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
            <button
                type="button"
                onClick={() => {
                    setCurrentStep('phone');
                    setOtpCode('');
                    setError('');
                }}
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
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="نام و نام خانوادگی"
                    className="focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-3 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none"
                />
                <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ایمیل (اختیاری)"
                    className="focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-3 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none"
                    dir="ltr"
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
        <div className="bg-[#fcfcfc]">
            <div className="h-screen flex justify-center items-center">
                <div className="bg-white rounded-2xl shadow-box-sm w-11/12 sm:w-7/12 md:w-6/12 lg:w-4/12 xl:w-3/12 h-auto py-5 px-4">
                    <img className="w-48 mx-auto" src="assets/image/logo.webp" alt="لوگو" />

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

export default LoginRegister;