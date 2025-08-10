import React, { useState } from 'react';
import { ListIcon } from './icons/Icon';
import { Link } from 'react-router-dom';
import MobileMenuDrawer from '../MobileMenuDrawer/MobileMenuDrawer.tsx';
import myProfileStore from '../../stores/MyProfileStore.ts';
import { observer } from 'mobx-react';

interface MobileHeaderProps {
    onSearchFocusChange: (isFocused: boolean) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onSearchFocusChange }) => {
    const [isMobileMenuDrawerOpen, setIsMobileMenuDrawerOpen] = useState(false)
    const isLoggedIn = myProfileStore.isLoggedIn
    const role = myProfileStore.profile?.role

    return (
        <div className="md:hidden">
            {/* Top Section */}
            <div className="container relative z-30 flex h-16 items-center justify-between gap-x-4 bg-white">
                <button
                    onClick={() => setIsMobileMenuDrawerOpen(true)}
                    aria-controls="mobile-menu-drawer-navigation"
                    className="cursor-pointer text-zinc-700"
                    type="button"
                >
                    <ListIcon name="ListIcon" />
                </button>

                {/* logo */}
                <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
                    <Link to='/' className='m-0'>
                        <img alt="Logo" className="h-12 w-full rounded-lg xs:h-10 m-0" src="/logo.webp" />
                    </Link>
                </div>

                {/* A placeholder to balance the flex layout, since cart/account is on the other side */}
                <div className="w-6"></div>
            </div>

            {/* Bottom Section with Search */}
            {/* <div className="absolute left-0 right-0 top-full z-40 bg-white pb-4 pt-5 transition-transform duration-300">
                <div className="container">
                    <SearchComponent isMobile={true}
                        onFocusChange={onSearchFocusChange}
                        searchResultItems={sampleSearchResultItems}
                        recentSearches={sampleRecentSearches}
                        popularSearches={samplePopularSearches}
                    />
                </div>
            </div> */}

            <MobileMenuDrawer
                isOpen={isMobileMenuDrawerOpen}
                onClose={() => setIsMobileMenuDrawerOpen(false)}
                menuItems={[
                    {
                        id: "home",
                        title: "صفحه اصلی",
                        href: "/",
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M217.47,105.24l-80-75.5-.09-.08a13.94,13.94,0,0,0-18.83,0l-.09.08-80,75.5A14,14,0,0,0,34,115.55V208a14,14,0,0,0,14,14H96a14,14,0,0,0,14-14V160a2,2,0,0,1,2-2h32a2,2,0,0,1,2,2v48a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V115.55A14,14,0,0,0,217.47,105.24ZM210,208a2,2,0,0,1-2,2H160a2,2,0,0,1-2-2V160a14,14,0,0,0-14-14H112a14,14,0,0,0-14,14v48a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V115.55a2,2,0,0,1,.65-1.48l.09-.08,79.94-75.48a2,2,0,0,1,2.63,0L209.26,114l.08.08a2,2,0,0,1,.66,1.48Z"></path>
                            </svg>
                        )
                    },
                    {
                        id: "contact",
                        title: "تماس با ما",
                        href: "/contactUs",
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M221.59,160.3l-47.24-21.17a14,14,0,0,0-13.28,1.22,4.81,4.81,0,0,0-.56.42l-24.69,21a1.88,1.88,0,0,1-1.68.06c-15.87-7.66-32.31-24-40-39.65a1.91,1.91,0,0,1,0-1.68l21.07-25a6.13,6.13,0,0,0,.42-.58,14,14,0,0,0,1.12-13.27L95.73,34.49a14,14,0,0,0-14.56-8.38A54.24,54.24,0,0,0,34,80c0,78.3,63.7,142,142,142a54.25,54.25,0,0,0,53.89-47.17A14,14,0,0,0,221.59,160.3ZM176,210C104.32,210,46,151.68,46,80A42.23,42.23,0,0,1,82.67,38h.23a2,2,0,0,1,1.84,1.31l21.1,47.11a2,2,0,0,1,0,1.67L84.73,113.15a4.73,4.73,0,0,0-.43.57,14,14,0,0,0-.91,13.73c8.87,18.16,27.17,36.32,45.53,45.19a14,14,0,0,0,13.77-1c.19-.13.38-.27.56-.42l24.68-21a1.92,1.92,0,0,1,1.6-.1l47.25,21.17a2,2,0,0,1,1.21,2A42.24,42.24,0,0,1,176,210Z"></path>
                            </svg>
                        )
                    },
                    {
                        id: "about",
                        title: "درباره ما",
                        href: "/aboutUs",
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M240,210H222V96a14,14,0,0,0-14-14H142V32a14,14,0,0,0-21.77-11.64l-80,53.33A14,14,0,0,0,34,85.34V210H16a6,6,0,0,0,0,12H240a6,6,0,0,0,0-12ZM208,94a2,2,0,0,1,2,2V210H142V94ZM46,85.34a2,2,0,0,1,.89-1.66l80-53.34A2,2,0,0,1,130,32V210H46ZM110,112v16a6,6,0,0,1-12,0V112a6,6,0,0,1,12,0Zm-32,0v16a6,6,0,0,1-12,0V112a6,6,0,0,1,12,0Zm0,56v16a6,6,0,0,1-12,0V168a6,6,0,0,1,12,0Zm32,0v16a6,6,0,0,1-12,0V168a6,6,0,0,1,12,0Z"></path>
                            </svg>
                        )
                    },
                    {
                        id: "faq",
                        title: "محصولات عمده",
                        href: "/whole-sale-products",
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M138,180a10,10,0,1,1-10-10A10,10,0,0,1,138,180ZM128,74c-21,0-38,15.25-38,34v4a6,6,0,0,0,12,0v-4c0-12.13,11.66-22,26-22s26,9.87,26,22-11.66,22-26,22a6,6,0,0,0-6,6v8a6,6,0,0,0,12,0v-2.42c18.11-2.58,32-16.66,32-33.58C166,89.25,149,74,128,74Zm102,54A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"></path>
                            </svg>
                        )
                    },
                    !isLoggedIn
                        ?
                        {
                            id: "login-register",
                            title: "ورود / ثبت نام",
                            href: "/login-register",
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4d4d4d" viewBox="0 0 256 256">
                                    <path d="M138,180a10,10,0,1,1-10-10A10,10,0,0,1,138,180ZM128,74c-21,0-38,15.25-38,34v4a6,6,0,0,0,12,0v-4c0-12.13,11.66-22,26-22s26,9.87,26,22-11.66,22-26,22a6,6,0,0,0-6,6v8a6,6,0,0,0,12,0v-2.42c18.11-2.58,32-16.66,32-33.58C166,89.25,149,74,128,74Zm102,54A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"></path>
                                </svg>
                            )
                        }
                        :
                        {
                            id: "profile",
                            title: "حساب کاربری",
                            href: "/profile",
                            icon: <></>
                        },
                    role === "admin" || role === "super-admin"
                        ?
                        {
                            id: "login-register",
                            title: "داشبورد",
                            href: "/dashboard",
                            icon: <></>
                        }
                        : undefined
                    // {
                    //     id: "seller",
                    //     title: "فروشنده شوید",
                    //     href: "seller-login.html",
                    //     isHighlighted: true,
                    //     icon: (
                    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4d4d4d" viewBox="0 0 256 256">
                    //             <path d="M184,89.57V84c0-25.08-37.83-44-88-44S8,58.92,8,84v40c0,20.89,26.25,37.49,64,42.46V172c0,25.08,37.83,44,88,44s88-18.92,88-44V132C248,111.3,222.58,94.68,184,89.57ZM232,132c0,13.22-30.79,28-72,28-3.73,0-7.43-.13-11.08-.37C170.49,151.77,184,139,184,124V105.74C213.87,110.19,232,122.27,232,132ZM72,150.25V126.46A183.74,183.74,0,0,0,96,128a183.74,183.74,0,0,0,24-1.54v23.79A163,163,0,0,1,96,152,163,163,0,0,1,72,150.25Zm96-40.32V124c0,8.39-12.41,17.4-32,22.87V123.5C148.91,120.37,159.84,115.71,168,109.93ZM96,56c41.21,0,72,14.78,72,28s-30.79,28-72,28S24,97.22,24,84,54.79,56,96,56ZM24,124V109.93c8.16,5.78,19.09,10.44,32,13.57v23.37C36.41,141.4,24,132.39,24,124Zm64,48v-4.17c2.63.1,5.29.17,8,.17,3.88,0,7.67-.13,11.39-.35A121.92,121.92,0,0,0,120,171.41v23.46C100.41,189.4,88,180.39,88,172Zm48,26.25V174.4a179.48,179.48,0,0,0,24,1.6,183.74,183.74,0,0,0,24-1.54v23.79a165.45,165.45,0,0,1-48,0Zm64-3.38V171.5c12.91-3.13,23.84-7.79,32-13.57V172C232,180.39,219.59,189.4,200,194.87Z"></path>
                    //         </svg>
                    //     )
                    // }
                ]}
            />
        </div>
    );
};

export default observer(MobileHeader);