import React from 'react';
import {
    ShoppingBag,
    Award,
    Truck,
    Shield,
    Heart,
    CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
    const stats = [
        { number: '۲۰ هزار+', label: 'کودک شاد' },
        { number: '۱۵ هزار+', label: 'اسباب بازی متنوع' },
        { number: '۲ شعبه', label: 'در شرق تهران' },
        { number: '۱۲ سال', label: 'سابقه فعالیت' }
    ];

    const values = [
        {
            icon: <Shield className="w-8 h-8 text-red-500" />,
            title: 'ایمنی کودکان',
            description: 'تمامی اسباب بازی‌های ما دارای استانداردهای بین‌المللی ایمنی کودک هستند و به دقت بررسی می‌شوند.'
        },
        {
            icon: <Heart className="w-8 h-8 text-red-500" />,
            title: 'رشد خلاقیت',
            description: 'انتخاب اسباب بازی‌هایی که علاوه بر سرگرمی، به رشد ذهنی و خلاقیت کودکان کمک می‌کنند.'
        },
        {
            icon: <Truck className="w-8 h-8 text-red-500" />,
            title: 'تحویل رایگان',
            description: 'برای خریدهای بالای ۵۰۰ هزار تومان در سطح شهر تهران، ارسال رایگان داریم.'
        },
        {
            icon: <Award className="w-8 h-8 text-red-500" />,
            title: 'تنوع محصولات',
            description: 'بیش از ۱۵ هزار نوع اسباب بازی متنوع برای تمامی سنین، از نوزاد تا نوجوان.'
        }
    ];

    // مشخصات شعبه‌ها
    const branches = [
        {
            name: 'شعبه افسریه',
            address: 'تهران، افسریه، ۱۵ متری سوم، نبش کوچه ۲۸، پلاک ۳۹۶',
            phone: '۰۲۱-۳۳۱۱۲۲۳۳',
            hours: '۱۰ صبح الی ۲۲:۳۰ (پنجشنبه‌ها: ۱۰ صبح الی ۲۳)'
        },
        {
            name: 'شعبه نارمک',
            address: 'تهران، نارمک، چهار راه تلفن خانه، ضلع جنوب غربی چهارراه، پلاک ۲۶۸',
            phone: '۰۲۱-۷۷۶۶۵۵۴۴',
            hours: '۱۰ صبح الی ۲۲:۳۰ (پنجشنبه‌ها: ۱۰ صبح الی ۲۳)'
        }
    ];

    const milestones = [
        { year: '۱۳۹۱', event: 'تأسیس اولین شعبه', description: 'اولین فروشگاه جزیره اسباب بازی در منطقه افسریه تهران افتتاح شد' },
        { year: '۱۳۹۴', event: 'افتتاح شعبه دوم', description: 'به دلیل استقبال فراوان، شعبه دوم در نارمک افتتاح شد' },
        { year: '۱۳۹۵', event: 'راه‌اندازی فروشگاه آنلاین', description: 'برای دسترسی راحت‌تر مشتریان، فروشگاه آنلاین اسباب بازی راه‌اندازی شد' },
        { year: '۱۳۹۸', event: 'گسترش به ۵ شعبه', description: 'با افتتاح شعب جدید در غرب تهران، به ۵ شعبه رسیدیم' },
        { year: '۱۴۰۲', event: 'بزرگترین مجموعه اسباب بازی', description: 'با افتتاح دو شعبه جدید، به بزرگترین مجموعه اسباب بازی تهران تبدیل شدیم' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 rtl mt-5 md:mt-28" dir="rtl">
            {/* Hero Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-7">
                            درباره <span className="text-red-500">جزیره اسباب بازی</span>
                        </h1>

                        <p className="text-xl font-normal text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            ما با افتخار بیش از ۱۲ سال است که شادی و لبخند را به کودکان عزیز تهران هدیه می‌دهیم.
                            هدف ما ارائه باکیفیت‌ترین اسباب بازی‌های ایمن و آموزشی برای کودکان سرزمین‌مان است.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-red-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-red-100 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                <span className="text-red-500">ماموریت</span> ما
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                ما معتقدیم که کودکان حق دارند با اسباب بازی‌های باکیفیت، ایمن و آموزنده بازی کنند.
                                به همین دلیل تمام تلاش خود را می‌کنیم تا بهترین محصولات را با قیمت‌های مناسب
                                و خدمات عالی به خانواده‌های ایرانی ارائه دهیم.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                با ۷ شعبه در سطح تهران و فروشگاه آنلاین، همواره در تلاشیم تا دسترسی به
                                اسباب بازی‌های استاندارد و با کیفیت را برای همه خانواده‌ها آسان‌تر کنیم.
                            </p>
                        </div>
                        <div className="relative">
                            <img
                                src="/about-us/image-1.jpg"
                                alt="ماموریت ما"
                                className="rounded-lg shadow-lg"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-red-500 text-white p-6 rounded-lg shadow-lg">
                                <ShoppingBag className="w-8 h-8 mb-2" />
                                <div className="font-bold">لبخند کودکان</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            <span className="text-red-500">ارزش‌های</span> ما
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            این ارزش‌های اصلی راهنمای همه کارهای ما هستند و تعهد ما به شما را شکل می‌دهند
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 bg-white max-sm:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            <span className="text-red-500">سفر</span> ما
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            از شروع متواضع تا جایی که امروز هستیم
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute right-1/2 transform translate-x-1/2 w-1 h-full bg-red-200"></div>
                        {milestones.map((milestone, index) => (
                            <div key={index} className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8 text-left' : 'pr-8 text-right'}`}>
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <div className="text-red-500 font-bold text-lg mb-2">{milestone.year}</div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                                        <p className="text-gray-600">{milestone.description}</p>
                                    </div>
                                </div>
                                <div className="absolute right-1/2 transform translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-4 border-white"></div>
                                <div className="w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Branches Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            شعبه‌های <span className="text-red-500">جزیره اسباب بازی</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            در خدمت شما در شرق تهران هستیم
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {branches.map((branch, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-center mb-4 w-16 h-16 bg-red-100 text-red-500 rounded-full mx-auto">
                                    <span className="text-xl font-bold">{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{branch.name}</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p className="flex items-start">
                                        <span className="font-semibold ml-2">آدرس:</span> 
                                        <span>{branch.address}</span>
                                    </p>
                                    <p className="flex items-center">
                                        <span className="font-semibold ml-2">تلفن:</span> 
                                        <span>{branch.phone}</span>
                                    </p>
                                    <p className="flex items-center">
                                        <span className="font-semibold ml-2">ساعات کاری:</span> 
                                        <span>{branch.hours}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="/about-us/image-2.jpg"
                                alt="چرا ما را انتخاب کنید"
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                چرا <span className="text-red-500">جزیره اسباب بازی</span> را انتخاب کنید؟
                            </h2>
                            <div className="space-y-4">
                                {[
                                    'بیش از ۱۵ هزار مدل اسباب بازی متنوع',
                                    'تمامی محصولات دارای استاندارد بین‌المللی ایمنی کودکان',
                                    '۷ شعبه فعال در مناطق مختلف تهران',
                                    'مشاوره تخصصی برای انتخاب اسباب بازی مناسب سن کودک',
                                    'گارانتی اصالت و سلامت کالا',
                                    'برگزاری جشنواره‌ها و کارگاه‌های آموزشی رایگان برای کودکان'
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-red-500 ml-3 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-red-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        به دنیای شگفت‌انگیز اسباب بازی‌ها خوش آمدید!
                    </h2>

                    <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                        از نزدیک‌ترین شعبه شهر اسباب بازی دیدن کنید یا همین الان به صورت آنلاین خرید کنید.
                        هدیه‌های ویژه برای مشتریان جدید!
                    </p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                        <Link to="/search" className="bg-white text-red-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                            مشاهده محصولات
                        </Link>
                        <Link to="/ContactUs" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
                            آدرس شعبه‌ها
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;