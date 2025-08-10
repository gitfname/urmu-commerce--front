import React from 'react';

export type TabType = 'specifications' | 'comments' | 'questions';

interface TabNavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'specifications' as TabType, label: 'مشخصات', href: '#proper' },
        { id: 'comments' as TabType, label: 'دیدگاه ها', href: '#comments' },
        { id: 'questions' as TabType, label: 'پرسش ها', href: '#quest' }
    ];

    return (
        <div className="flex gap-x-8 mt-20 pb-2 border-b">
            {tabs.map((tab) => (
                <a
                    key={tab.id}
                    className={`transition ${activeTab === tab.id ? 'text-zinc-800' : 'text-zinc-600 hover:text-zinc-800'}`}
                    href={tab.href}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </a>
            ))}
        </div>
    );
};

export default TabNavigation;