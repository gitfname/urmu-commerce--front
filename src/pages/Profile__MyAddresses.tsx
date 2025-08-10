import React, { useState } from 'react';

interface Address {
    id: string;
    title: string;
    recipientName: string;
    recipientPhone: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
    isDefault: boolean;
}

const Profile__MyAddresses: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            title: 'منزل',
            recipientName: 'امیررضا کریمی',
            recipientPhone: '09123456789',
            province: 'تهران',
            city: 'تهران',
            address: 'خیابان ولیعصر، خیابان طالقانی، پلاک 123، واحد 45',
            postalCode: '1234567890',
            isDefault: true
        },
        {
            id: '2',
            title: 'محل کار',
            recipientName: 'امیررضا کریمی',
            recipientPhone: '09123456789',
            province: 'تهران',
            city: 'تهران',
            address: 'میدان تجریش، خیابان شریعتی، برج میلاد، طبقه 15',
            postalCode: '1987654321',
            isDefault: false
        }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<Partial<Address>>({
        title: '',
        recipientName: '',
        recipientPhone: '',
        province: '',
        city: '',
        address: '',
        postalCode: '',
        isDefault: false
    });

    const provinces = [
        'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'خوزستان',
        'مازندران', 'کرمان', 'سیستان و بلوچستان', 'گیلان'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingAddress) {
            // Update existing address
            setAddresses(addresses.map(addr =>
                addr.id === editingAddress.id
                    ? { ...addr, ...formData } as Address
                    : formData.isDefault ? { ...addr, isDefault: false } : addr
            ));
        } else {
            // Add new address
            const newAddress: Address = {
                id: Date.now().toString(),
                ...formData as Omit<Address, 'id'>
            };

            setAddresses(prev =>
                formData.isDefault
                    ? [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress]
                    : [...prev, newAddress]
            );
        }

        // Reset form
        setFormData({
            title: '',
            recipientName: '',
            recipientPhone: '',
            province: '',
            city: '',
            address: '',
            postalCode: '',
            isDefault: false
        });
        setShowAddForm(false);
        setEditingAddress(null);
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setFormData(address);
        setShowAddForm(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
            setAddresses(addresses.filter(addr => addr.id !== id));
        }
    };

    const setAsDefault = (id: string) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const cancelForm = () => {
        setShowAddForm(false);
        setEditingAddress(null);
        setFormData({
            title: '',
            recipientName: '',
            recipientPhone: '',
            province: '',
            city: '',
            address: '',
            postalCode: '',
            isDefault: false
        });
    };

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5">
            <div className="my-5 lg:my-10">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">آدرس‌های من</h1>
                        <p className="text-zinc-600">مدیریت آدرس‌های تحویل سفارشات</p>
                    </div>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-4 md:mt-0 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm48,112H136v40a8,8,0,0,1-16,0V136H80a8,8,0,0,1,0-16h40V80a8,8,0,0,1,16,0v40h40A8,8,0,0,1,176,128Z" />
                        </svg>
                        افزودن آدرس جدید
                    </button>
                </div>

                {/* Add/Edit Address Form */}
                {showAddForm && (
                    <div className="bg-white rounded-2xl shadow-box-md p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-zinc-800">
                                {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
                            </h2>
                            <button
                                onClick={cancelForm}
                                className="text-zinc-400 hover:text-zinc-600"
                            >
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">عنوان آدرس</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="مثال: منزل، محل کار"
                                        className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Recipient Name */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">نام گیرنده</label>
                                    <input
                                        type="text"
                                        name="recipientName"
                                        value={formData.recipientName}
                                        onChange={handleInputChange}
                                        placeholder="نام و نام خانوادگی"
                                        className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">شماره تماس</label>
                                    <input
                                        type="tel"
                                        name="recipientPhone"
                                        value={formData.recipientPhone}
                                        onChange={handleInputChange}
                                        placeholder="09123456789"
                                        className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Province */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">استان</label>
                                    <select
                                        name="province"
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">انتخاب استان</option>
                                        {provinces.map(province => (
                                            <option key={province} value={province}>{province}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">شهر</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="نام شهر"
                                        className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Postal Code */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">کد پستی</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="1234567890"
                                        className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">آدرس کامل</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="آدرس کامل شامل خیابان، کوچه، پلاک و واحد"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            {/* Default Address Checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-red-500 border-zinc-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="isDefault" className="mr-2 text-sm text-zinc-700">
                                    به عنوان آدرس پیش‌فرض تنظیم شود
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                                >
                                    {editingAddress ? 'به‌روزرسانی آدرس' : 'افزودن آدرس'}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelForm}
                                    className="px-6 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-xl font-medium transition-colors"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Addresses List */}
                <div className="space-y-4">
                    {addresses.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-box-md p-12 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 fill-zinc-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                <path d="M128,64a40,40,0,1,1,40-40A40,40,0,0,1,128,64Zm0-64a24,24,0,1,0,24,24A24,24,0,0,0,128,0Zm0,80A104.11,104.11,0,0,0,24,184c0,22.24,18.35,40,40.56,40h126.88c22.21,0,40.56-17.76,40.56-40A104.11,104.11,0,0,0,128,80Zm0,128H64.56C50.45,208,40,197.28,40,184a88,88,0,0,1,176,0c0,13.28-10.45,24-24.56,24Z" />
                            </svg>
                            <h3 className="text-lg font-medium text-zinc-800 mb-2">آدرسی ثبت نشده</h3>
                            <p className="text-zinc-600 mb-6">برای تحویل سفارشات، آدرس خود را ثبت کنید</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                            >
                                افزودن اولین آدرس
                            </button>
                        </div>
                    ) : (
                        addresses.map((address) => (
                            <div key={address.id} className="bg-white rounded-2xl shadow-box-md p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-lg font-bold text-zinc-800">{address.title}</h3>
                                            {address.isDefault && (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                    آدرس پیش‌فرض
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-zinc-500 mb-1">گیرنده</p>
                                                <p className="text-zinc-800 font-medium">{address.recipientName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-zinc-500 mb-1">شماره تماس</p>
                                                <p className="text-zinc-800 font-medium">{address.recipientPhone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-zinc-500 mb-1">استان و شهر</p>
                                                <p className="text-zinc-800 font-medium">{address.province}، {address.city}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-zinc-500 mb-1">کد پستی</p>
                                                <p className="text-zinc-800 font-medium">{address.postalCode}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-zinc-500 mb-1">آدرس کامل</p>
                                            <p className="text-zinc-800 leading-relaxed">{address.address}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 mt-6 lg:mt-0 lg:mr-6">
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => setAsDefault(address.id)}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                تنظیم به عنوان پیش‌فرض
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEdit(address)}
                                            className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            className="px-4 py-2 border border-red-300 hover:border-red-400 text-red-600 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default Profile__MyAddresses;