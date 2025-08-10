import React from 'react';
import LoginSignUp from '../pages/LoginSignUp';
import myProfileStore from '../stores/MyProfileStore';
import { observer } from 'mobx-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireSuperAdmin?: boolean;
    requireAdmin?: boolean;
}

function ProtectedRoute({ children, requireAdmin, requireSuperAdmin }: ProtectedRouteProps) {
    const isLoading = myProfileStore.isFetching
    const isLoggedIn = myProfileStore.isLoggedIn
    const role = myProfileStore.profile?.role
    const isSuperAdmin = myProfileStore?.profile?.role === "super-admin"
    const isAdmin = myProfileStore?.profile?.role === "admin"

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
                <div className="h-screen w-full grid place-items-center">
                    <div className='flex items-center justify-center gap-2'>
                        <div className='w-5 h-5 rounded-full border-t border-t-red-500 animate-spin duration-700'></div>

                        <p className='text-black/90 text-base font-medium'>
                            در حال بررسی احراز هویت...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // If not authenticated, show login page
    if (!isLoggedIn) {
        return <LoginSignUp />;
    }

    // If authenticated but not admin/super-admin (when admin is required)
    if ((requireAdmin && !isAdmin) && (requireSuperAdmin && !isSuperAdmin)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>

                            <p className="text-gray-800 mb-2">
                                دسترسی محدود
                            </p>

                            <p className="mb-6">
                                شما دسترسی لازم برای ورود به پنل مدیریت را ندارید.
                                <br />
                                نقش فعلی شما: <strong>{role === 'user' ? 'کاربر عادی' : role}</strong>
                            </p>
                            <p className='text-sm text-black/70'>
                                برای دسترسی به پنل مدیریت، نیاز به نقش مدیر یا مدیر کل دارید.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If all checks pass, render the protected content
    return <>{children}</>;
}

export default observer(ProtectedRoute)