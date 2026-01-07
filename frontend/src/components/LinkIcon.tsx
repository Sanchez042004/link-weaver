import React, { useState } from 'react';
import { getDomain } from '../utils/url.utils';

interface LinkIconProps {
    url: string;
    className?: string;
}

const LinkIcon: React.FC<LinkIconProps> = ({ url, className = "size-10" }) => {
    const domain = getDomain(url);
    const [error, setError] = useState(false);

    // Using Google Favicon Service as it's reliable and provides high-quality icons
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    return (
        <div className={`${className} rounded-xl bg-slate-800/40 flex items-center justify-center border border-slate-700/50 overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-all duration-300`}>
            {!error && domain ? (
                <img
                    src={faviconUrl}
                    alt={domain}
                    className="w-1/2 h-1/2 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110"
                    onError={() => setError(true)}
                />
            ) : (
                <span className="material-symbols-outlined text-slate-500 text-[20px]">public</span>
            )}
        </div>
    );
};

export default LinkIcon;
