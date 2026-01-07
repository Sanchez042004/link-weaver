import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const alias = searchParams.get('alias');

    return (
        <div className="min-h-screen bg-surface-dark flex flex-col items-center justify-center p-4 bg-pattern relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-lg text-center space-y-8">
                {/* 404 Visual */}
                <div className="relative">
                    <h1 className="text-[150px] font-black text-white/5 font-display leading-none select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-24 bg-surface-light border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-950/20 rotate-12 group hover:rotate-0 transition-transform duration-500">
                            <span className="material-symbols-outlined text-5xl text-primary animate-pulse">link_off</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white font-display">
                        {alias ? 'Link not found' : 'Page not found'}
                    </h2>
                    <p className="text-slate-400 text-lg font-body max-w-md mx-auto">
                        {alias
                            ? `The link with alias "${alias}" doesn't exist or has expired.`
                            : "The page you're looking for doesn't exist or has been moved."}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        to="/"
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                    >
                        <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        Go Home
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        Create your own link
                    </Link>
                </div>
            </div>

            {/* Subtle Footer Decor */}
            <div className="absolute bottom-8 text-white/20 font-medium tracking-widest text-xs uppercase select-none">
                Link Weaver • Redefining Connections
            </div>
        </div>
    );
};

export default NotFoundPage;
