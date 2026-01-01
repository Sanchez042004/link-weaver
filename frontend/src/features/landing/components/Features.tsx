import React from 'react';

const Features: React.FC = () => {
    return (
        <div id="features" className="w-full bg-slate-50 dark:bg-[#0B1019] border-t border-slate-200 dark:border-slate-800 scroll-mt-24 min-h-[85vh] flex flex-col justify-center py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why use Knot.ly?</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">More than just a link shortener. A complete platform to manage your links and understand your audience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 p-8 rounded-2xl hover:border-primary/50 transition-colors group">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-primary text-2xl">monitoring</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Real-time Analytics</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Track clicks, geographic data, and referral sources in real-time. Know exactly who is clicking your links.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 p-8 rounded-2xl hover:border-primary/50 transition-colors group">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-purple-500 text-2xl">edit_square</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Custom Aliases</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Ditch the random characters. Create branded, memorable links like <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">knotly.vercel.app/sale</span> that stand out.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 p-8 rounded-2xl hover:border-primary/50 transition-colors group">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-emerald-500 text-2xl">verified_user</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Enterprise Reliability</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Built on a global edge network with 99.9% uptime guarantee. Your links will always work, everywhere.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
