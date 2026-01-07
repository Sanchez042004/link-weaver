import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-1 w-full min-h-screen page-transition">
            {/* Left Side: Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-10 lg:p-16 xl:p-20 relative z-10 bg-background-light dark:bg-background-dark min-h-screen">
                {/* Logo Header */}
                <div className="mb-auto">
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>

                {/* Main Form Content Container */}
                <div className="my-auto py-12 max-w-[480px] w-full mx-auto">
                    {/* Page Heading */}
                    <div className="mb-6 flex flex-col gap-2">
                        <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 dark:text-[#b9a69d] text-base font-normal leading-normal">
                            Log in to manage your links and analytics.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Email Field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-700 dark:text-white text-sm font-medium leading-normal">Email address</label>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-slate-300 dark:border-[#54433b] bg-white dark:bg-surface-dark focus:border-primary h-11 placeholder:text-slate-400 dark:placeholder:text-[#b9a69d] px-[15px] text-sm font-normal transition-colors"
                                placeholder="name@company.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-slate-700 dark:text-white text-sm font-medium leading-normal">Password</label>
                                <Link to="/forgot-password" global-tag="" className="text-primary hover:text-primary/80 text-xs font-medium">Forgot Password?</Link>
                            </div>
                            <div className="flex w-full flex-1 items-stretch rounded-xl border border-slate-300 dark:border-[#54433b] bg-white dark:bg-surface-dark focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden">
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none border-none bg-transparent text-slate-900 dark:text-white focus:outline-0 focus:ring-0 h-11 placeholder:text-slate-400 dark:placeholder:text-[#b9a69d] px-[15px] text-sm font-normal"
                                    placeholder="Enter your password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div
                                    className="flex items-center justify-center pr-[15px] pl-2 cursor-pointer group"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-slate-400 dark:text-[#b9a69d] group-hover:text-primary transition-colors text-[20px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d94f0e] transition-colors shadow-lg shadow-primary/20"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                'Log In'
                            )}
                        </button>

                        {/* Footer Sign Up */}
                        <div className="flex justify-center mt-2">
                            <p className="text-slate-500 dark:text-[#b9a69d] text-base">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="mt-auto pt-8 text-xs text-slate-400 dark:text-[#54433b]">
                    © 2023 Knot.ly Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side: Decorative Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#181311] items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-background-dark z-10 opacity-70"></div>
                    <div
                        className="w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfXgfQiswm97we5CRw1Tbiu2YrE7TUBkI6g0fWf958Jm7AJNz1oKVANrO_hne5BRXEoegud5AGUAPBSO8pY7wEeFticmrXrGzIgNFD4J_RzBRKTcBBStevXHTTPCvZMf9G8SrmIyVm76HeE5x0fatFd4Sq5YlLSDBlneDdLBYB32fgiovvC3AEd2sLAUEzpOhGFzym4YTFIBeNHOR3LHh3y-6DgphpmeMgRl327pYQxdn2sBAf9seZKNE_knxJeQuMebK_YVr_fY9g")' }}
                    >
                    </div>
                    <div className="absolute inset-0 bg-[url(\'https://www.transparenttextures.com/patterns/cubes.png\')] opacity-10 z-0"></div>
                </div>

                {/* Floating Content Card */}
                <div className="relative z-20 max-w-md p-10 bg-background-dark/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                    <div className="flex items-start gap-4 mb-4">
                        <span className="material-symbols-outlined text-primary text-4xl">all_inclusive</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 leading-tight">Shorten, Share, and Analyze.</h3>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Seamlessly connect your audience with your content. The most powerful link management tool for modern creators.
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="flex -space-x-3">
                            <img alt="User avatar 1" className="w-10 h-10 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaW75yFQPJkVv70ziIBR74VYiCTyxB3HXNGLd7N9rgNP4Q65Kmd1nIIFaEWtrQk1Yd_OJqq3rNWaoR9sXxaWgvMqwf19XlxCnE42BM4LWTkZED3R6bFv0fka3lmuJP5Oxkxi73bUjd4Z5Zq_ktS4weBZ4hFlntdER6ekukuiU2jel9Xb3XkgmLsLilgYwekJp4SgKBMcUGjgfR9XpjqqBp_Ef_d7kmZYmIP2M6aNHMSlD0fyr7qxIAsHavnWhmP5ReGxLEfH97A_dl" />
                            <img alt="User avatar 2" className="w-10 h-10 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw8fUhWut1TS1-UGGDTwiWKBJ0-HqA25vHHNNK4Xc_NsPz307zprsirnIRksGRPbhUjXaFfgQvYoB_AlBrscPB3boVUkJAJNTbHWOjy_q0yD4rWES5Tzgsfbe_4gcE5s8q367C9rPZw36YDwGRHdW-7DUkThY7JW2nxHMfN_ZYWoJtedYujHaPs0caxahJW34Y86mjHIlGfzLAXUDn-dEzG0O-2rqAIEkweiZoDcnUDHQ0Bh9MqhOdzobfzwMXFw4jy8Q1HUhre3yz" />
                            <img alt="User avatar 3" className="w-10 h-10 rounded-full border-2 border-background-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJRMDcGkVmdino3909C2M9K4CcZN21rTEg6MbmMeMj5NH7rzMRMf0gwTj0VNYw1xKv2mw1pEDBN0rXVH0bhX2Wh3G7OYp6ffVSQ_DhM0L7m6Z7VaaKcMTijiC1Gi8RjXVpIQhTmZYkb6HT3Jkb88Qi40MqPrhHotEZLXXKqm-qWhcj8KaLwEb6FGZtWk8mCwINIsbwSf5NXOaSHFIKRspNLsAscenkwkIVlRMFHQtnB_qY8DvLyp66NIQAarN44q46syy8lzKLXOon" />
                        </div>
                        <p className="text-white/60 text-sm font-medium">Trusted by 10k+ creators</p>
                    </div>
                </div>

                {/* Decorative SVG Element */}
                <svg className="absolute bottom-0 right-0 w-[600px] h-[600px] text-primary/5 pointer-events-none translate-x-1/3 translate-y-1/3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,31.2C59,40.9,47.1,47.4,35.7,53.8C24.3,60.2,13.4,66.5,1.4,64.1C-10.6,61.7,-23.7,50.6,-36.8,40.7C-49.9,30.8,-63,22.1,-69.5,9.6C-76,-2.9,-75.9,-19.2,-67.9,-32.1C-59.9,-45,-44,-54.5,-29.1,-61.3C-14.2,-68.1,0.3,-72.1,15.2,-74.6C30.1,-77.1,45.4,-78.1,44.7,-76.4Z" fill="currentColor" transform="translate(100 100)" />
                </svg>
            </div>
        </div>
    );
};

export default LoginPage;
