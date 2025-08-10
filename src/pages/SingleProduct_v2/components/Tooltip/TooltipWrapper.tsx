import React from 'react';

interface TooltipWrapperProps {
    children: React.ReactNode;
    text: string;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ children, text }) => (
    <div className="group cursor-pointer relative inline-block text-center">
        {children}
        <div className="opacity-0 w-28 transition-all bg-zinc-800 text-white text-center text-xs rounded-lg py-2 absolute z-10 -left-11 group-hover:opacity-100 px-3 pointer-events-none">
            {text}
            <svg className="absolute text-black h-2 w-full left-0 bottom-full rotate-180" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
            </svg>
        </div>
    </div>
);

export default TooltipWrapper;