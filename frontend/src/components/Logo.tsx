import React from 'react';

const Logo: React.FC = () => {
    return (
        <div className="flex items-center gap-4 select-none">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2e1d15] text-primary shadow-inner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path>
                </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-display">Knot.ly</span>
        </div>
    );
};

export default Logo;
