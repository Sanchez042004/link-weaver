import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-[#392e28] bg-background-dark/90 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="hover:opacity-80 transition-opacity">
                            <Logo />
                        </Link>

                        {/* Desktop Menu - Empty for now as requested */}
                        <div className="hidden md:flex items-center gap-8">
                        </div>

                        {/* Desktop CTAs */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="text-sm font-bold text-white hover:text-primary transition-colors px-4">
                                Log in
                            </Link>
                            <Link to="/signup" className="bg-primary hover:bg-orange-600 text-white text-sm font-bold h-10 px-5 rounded-xl transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center">
                                Create account
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-3">
                            <Link to="/signup" className="bg-primary hover:bg-orange-600 text-white text-[12px] font-black h-9 px-4 rounded-lg transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center uppercase tracking-wider">
                                Join
                            </Link>
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-lg text-white hover:bg-surface-dark transition-colors"
                            >
                                <span className="material-symbols-outlined text-[28px]">{isMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Drawer - MOVED OUTSIDE NAV */}
            <div className={`fixed inset-0 bg-[#221610] z-[9999] transition-all duration-500 md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-12">
                        <Logo />
                        <button onClick={toggleMenu} className="p-2 text-white">
                            <span className="material-symbols-outlined text-[32px]">close</span>
                        </button>
                    </div>

                    {/* Main Actions */}
                    <div className="flex flex-col gap-4 mt-8">
                        <Link to="/login" onClick={toggleMenu} className="w-full py-4 text-center font-bold text-white border border-border-dark rounded-xl text-lg">
                            Log in
                        </Link>
                        <Link to="/signup" onClick={toggleMenu} className="w-full py-4 text-center font-bold text-white bg-primary rounded-xl shadow-xl shadow-primary/20 text-lg">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
