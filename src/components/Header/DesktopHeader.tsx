import React from 'react';
import SearchComponent from './SearchComponent';
import AccountDropdown from './AccountDropdown';
import CartDropdown from './CartDropdown';
import { Link } from 'react-router-dom';
import RenderIfLoggedIn from '../RenderIfLoggedIn';

interface DesktopHeaderProps {
    onSearchFocusChange: (isFocused: boolean) => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ onSearchFocusChange }) => {
    return (
        <div className="hidden md:block">
            <div className="container relative px-5 z-30 flex max-w-[1680px] items-center justify-between gap-x-4 bg-white py-4">        {/* LOGO */}
                <div className="z-0">
                    <Link to='/'>
                        <img alt="Logo" className="w-40" src="/assets/image/Logo.jpg" />
                    </Link>
                </div>

                {/* Search Box */}
                <div className="flex-1">
                    <SearchComponent
                        onFocusChange={onSearchFocusChange}
                        isMobile={false}
                        popularSearches={[]}
                    // searchResultItems={sampleSearchResultItems}
                    // recentSearches={sampleRecentSearches}
                    // popularSearches={samplePopularSearches}
                    />
                </div>


                {/* Cart and Account */}
                <div className="flex items-center justify-center gap-x-6">
                    <AccountDropdown />
                    <RenderIfLoggedIn>
                        <CartDropdown />
                    </RenderIfLoggedIn>
                </div>
            </div>
        </div>
    );
};

export default DesktopHeader;