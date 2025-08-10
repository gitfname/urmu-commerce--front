import React from 'react';
import type { Review, Product } from '../../types/product';
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon } from '../Icons';

interface CommentsTabProps {
    product: Product;
    reviews: Review[];
    onSubmitReview: (reviewData: any) => void;
}

const CommentsTab: React.FC<CommentsTabProps> = ({ product, reviews, onSubmitReview }) => {
    return (
        <div className="p-4 border-b" id="comments">
            <span className="border-b-red-300 border-b text-zinc-800">
                دیدگاه ها
            </span>

            <div className="lg:flex gap-5">
                {/* Comment Form */}
                <div className="lg:w-3/12 py-5">
                    <div className="flex items-start gap-x-1 text-sm text-zinc-600">
                        <span>
                            <span>(از {product.reviewCount} امتیاز)</span>
                            <span>{product.rating}</span>
                        </span>
                        <StarIcon />
                    </div>
                    <div className="mt-6 mb-2 text-sm text-zinc-700">
                        شما هم دیدگاه خود را ثبت کنید
                    </div>
                    <input
                        type="text"
                        placeholder="عنوان دیدگاه"
                        className="focus:shadow-primary-outline text-sm leading-5.6 block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-300 focus:outline-none"
                    />
                    <ul className="grid my-3 gap-5 grid-cols-2">
                        <li>
                            <input type="radio" id="yes" name="recommendation" value="yes" className="hidden peer" />
                            <label htmlFor="yes" className="inline-flex items-center justify-center w-full px-2 py-3 text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-green-400 peer-checked:text-green-500 hover:text-gray-600 hover:bg-gray-100">
                                <div className="flex items-center gap-x-1">
                                    <ThumbsUpIcon />
                                    <div className="text-sm">پیشنهاد میشود</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input type="radio" id="no" name="recommendation" value="no" className="hidden peer" />
                            <label htmlFor="no" className="inline-flex items-center justify-center w-full px-2 py-3 text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-red-400 peer-checked:text-red-400 hover:text-gray-600 hover:bg-gray-100">
                                <div className="flex items-center gap-x-1">
                                    <ThumbsDownIcon />
                                    <div className="text-sm">پیشنهاد نمیشود</div>
                                </div>
                            </label>
                        </li>
                    </ul>
                    <textarea
                        placeholder="متن دیدگاه"
                        name="reviewText"
                        cols={30}
                        rows={7}
                        className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-400 focus:outline-none"
                    ></textarea>
                    <button
                        className="mx-auto w-full px-2 py-3 mt-5 text-sm bg-red-500 hover:bg-red-400 transition text-gray-100 rounded-lg"
                        onClick={onSubmitReview}
                    >
                        ارسال
                    </button>
                </div>

                {/* Reviews List */}
                <div className="lg:w-9/12 divide-y">
                    {reviews.map((review) => (
                        <div key={review.id} className="px-2 pt-5">
                            <div className="text-lg text-zinc-700">
                                {review.title}
                            </div>
                            <div className="mt-2 flex gap-x-4 items-center border-b pb-3">
                                <div className="text-xs text-zinc-600">
                                    {review.date}
                                </div>
                                <div className="text-xs text-zinc-600">
                                    {review.author}
                                </div>
                                {review.isPurchaser && (
                                    <div className="text-xs text-zinc-50 bg-green-400 rounded-full px-2 py-1">
                                        خریدار
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-x-1 pt-3">
                                {review.isRecommended ? <ThumbsUpIcon /> : <ThumbsDownIcon />}
                                <div className={`text-sm ${review.isRecommended ? 'text-green-500' : 'text-red-500'}`}>
                                    {review.isRecommended ? 'پیشنهاد میشود' : 'پیشنهاد نمیشود'}
                                </div>
                            </div>
                            <div className="mt-2 text-zinc-600 text-sm">
                                {review.content}
                            </div>
                            <div className="flex justify-end items-center gap-x-5 mt-3">
                                <div className="text-sm text-zinc-400">
                                    آیا این دیدگاه برایتان مفید بود؟
                                </div>
                                <ul className="grid my-3 gap-5 grid-cols-2">
                                    <li>
                                        <input type="radio" id={`helpful-${review.id}`} name={`helpful-${review.id}`} value="yes" className="hidden peer" />
                                        <label htmlFor={`helpful-${review.id}`} className="inline-flex p-2 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-green-400 hover:bg-gray-100">
                                            <ThumbsUpIcon />
                                        </label>
                                    </li>
                                    <li>
                                        <input type="radio" id={`not-helpful-${review.id}`} name={`helpful-${review.id}`} value="no" className="hidden peer" />
                                        <label htmlFor={`not-helpful-${review.id}`} className="inline-flex p-2 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-red-400 hover:bg-gray-100">
                                            <ThumbsDownIcon />
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommentsTab;