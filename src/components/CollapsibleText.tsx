import { useEffect, useRef, useState } from "react";

interface CollapsibleTextProps {
    children: React.ReactNode;
    maxHeight?: number; // in pixels
    showMoreText?: string;
    showLessText?: string;
    className?: string;
    buttonClassName?: string;
    isRTL?: boolean;
}

const CollapsibleText: React.FC<CollapsibleTextProps> = ({
    children,
    maxHeight = 200,
    showMoreText = 'Show More',
    showLessText = 'Show Less',
    className = '',
    buttonClassName = '',
    isRTL = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            setShouldShowButton(contentHeight > maxHeight);
        }
    }, [children, maxHeight]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const baseDirection = isRTL ? 'rtl' : 'ltr';

    return (
        <div className={`relative ${className}`} dir={baseDirection}>
            <div
                ref={contentRef}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-none' : ''
                    }`}
                style={{
                    maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
                }}
            >
                {children}
            </div>

            {/* Gradient overlay when collapsed */}
            {!isExpanded && shouldShowButton && (
                <div
                    className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none ${isRTL ? 'bg-gradient-to-t' : 'bg-gradient-to-t'
                        }`}
                />
            )}

            {/* Toggle button */}
            {shouldShowButton && (
                <div className={`mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <button
                        onClick={toggleExpanded}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors duration-200 border border-red-200 hover:border-red-300 rounded-lg bg-white hover:bg-red-50 ${buttonClassName}`}
                        type="button"
                    >
                        <span>{isExpanded ? showLessText : showMoreText}</span>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'
                                } ${isRTL ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};


export default CollapsibleText