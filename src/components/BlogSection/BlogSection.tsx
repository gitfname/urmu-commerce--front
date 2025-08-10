import React from 'react';
import { Link } from 'react-router-dom';

// Types
interface BlogPost {
  id: number;
  title: string;
  category: string;
  categoryHref?: string;
  image: string;
  date: {
    day: string;
    month: string;
  };
  href: string;
  readMoreText?: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
  sectionTitle?: string;
  viewAllText?: string;
  viewAllHref?: string;
  className?: string;
}

// Blog Icon Component
const BlogIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#2e2e2e" viewBox="0 0 256 256">
    <path d="M104,34H56A14,14,0,0,0,42,48V208a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V48A14,14,0,0,0,104,34ZM54,78h52V178H54Zm2-32h48a2,2,0,0,1,2,2V66H54V48A2,2,0,0,1,56,46Zm48,164H56a2,2,0,0,1-2-2V190h52v18A2,2,0,0,1,104,210Zm125.7-15L196.51,37.16a14,14,0,0,0-16.63-10.85L133.07,36.37A14.09,14.09,0,0,0,122.3,53l33.19,157.81a14,14,0,0,0,6.1,8.9,13.85,13.85,0,0,0,7.57,2.26,13.55,13.55,0,0,0,3-.32l46.81-10.05A14.09,14.09,0,0,0,229.7,195Zm-82.81-83.32,50.73-10.9,14.12,67.16L161,178.81Zm-6.63-31.56L191,69.19,195.15,89l-50.73,10.9Zm-4.66-32,46.8-10.05a2.18,2.18,0,0,1,.42,0,1.89,1.89,0,0,1,1.05.32,2,2,0,0,1,.89,1.31l3.75,17.82L137.79,68.34l-3.74-17.78A2.07,2.07,0,0,1,135.6,48.1Zm80.81,151.8L169.6,210a1.92,1.92,0,0,1-1.47-.27,2,2,0,0,1-.89-1.31l-3.75-17.82,50.72-10.9L218,197.43A2.07,2.07,0,0,1,216.41,199.9Z"></path>
  </svg>
);

// Arrow Icon Component
const ArrowIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#292929" viewBox="0 0 256 256">
    <path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path>
  </svg>
);

// Individual Blog Card Component
interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link to={post.href} className="relative flex items-end justify-start w-full text-left bg-center bg-cover group">
      <img className="rounded-xl" src={post.image} alt={post.title} />
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b via-transparent from-gray-900 to-gray-900 rounded-xl"></div>
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
        <a
          rel="noopener noreferrer"
          href={post.categoryHref || '#'}
          className="px-3 py-2 text-xs font-semibold tracki uppercase text-gray-100 bgundefined"
        >
          {post.category}
        </a>
        <div className="flex flex-col justify-start text-center text-gray-100">
          <span className="text-2xl font-semibold leadi tracki">{post.date.day}</span>
          <span className="text-sm">{post.date.month}</span>
        </div>
      </div>
      <h2 className="z-10 p-2 sm:p-5 absolute -bottom-1 group-hover:bottom-0 group-hover:block transition-all text-right">
        <a href={post.href} className="text-sm sm:text-md opacity-90 text-gray-50 md:text-gray-100 transition-all line-clamp-2">
          {post.title}
        </a>
        <br />
        <Link
          to={post.href}
          className="text-sm bg-gray-300 bg-opacity-30 hover:bg-opacity-45 w-fit rounded-lg px-3 py-1 opacity-90 text-gray-100 mt-2 hidden group-hover:block transition-all"
        >
          {post.readMoreText || 'مطالعه بیشتر'}
        </Link>
      </h2>
    </Link>
  );
};

// Main Blog Section Component
const BlogSection: React.FC<BlogSectionProps> = ({
  posts,
  sectionTitle = 'خواندنی ها',
  viewAllText = 'مشاهده همه',
  viewAllHref = '#',
  className = ''
}) => {
  return (
    <div className={`rounded-2xl mx-auto text-gray-100 ${className}`}>
      {/* Top blog header */}
      <div className="flex justify-between px-5 md:px-10 items-center bg-white py-3 rounded-xl drop-shadow-lg mb-5">
        <div className="px-4 py-2 flex justify-center items-center gap-x-1 text-sm text-zinc-700">
          <BlogIcon />
          <span>{sectionTitle}</span>
        </div>
        <a href={viewAllHref}>
          <div className="transition px-4 py-2 flex justify-center items-center text-sm text-zinc-700 hover:text-zinc-600">
            {viewAllText}
            <ArrowIcon />
          </div>
        </a>
      </div>

      {/* Main blog grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-5 lg:grid-cols-4 sm:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogSection;