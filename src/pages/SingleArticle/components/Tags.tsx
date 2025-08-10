import React from 'react';
import { Link } from 'react-router-dom';


interface Props {
    tags: string[]
}

const Tags: React.FC<Props> = ({ tags }) => {
    return (
        <div className="p-3 bg-white rounded-xl shadow-box-sm">
            <div className="mx-auto flex gap-x-1 group items-center text-right w-full px-2 py-3 text-sm text-gray-600 rounded-lg mb-2 font-semibold">
                <span className="w-44">برچسب ها</span>
                <span className="bg-red-400 w-full h-px"></span>
            </div>
            <div className="flex gap-2 flex-wrap">
                {tags.map((tag, index) => (
                    <Link
                        key={index}
                        to={"/articles/tags/" + tag?.replaceAll(" ", "-")}
                        className="bg-gray-200 text-gray-500 hover:text-gray-400 transition px-2 py-1 text-sm rounded-full w-fit"
                    >
                        #{tag}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Tags;