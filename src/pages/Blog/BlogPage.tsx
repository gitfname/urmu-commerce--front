import React from 'react';
import Breadcrumb from './Breadcrumb';
import BlogCategorySidebar from './BlogCategorySidebar';
import BlogBanner from './BlogBanner';
import FeaturedBlogs from './FeaturedBlogs';
import BlogSlider from './BlogSlider';
import RecentBlogs from './RecentBlogs';
import BlogGrid from './BlogGrid';

const BlogPage: React.FC = () => {
    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-20 md:mt-36">
            <Breadcrumb
                items={[
                    { label: "خانه", link: "/" },
                    { label: "وبلاگ", link: "/blog" }
                ]}
            />

            <div className="my-2 py-5 lg:px-10 md:flex">
                {/* <BlogCategorySidebar /> */}

                {/* <div className="md:w-9/12 px-2 sm:px-6 mt-5 md:mt-0">
                    <BlogBanner />

                    <FeaturedBlogs />
                </div> */}

                <div className='w-full'>
                    {/* <BlogBanner /> */}
                    <FeaturedBlogs />
                </div>
            </div>

            <BlogSlider />

            {/* <RecentBlogs /> */}

            <BlogGrid />
        </main>
    );
};

export default BlogPage;