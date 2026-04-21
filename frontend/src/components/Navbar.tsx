import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center">
                            <img src="/logo.png" alt="Knot.ly" className="h-[34px] w-auto" />
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            {/* Navigation links removed per user request */}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-[13px] text-text-secondary hover:text-text-primary transition-colors hidden sm:block">Log in</Link>
                        <Link to="/signup" className="text-[13px] text-text-primary border border-border px-4 py-1.5 rounded bg-surface hover:bg-surface-2 transition-colors">Sign up</Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-1.5 rounded-lg text-text-secondary hover:bg-surface transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">{isMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <div className={`fixed inset-0 bg-bg z-[40] transition-all duration-300 md:hidden flex flex-col pt-20 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col h-full px-6 py-8">
                    <div className="flex flex-col gap-6 text-center">
                        {/* Mobile Navigation links removed per user request */}
                    </div>
                    <div className="flex flex-col gap-4 mt-12">
                        <Link to="/login" onClick={toggleMenu} className="w-full py-3 text-center text-sm font-medium text-text-primary border border-border rounded">
                            Log in
                        </Link>
                        <Link to="/signup" onClick={toggleMenu} className="w-full py-3 text-center text-sm font-medium text-white bg-accent rounded hover:bg-accent/90 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
