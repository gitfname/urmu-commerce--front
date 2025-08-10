import React from 'react';
import {
    ShoppingBag,
    Users,
    Award,
    Truck,
    Shield,
    Heart,
    Star,
    CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
    const stats = [
        { number: '۱۰ هزار+', label: 'مشتری راضی' },
        { number: '۵ هزار+', label: 'محصول فروخته شده' },
        { number: '۵۰+', label: 'برند همکار' },
        { number: '۲۴/۷', label: 'پشتیبانی مشتری' }
    ];

    const values = [
        {
            icon: <Shield className="w-8 h-8 text-red-500" />,
            title: 'تضمین کیفیت',
            description: 'ما اطمینان حاصل می‌کنیم که هر محصول قبل از رسیدن به شما استانداردهای بالای ما را داشته باشد.'
        },
        {
            icon: <Heart className="w-8 h-8 text-red-500" />,
            title: 'مشتری محوری',
            description: 'رضایت شما اولویت ماست. ما برای مشتریانمان فراتر از انتظار تلاش می‌کنیم.'
        },
        {
            icon: <Truck className="w-8 h-8 text-red-500" />,
            title: 'ارسال سریع',
            description: 'ارسال سریع و قابل اعتماد تا سفارشات شما در اسرع وقت به دستتان برسد.'
        },
        {
            icon: <Award className="w-8 h-8 text-red-500" />,
            title: 'تعالی',
            description: 'ما در همه کارهایمان، از محصولات تا خدمات، به دنبال تعالی هستیم.'
        }
    ];

    const teamMembers = [
        {
            name: 'سارا احمدی',
            role: 'بنیان‌گذار و مدیرعامل',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
            description: 'علاقه‌مند به ارائه محصولات باکیفیت به مشتریان در سراسر جهان.'
        },
        {
            name: 'محمد رضایی',
            role: 'مدیر عملیات',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            description: 'تضمین عملیات روان و تجربه استثنایی مشتری.'
        },
        {
            name: 'فاطمه کریمی',
            role: 'مدیر محصول',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
            description: 'انتخاب محصولات ما برای پاسخگویی به نیازها و ترندهای مشتریان.'
        }
    ];

    const milestones = [
        { year: '۱۳۹۹', event: 'تأسیس شرکت', description: 'با چشم‌اندازی برای متحول کردن خرید آنلاین شروع کردیم' },
        { year: '۱۴۰۰', event: 'اولین ۱۰۰۰ مشتری', description: 'به اولین نقطه عطف مهم در رضایت مشتری رسیدیم' },
        { year: '۱۴۰۱', event: 'توسعه بین‌المللی', description: 'خدمات خود را به کشورهای متعدد گسترش دادیم' },
        { year: '۱۴۰۲', event: 'شراکت پریمیوم', description: 'با برندهای پیشرو برای ارائه محصولات انحصاری همکاری کردیم' },
        { year: '۱۴۰۳', event: '۱۰ هزار+ مشتری راضی', description: 'جشن گرفتن جامعه رو به رشد مشتریان راضی ما' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 rtl mt-5 md:mt-28" dir="rtl">
            {/* Hero Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-7">
                            درباره <span className="text-red-500">داستان ما</span>
                        </h1>

                        <p className="text-xl font-normal text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            ما علاقه‌مندیم که بهترین محصولات را با قیمت‌های بی‌نظیر برای شما فراهم کنیم.
                            سفر ما با یک ماموریت ساده شروع شد: دسترسی به خرید باکیفیت برای همه.
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
                                ما معتقدیم که خرید باید آسان، لذت‌بخش و برای همه قابل دسترس باشد.
                                به همین دلیل پلتفرمی ساخته‌ایم که بهترین محصولات،
                                قیمت‌های رقابتی و خدمات مشتری استثنایی را ترکیب می‌کند.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                از انتخاب دقیق محصولات تا ارسال فوق‌العاده سریع،
                                هر جنبه از کسب‌وکار ما با در نظر گیری شما طراحی شده است.
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
                                <div className="font-bold">کیفیت اول</div>
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

            {/* Team Section */}
            {/* <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            آشنایی با <span className="text-red-500">تیم</span> ما
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            افراد پرشور پشت موفقیت ما
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                                    <div className="text-red-500 font-medium mb-3">{member.role}</div>
                                    <p className="text-gray-600">{member.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

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
                                چرا <span className="text-red-500">ما</span> را انتخاب کنید؟
                            </h2>
                            <div className="space-y-4">
                                {[
                                    'انتخاب دقیق محصولات',
                                    'قیمت‌های رقابتی و تخفیف‌های منظم',
                                    'ارسال سریع و قابل اعتماد',
                                    'پشتیبانی عالی مشتری',
                                    'پردازش امن پرداخت',
                                    'ضمانت بازگشت ۳۰ روزه'
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
                        آماده برای شروع خرید هستید؟
                    </h2>

                    <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                        به هزاران مشتری راضی بپیوندید و محصولات شگفت‌انگیز را با قیمت‌های بی‌نظیر کشف کنید.
                    </p>

                    <Link to="/search" className="bg-white text-red-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                        همین الان خرید کنید
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;