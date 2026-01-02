import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../features/landing/components/Footer';

const FeaturesPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col font-display bg-white dark:bg-[#0B1019] text-slate-900 dark:text-white">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 mb-6">
                            Simple Tools. Big Impact.
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            Knot.ly isn't just about making links shorter. It's about making your life easier and your sharing smarter.
                        </p>
                    </div>
                </div>

                {/* Features List */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="space-y-24">
                        {/* Feature 1 */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 order-2 md:order-1">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-primary text-4xl">link</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Clean & Tidy Links</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Long, ugly web addresses are messy and hard to read. We turn them into short, neat links that look professional and are easy to share in emails, texts, or social media bios.
                                </p>
                            </div>
                            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-3xl h-64 md:h-80 w-full order-1 md:order-2 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-9xl">content_cut</span>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-3xl h-64 md:h-80 w-full flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-9xl">visibility</span>
                            </div>
                            <div className="flex-1">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-4xl">travel_explore</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">See Who's Clicking</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Wondering if your friends opened that link? We show you exactly how many people clicked, where they are from, and what device they used (phone or computer). No technical setup required.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 order-2 md:order-1">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-4xl">fingerprint</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Make It Yours</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Customize your links to say exactly what you want. Instead of random letters, create <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded mx-1">/wedding-photos</span> or <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded mx-1">/my-portfolio</span>. It's personal and memorable.
                                </p>
                            </div>
                            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-3xl h-64 md:h-80 w-full order-1 md:order-2 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-9xl">edit</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="py-24 bg-slate-50 dark:bg-background-dark/50 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to try it out?</h2>
                        <a href="/signup" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary hover:bg-blue-600 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-105">
                            Get Started for Free
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FeaturesPage;
