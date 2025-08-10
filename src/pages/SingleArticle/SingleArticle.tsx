import React, { useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Breadcrumb from '../Blog/Breadcrumb';
import ArticleContent from './components/ArticleContent';
import { useParams } from 'react-router-dom';
import { getFindWeblogArticleBySlugQueryQueryKey, useFindWeblogArticleBySlugQuery } from '../../services/api/ecommerce--api';
import { convertIsoToJalali } from '../../utils/convertIsoToJalali';

const SingleArticle: React.FC = () => {
    const { slug } = useParams<{ slug: string }>()

    const article = useFindWeblogArticleBySlugQuery(slug, {
        query: {
            queryKey: getFindWeblogArticleBySlugQueryQueryKey(slug),
            refetchOnWindowFocus: false,
            retry: 2
        }
    })

    const pubDate = useMemo(
        () => {
            if (!article?.data?.data?.createdAt) return
            return convertIsoToJalali(article?.data?.data.createdAt)
        }, [article?.data?.data]
    )

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-20 md:mt-36">
            {/* Breadcrumb Section */}
            <Breadcrumb
                items={[
                    { label: "خانه", link: "/" },
                    { label: "وبلاگ", link: "/blog" },
                    { label: article?.data?.data?.title, link: "/articles/" + article?.data?.data?.slug },
                ]}
            />

            {/* Main Content and Sidebar */}
            <div className="my-2 py-5 lg:px-10 flex flex-col lg:flex-row gap-4">
                <ArticleContent
                    title={article?.data?.data?.title || ""}
                    content={article?.data?.data?.content || ""}
                    pubDate={pubDate}
                />

                <Sidebar tags={article?.data?.data?.tags || []} />
            </div>
        </main>
    );
};

export default SingleArticle;