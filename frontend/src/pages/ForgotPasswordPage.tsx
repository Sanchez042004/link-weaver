import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const ForgotPasswordPage: React.FC = () => {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            await forgotPassword(email);
            setStatus('success');
            setMessage('If an account exists for this email, you will receive a reset link shortly.');
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark page-transition">
            <div className="mb-12">
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            <div className="max-w-md w-full bg-white dark:bg-[#2c201a] rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-[#3f322c]">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                    Forgot Password?
                </h1>
                <p className="text-slate-600 dark:text-[#b9a69d] text-sm text-center mb-8">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="size-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">mark_email_read</span>
                        </div>
                        <p className="text-slate-600 dark:text-[#b9a69d] mb-8 text-sm">
                            {message}
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex w-full items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-[#d14e0f] text-white font-bold transition-all shadow-lg shadow-primary/20"
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-slate-900 dark:text-white text-xs font-medium" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="form-input w-full rounded-lg border border-slate-300 dark:border-[#3f322c] bg-white dark:bg-[#2c201a] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-sm placeholder:text-slate-400 dark:placeholder:text-[#b9a69d] dark:text-white transition-colors"
                                id="email"
                                placeholder="name@company.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {status === 'error' && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {message}
                            </div>
                        )}

                        <button
                            className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-[#d14e0f] text-white font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        <Link to="/login" className="text-center text-sm text-primary hover:text-primary-dark font-medium mt-2">
                            I remember my password
                        </Link>
                    </form>
                )}
            </div>

            <p className="mt-8 text-slate-400 dark:text-[#54433b] text-xs">
                © {new Date().getFullYear()} Knot.ly URL Shortener.
            </p>
        </div>
    );
};

export default ForgotPasswordPage;
