import React from 'react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
    title: string;
    image: string;
    readingTime: string;
    summary: string;
    href: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, image, readingTime, summary, href }) => {
    return (
        <Link to={href} className="card bg-white rounded-2xl drop-shadow-lg block">
            <div className="image-box mb-6">
                <div className="relative">
                    <img className="mx-auto rounded-xl" src={image} alt={title} />
                    <div className="absolute top-2 left-2">
                        <svg
                            className="bg-gray-200 rounded-full p-1 hover:fill-gray-500 transition"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="#3d3d3d"
                            viewBox="0 0 256 256"
                        >
                            <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div className='px-2 pb-3'>
                <div className="mb-2 space-y-3">
                    <div className="flex items-start gap-x-1 text-xs text-zinc-500">
                        <svg
                            className="fill-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 256 256"
                        >
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                        </svg>

                        <span>{readingTime}</span>
                    </div>

                    <div className="flex flex-col gap-y-4">
                        <span className="text-sm font-semibold text-zinc-800">{title}</span>

                        <span className="text-sm font-normal text-zinc-500 line-clamp-3">{summary}</span>
                    </div>

                </div>
            </div>
        </Link>
    );
};

export default BlogCard;