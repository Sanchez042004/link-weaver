import React from 'react';
import ShortenerForm from './ShortenerForm';

const Hero: React.FC = () => {
    const scrollToFeatures = () => {
        const element = document.getElementById('features');
        if (element) {
            const offset = 100; // Ajusta este número para que baje más (positivo) o menos (negativo)
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <div className="relative bg-pattern min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-1/4 right-0 -mr-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="layout-container flex h-full grow flex-col relative z-10">
                    <div className="px-4 md:px-10 lg:px-20 py-12 md:py-20">
                        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-12 lg:gap-20 items-center translate-y-[1px]">
                            {/* Left Column: Copy */}
                            <div className="flex flex-col gap-6 lg:w-1/2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-primary/20 w-fit">
                                    <span className="block size-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">New: Analytics 2.0</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tighter text-white">
                                    Untangle <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">your analytics.</span>
                                </h1>
                                <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                                    The URL shortener for creators who value speed, privacy, and absolute control over their traffic. Map your audience's journey with precision.
                                </p>
                                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                        <span>No credit card required</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                                        <span>GDPR Compliant</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Interactive Card */}
                            <div className="w-full lg:w-1/2">
                                <ShortenerForm />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block text-gray-600 cursor-pointer hover:text-primary transition-colors z-20"
                    onClick={scrollToFeatures}
                >
                    <span className="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
                </div>

            </div>
            {/* Stats Ticker */}
            <div className="w-full bg-primary text-white py-3 overflow-hidden whitespace-nowrap border-y border-orange-700 relative z-20">
                <style>
                    {`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    `}
                </style>
                <div className="inline-flex animate-[marquee_20s_linear_infinite] items-center gap-12 text-sm font-bold uppercase tracking-widest">
                    <span>// Lightning Fast Redirects</span>
                    <span>// Advanced Traffic Analytics</span>
                    <span>// Secure Link Management</span>
                    <span>// Privacy First Tracking</span>
                    <span>// Custom Branded Domains</span>
                    <span>// Global Infrastructure</span>
                    <span>// Lightning Fast Redirects</span>
                    <span>// Advanced Traffic Analytics</span>
                    <span>// Secure Link Management</span>
                    <span>// Privacy First Tracking</span>
                    <span>// Custom Branded Domains</span>
                    <span>// Global Infrastructure</span>
                </div>
            </div>
        </>
    );
};

export default Hero;
