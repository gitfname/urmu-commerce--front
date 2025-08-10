import React from 'react';
import type { Question } from '../../types/product';
import { ThumbsUpIcon, ThumbsDownIcon } from '../Icons';

interface QuestionsTabProps {
    questions: Question[];
    onSubmitQuestion: (questionData: any) => void;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ questions, onSubmitQuestion }) => {
    return (
        <div className="p-4 border-b" id="quest">
            <span className="border-b-red-300 border-b text-zinc-800">
                پرسش ها
            </span>

            <div className="lg:flex gap-5">
                {/* Question Form */}
                <div className="lg:w-3/12 py-5">
                    <div className="mt-6 mb-2 text-sm text-zinc-700">
                        اگر سوالی دارید بپرسید
                    </div>
                    <textarea
                        placeholder="متن پرسش"
                        name="questionText"
                        cols={30}
                        rows={7}
                        className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all focus:border-red-400 focus:outline-none"
                    ></textarea>
                    <button
                        className="mx-auto w-full px-2 py-3 mt-5 text-sm bg-red-500 hover:bg-red-400 transition text-gray-100 rounded-lg"
                        onClick={onSubmitQuestion}
                    >
                        ارسال
                    </button>
                </div>

                {/* Questions List */}
                <div className="lg:w-9/12 divide-y">
                    {questions.map((question) => (
                        <div key={question.id} className="px-3 pt-5">
                            <div className="mt-2 flex gap-x-4 items-center border-b pb-3">
                                <div className="text-xs text-zinc-600">
                                    {question.date}
                                </div>
                                <div className="text-xs text-zinc-600">
                                    {question.author}
                                </div>
                            </div>
                            <div className="mt-2 mb-4 text-zinc-600 text-sm">
                                {question.content}
                            </div>
                            <a href="#">
                                <div className="transition px-2 flex items-center text-xs text-zinc-600 hover:text-zinc-700">
                                    پاسخ
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#292929" viewBox="0 0 256 256">
                                        <path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path>
                                    </svg>
                                </div>
                            </a>
                            <div className="flex justify-end items-center gap-x-5 mt-3">
                                <div className="text-sm text-zinc-400">
                                    آیا این جواب برایتان مفید بود؟
                                </div>
                                <ul className="grid my-3 gap-5 grid-cols-2">
                                    <li>
                                        <input type="radio" id={`question-helpful-${question.id}`} name={`question-helpful-${question.id}`} value="yes" className="hidden peer" />
                                        <label htmlFor={`question-helpful-${question.id}`} className="inline-flex p-2 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-green-400 hover:bg-gray-100">
                                            <ThumbsUpIcon />
                                        </label>
                                    </li>
                                    <li>
                                        <input type="radio" id={`question-not-helpful-${question.id}`} name={`question-helpful-${question.id}`} value="no" className="hidden peer" />
                                        <label htmlFor={`question-not-helpful-${question.id}`} className="inline-flex p-2 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-red-400 hover:bg-gray-100">
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

export default QuestionsTab;