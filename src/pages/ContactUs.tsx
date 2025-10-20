import React, { useState } from 'react';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageCircle,
    Headphones,
    Shield,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
}

const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const contactInfo = [
        {
            icon: <Phone className="w-6 h-6 text-red-500" />,
            title: 'تماس تلفنی',
            details: ['۰۲۱-۳۳۱۱۲۲۳۳', '۰۲۱-۷۷۶۶۵۵۴۴'],
            description: 'پاسخگویی در ساعات کاری فروشگاه'
        },
        {
            icon: <Mail className="w-6 h-6 text-red-500" />,
            title: 'ایمیل',
            details: ['info@toyisland.ir', 'support@toyisland.ir'],
            description: 'پاسخ در کمتر از ۲۴ ساعت'
        },
        {
            icon: <MapPin className="w-6 h-6 text-red-500" />,
            title: 'آدرس شعبه‌ها',
            details: [
                'شعبه افسریه: تهران، افسریه، ۱۵ متری سوم، نبش کوچه ۲۸، پلاک ۳۹۶',
                'شعبه نارمک: تهران، نارمک، چهار راه تلفن خانه، ضلع جنوب غربی چهارراه، پلاک ۲۶۸'
            ],
            description: 'مراجعه حضوری در ساعات کاری'
        },
        {
            icon: <Clock className="w-6 h-6 text-red-500" />,
            title: 'ساعات کاری',
            details: ['شنبه تا جمعه: ۱۰:۰۰ الی ۲۲:۳۰', 'پنج‌شنبه‌ها: ۱۰:۰۰ الی ۲۳:۰۰'],
            description: 'پشتیبانی آنلاین در ساعات کاری فروشگاه'
        }
    ];

    const supportCategories = [
        {
            icon: <MessageCircle className="w-8 h-8 text-red-500" />,
            title: 'مشاوره اسباب بازی',
            description: 'کمک در انتخاب اسباب بازی مناسب سن و علاقه کودک شما'
        },
        {
            icon: <Headphones className="w-8 h-8 text-red-500" />,
            title: 'سفارش و ارسال',
            description: 'سوالات مربوط به خرید، سفارش آنلاین و ارسال محصولات'
        },
        {
            icon: <Shield className="w-8 h-8 text-red-500" />,
            title: 'پیشنهادات و انتقادات',
            description: 'نظرات شما برای بهبود خدمات جزیره اسباب بازی مهم است'
        }
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'نام الزامی است';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'ایمیل الزامی است';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'فرمت ایمیل صحیح نیست';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'شماره تلفن الزامی است';
        } else if (!/^(\+98|0)?9\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'شماره تلفن صحیح نیست';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'موضوع الزامی است';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'پیام الزامی است';
        } else if (formData.message.length < 10) {
            newErrors.message = 'پیام باید حداقل ۱۰ کاراکتر باشد';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would make your actual API call
            // const response = await fetch('/api/contact', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData)
            // });

            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 rtl mt-5 md:mt-28" dir="rtl">
            {/* Hero Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-7">
                            تماس با <span className="text-red-500">جزیره اسباب بازی</span>
                        </h1>
                        <p className="text-xl font-normal text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            ما اینجا هستیم تا به سوالات شما درباره اسباب بازی‌های کودکان پاسخ دهیم و بهترین تجربه خرید را برای شما و فرزندان دلبندتان فراهم کنیم.
                            با ما در ارتباط باشید و از مشاوره تخصصی در انتخاب اسباب بازی مناسب سن کودک خود بهره‌مند شوید.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="mb-4">
                                    {info.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    {info.title}
                                </h3>
                                <div className="space-y-1 mb-3">
                                    {info.details.map((detail, idx) => (
                                        <div key={idx} className="text-gray-700 font-medium">
                                            {detail}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {info.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support Categories */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            چگونه می‌توانیم <span className="text-red-500">کمکتان</span> کنیم؟
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            تیم متخصص ما در جزیره اسباب بازی آماده راهنمایی و پاسخگویی به سوالات شما درباره انتخاب و خرید اسباب بازی مناسب است
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {supportCategories.map((category, index) => (
                            <div key={index} className="text-center p-8 rounded-lg border-2 border-gray-100 hover:border-red-200 transition-colors">
                                <div className="mb-4 flex justify-center">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {category.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {category.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            پیام خود را <span className="text-red-500">ارسال</span> کنید
                        </h2>
                        <p className="text-lg text-gray-600">
                            فرم زیر را پر کنید و کارشناسان جزیره اسباب بازی در اسرع وقت با شما تماس خواهند گرفت
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 ml-3" />
                                <span className="text-green-700">پیام شما با موفقیت ارسال شد. کارشناسان جزیره اسباب بازی به زودی با شما تماس خواهند گرفت.</span>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-500 ml-3" />
                                <span className="text-red-700">خطا در ارسال پیام. لطفاً دوباره تلاش کنید.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        نام و نام خانوادگی *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        placeholder="نام کامل خود را وارد کنید"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        شماره تلفن *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    آدرس ایمیل *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="example@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    موضوع پیام *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">موضوع پیام را انتخاب کنید</option>
                                    <option value="consultation">مشاوره انتخاب اسباب بازی</option>
                                    <option value="age-group">اسباب بازی مناسب رده سنی</option>
                                    <option value="order">سوال درباره سفارش</option>
                                    <option value="delivery">ارسال و تحویل</option>
                                    <option value="product-quality">کیفیت محصول</option>
                                    <option value="suggestion">پیشنهاد</option>
                                </select>
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    متن پیام *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors resize-vertical ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="پیام خود را به تفصیل بنویسید..."
                                ></textarea>
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    حداقل ۱۰ کاراکتر - {formData.message.length} کاراکتر نوشته‌اید
                                </p>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                                            در حال ارسال...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 ml-2" />
                                            ارسال پیام
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* FAQ Quick Links */}
            {/* <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        سوال خود را <span className="text-red-500">پیدا نکردید؟</span>
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        شاید پاسخ سوال شما در بخش سوالات متداول موجود باشد
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                            مشاهده سوالات متداول
                        </button>
                        <button className="border-2 border-red-500 text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                            راهنمای خرید
                        </button>
                    </div>
                </div>
            </section> */}
        </div>
    );
};

export default ContactUs;