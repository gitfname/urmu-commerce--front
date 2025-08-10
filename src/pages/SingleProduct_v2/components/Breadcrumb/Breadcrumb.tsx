import React from 'react';
import { ArrowIcon } from '../Icons/Icons';

interface BreadcrumbItem {
    title: string;
    href: string;
    isActive?: boolean;
}

interface BreadcrumbProps {
    breadcrumbs: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumbs }) => (
    <div className="mb-7 text-sm flex items-center gap-x-2 opacity-90">
        {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
                <a
                    href={breadcrumb.href}
                    className={`${breadcrumb.isActive ? 'text-red-400' : 'text-zinc-800 hover:text-red-400'} transition`}
                >
                    {breadcrumb.title}
                </a>
                {index < breadcrumbs.length - 1 && (
                    <div><ArrowIcon /></div>
                )}
            </React.Fragment>
        ))}
    </div>
);

export default Breadcrumb;