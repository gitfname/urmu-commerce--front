import React from 'react';
import RecentArticles from './RecentArticles';
import Tags from './Tags';

interface Props {
    tags: string[];
}

const Sidebar: React.FC<Props> = ({ tags }) => {
    return (
        <div className="lg:w-4/12">
            <RecentArticles />

            <Tags tags={tags} />
        </div>
    );
};

export default Sidebar;