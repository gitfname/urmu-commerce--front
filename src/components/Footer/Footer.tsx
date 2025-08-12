import React from 'react';
import { Link } from 'react-router-dom';

// Types
interface Service {
    id: string;
    icon: string;
    title: string;
}

interface FooterLink {
    id: string;
    text: string;
    href: string;
}

interface FooterSection {
    id: string;
    title: string;
    links: FooterLink[];
}

interface SocialLink {
    id: string;
    name: string;
    href: string;
    icon: React.ReactNode;
}

interface FooterProps {
    logo?: string;
    supportPhone?: string;
    services?: Service[];
    sections?: FooterSection[];
    socialLinks?: SocialLink[];
    newsletterText?: string;
    companyDescription?: string;
    copyrightText?: string;
    badges?: string[];
    onBackToTop?: () => void;
    onNewsletterSubmit?: (email: string) => void;
}

// Icon Components
const UpArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#9c9c9c" viewBox="0 0 256 256">
        <path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm44.24-78.24a6,6,0,1,1-8.48,8.48L128,112.49,92.24,148.24a6,6,0,0,1-8.48-8.48l40-40a6,6,0,0,1,8.48,0Z"></path>
    </svg>
);



// Service Item Component
const ServiceItem: React.FC<{ service: Service }> = ({ service }) => (
    <div className="flex justify-center items-center flex-col rounded-3xl w-28 h-24">
        <img className="w-12 md:w-14" src={service.icon} alt={service.title} />
        <span className="text-xs text-zinc-600">{service.title}</span>
    </div>
);

// Footer Section Component
const FooterLinkSection: React.FC<{ section: FooterSection }> = ({ section }) => (
    <div className="px-4 sm:w-1/2 lg:w-3/12">
        <div className="mb-10 w-full">
            <h4 className="mb-3 text-zinc-700">{section.title}</h4>
            <ul className="grid gap-y-3">
                {section.links.map((link) => (
                    <li key={link.id}>
                        <Link
                            to={link.href}
                            className="mb-2 hover:text-zinc-600 transition text-zinc-500 text-xs md:text-sm"
                        >
                            {link.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// Main Footer Component
const Footer: React.FC<FooterProps> = ({
    supportPhone = "77916067 - 021",
    services = [],
    sections = [],
    socialLinks = [],
    companyDescription = "",
    copyrightText = "تمامی حقوق محفوظ است 2023",
    badges = [],
    onBackToTop,

}) => {

    const handleBackToTop = () => {
        if (onBackToTop) {
            onBackToTop();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white border-t pt-8 max-w-[1680px] mx-auto max-md:pb-32">
            {/* Top footer */}
            <div className="flex flex-wrap gap-y-4 justify-between items-center px-6">
                <div className="flex flex-col">
                    <div>
                        <img className="w-32 md:w-48" src={"/assets/image/Logo.jpg"} alt="Logo" />
                    </div>
                    <div className="text-xs text-zinc-600 mt-3" dir="ltr">
                        <p>
                            تلفن پشتیبانی {supportPhone}
                        </p>
                    </div>
                </div>
                <div>
                    <button
                        type="button"
                        className="flex items-center gap-x-1 border rounded-lg px-3 py-2 text-zinc-500 text-sm md:text-base"
                        onClick={handleBackToTop}
                    >
                        برو به بالا
                        <UpArrowIcon />
                    </button>
                </div>
            </div>

            {/* Services */}
            {services.length > 0 && (
                <div className="flex flex-wrap items-center gap-y-5 justify-around mb-10">
                    {services.map((service) => (
                        <ServiceItem key={service.id} service={service} />
                    ))}
                </div>
            )}

            {/* Links */}
            <div className="mx-auto shadow-lg">
                <div className="flex flex-wrap">
                    {sections.map((section) => (
                        <FooterLinkSection key={section.id} section={section} />
                    ))}

                    {/* Newsletter Section */}
                    <div className="px-4 sm:w-1/2 lg:w-3/12">
                        <div className="mb-10 w-full">
                            <h4 className="mb-2 text-right text-zinc-700">همراه ما باشید!</h4>
                            <div className="mb-5 flex items-center justify-start">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.id}
                                        href={social.href}
                                        title={social.name}
                                        className="mr-3 flex h-11 md:h-12 w-11 md:w-12 items-center justify-center p-2"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                            {/* <div className="text-sm text-zinc-700">
                                {newsletterText}
                                <form onSubmit={handleNewsletterSubmit} className="flex gap-x-2 mt-5">
                                    <input
                                        className="w-9/12 p-3 border rounded-xl focus:outline-none"
                                        placeholder="ایمیل شما..."
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={!email}
                                        className="text-sm disabled:bg-zinc-300 py-2 px-3 h-auto rounded-lg text-white bg-red-500 hover:bg-red-400 transition"
                                    >
                                        ارسال
                                    </button>
                                </form>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Company Description and Badges */}
                <div className="px-4 lg:flex pb-5">
                    <div className="lg:w-9/12">
                        <p className="mb-2 text-lg text-zinc-700">
                            فروشگاه اینترنتی نارنجی توی
                        </p>
                        <p className="mb-7 text-zinc-600 text-sm leading-7 text-justify">
                            {companyDescription}
                        </p>
                    </div>
                    {badges.length > 0 && (
                        <div className="lg:w-3/12 flex justify-center">
                            {badges.map((badge, index) => (
                                <a key={index} href="#">
                                    <img className="w-28 h-auto" src={badge} alt={`Badge ${index + 1}`} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Footer;