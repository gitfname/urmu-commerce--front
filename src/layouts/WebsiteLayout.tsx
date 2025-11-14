import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation/BottomNavigation";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import FloatingContactButton from "../components/FloatingContactButton";

interface Props {
    children: ReactNode;
}

function WebsiteLayout({ children }: Props) {
    const location = useLocation();
    const isSingleProductPage = location.pathname.startsWith('/products/');

    return (
        <div dir="rtl" className="relative">
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
                        title: 'راهنمای خرید',
                        links: [
                            { id: '1-1', text: 'جستجوی محصولات', href: '/search' },
                            { id: '1-2', text: 'محصولات فوق‌العاده', href: '/amazing-products' },
                            { id: '1-4', text: 'مقایسه محصولات', href: '/compare' },
                        ]
                    },
                    {
                        id: '2',
                        title: 'با نارنجی توی',
                        links: [
                            { id: '2-1', text: 'درباره ما', href: '/aboutUs' },
                            { id: '2-2', text: 'تماس با ما', href: '/contactUs' },
                            { id: '2-3', text: 'بلاگ', href: '/blog' },
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
                    'https://trustseal.enamad.ir/logo.aspx?id=651055&Code=370Qn5wZjTvMppfCwL55Jolp6oL7uVbI'
                ]}

                companyDescription='فروشگاه اینترنتی نارنجی توی، با هدف ارائه بهترین و باکیفیت‌ترین محصولات به مشتریان عزیز، فعالیت خود را آغاز کرده است. ما در نارنجی توی تلاش می‌کنیم تا با ارائه محصولات متنوع، قیمت‌های مناسب و خدمات پس از فروش عالی، تجربه خریدی لذت‌بخش را برای شما فراهم کنیم.
                یکی از مهم‌ترین اولویت‌های ما در نارنجی توی، رضایت مشتریان است. به همین دلیل تمام تلاش خود را می‌کنیم تا سفارشات شما را در سریع‌ترین زمان ممکن و با بهترین کیفیت به دستتان برسانیم. ما با شیوه‌های مختلف ارسال و پرداخت، سعی داریم تا خرید را برای شما آسان‌تر کنیم.`'

                copyrightText="تمامی حقوق این سایت متعلق به نارنجی توی میباشد"
            />

            <div className="md:hidden">
                <BottomNavigation />
            </div>
            
            {!isSingleProductPage && <FloatingContactButton />}
        </div>
    )
}

export default WebsiteLayout