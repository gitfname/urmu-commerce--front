import React from 'react';
import { getFindManyAndCountWeblogArticlesQueryQueryKey, useFindManyAndCountWeblogArticlesQuery } from '../../../services/api/ecommerce--api';
import { Env } from '../../../env';
import { convertIsoToJalali } from '../../../utils/convertIsoToJalali';
import { Link } from 'react-router-dom';

const RecentArticles: React.FC = () => {
    const latestArticles = useFindManyAndCountWeblogArticlesQuery({
        limit: 6
    }, {
        query: {
            queryKey: getFindManyAndCountWeblogArticlesQueryQueryKey({ limit: 6 }),
            retry: 2,
            refetchOnWindowFocus: false
        }
    })

    return (
        <div className="p-3 bg-white rounded-xl shadow-box-sm mb-4">
            <div className="mx-auto flex gap-x-1 group items-center text-right w-full px-2 py-3 text-sm text-gray-600 rounded-lg mb-2 font-semibold">
                <span className="w-44">جدیدترین مقالات</span>
                <span className="bg-red-400 w-full h-px"></span>
            </div>
            <div className="grid w-full gap-3">
                {latestArticles?.data?.data?.data?.map(article => {
                    const pubDate = convertIsoToJalali(article.createdAt)

                    return <Link to={"/articles/" + article.slug} key={article.id}>
                        <label className="flex items-center justify-start gap-x-2 w-full p-2 text-gray-600 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-600 hover:bg-gray-100">
                            <img className="max-w-20 rounded-md" src={Env.weblogArticleThumbnailBaseUrl + article.thumbnailImage} alt={article.title} />

                            <div className="text-center flex flex-col space-y-3">
                                <div className="text-xs sm:text-sm">{article.title}</div>
                                <div className="flex items-start gap-x-1 text-xs text-zinc-400">
                                    <svg className="fill-gray-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256">
                                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                                    </svg>

                                    <span>{pubDate.year} {pubDate.month} {pubDate.day}</span>
                                </div>
                            </div>
                        </label>
                    </Link>
                })}
            </div>
        </div>
    );
};

export default RecentArticles;