import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ContactOption {
    id: string;
    title: string;
    icon: React.ReactNode;
    href: string;
    bgColor: string;
}

const FloatingContactButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const contactOptions: ContactOption[] = [
        {
            id: 'store',
            title: 'تماس با فروشگاه',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                    <path d="M231.88,175.08A56.26,56.26,0,0,1,176,224C96.6,224,32,159.4,32,80A56.26,56.26,0,0,1,80.92,24.12a16,16,0,0,1,16.62,9.52l21.12,47.15,0,.12A16,16,0,0,1,117.39,96.6C107.81,116.39,96,139.32,96,160a16,16,0,0,0,16,16c20.68,0,43.61-11.81,63.4-21.39a16,16,0,0,1,16.81-.84l.12,0,47.15,21.12A16,16,0,0,1,231.88,175.08Z"/>
                </svg>
            ),
            href: 'tel:02177916067',
            bgColor: 'bg-green-500'
        },
        {
            id: 'support',
            title: 'تماس با پشتیبان فروش',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                    <path d="M231.88,175.08A56.26,56.26,0,0,1,176,224C96.6,224,32,159.4,32,80A56.26,56.26,0,0,1,80.92,24.12a16,16,0,0,1,16.62,9.52l21.12,47.15,0,.12A16,16,0,0,1,117.39,96.6C107.81,116.39,96,139.32,96,160a16,16,0,0,0,16,16c20.68,0,43.61-11.81,63.4-21.39a16,16,0,0,1,16.81-.84l.12,0,47.15,21.12A16,16,0,0,1,231.88,175.08Z"/>
                </svg>
            ),
            href: 'tel:02133159655',
            bgColor: 'bg-orange-500'
        },
        {
            id: 'whatsapp',
            title: 'ارتباط از طریق واتساپ',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,0,0,24,128c0,22.5,7.4,43.3,20,60.2L24,232l44.8-20c16.9,12.6,37.7,20,60.2,20A104,104,0,0,0,128,24Zm0,192a88,88,0,0,1-44.9-12.3l-5.1-3-55.2,24.1,24.1-55.2-3-5.1A88,88,0,1,1,128,216Zm47.5-66.7c-1.4-7.5-7.1-13.8-14.6-15.4l-32.1-6.4c-7.5-1.4-14.6,2.3-18.3,9.1l-16.8,30.6c-3.7,6.8-1.4,15.2,5.4,18.9l8.9,4.8c1.8,1,3.9,1.2,5.9,0.6l20.8-8.4c6.8-2.7,14.1-0.9,18.9,4.7l16.8,16.8c4.8,4.8,6.6,12.1,4.7,18.9l-8.4,20.8c-0.6,2,0,4.1,0.6,5.9l4.8,8.9c3.7,6.8,12.1,9.1,18.9,5.4l30.6-16.8c6.8-3.7,10.5-10.8,9.1-18.3L175.5,149.3Z"/>
                </svg>
            ),
            href: 'https://wa.me/09107660844/',
            bgColor: 'bg-green-500'
        },
        {
            id: 'telegram',
            title: 'ارتباط از طریق تلگرام',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,0,0,24,128c0,57.6,46.4,104,104,104s104-46.4,104-104S185.6,24,128,24Zm47.5,68.5L175.5,155.5c-1.4,7.5-7.1,13.8-14.6,15.4l-32.1,6.4c-7.5,1.4-14.6-2.3-18.3-9.1l-16.8-30.6c-3.7-6.8-1.4-15.2,5.4-18.9l8.9-4.8c1.8-1,3.9-1.2,5.9-0.6l20.8,8.4c6.8,2.7,14.1,0.9,18.9-4.7l16.8-16.8c4.8-4.8,6.6-12.1,4.7-18.9l-8.4-20.8c-0.6-2,0-4.1,0.6-5.9l4.8-8.9c3.7-6.8,12.1-9.1,18.9-5.4l30.6,16.8c6.8,3.7,10.5,10.8,9.1,18.3L175.5,92.5Z"/>
                </svg>
            ),
            href: 'https://t.me/narenjitoy',
            bgColor: 'bg-blue-400'
        },
        {
            id: 'instagram',
            title: 'ارتباط از طریق اینستاگرام',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256">
                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"/>
                </svg>
            ),
            href: 'https://www.instagram.com/toyisland4',
            bgColor: 'bg-red-500'
        }
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (href: string) => {
        window.open(href, '_blank');
        setIsOpen(false);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        // Only close if clicking on the overlay, not on the menu content
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-[51]"
                    onClick={handleOverlayClick}
                />
            )}
            
            <div className="fixed lg:bottom-16 bottom-[70px] left-6 z-[52]">
                {/* Contact Menu */}
                {isOpen && (
                    <div className="absolute bottom-16 left-0 mb-2 bg-white rounded-lg shadow-lg border p-4 min-w-[280px] z-[52]">
                        <div className="space-y-3">
                            {contactOptions.map((option) => (
                                <Link
                                    key={option.id}
                                    to={option.href}
                                    onClick={() => handleOptionClick(option.href)}
                                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-right"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${option.bgColor}`}>
                                        {option.icon}
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">{option.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            {/* Floating Button */}
            <button
                onClick={toggleMenu}
                className={`${isOpen ? 'w-14 h-14' : 'size-[60px]'} bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 gap-1`}
                aria-label="تماس با ما"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
                    </svg>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M231.88,175.08A56.26,56.26,0,0,1,176,224C96.6,224,32,159.4,32,80A56.26,56.26,0,0,1,80.92,24.12a16,16,0,0,1,16.62,9.52l21.12,47.15,0,.12A16,16,0,0,1,117.39,96.6C107.81,116.39,96,139.32,96,160a16,16,0,0,0,16,16c20.68,0,43.61-11.81,63.4-21.39a16,16,0,0,1,16.81-.84l.12,0,47.15,21.12A16,16,0,0,1,231.88,175.08Z"/>
                        </svg>
                        <span className="text-[10px] font-medium leading-tight">تماس با ما</span>
                    </>
                )}
            </button>
        </div>
        </>
    );
};

export default FloatingContactButton; 