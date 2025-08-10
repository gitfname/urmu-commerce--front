import React, { useState, useEffect } from 'react';
import { 
  useGetMyWholeSellersRequestQuery,
  useCreateWholeSellersRequestMutation,
  useUpdateMyWholeSellersRequestMutation,
  useDeleteWholeSellersRequestByIdMutation,
  type WholeSellersSerializer,
  type CreateWholeSellersDto,
  type UpdateWholeSellersDto,
  WholeSellersSerializerStatus,
  getGetMyWholeSellersRequestQueryQueryKey
} from '../../services/api/ecommerce--api';
import { useQueryClient } from '@tanstack/react-query';
import { Env } from '../../env';

interface WholeSaleProfile {
  id?: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  companyName: string;
  nationalCardPhoto: File | null;
  businessLicencePhoto: File | null;
  creditCardOrShaba: string;
  status?: string;
  rejectionReason?: string;
}

const Profile__WholeSale: React.FC = () => {
  const queryClient = useQueryClient();
  
  // API Hooks
  const { data: profileData, isLoading, error, refetch } = useGetMyWholeSellersRequestQuery({
    query: {
        queryKey: getGetMyWholeSellersRequestQueryQueryKey(),
      retry: false,
    },
    axios: {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
        }
    }
  });
  
  const createMutation = useCreateWholeSellersRequestMutation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/whole-sellers/my-request'] });
        resetForm();
        alert('درخواست عمده‌فروشی با موفقیت ثبت شد');
      },
      onError: (error: any) => {
        console.error('Create error:', error);
        alert('خطا در ثبت درخواست: ' + (error.response?.data?.message || error.message));
      }
    },
    axios: {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
        }
    }
  });
  
  const updateMutation = useUpdateMyWholeSellersRequestMutation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/whole-sellers/my-request'] });
        resetForm();
        alert('اطلاعات با موفقیت به‌روزرسانی شد');
      },
      onError: (error: any) => {
        console.error('Update error:', error);
        alert('خطا در به‌روزرسانی: ' + (error.response?.data?.message || error.message));
      }
    },
    axios: {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
        }
    }
  });
  
  const deleteMutation = useDeleteWholeSellersRequestByIdMutation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/whole-sellers/my-request'] });
        alert('درخواست با موفقیت حذف شد');
      },
      onError: (error: any) => {
        console.error('Delete error:', error);
        alert('خطا در حذف درخواست: ' + (error.response?.data?.message || error.message));
      }
    },
    axios: {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
        }
    }
  });

  // Component State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<WholeSaleProfile>({
    firstName: '',
    lastName: '',
    nationalCode: '',
    companyName: '',
    nationalCardPhoto: null,
    businessLicencePhoto: null,
    creditCardOrShaba: ''
  });

  const [previewImages, setPreviewImages] = useState<{
    nationalCard: string | null;
    businessLicence: string | null;
  }>({
    nationalCard: null,
    businessLicence: null
  });

  // Convert API data to component format
  const profile: WholeSaleProfile | null = profileData?.data ? {
    id: profileData.data.id.toString(),
    firstName: profileData.data.firstName,
    lastName: profileData.data.lastName,
    nationalCode: profileData.data.nationalCode,
    companyName: profileData.data.companyName,
    nationalCardPhoto: null, // Files are not returned from API
    businessLicencePhoto: null,
    creditCardOrShaba: profileData.data.creditCardOrShaba,
    status: profileData.data.status,
    rejectionReason: profileData.data.rejectionReason
  } : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (name === 'nationalCardPhoto') {
          setPreviewImages(prev => ({ ...prev, nationalCard: result }));
        } else if (name === 'businessLicencePhoto') {
          setPreviewImages(prev => ({ ...prev, businessLicence: result }));
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate national code
    if (!validateNationalCode(formData.nationalCode)) {
      alert('کد ملی وارد شده معتبر نیست');
      return;
    }

    try {
      if (isEditing && profile) {
        // Update existing profile
        const updateData: UpdateWholeSellersDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          nationalCode: formData.nationalCode,
          companyName: formData.companyName,
          creditCardOrShaba: formData.creditCardOrShaba,
        };

        // Only include files if they are selected
        if (formData.nationalCardPhoto) {
          updateData.nationalCardPhoto = formData.nationalCardPhoto;
        }
        if (formData.businessLicencePhoto) {
          updateData.businessLicensePhoto = formData.businessLicencePhoto;
        }

        updateMutation.mutate({ data: updateData });
      } else {
        // Create new profile
        if (!formData.nationalCardPhoto || !formData.businessLicencePhoto) {
          alert('لطفاً تصاویر کارت ملی و مجوز کسب را انتخاب کنید');
          return;
        }

        const createData: CreateWholeSellersDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          nationalCode: formData.nationalCode,
          companyName: formData.companyName,
          nationalCardPhoto: formData.nationalCardPhoto,
          businessLicensePhoto: formData.businessLicencePhoto,
          creditCardOrShaba: formData.creditCardOrShaba,
        };

        createMutation.mutate({ data: createData });
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      nationalCode: '',
      companyName: '',
      nationalCardPhoto: null,
      businessLicencePhoto: null,
      creditCardOrShaba: ''
    });
    setPreviewImages({
      nationalCard: null,
      businessLicence: null
    });
    setShowForm(false);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        nationalCode: profile.nationalCode,
        companyName: profile.companyName,
        nationalCardPhoto: null, // Reset file inputs
        businessLicencePhoto: null,
        creditCardOrShaba: profile.creditCardOrShaba
      });
      setPreviewImages({
        nationalCard: null,
        businessLicence: null
      });
      setIsEditing(true);
      setShowForm(true);
    }
  };

  const handleDelete = () => {
    if (profile && window.confirm('آیا از حذف اطلاعات عمده‌فروشی اطمینان دارید؟')) {
      deleteMutation.mutate({ id: parseInt(profile.id!) });
    }
  };

  const validateNationalCode = (code: string): boolean => {
    if (code.length !== 10) return false;
    const digits = code.split('').map(Number);
    const checkSum = digits[9];
    const sum = digits.slice(0, 9).reduce((acc, digit, index) => acc + digit * (10 - index), 0);
    const remainder = sum % 11;
    return remainder < 2 ? checkSum === remainder : checkSum === 11 - remainder;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case WholeSellersSerializerStatus.approved:
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            تایید شده
          </span>
        );
      case WholeSellersSerializerStatus.rejected:
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            رد شده
          </span>
        );
      case WholeSellersSerializerStatus.pending:
      default:
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            در انتظار بررسی
          </span>
        );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="max-w-[1500px] mx-auto px-3 md:px-5">
        <div className="my-5 lg:my-10">
          <div className="bg-white rounded-2xl shadow-box-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-zinc-600">در حال بارگذاری...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1500px] mx-auto px-3 md:px-5">
      <div className="my-5 lg:my-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">اطلاعات عمده‌فروشی</h1>
            <p className="text-zinc-600">مدیریت اطلاعات حساب عمده‌فروشی شما</p>
          </div>

          {!profile && !error && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 md:mt-0 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm48,112H136v40a8,8,0,0,1-16,0V136H80a8,8,0,0,1,0-16h40V80a8,8,0,0,1,16,0v40h40A8,8,0,0,1,176,128Z" />
              </svg>
              ثبت اطلاعات عمده‌فروشی
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-box-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-800">
                {isEditing ? 'ویرایش اطلاعات عمده‌فروشی' : 'ثبت اطلاعات عمده‌فروشی'}
              </h2>
              <button
                onClick={resetForm}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">نام</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="نام خود را وارد کنید"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">نام خانوادگی</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="نام خانوادگی خود را وارد کنید"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* National Code */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">کد ملی</label>
                  <input
                    type="text"
                    name="nationalCode"
                    value={formData.nationalCode}
                    onChange={handleInputChange}
                    placeholder="کد ملی 10 رقمی"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    onBlur={(e) => {
                      if (e.target.value && !validateNationalCode(e.target.value)) {
                        alert('کد ملی وارد شده معتبر نیست');
                      }
                    }}
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">نام شرکت</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="نام شرکت یا کسب و کار"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Credit Card or Shaba Number */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-2">شماره کارت یا شبا</label>
                  <input
                    type="text"
                    name="creditCardOrShaba"
                    value={formData.creditCardOrShaba}
                    onChange={handleInputChange}
                    placeholder="شماره کارت 16 رقمی یا شماره شبا"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* National Card Photo */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">تصویر کارت ملی</label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      name="nationalCardPhoto"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required={!isEditing}
                    />
                    {previewImages.nationalCard && (
                      <div className="mt-2">
                        <img
                          src={previewImages.nationalCard}
                          alt="پیش‌نمایش کارت ملی"
                          className="w-32 h-20 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Licence Photo */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">تصویر مجوز کسب</label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      name="businessLicencePhoto"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required={!isEditing}
                    />
                    {previewImages.businessLicence && (
                      <div className="mt-2">
                        <img
                          src={previewImages.businessLicence}
                          alt="پیش‌نمایش مجوز کسب"
                          className="w-32 h-20 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-xl font-medium transition-colors"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? 'در حال پردازش...' : 
                   (isEditing ? 'به‌روزرسانی اطلاعات' : 'ثبت اطلاعات')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-xl font-medium transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Profile Display */}
        {profile ? (
          <div className="bg-white rounded-2xl shadow-box-md p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-bold text-zinc-800">اطلاعات عمده‌فروشی</h3>
                  {getStatusBadge(profile.status)}
                </div>

                {/* Show rejection reason if rejected */}
                {profile.status === WholeSellersSerializerStatus.rejected && profile.rejectionReason && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <h4 className="text-sm font-medium text-red-800 mb-2">دلیل رد درخواست:</h4>
                    <p className="text-sm text-red-700">{profile.rejectionReason}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">نام و نام خانوادگی</p>
                    <p className="text-zinc-800 font-medium">{profile.firstName} {profile.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">کد ملی</p>
                    <p className="text-zinc-800 font-medium">{profile.nationalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">نام شرکت</p>
                    <p className="text-zinc-800 font-medium">{profile.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">شماره کارت/شبا</p>
                    <p className="text-zinc-800 font-medium">{profile.creditCardOrShaba}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-zinc-500 mb-2">تصویر کارت ملی</p>
                    {profileData?.data?.nationalCardPhoto ? (
                      <img 
                        src={Env.WholeSalersNationalCardImage + profileData.data.nationalCardPhoto} 
                        alt="کارت ملی"
                        className="w-40 h-24 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-40 h-24 bg-zinc-100 rounded-lg border flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-2">تصویر مجوز کسب</p>
                    {profileData?.data?.businessLicensePhoto ? (
                      <img 
                        src={Env.WholeSalersBusinessLicenseCardImage + profileData.data.businessLicensePhoto} 
                        alt="مجوز کسب"
                        className="w-40 h-24 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-40 h-24 bg-zinc-100 rounded-lg border flex items-center justify-center">
                        <svg className="w-8 h-8 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-6 lg:mt-0 lg:mr-6">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm font-medium transition-colors"
                >
                  ویرایش
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 border border-red-300 hover:border-red-400 text-red-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'در حال حذف...' : 'حذف'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          !showForm && !isLoading && (
            <div className="bg-white rounded-2xl shadow-box-md p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 fill-zinc-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
              </svg>
              <h3 className="text-lg font-medium text-zinc-800 mb-2">اطلاعات عمده‌فروشی ثبت نشده</h3>
              <p className="text-zinc-600 mb-6">برای دسترسی به خرید عمده، اطلاعات خود را ثبت کنید</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                ثبت اطلاعات عمده‌فروشی
              </button>
            </div>
          )
        )}
      </div>
    </main>
  );
};

export default Profile__WholeSale;




























// import React, { useState } from 'react';

// interface WholeSaleProfile {
//   id?: string;
//   firstName: string;
//   lastName: string;
//   nationalCode: string;
//   companyName: string;
//   nationalCardPhoto: File | null;
//   businessLicencePhoto: File | null;
//   creditCardOrShaba: string;
// }

// const Profile__WholeSale: React.FC = () => {
//   const [profile, setProfile] = useState<WholeSaleProfile | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState<WholeSaleProfile>({
//     firstName: '',
//     lastName: '',
//     nationalCode: '',
//     companyName: '',
//     nationalCardPhoto: null,
//     businessLicencePhoto: null,
//     creditCardOrShaba: ''
//   });

//   const [previewImages, setPreviewImages] = useState<{
//     nationalCard: string | null;
//     businessLicence: string | null;
//   }>({
//     nationalCard: null,
//     businessLicence: null
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, files } = e.target;
    
//     if (type === 'file' && files && files[0]) {
//       const file = files[0];
//       setFormData(prev => ({
//         ...prev,
//         [name]: file
//       }));

//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result as string;
//         if (name === 'nationalCardPhoto') {
//           setPreviewImages(prev => ({ ...prev, nationalCard: result }));
//         } else if (name === 'businessLicencePhoto') {
//           setPreviewImages(prev => ({ ...prev, businessLicence: result }));
//         }
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (isEditing && profile) {
//       // Update existing profile
//       setProfile({ ...profile, ...formData });
//     } else {
//       // Create new profile
//       const newProfile: WholeSaleProfile = {
//         id: Date.now().toString(),
//         ...formData
//       };
//       setProfile(newProfile);
//     }

//     // Reset form
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       firstName: '',
//       lastName: '',
//       nationalCode: '',
//       companyName: '',
//       nationalCardPhoto: null,
//       businessLicencePhoto: null,
//       creditCardOrShaba: ''
//     });
//     setPreviewImages({
//       nationalCard: null,
//       businessLicence: null
//     });
//     setShowForm(false);
//     setIsEditing(false);
//   };

//   const handleEdit = () => {
//     if (profile) {
//       setFormData({
//         firstName: profile.firstName,
//         lastName: profile.lastName,
//         nationalCode: profile.nationalCode,
//         companyName: profile.companyName,
//         nationalCardPhoto: profile.nationalCardPhoto,
//         businessLicencePhoto: profile.businessLicencePhoto,
//         creditCardOrShaba: profile.creditCardOrShaba
//       });
//       setIsEditing(true);
//       setShowForm(true);
//     }
//   };

//   const handleDelete = () => {
//     if (window.confirm('آیا از حذف اطلاعات عمده‌فروشی اطمینان دارید؟')) {
//       setProfile(null);
//       resetForm();
//     }
//   };

//   const validateNationalCode = (code: string): boolean => {
//     if (code.length !== 10) return false;
//     const digits = code.split('').map(Number);
//     const checkSum = digits[9];
//     const sum = digits.slice(0, 9).reduce((acc, digit, index) => acc + digit * (10 - index), 0);
//     const remainder = sum % 11;
//     return remainder < 2 ? checkSum === remainder : checkSum === 11 - remainder;
//   };

//   return (
//     <main className="max-w-[1500px] mx-auto px-3 md:px-5">
//       <div className="my-5 lg:my-10">
//         {/* Page Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-2">اطلاعات عمده‌فروشی</h1>
//             <p className="text-zinc-600">مدیریت اطلاعات حساب عمده‌فروشی شما</p>
//           </div>

//           {!profile && (
//             <button
//               onClick={() => setShowForm(true)}
//               className="mt-4 md:mt-0 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
//                 <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm48,112H136v40a8,8,0,0,1-16,0V136H80a8,8,0,0,1,0-16h40V80a8,8,0,0,1,16,0v40h40A8,8,0,0,1,176,128Z" />
//               </svg>
//               ثبت اطلاعات عمده‌فروشی
//             </button>
//           )}
//         </div>

//         {/* Add/Edit Form */}
//         {showForm && (
//           <div className="bg-white rounded-2xl shadow-box-md p-6 mb-8">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-zinc-800">
//                 {isEditing ? 'ویرایش اطلاعات عمده‌فروشی' : 'ثبت اطلاعات عمده‌فروشی'}
//               </h2>
//               <button
//                 onClick={resetForm}
//                 className="text-zinc-400 hover:text-zinc-600"
//               >
//                 <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
//                   <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
//                 </svg>
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* First Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-zinc-700 mb-2">نام</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     placeholder="نام خود را وارد کنید"
//                     className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 {/* Last Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-zinc-700 mb-2">نام خانوادگی</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     placeholder="نام خانوادگی خود را وارد کنید"
//                     className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 {/* National Code */}
//                 <div>
//                   <label className="block text-sm font-medium text-zinc-700 mb-2">کد ملی</label>
//                   <input
//                     type="text"
//                     name="nationalCode"
//                     value={formData.nationalCode}
//                     onChange={handleInputChange}
//                     placeholder="کد ملی 10 رقمی"
//                     maxLength={10}
//                     className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     required
//                     onBlur={(e) => {
//                       if (e.target.value && !validateNationalCode(e.target.value)) {
//                         alert('کد ملی وارد شده معتبر نیست');
//                       }
//                     }}
//                   />
//                 </div>

//                 {/* Company Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-zinc-700 mb-2">نام شرکت</label>
//                   <input
//                     type="text"
//                     name="companyName"
//                     value={formData.companyName}
//                     onChange={handleInputChange}
//                     placeholder="نام شرکت یا کسب و کار"
//                     className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 {/* Credit Card or Shaba Number */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-zinc-700 mb-2">شماره کارت یا شبا</label>
//                   <input
//                     type="text"
//                     name="creditCardOrShaba"
//                     value={formData.creditCardOrShaba}
//                     onChange={handleInputChange}
//                     placeholder="شماره کارت 16 رقمی یا شماره شبا"
//                     className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* File Uploads */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* National Card Photo */}
//                 <div>
//                   <label className="block text-sm font-medium text-zinc-700 mb-2">تصویر کارت ملی</label>
//                   <div className="space-y-4">
//                     <input
//                       type="file"
//                       name="nationalCardPhoto"
//                       onChange={handleInputChange}
//                       accept="image/*"
//                       className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       required={!isEditing}
//                     />
//                     {previewImages.nationalCard && (
//                       <div className="mt-2">
//                         <img
//                           src={previewImages.nationalCard}
//                           alt="پیش‌نمایش کارت ملی"
//                           className="w-32 h-20 object-cover rounded-lg border"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Business Licence Photo */}
//                 <div>
//                   <label className="block text-sm font-medium text-zinc-700 mb-2">تصویر مجوز کسب</label>
//                   <div className="space-y-4">
//                     <input
//                       type="file"
//                       name="businessLicencePhoto"
//                       onChange={handleInputChange}
//                       accept="image/*"
//                       className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       required={!isEditing}
//                     />
//                     {previewImages.businessLicence && (
//                       <div className="mt-2">
//                         <img
//                           src={previewImages.businessLicence}
//                           alt="پیش‌نمایش مجوز کسب"
//                           className="w-32 h-20 object-cover rounded-lg border"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Form Actions */}
//               <div className="flex gap-4 pt-4">
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
//                 >
//                   {isEditing ? 'به‌روزرسانی اطلاعات' : 'ثبت اطلاعات'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-6 py-3 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-xl font-medium transition-colors"
//                 >
//                   انصراف
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Profile Display */}
//         {profile ? (
//           <div className="bg-white rounded-2xl shadow-box-md p-6">
//             <div className="flex flex-col lg:flex-row lg:items-start justify-between">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-6">
//                   <h3 className="text-xl font-bold text-zinc-800">اطلاعات عمده‌فروشی</h3>
//                   <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
//                     تایید شده
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div>
//                     <p className="text-sm text-zinc-500 mb-1">نام و نام خانوادگی</p>
//                     <p className="text-zinc-800 font-medium">{profile.firstName} {profile.lastName}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-zinc-500 mb-1">کد ملی</p>
//                     <p className="text-zinc-800 font-medium">{profile.nationalCode}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-zinc-500 mb-1">نام شرکت</p>
//                     <p className="text-zinc-800 font-medium">{profile.companyName}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-zinc-500 mb-1">شماره کارت/شبا</p>
//                     <p className="text-zinc-800 font-medium">{profile.creditCardOrShaba}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <p className="text-sm text-zinc-500 mb-2">تصویر کارت ملی</p>
//                     <div className="w-40 h-24 bg-zinc-100 rounded-lg border flex items-center justify-center">
//                       <svg className="w-8 h-8 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-zinc-500 mb-2">تصویر مجوز کسب</p>
//                     <div className="w-40 h-24 bg-zinc-100 rounded-lg border flex items-center justify-center">
//                       <svg className="w-8 h-8 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex flex-col gap-2 mt-6 lg:mt-0 lg:mr-6">
//                 <button
//                   onClick={handleEdit}
//                   className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-lg text-sm font-medium transition-colors"
//                 >
//                   ویرایش
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="px-4 py-2 border border-red-300 hover:border-red-400 text-red-600 rounded-lg text-sm font-medium transition-colors"
//                 >
//                   حذف
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           !showForm && (
//             <div className="bg-white rounded-2xl shadow-box-md p-12 text-center">
//               <svg className="w-16 h-16 mx-auto mb-4 fill-zinc-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
//                 <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
//               </svg>
//               <h3 className="text-lg font-medium text-zinc-800 mb-2">اطلاعات عمده‌فروشی ثبت نشده</h3>
//               <p className="text-zinc-600 mb-6">برای دسترسی به خرید عمده، اطلاعات خود را ثبت کنید</p>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
//               >
//                 ثبت اطلاعات عمده‌فروشی
//               </button>
//             </div>
//           )
//         )}
//       </div>
//     </main>
//   );
// };

// export default Profile__WholeSale;