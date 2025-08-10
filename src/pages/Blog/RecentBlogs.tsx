import React from 'react';

const RecentBlogs: React.FC = () => {
    return (
        <div className="my-2 py-5 lg:px-10 flex flex-col lg:flex-row gap-4">
            <div className="lg:w-4/12">
                <div className="p-3 bg-white rounded-xl shadow-box-sm">
                    <div className="mx-auto flex gap-x-1 group items-center text-right w-full px-2 py-3 text-sm text-gray-600 rounded-lg mb-2 font-semibold">
                        <span className="w-44">جدیدترین مقالات</span>
                        <span className="bg-red-400 w-full h-px"></span>
                    </div>
                    <ul className="grid w-full gap-3">
                        {Array(6).fill(0).map((_, index) => (
                            <li key={index}>
                                <label className="flex items-center justify-start gap-x-2 w-full p-2 text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-600 hover:bg-gray-100">
                                    <img
                                        className="max-w-20 rounded-md"
                                        src={`assets/image/blog/${index + 1}.jpg`}
                                        alt="Blog Thumbnail"
                                    />
                                    <div className="text-center flex flex-col space-y-3">
                                        <div className="text-xs sm:text-sm">طرز پخت تاکو مثل مکزیکی ها</div>
                                        <div className="flex items-start gap-x-1 text-xs text-zinc-400">
                                            <svg
                                                className="fill-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 256 256"
                                            >
                                                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                                            </svg>
                                            <span>2 دقیقه</span>
                                        </div>
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="lg:w-10/12">
                <div className="border rounded-xl p-4">
                    <img className="rounded-lg" src="assets/image/blog/switch-2.jpg" alt="Featured Blog" />
                    <div className="mt-7">
                        <a href="#" className="text-xl md:text-2xl text-zinc-500 hover:text-zinc-600 transition">
                            معرفی بازی فکری کلاغ پر؛ بازی برای تقویت حافظه کوتاه مدت
                        </a>
                        <div className="bg-red-400 w-6/12 h-px mt-5"></div>
                        <div className="text-zinc-500 text-sm my-7 flex flex-wrap">
                            <span className="leading-7 font-normal">
                                بازی فکری کلاغ پر یک بازی فکری حافظه‌ای است که برای 2 تا 6 نفر طراحی شده است. اگرچه بازی می‌تواند برای همه‌ی سنین خوب باشد اما مشخصاً هدف اصلی آن کمک به تقویت حافظه کوتاه مدت کودکان است و به آن‌ها کمک خواهد کرد. در بازی توکن‌هایی سف...{' '}
                                <a href="#" className="text-blue-500 hover:text-blue-400 transition text-sm">
                                    خواندن بیشتر
                                </a>
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <a href="#" className="text-zinc-100 text-sm bg-gray-400 hover:bg-gray-300 transition px-3 py-2 rounded-md">
                                امیررضا کریمی
                            </a>
                            <div className="flex items-start gap-x-1 text-xs text-zinc-400">
                                <svg
                                    className="fill-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 256 256"
                                >
                                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                                </svg>
                                <span>3 ساعت پیش</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentBlogs;