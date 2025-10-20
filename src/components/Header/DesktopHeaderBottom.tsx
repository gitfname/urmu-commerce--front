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

const DesktopHeaderBottom: React.FC<DesktopHeaderBottomProps> = () => {
    return (
        <div className="  z-20 bg-white shadow-sm transition-transform duration-300" id="desktop-header-bottom">
            <div className="container relative flex max-w-[1680px] items-center gap-x-2 px-5 pb-2">
                {/* Categories Menu */}
                <MegaMenu />
               
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
                    <Link to="/amazing-products" className="group relative">
                        <div className="p-2 pt-0 text-sm text-zinc-700 flex items-center gap-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4d4d4d" viewBox="0 0 256 256">
                                <path d="M181.92,153A55.58,55.58,0,0,1,137,197.92a7,7,0,0,1-1,.08,6,6,0,0,1-1-11.92c17.38-2.92,32.13-17.68,35.08-35.08a6,6,0,1,1,11.84,2ZM214,144a86,86,0,0,1-172,0c0-27.47,10.85-55.61,32.25-83.64a6,6,0,0,1,9-.67l26.34,25.56,23.09-63.31a6,6,0,0,1,9.47-2.56C163.72,37.33,214,85.4,214,144Zm-12,0c0-48.4-38.65-89.84-61.07-109.8L117.64,98.06a6,6,0,0,1-9.82,2.25l-28-27.22C62.67,97.13,54,121,54,144a74,74,0,0,0,148,0Z"></path>
                            </svg>
                            محصولات فوق العاده
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
            </div>
        </div>
    );
};

export default DesktopHeaderBottom;