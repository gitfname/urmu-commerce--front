import React from 'react';

interface CommentProps {
    comment: {
        id: number;
        author: string;
        date: string;
        content: string;
        replies: Array<{ id: number; author: string; date: string; content: string }>;
    };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
    return (
        <div className="border rounded-xl px-5 py-3 my-2">
            <div className="flex items-center gap-x-1">
                <svg className="fill-zinc-500" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                </svg>
                <div className="text-xs opacity-60">
                    {comment.author} - {comment.date}
                </div>
            </div>
            <div className="opacity-60 text-sm py-3">{comment.content}</div>
            <div>
                <button className="mr-auto bg-blue-500 text-zinc-50 rounded-lg px-4 py-1 md:w-auto text-sm flex justify-center items-center">
                    پاسخ
                </button>
            </div>
            {comment.replies.length > 0 && comment.replies.map(reply => (
                <div key={reply.id} className="bg-blue-100 rounded-xl pl-2 pr-5 sm:pr-8 py-3 mt-2">
                    <div className="flex items-center gap-x-1">
                        <svg className="fill-zinc-500" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256">
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                        </svg>
                        <div className="text-xs opacity-60">
                            {reply.author} - {reply.date}
                        </div>
                    </div>
                    <div className="opacity-60 text-sm py-3">{reply.content}</div>
                    <div>
                        <button className="mr-auto bg-blue-500 text-zinc-50 rounded-lg px-4 py-1 md:w-auto text-sm flex justify-center items-center">
                            پاسخ
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Comment;