import React from 'react';
import Article from './Article';
// import CommentsSection from './CommentsSection';
import ArticleMeta from './ArticleMeta';


interface Props {
    title: string;
    content: string;
    pubDate: any;
}

const ArticleContent: React.FC<Props> = ({ content, pubDate, title }) => {
    return (
        <div className="lg:w-10/12">
            <div className="bg-white rounded-xl shadow-box-md p-4">
                <ArticleMeta
                    category={title}
                    pubDate={`${pubDate?.year} ${pubDate?.month} ${pubDate?.day}`}
                />

                <div className='prose max-w-5xl mx-auto mt-5' dangerouslySetInnerHTML={{ __html: content }}></div>


                {/* <img className="rounded-lg" src="/assets/image/blog/10.jpg" alt="Blog Thumbnail" />
                <Article />
                <img className="rounded-lg w-10/12 mx-auto" src="/assets/image/blog/10.jpg" alt="Blog Image" />
                <Article /> */}
            </div>

            {/* <CommentsSection /> */}
        </div>
    );
};

export default ArticleContent;