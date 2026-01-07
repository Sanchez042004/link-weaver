import { Link } from "react-router-dom";

export const CallToAction = () => {
    return (
        <section className="py-24 bg-[#2e201a]">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
                    Ready to tie the knot?
                </h2>
                <p className="text-[#9ca3af] text-lg mb-10 max-w-2xl mx-auto">
                    Join to marketers and creators who trust Knot.ly with their links.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/signup"
                        className="h-12 px-8 rounded-full bg-[#ec5b13] hover:bg-[#ff6b26] text-white font-bold text-lg transition-all shadow-[0_4px_14px_0_rgba(236,91,19,0.39)] flex items-center justify-center min-w-[200px]"
                    >
                        Get Started for Free
                    </Link>

                </div>
            </div>
        </section>
    );
};
