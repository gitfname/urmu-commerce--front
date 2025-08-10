import React from 'react';

interface Props {
    pubDate: string;
    category: string;
}

const ArticleMeta: React.FC<Props> = ({ category, pubDate }) => {
    return (
        <div className="flex gap-4 pb-2 flex-wrap">
            <div className="text-xs flex gap-x-1 items-center text-zinc-400">
                <svg className="fill-zinc-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                    <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
                </svg>
                {pubDate}
            </div>

            {/* <div className="text-xs flex gap-x-1 items-center text-zinc-400">
                <svg className="fill-zinc-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                </svg>
                ارسال شده توسط امیررضا کریمی
            </div> */}

            <div className="text-xs flex gap-x-1 items-center text-zinc-400">
                <svg className="fill-zinc-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                    <path d="M224,64H154.67L126.93,43.2a16.12,16.12,0,0,0-9.6-3.2H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H192.89A15.13,15.13,0,0,0,208,200.89V184h16.89A15.13,15.13,0,0,0,240,168.89V80A16,16,0,0,0,224,64ZM192,200H40V88H85.33l27.74,20.8a16.12,16.12,0,0,0,9.6,3.2H192Zm32-32H208V112a16,16,0,0,0-16-16H122.67L94.93,75.2a16.12,16.12,0,0,0-9.6-3.2H72V56h45.33l27.74,20.8a16.12,16.12,0,0,0,9.6,3.2H224Z"></path>
                </svg>
                {category}
            </div>

            {/* <div className="text-xs flex gap-x-1 items-center text-zinc-400">
                <svg className="fill-zinc-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                </svg>
                73بازدید
            </div> */}
        </div>
    );
};

export default ArticleMeta;