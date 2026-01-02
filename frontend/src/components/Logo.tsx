import React from 'react';

const Logo: React.FC = () => {
    return (
        <div className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Knot.ly</span>
        </div>
    );
};

export default Logo;
