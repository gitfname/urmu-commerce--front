import React, { useState } from 'react';
import Comment from './Comment';

const CommentsSection: React.FC = () => {
    const [comments] = useState([
        { id: 1, author: "امیررضا", date: "11 بهمن 1402", content: "نظر شما درباره این لپ تاپ چیه؟", replies: [{ id: 1.1, author: "امیررضا", date: "11 بهمن 1402", content: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحامه و مجله در ستون و سطرآنچنان که لازم است." }] },
        { id: 2, author: "امیررضا", date: "11 بهمن 1402", content: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهو است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.", replies: [] },
        { id: 3, author: "امیررضا", date: "11 بهمن 1402", content: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گ ستون و سطرآنچنان که لازم است.", replies: [{ id: 3.1, author: "امیررضا", date: "11 بهمن 1402", content: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکهلازم است." }] }
    ]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");

    return (
        <div className="flex flex-col p-4 mt-5 rounded-2xl bg-white shadow-box-md">
            <div className="text-zinc-600">5 دیدگاه برای معرفی نینتندو سوییچ 2</div>
            {comments.map(comment => (
                <Comment key={comment.id} comment={comment} />
            ))}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="mb-4">
                    <label htmlFor="username" className="inline-block mb-2 ml-1 font-semibold text-xs text-slate-700">نام شما:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-sm block w-full rounded-lg border border-gray-400 bg-white px-3 py-2 font-normal text-gray-700 outline-none focus:border-red-300"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="inline-block mb-2 ml-1 font-semibold text-xs text-slate-700">ایمیل شما:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-sm block w-full rounded-lg border border-gray-400 bg-white px-3 py-2 font-normal text-gray-700 outline-none focus:border-red-300"
                    />
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="comment" className="inline-block mb-2 ml-1 font-semibold text-xs text-slate-700">نظر شما:</label>
                <textarea
                    cols={30}
                    rows={5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="text-sm block w-full rounded-lg border border-gray-400 bg-white px-3 py-2 font-normal text-gray-700 outline-none focus:border-red-300"
                ></textarea>
            </div>
            <button className="inline-block px-8 py-2 ml-auto text-center text-white bg-red-400 hover:bg-red-500 transition rounded-lg shadow-md text-xs">
                ارسال نظر
            </button>
        </div>
    );
};

export default CommentsSection;