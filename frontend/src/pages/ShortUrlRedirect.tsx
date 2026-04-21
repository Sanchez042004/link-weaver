import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShortUrlRedirect: React.FC = () => {
    const { alias } = useParams<{ alias: string }>();

    useEffect(() => {
        if (alias && alias.toLowerCase() !== '404') {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const serverBaseUrl = apiUrl.replace(/\/api$/, '');

            // Redirigir al backend tras un breve delay para que se aprecie la marca
            const timer = setTimeout(() => {
                window.location.href = `${serverBaseUrl}/${alias}`;
            }, 1800);

            return () => clearTimeout(timer);
        }
    }, [alias]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[#e2e2e2] relative overflow-hidden font-inter">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#5e6ad2]/10 via-transparent to-transparent"></div>
            </div>
 
            <div className="relative z-10 flex flex-col items-center gap-16">
                {/* Logo Group with Border Beam */}
                <div className="relative">
                    {/* The Border Beam Container */}
                    <div className="relative size-24 bg-[#0a0a0a] rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden group">
                        {/* The Beam Effect */}
                        <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_30%,#5e6ad2_50%,transparent_70%,transparent_100%)] animate-[spin_3s_linear_infinite]"></div>
                        
                        {/* Inner Mask to keep border thin */}
                        <div className="absolute inset-[1.5px] bg-[#0a0a0a] rounded-[14px] z-10"></div>

                        {/* The Logo */}
                        <img 
                            src="/logo-imagen.png" 
                            alt="Knotly" 
                            className="w-12 h-auto relative z-20 opacity-95 drop-shadow-[0_0_15px_rgba(94,106,210,0.4)]" 
                        />
                    </div>
                </div>

                {/* Refined Status Text */}
                <div className="flex flex-col items-center gap-4">
                    <p className="text-[11px] font-medium tracking-[0.5em] uppercase text-[#e2e2e2] opacity-80">
                        Redirecting to destination
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShortUrlRedirect;
