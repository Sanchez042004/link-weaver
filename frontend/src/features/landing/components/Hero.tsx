import React from 'react';
import ShortenerForm from './ShortenerForm';

const Hero: React.FC = () => {
    return (
        <main className="flex-grow flex items-center justify-center h-full p-4 md:p-6 overflow-hidden">

            {/* Subtle Background Glow has been removed per user request */}

            <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center text-center">


                {/* Headline */}
                <h1 className="font-headline text-4xl md:text-[64px] leading-[1.1] font-semibold tracking-[-0.03em] text-text-primary mb-4 md:mb-6 max-w-3xl">
                    shorten. track. done.
                </h1>

                {/* Subheadline */}
                <p className="text-sm md:text-base text-text-secondary max-w-[520px] mb-8 md:mb-12 leading-relaxed">
                    <strong>Knot.ly</strong> provides high-speed URL shortening and precision analytics. Track, analyze, and optimize every click with ease.
                </p>

                {/* Product Widget */}
                <ShortenerForm />

                {/* Developer Info */}
                <div className="mt-8 md:mt-16 pt-6 md:pt-8 border-t border-border-primary w-full flex flex-col items-center">
                    <p className="text-[10px] md:text-[11px] font-headline font-semibold uppercase tracking-widest text-[#8a8a8a] mb-4 md:mb-6">Developed by Andrés</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        <a href="https://github.com/Sanchez042004" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[#e2e2e2] opacity-70 hover:opacity-100 hover:text-[#5e6ad2] transition-all duration-300">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0C5.372 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                            <span className="text-[13px] font-mono">GitHub</span>
                        </a>
                        <a href="https://www.linkedin.com/in/andres-sanchez04/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[#e2e2e2] opacity-70 hover:opacity-100 hover:text-[#5e6ad2] transition-all duration-300">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            <span className="text-[13px] font-mono">LinkedIn</span>
                        </a>
                        <a href="https://asanchez-cv.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[#e2e2e2] opacity-70 hover:opacity-100 hover:text-[#5e6ad2] transition-all duration-300">
                            <span className="material-symbols-outlined !text-[20px]">language</span>
                            <span className="text-[13px] font-mono">Portfolio</span>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Hero;
