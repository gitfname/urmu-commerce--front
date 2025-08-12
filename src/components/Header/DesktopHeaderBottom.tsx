import React from 'react';
import MegaMenu from './MegaMenu';
import { Link } from 'react-router-dom';

interface MenuItem {
    title: string;
    items: string[];
}

interface PageLink {
    title: string;
    href: string;
}

interface DesktopHeaderBottomProps {
    menuItems?: MenuItem[];
    pageLinks?: PageLink[];
}

const DesktopHeaderBottom: React.FC<DesktopHeaderBottomProps> = ({
    menuItems = [
        {
            title: "برند های مختلف موبایل",
            items: ["گوشی اپل", "گوشی سامسونگ", "گوشی شیائومی", "گوشی هاوائی", "گوشی ال جی", "گوشی آنر", "گوشی نوکیا", "گوشی آنر", "گوشی جی پلاس"]
        },
        {
            title: "برند های مختلف موبایل",
            items: ["گوشی اپل", "گوشی سامسونگ", "گوشی شیائومی", "گوشی هاوائی", "گوشی ال جی", "گوشی آنر", "گوشی نوکیا", "گوشی آنر", "گوشی جی پلاس"]
        },
        {
            title: "برند های مختلف موبایل",
            items: ["گوشی اپل", "گوشی سامسونگ", "گوشی شیائومی", "گوشی هاوائی", "گوشی ال جی", "گوشی آنر", "گوشی نوکیا", "گوشی آنر", "گوشی جی پلاس"]
        },
        {
            title: "برند های مختلف موبایل",
            items: ["گوشی اپل", "گوشی سامسونگ", "گوشی شیائومی", "گوشی هاوائی", "گوشی ال جی", "گوشی آنر", "گوشی نوکیا", "گوشی آنر", "گوشی جی پلاس"]
        }
    ],
    pageLinks = [
        { title: "404", href: "404.html" },
        { title: "بلاگ", href: "blog.html" },
        { title: "بلاگ تکی", href: "blog(single).html" },
        { title: "سبد خرید", href: "cart.html" },
        { title: "دسته بندی", href: "category-index.html" },
        { title: "پرداخت", href: "checkout.html" },
        { title: "ورود یا ثبت نام", href: "login-register.html" },
        { title: "پروفایل کاربر", href: "profile.html" },
        { title: "جستجو محصولات", href: "search.html" },
        { title: "جزئیات محصول", href: "single-product.html" }
    ]
}) => {
    return (
        <div className="  z-20 bg-white shadow-sm transition-transform duration-300" id="desktop-header-bottom">
            <div className="container relative flex max-w-[1680px] items-center gap-x-2 px-5 pb-2">
                {/* Categories Menu */}
                <MegaMenu />
                {/* <div className="group" id="desktopMegamenuWrapper">
                    <div className="relative flex cursor-pointer items-center gap-x-2 pb-2 text-zinc-700">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128ZM40,70H216a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12ZM216,186H40a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Z"></path>
                            </svg>
                        </div>

                        <div className="text-sm">دسته‌ بندی‌ ها</div>

                        <div className="absolute bottom-0 flex w-full justify-center">
                            <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                        </div>
                    </div>
                </div> */}

                {/* Amazing Offers */}
                {/* <div className="group">
                    <a className="relative" href="#">
                        <div className="p-2 pt-0 text-sm text-zinc-700">
                            شگفت انگیزها
                        </div>
                        <div className="absolute bottom-0 flex w-full justify-center">
                            <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                        </div>
                        <div className="absolute flex opacity-0 pointer-events-none group-hover:pointer-events-auto
                        group-hover:opacity-100 group-hover:flex top-8 -right-4 h-auto rounded-lg
                        hover:opacity-10 hover:pointer-events-auto
                        w-[75vw] shadow-lg border bg-white items-center gap-x-5 p-5">
                            {menuItems.map((menuItem, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center gap-x-1 text-zinc-700 hover:text-red-400">
                                        <span className="h-5 w-0.5 rounded-full bg-red-500"></span>
                                        <div className="text-sm">{menuItem.title}</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#4d4d4d" viewBox="0 0 256 256">
                                            <path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path>
                                        </svg>
                                    </div>
                                    <ul>
                                        {menuItem.items.map((item, itemIndex) => (
                                            <li key={itemIndex}>
                                                <a className="block py-2 text-xs text-zinc-600 hover:text-red-500" href="#">
                                                    {item}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <img className="w-36 lg:w-64 mx-auto h-full" src="assets/image/General.webp" alt="" />
                        </div>
                    </a>
                </div> */}
                <div>
                    <Link to="/amazing-products" className="group relative">
                        <div className="p-2 pt-0 text-sm text-zinc-700 flex items-center gap-x-1">
                            شگفت انگیزها
                        </div>
                        <div className="absolute bottom-0 flex w-full justify-center">
                            <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                        </div>
                    </Link>
                </div>

                {/* Supermarket */}
                {/* <div>
                    <Link to="/search" className="group relative">
                        <div className="p-2 pt-0 text-sm text-zinc-700 flex items-center gap-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M230,96a6.19,6.19,0,0,0-.22-1.65l-14.34-50.2A14.07,14.07,0,0,0,202,34H54A14.07,14.07,0,0,0,40.57,44.15L26.23,94.35A6.19,6.19,0,0,0,26,96v16A38,38,0,0,0,42,143V208a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V143A38,38,0,0,0,230,112ZM52.11,47.45A2,2,0,0,1,54,46H202a2,2,0,0,1,1.92,1.45L216.05,90H40ZM102,102h52v10a26,26,0,0,1-52,0Zm-64,0H90v10a26,26,0,0,1-52,0ZM202,208a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V148.66a38,38,0,0,0,42-16.21,37.95,37.95,0,0,0,64,0,38,38,0,0,0,42,16.21Zm-10-70a26,26,0,0,1-26-26V102h52v10A26,26,0,0,1,192,138Z"></path>
                            </svg>
                            سوپر مارکت
                        </div>
                        <div className="absolute bottom-0 flex w-full justify-center">
                            <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                        </div>
                    </Link>
                </div> */}

                {/* Weblog */}
                <div>
                    <Link to="/blog" className="group relative">
                        <div className="p-2 pt-0 text-sm text-zinc-700 flex items-center gap-x-1">
                            وبلاگ
                        </div>
                        <div className="absolute bottom-0 flex w-full justify-center">
                            <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                        </div>
                    </Link>
                </div>


                {/* Whole sale products */}
                <div>
                    <Link to="/whole-sale-products" className="group relative">
                        <div className="p-2 pt-0 text-sm text-zinc-700 flex items-center gap-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M181.92,153A55.58,55.58,0,0,1,137,197.92a7,7,0,0,1-1,.08,6,6,0,0,1-1-11.92c17.38-2.92,32.13-17.68,35.08-35.08a6,6,0,1,1,11.84,2ZM214,144a86,86,0,0,1-172,0c0-27.47,10.85-55.61,32.25-83.64a6,6,0,0,1,9-.67l26.34,25.56,23.09-63.31a6,6,0,0,1,9.47-2.56C163.72,37.33,214,85.4,214,144Zm-12,0c0-48.4-38.65-89.84-61.07-109.8L117.64,98.06a6,6,0,0,1-9.82,2.25l-28-27.22C62.67,97.13,54,121,54,144a74,74,0,0,0,148,0Z"></path>
                            </svg>
                            محصولات عمده
                        </div>
                        <div className="absolute bottom-0 flex w-full justify-center">
                            <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                        </div>
                    </Link>
                </div>

                {/* contact us */}
                <div>
                    <Link to="/contactUs" className="group relative">
                        <div className="p-2 pt-0 text-sm text-zinc-700 flex items-center gap-x-1">
                            تماس با ما
                        </div>
                        <div className="absolute bottom-0 flex w-full justify-center">
                            <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                        </div>
                    </Link>
                </div>

                {/* about us */}
                <div>
                    <Link to="/aboutUs" className="group relative">
                        <div className="p-2 pt-0 text-sm text-zinc-700 flex items-center gap-x-1">
                            درباره ما
                        </div>
                        <div className="absolute bottom-0 flex w-full justify-center">
                            <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                        </div>
                    </Link>
                </div>

                {/* Best Sellers */}
                {/* <div>
                    <a className="group relative" href="#">
                        <div className="p-2 pt-0 text-sm text-zinc-700 flex items-center gap-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M181.92,153A55.58,55.58,0,0,1,137,197.92a7,7,0,0,1-1,.08,6,6,0,0,1-1-11.92c17.38-2.92,32.13-17.68,35.08-35.08a6,6,0,1,1,11.84,2ZM214,144a86,86,0,0,1-172,0c0-27.47,10.85-55.61,32.25-83.64a6,6,0,0,1,9-.67l26.34,25.56,23.09-63.31a6,6,0,0,1,9.47-2.56C163.72,37.33,214,85.4,214,144Zm-12,0c0-48.4-38.65-89.84-61.07-109.8L117.64,98.06a6,6,0,0,1-9.82,2.25l-28-27.22C62.67,97.13,54,121,54,144a74,74,0,0,0,148,0Z"></path>
                            </svg>
                            پرفروش ترین ها
                        </div>
                        <div className="absolute bottom-0 flex w-full justify-center">
                            <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                        </div>
                    </a>
                </div> */}

                {/* Pages Dropdown */}
                {/* <div className="group relative cursor-pointer">
                    <div className="p-2 pt-0 text-sm text-zinc-700 flex items-center gap-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4d4d4d" viewBox="0 0 256 256">
                            <path d="M96,104a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H104A8,8,0,0,1,96,104Zm8,40h64a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16Zm128,48a32,32,0,0,1-32,32H88a32,32,0,0,1-32-32V64a16,16,0,0,0-32,0c0,5.74,4.83,9.62,4.88,9.66h0A8,8,0,0,1,24,88a7.89,7.89,0,0,1-4.79-1.61h0C18.05,85.54,8,77.61,8,64A32,32,0,0,1,40,32H176a32,32,0,0,1,32,32V168h8a8,8,0,0,1,4.8,1.6C222,170.46,232,178.39,232,192ZM96.26,173.48A8.07,8.07,0,0,1,104,168h88V64a16,16,0,0,0-16-16H67.69A31.71,31.71,0,0,1,72,64V192a16,16,0,0,0,32,0c0-5.74-4.83-9.62-4.88-9.66A7.82,7.82,0,0,1,96.26,173.48ZM216,192a12.58,12.58,0,0,0-3.23-8h-94a26.92,26.92,0,0,1,1.21,8,31.82,31.82,0,0,1-4.29,16H200A16,16,0,0,0,216,192Z"></path>
                        </svg>
                        صفحات
                    </div>
                    <div className="absolute bottom-0 flex w-full justify-center">
                        <div className="left-0 h-[1px] animate-border-width-reverse rounded-full bg-gradient-to-r from-red-400 to-red-400 transition-all duration-200 group-hover:animate-border-width"></div>
                    </div>
                    <div className="absolute top-full hidden group-hover:block bg-white rounded-lg drop-shadow-xl w-56 z-50 p-2 text-sm text-zinc-600">
                        {pageLinks.map((link, index) => (
                            <a
                                key={index}
                                className="block hover:text-zinc-800 hover:bg-zinc-100 rounded-md transition p-2 my-1"
                                href={link.href}
                            >
                                {link.title}
                            </a>
                        ))}
                    </div>
                </div> */}

                {/* Become Seller */}
                {/* <div className="mr-auto">
                    <a href="seller-login.html">
                        <div className="py-2 px-3 rounded-lg text-sm text-zinc-700 bg-gray-100 hover:bg-gray-200 transition border hover:shadow-lg flex items-center gap-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M184,89.57V84c0-25.08-37.83-44-88-44S8,58.92,8,84v40c0,20.89,26.25,37.49,64,42.46V172c0,25.08,37.83,44,88,44s88-18.92,88-44V132C248,111.3,222.58,94.68,184,89.57ZM232,132c0,13.22-30.79,28-72,28-3.73,0-7.43-.13-11.08-.37C170.49,151.77,184,139,184,124V105.74C213.87,110.19,232,122.27,232,132ZM72,150.25V126.46A183.74,183.74,0,0,0,96,128a183.74,183.74,0,0,0,24-1.54v23.79A163,163,0,0,1,96,152,163,163,0,0,1,72,150.25Zm96-40.32V124c0,8.39-12.41,17.4-32,22.87V123.5C148.91,120.37,159.84,115.71,168,109.93ZM96,56c41.21,0,72,14.78,72,28s-30.79,28-72,28S24,97.22,24,84,54.79,56,96,56ZM24,124V109.93c8.16,5.78,19.09,10.44,32,13.57v23.37C36.41,141.4,24,132.39,24,124Zm64,48v-4.17c2.63.1,5.29.17,8,.17,3.88,0,7.67-.13,11.39-.35A121.92,121.92,0,0,0,120,171.41v23.46C100.41,189.4,88,180.39,88,172Zm48,26.25V174.4a179.48,179.48,0,0,0,24,1.6,183.74,183.74,0,0,0,24-1.54v23.79a165.45,165.45,0,0,1-48,0Zm64-3.38V171.5c12.91-3.13,23.84-7.79,32-13.57V172C232,180.39,219.59,189.4,200,194.87Z"></path>
                            </svg>
                            فروشنده شوید
                        </div>
                    </a>
                </div> */}
            </div>
        </div>
    );
};

export default DesktopHeaderBottom;