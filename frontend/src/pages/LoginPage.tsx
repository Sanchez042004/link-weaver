import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col antialiased selection:bg-primary/30">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-gray-200 dark:border-[#232f48] bg-white/50 dark:bg-[#111722]/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-3">
                            <Logo />
                        </Link>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:block text-sm font-medium text-slate-500 dark:text-slate-400">Don't have an account?</span>
                            <Link to="/signup" className="flex items-center justify-center rounded-lg h-10 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 pt-28 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none opacity-50 dark:opacity-20"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[96px] pointer-events-none opacity-50 dark:opacity-20"></div>

                <div className="w-full max-w-[440px] flex flex-col gap-8 z-10">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome Back</h1>
                        <p className="text-gray-500 dark:text-slate-400 text-base">Log in to manage your shortened URLs and analytics.</p>
                    </div>

                    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-gray-900 dark:text-white text-sm font-medium ml-1">Email address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <input
                                    type="email"
                                    className="form-input w-full rounded-lg h-12 py-3 pl-10 pr-4 text-sm bg-white dark:bg-[#192233] border border-gray-300 dark:border-[#324467] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-gray-900 dark:text-white text-sm font-medium">Password</label>
                                <a href="#" className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">Forgot Password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-input w-full rounded-lg h-12 py-3 pl-10 pr-12 text-sm bg-white dark:bg-[#192233] border border-gray-300 dark:border-[#324467] text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? "visibility" : "visibility_off"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                "Log In"
                            )}
                        </button>
                    </form>
                </div>
            </main>

            <footer className="py-6 text-center">
                <p className="text-xs text-gray-400 dark:text-[#5f6e8c]">© {new Date().getFullYear()} Knot.ly.</p>
            </footer>
        </div>
    );
};

export default LoginPage;
