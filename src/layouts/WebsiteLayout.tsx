import type { ReactNode } from "react";
import BottomNavigation from "../components/BottomNavigation/BottomNavigation";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import FloatingContactButton from "../components/FloatingContactButton";

interface Props {
    children: ReactNode;
}

function WebsiteLayout({ children }: Props) {


    return (
        <div dir="rtl">
            <Header />

            {children}

            <Footer
                services={[
                    { id: '1', icon: '/assets/image/services/cash-on-delivery.svg', title: 'پرداخت درب منزل' },
                    { id: '2', icon: '/assets/image/services/days-return.svg', title: 'ضمانت 7 روزه' },
                    { id: '3', icon: '/assets/image/services/express-delivery.svg', title: 'پست پیشتاز' },
                    { id: '4', icon: '/assets/image/services/original-products.svg', title: 'ضمانت کالا' },
                    { id: '5', icon: '/assets/image/services/support.svg', title: 'پشتیبانی 24 ساعته' }
                ]}

                sections={[
                    {
                        id: '1',
                        title: 'راهنمای خرید  ',
                        links: [
                            { id: '1-1', text: 'نحوه ثبت سفارش', href: 'index-2.html' },
                            { id: '1-2', text: 'رویه ارسال سفارش', href: 'index-2.html' },
                            { id: '1-3', text: 'شیوه‌های پرداخت', href: 'index-2.html' },
                            { id: '1-4', text: 'رویه‌های بازگرداندن کالا', href: '/contact-us' },
                        ]
                    },
                    {
                        id: '2',
                        title: 'با نارنجی توی',
                        links: [
                            { id: '3-1', text: 'حریم خصوصی', href: '/amazing-products' },
                            { id: '3-2', text: 'شرایط استفاده', href: '/blog' },
                            { id: '3-3', text: 'محصولات عمده', href: '/whole-sale-products' },
                            { id: '3-4', text: 'رویه‌های بازگرداندن کالا', href: '/contactUs' },
                            { id: '3-4', text: 'پاسخ به پرسش‌های متداول', href: '/aboutUs' },
                        ]
                    },
                    {
                        id: '3',
                        title: 'درباره ما',
                        links: [
                            { id: '3-1', text: 'اتاق خبر نارنجی توی', href: '/amazing-products' },
                            { id: '3-2', text: 'فروش در نارنجی توی', href: '/blog' },
                            { id: '3-4', text: 'فرصت‌های شغلی', href: '/contactUs' },
                            { id: '3-4', text: 'تماس با ما', href: '/aboutUs' },
                        ]
                    }
                ]}

                socialLinks={[
                    {
                        id: '1',
                        name: 'instagram',
                        href: 'https://www.instagram.com/toyisland4',
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#575757" viewBox="0 0 256 256">
                            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                        </svg>
                    }
                ]}

                badges={[
                    '/assets/image/services/symbol-01.png',
                    '/assets/image/services/symbol-02.png',
                    '/assets/image/services/symbol-01.png'
                ]}

                companyDescription='یک خرید اینترنتی مطمئن، نیازمند فروشگاهی است که بتواند کالاهایی متنوع، باکیفیت و دارای قیمت مناسب را در مدت زمان ی کوتاه به دست مشتریان خود برساند و ضمانت بازگشت کالا هم داشته باشد؛ ویژگی‌هایی که فروشگاه اینترنتی دیجی‌کالا سال‌هاست بر روی آن‌ها کار کرده و توانسته از این طریق مشتریان ثابت خود را داشته باشد.
                یکی از مهم‌ترین دغدغه‌های کاربران دیجی‌کالا یا هر فروشگاه‌ اینترنتی دیگری، این است که کالای خریداری شده چه زمانی به دستشان می‌رسد. دیجی‌کالا شیوه‌های مختلفی از ارسال را متناسب با فروشنده کالا،‌ مقصد کالا و همچنین نوع کالا در اختیار کاربران خود قرار می‌دهد.`'

                copyrightText="تمامی حقوق این سایت متعلق به نارنجی توی میباشد"
            />

            <div className="md:hidden">
                <BottomNavigation />
            </div>
            
            <FloatingContactButton />
        </div>
    )
}

export default WebsiteLayout