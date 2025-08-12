import React, { useState } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import DesktopHeaderBottom from './DesktopHeaderBottom';

const Header: React.FC = () => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // This handler will be passed down to the search components
    // to update the parent state when search is focused or blurred.
    const handleSearchFocusChange = (isFocused: boolean) => {
        setIsSearchFocused(isFocused);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className='max-md:hidden'>
                <DesktopHeader onSearchFocusChange={handleSearchFocusChange} />
                <DesktopHeaderBottom />
            </div>

            <MobileHeader onSearchFocusChange={handleSearchFocusChange} />

            {/* background gray overlay */}
            {isSearchFocused && (
                <div className="fixed inset-0 z-20 bg-black/40 backdrop-blur-md"></div>
            )}
        </header>
    );
};

export default Header;