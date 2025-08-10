import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import myProfileStore from '../stores/MyProfileStore';
import { observer } from 'mobx-react';

const Profile__Logout: React.FC = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (isLoggingOut && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isLoggingOut && countdown === 0) {
            // Perform actual logout
            handleLogout();
        }
    }, [isLoggingOut, countdown]);

    const handleLogout = () => {
        // Clear user data from localStorage/sessionStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');

        // Redirect to login page
        window.location.href = '/login';
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem("access_token")
        location.replace("/")
        setIsLoggingOut(true);
    };

    const handleCancelLogout = () => {
        // Go back to previous page or profile
        window.history.back();
    };

    const handleStayLoggedIn = () => {
        setIsLoggingOut(false);
        setCountdown(5);
        // Redirect to profile or home
        window.location.href = '/profile';
    };

    return (
        <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 mt-20 md:mt-32">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-box-md p-8 text-center">
                    {!isLoggingOut ? (
                        <>
                            {/* Logout Confirmation */}
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                    <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-82.34-40,40A8,8,0,0,1,168,168V136H104a8,8,0,0,1,0-16h64V88a8,8,0,0,1,13.66-5.66l40,40A8,8,0,0,1,221.66,133.66Z" />
                                </svg>
                            </div>

                            <h1 className="text-2xl font-bold text-zinc-800 mb-3">خروج از حساب کاربری</h1>
                            <p className="text-zinc-600 mb-8">
                                آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
                            </p>

                            {/* User Info Summary */}
                            <div className="bg-zinc-50 rounded-xl p-4 mb-8">
                                <div className="flex items-center justify-center mb-3">
                                    <div className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 fill-zinc-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="font-medium text-zinc-800">{myProfileStore?.profile?.firstName + " " + myProfileStore?.profile?.lastName}</p>
                                <p className="text-sm text-zinc-600">{myProfileStore?.profile?.phoneNumber}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleConfirmLogout}
                                    className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                                >
                                    خروج از حساب
                                </button>
                                <button
                                    onClick={handleCancelLogout}
                                    className="w-full px-6 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-xl font-medium transition-colors"
                                >
                                    انصراف
                                </button>
                            </div>

                            {/* Security Note */}
                            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 fill-blue-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,0,1-12,12H116a8,8,0,0,1,0-16h12V96a8,8,0,0,1,16,0Z" />
                                    </svg>

                                    <div className="text-right">
                                        <p className="text-sm text-blue-800 font-medium mb-1">نکته امنیتی</p>
                                        <p className="text-xs text-blue-700">
                                            اگر از دستگاه عمومی استفاده می‌کنید، حتماً از حساب خود خارج شوید.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Logout Progress */}
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                <svg className="w-10 h-10 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold text-red-600">{countdown}</span>
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-zinc-800 mb-3">در حال خروج...</h1>

                            <p className="text-zinc-600 mb-8">
                                شما در {countdown} ثانیه از حساب کاربری خارج خواهید شد
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-zinc-200 rounded-full h-2 mb-8">
                                <div
                                    className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                                ></div>
                            </div>

                            {/* Cancel Button */}
                            <button
                                onClick={handleStayLoggedIn}
                                className="w-full px-6 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-xl font-medium transition-colors"
                            >
                                لغو و ماندن در حساب
                            </button>

                            {/* Logout Status */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-600">
                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>در حال پاک کردن اطلاعات جلسه...</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Actions */}
                {!isLoggingOut && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-zinc-600 mb-4">یا می‌توانید به بخش‌های زیر بروید:</p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/profile"
                                className="text-red-500 hover:text-red-600 text-sm font-medium"
                            >
                                پروفایل
                            </Link>

                            <span className="text-zinc-300">|</span>

                            <Link
                                to="/profile/my-orders"
                                className="text-red-500 hover:text-red-600 text-sm font-medium"
                            >
                                سفارشات
                            </Link>

                            <span className="text-zinc-300">|</span>

                            <Link
                                to="/"
                                className="text-red-500 hover:text-red-600 text-sm font-medium"
                            >
                                صفحه اصلی
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default observer(Profile__Logout);