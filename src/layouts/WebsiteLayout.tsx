import type { ReactNode } from "react"
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import BottomNavigation from "../components/BottomNavigation/BottomNavigation";
import { getFindManyAndCountWeblogArticlesQueryQueryKey, useFindManyAndCountWeblogArticlesQuery } from "../services/api/ecommerce--api";

interface Props {
    children: ReactNode;
}

function WebsiteLayout({ children }: Props) {
    const latestArticles = useFindManyAndCountWeblogArticlesQuery({
        skip: 0,
        limit: 5
    }, {
        query: {
            queryKey: getFindManyAndCountWeblogArticlesQueryQueryKey({
                skip: 0,
                limit: 5
            }),
            retry: false,
            refetchOnWindowFocus: false
        }
    })

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
                    // {
                    //     id: '1',
                    //     title: 'با بازرگانان بدون مرز - BBM',
                    //     links: [
                    //         { id: '1-1', text: 'وبلاگ بازرگانان بدون مرز - BBM', href: 'index-2.html' },
                    //         { id: '1-2', text: 'فروش در بازرگانان بدون مرز - BBM', href: 'index-2.html' },
                    //         { id: '1-3', text: 'گزارش تخلف در بازرگانان بدون مرز - BBM', href: 'index-2.html' },
                    //         { id: '1-4', text: 'تماس با بازرگانان بدون مرز - BBM', href: '/contact-us' },
                    //         { id: '1-5', text: 'درباره بازرگانان بدون مرز - BBM', href: '/about-us' }
                    //     ]
                    // },
                    {
                        id: '2',
                        title: 'آخرین مقالات',
                        links: latestArticles?.data?.data?.data?.map(article => ({
                            id: article.id.toString(),
                            href: "/articles/" + article.slug,
                            text: article.title
                        })) || []
                    },
                    {
                        id: '3',
                        title: 'لینک های اصلی سایت',
                        links: [
                            { id: '3-1', text: 'شگفت انگیز ها', href: '/amazing-products' },
                            { id: '3-2', text: 'وبلاگ', href: '/blog' },
                            { id: '3-3', text: 'محصولات عمده', href: '/whole-sale-products' },
                            { id: '3-4', text: 'تماس با ما', href: '/contactUs' },
                            { id: '3-4', text: 'درباره ما', href: '/aboutUs' },
                        ]
                    }
                ]}

                socialLinks={[
                    {
                        id: '1',
                        name: 'instagram',
                        href: '#',
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#575757" viewBox="0 0 256 256">
                            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                        </svg>
                    },
                    {
                        id: '2',
                        name: 'telegram',
                        href: '#',
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#575757" viewBox="0 0 256 256">
                            <path d="M236.88,26.19a9,9,0,0,0-9.16-1.57L25.06,103.93a14.22,14.22,0,0,0,2.43,27.21L80,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L173,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L239.77,35A9,9,0,0,0,236.88,26.19Zm-61.14,36L86.15,126.35l-49.6-9.73ZM96,200V152.52l24.79,21.74Zm87.53,8L100.85,135.5l119-85.29Z"></path>
                        </svg>
                    },
                    {
                        id: '3',
                        name: 'whatsapp',
                        href: '#',
                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#575757" viewBox="0 0 256 256">
                            <path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"></path>
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

                copyrightText="تمامی حقوق این سایت متعلق به بازرگانان بدون مرز - BBM میباشد"
            />

            <div className="md:hidden">
                <BottomNavigation />
            </div>
        </div>
    )
}

export default WebsiteLayout