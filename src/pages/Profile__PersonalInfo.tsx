
import React, { useEffect, useState } from 'react';
import myProfileStore from '../stores/MyProfileStore';
import { useUpdateMyProfileMutation, type UsersSerializer } from '../services/api/ecommerce--api';
import { observer } from 'mobx-react';

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const Profile__PersonalInfo: React.FC = () => {
    const updateMyProfile = useUpdateMyProfileMutation({
        axios: {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token") || ""
            }
        }
    })

    const [userInfo, setUserInfo] = useState<Partial<UsersSerializer>>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        // nationalId: '1234567890',
        // birthDate: '1370/05/15',
        // gender: 'male',
    });

    useEffect(
        () => {
            setUserInfo({
                ...userInfo,
                firstName: myProfileStore?.profile?.firstName,
                lastName: myProfileStore?.profile?.lastName,
                phoneNumber: myProfileStore?.profile?.phoneNumber
            })
        }, [myProfileStore?.profile]
    )

    const [passwordData, setPasswordData] = useState<PasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [activeTab, setActiveTab] = useState<'info' | 'password' | 'security'>('info');
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveUserInfo = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateMyProfile.mutateAsync({
                data: {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName
                }
            });

            myProfileStore.fetchMyProfile()
        } catch (error) {
            console.log("error while updating my profile")
            console.log(error)
            console.log("End -- error while updating my profile -- ENd")
        }

        setIsEditing(false);
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('رمز عبور جدید و تکرار آن یکسان نیست');
            return;
        }
        // Change password logic here
        console.log('Changing password');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        // Show success message
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo(prev => ({
                    ...prev,
                    profileImage: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('آیا از حذف حساب کاربری خود اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
            // Delete account logic here
            console.log('Deleting account');
        }
    };

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5">
            <div className="my-5 lg:my-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">اطلاعات شخصی</h1>
                    <p className="text-zinc-600">مدیریت اطلاعات حساب کاربری و تنظیمات امنیتی</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-box-md p-1 mb-8">
                    <div className="flex flex-wrap gap-1">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'info'
                                ? 'bg-red-500 text-white'
                                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            اطلاعات کلی
                        </button>
                        {/* <button
                            onClick={() => setActiveTab('password')}
                            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'password'
                                ? 'bg-red-500 text-white'
                                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            تغییر رمز عبور
                        </button> */}
                        {/* <button
                            onClick={() => setActiveTab('security')}
                            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'security'
                                ? 'bg-red-500 text-white'
                                : 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100'
                                }`}
                        >
                            امنیت حساب
                        </button> */}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-2xl shadow-box-md p-6">
                    {/* Personal Info Tab */}
                    {activeTab === 'info' && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-zinc-800">اطلاعات شخصی</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing
                                        ? 'border border-zinc-300 hover:border-zinc-400 text-zinc-700'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                >
                                    {isEditing ? 'انصراف' : 'ویرایش اطلاعات'}
                                </button>
                            </div>

                            <form onSubmit={handleSaveUserInfo}>
                                {/* Profile Image */}
                                {/* <div className="flex flex-col items-center mb-8">
                                    <div className="relative">
                                        <div className="w-32 h-32 bg-zinc-200 rounded-full overflow-hidden mb-4">
                                            {userInfo.profileImage ? (
                                                <img
                                                    src={userInfo.profileImage}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-16 h-16 fill-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                                                <svg className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                                    <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.31,64l24-24L216,84.69Z" />
                                                </svg>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-600">تصویر پروفایل</p>
                                </div> */}

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">نام</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={userInfo.firstName}
                                            onChange={handleUserInfoChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border rounded-xl transition-colors ${isEditing
                                                ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                                : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                                                }`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">نام خانوادگی</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={userInfo.lastName}
                                            onChange={handleUserInfoChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border rounded-xl transition-colors ${isEditing
                                                ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                                : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                                                }`}
                                            required
                                        />
                                    </div>

                                    {/* <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">ایمیل</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={userInfo.email}
                                            onChange={handleUserInfoChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border rounded-xl transition-colors ${isEditing
                                                ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                                : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                                                }`}
                                            required
                                        />
                                    </div> */}

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">شماره موبایل</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={userInfo.phoneNumber}
                                            onChange={handleUserInfoChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border rounded-xl transition-colors ${isEditing
                                                ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                                : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                                                }`}
                                            required
                                        />
                                    </div>

                                    {/* <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">کد ملی</label>
                                        <input
                                            type="text"
                                            name="nationalId"
                                            value={userInfo.nationalId}
                                            onChange={handleUserInfoChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border rounded-xl transition-colors ${isEditing
                                                ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                                : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                                                }`}
                                            required
                                        />
                                    </div> */}

                                    {/* <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">تاریخ تولد</label>
                                        <input
                                            type="text"
                                            name="birthDate"
                                            value={userInfo.birthDate}
                                            onChange={handleUserInfoChange}
                                            disabled={!isEditing}
                                            placeholder="1370/01/01"
                                            className={`w-full px-4 py-3 border rounded-xl transition-colors ${isEditing
                                                ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                                : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                                                }`}
                                        />
                                    </div> */}

                                    {/* <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">جنسیت</label>
                                        <select
                                            name="gender"
                                            value={userInfo.gender}
                                            onChange={handleUserInfoChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border rounded-xl transition-colors ${isEditing
                                                ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                                : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                                                }`}
                                        >
                                            <option value="">انتخاب کنید</option>
                                            <option value="male">مرد</option>
                                            <option value="female">زن</option>
                                        </select>
                                    </div> */}
                                </div>

                                {isEditing && (
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            type="submit"
                                            disabled={updateMyProfile.isPending}
                                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors relative overflow-hidden"
                                        >
                                            ذخیره تغییرات

                                            {
                                                updateMyProfile.isPending
                                                    ?
                                                    <div className='absolute top-0 left-0 w-full h-full z-10 bg-white/60 grid place-items-center'>
                                                        <div className='w-7 h-7 rounded-full border-t-2 border-t-red-500 animate-spin duration-700'></div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-xl font-medium transition-colors"
                                        >
                                            انصراف
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div>
                            <h2 className="text-xl font-bold text-zinc-800 mb-8">تغییر رمز عبور</h2>

                            <form onSubmit={handleChangePassword} className="max-w-md">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">رمز عبور فعلی</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">رمز عبور جدید</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">تکرار رمز عبور جدید</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-8 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                                >
                                    تغییر رمز عبور
                                </button>
                            </form>

                            {/* Password Tips */}
                            <div className="mt-8 p-4 bg-zinc-50 rounded-xl">
                                <h3 className="font-medium text-zinc-800 mb-3">نکات امنیتی:</h3>
                                <ul className="text-sm text-zinc-600 space-y-1">
                                    <li>• رمز عبور حداقل 8 کاراکتر باشد</li>
                                    <li>• ترکیبی از حروف بزرگ، کوچک و اعداد استفاده کنید</li>
                                    <li>• از کاراکترهای ویژه استفاده کنید</li>
                                    <li>• رمز عبور خود را با دیگران به اشتراک نگذارید</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 className="text-xl font-bold text-zinc-800 mb-8">امنیت حساب</h2>

                            <div className="space-y-6">
                                {/* Two-Factor Authentication */}
                                <div className="p-6 border border-zinc-200 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-zinc-800 mb-2">احراز هویت دو مرحله‌ای</h3>
                                            <p className="text-sm text-zinc-600">افزایش امنیت حساب با کد تأیید پیامکی</p>
                                        </div>
                                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                                            فعال‌سازی
                                        </button>
                                    </div>
                                </div>

                                {/* Login History */}
                                <div className="p-6 border border-zinc-200 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-zinc-800 mb-2">تاریخچه ورود</h3>
                                            <p className="text-sm text-zinc-600">مشاهده آخرین ورودهای حساب کاربری</p>
                                        </div>
                                        <button className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm font-medium transition-colors">
                                            مشاهده
                                        </button>
                                    </div>
                                </div>

                                {/* Active Sessions */}
                                <div className="p-6 border border-zinc-200 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-zinc-800 mb-2">جلسات فعال</h3>
                                            <p className="text-sm text-zinc-600">مدیریت دستگاه‌های متصل به حساب شما</p>
                                        </div>
                                        <button className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm font-medium transition-colors">
                                            مدیریت
                                        </button>
                                    </div>
                                </div>

                                {/* Delete Account */}
                                <div className="p-6 border border-red-200 rounded-xl bg-red-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-red-800 mb-2">حذف حساب کاربری</h3>
                                            <p className="text-sm text-red-600">حذف دائمی حساب کاربری و تمام اطلاعات</p>
                                        </div>
                                        <button
                                            onClick={() => setShowDeleteAccount(true)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            حذف حساب
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Account Modal */}
                {showDeleteAccount && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 fill-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16Z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-zinc-800 mb-2">حذف حساب کاربری</h3>
                                <p className="text-zinc-600 mb-6">
                                    آیا از حذف حساب کاربری خود اطمینان دارید؟ این عمل غیرقابل بازگشت است و تمام اطلاعات شما حذف خواهد شد.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        حذف حساب
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteAccount(false)}
                                        className="flex-1 px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg font-medium transition-colors"
                                    >
                                        انصراف
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default observer(Profile__PersonalInfo);