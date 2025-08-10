import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    link?: string; // Optional link; if provided, it's a clickable navigation item
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <div className="lg:mr-8 lg:ml-16 h-full p-5 text-sm bg-white rounded-xl shadow-box-sm flex items-center gap-x-2">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {item.link && index < items.length - 1 ? (
                        <Link
                            to={item.link}
                            className="text-zinc-800 hover:text-red-400 transition"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span
                            className={
                                index === items.length - 1
                                    ? 'text-red-400'
                                    : 'text-zinc-800 hover:text-red-400 transition'
                            }
                        >
                            {item.label}
                        </span>
                    )}
                    {index < items.length - 1 && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#3d3d3d"
                            viewBox="0 0 256 256"
                        >
                            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                        </svg>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Breadcrumb;