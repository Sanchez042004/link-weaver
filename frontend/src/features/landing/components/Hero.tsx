import React from 'react';
import ShortenerForm from './ShortenerForm';

const Hero: React.FC = () => {
    const scrollToFeatures = () => {
        const element = document.getElementById('features');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="min-h-[calc(100vh-64px)] flex flex-col justify-center pb-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 flex flex-col items-center text-center relative z-10">
                {/* Hero Text */}
                <div className="max-w-3xl mx-auto mb-8 md:mb-12">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                        Shorten Your Links,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Expand Your Reach</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        A fast, privacy-focused URL shortener built for modern needs. Transform long, ugly links into smart, trackable assets for your business.
                    </p>
                </div>

                {/* Main Shortener Interface */}
                <ShortenerForm />
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-0 w-full flex flex-col items-center gap-2 cursor-pointer group animate-bounce z-20" onClick={scrollToFeatures}>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 group-hover:text-primary transition-colors">Learn More</span>
                <div className="size-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm group-hover:border-primary group-hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-2xl">keyboard_arrow_down</span>
                </div>
            </div>
        </main>
    );
};

export default Hero;
