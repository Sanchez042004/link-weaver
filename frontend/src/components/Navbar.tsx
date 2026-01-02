import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Navbar: React.FC = () => {
    return (
        <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-surface-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 cursor-pointer">
                        <Logo />
                    </Link>

                    {/* Desktop Nav - Removed as per request */}
                    <div />

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="hidden sm:flex items-center justify-center rounded-lg h-10 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold transition-colors">
                            Log In
                        </Link>
                        <Link to="/signup" className="flex items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95">
                            Sign Up Free
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
