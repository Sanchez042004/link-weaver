import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg page-transition">
            <div className="w-full max-w-[380px] flex flex-col items-center text-center">

                {status === 'success' ? (
                    <>
                        {/* Success: Check your email */}
                        <div className="mb-8 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[32px] text-accent">mail</span>
                        </div>

                        <h1 className="text-[24px] font-semibold tracking-[-0.03em] leading-[1.1] text-text-primary mb-2 font-headline">
                            Check your email.
                        </h1>

                        <p className="text-[13px] leading-relaxed text-text-secondary mb-10 max-w-[320px]">
                            We sent a reset link to <span className="text-text-primary font-medium">{email}</span>. Check your inbox.
                        </p>

                        <div className="mb-5">
                            <p className="text-[13px] text-text-secondary">
                                Didn't receive it? Check your spam folder or{' '}
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-accent hover:opacity-80 transition-colors"
                                >
                                    try again
                                </button>
                            </p>
                        </div>

                        <div className="mt-5">
                            <Link className="flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium" to="/login">
                                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                                Back to log in
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Request Form */}
                        <div className="mb-8">
                            <Link to="/" className="hover:opacity-80 transition-opacity">
                                <span className="text-[15px] font-medium text-text-primary tracking-tighter lowercase font-mono">knot.ly</span>
                            </Link>
                        </div>

                        <div className="text-center mb-6">
                            <h1 className="text-[24px] font-semibold text-text-primary leading-[1.1] tracking-[-0.03em] mb-2 font-headline">Forgot your password?</h1>
                            <p className="text-[13px] text-text-secondary leading-relaxed max-w-[300px] mx-auto">
                                Enter your email and we'll send you a reset link.
                            </p>
                        </div>

                        <form className="w-full space-y-3" onSubmit={handleSubmit}>
                            <div className="w-full">
                                <input
                                    className="w-full bg-surface border border-border rounded-[6px] px-[14px] py-[10px] text-[14px] text-text-primary placeholder-text-disabled focus:ring-0 focus:border-accent transition-colors font-mono focus:outline-none"
                                    placeholder="name@company.com"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 p-3 rounded-[6px] bg-danger-soft border border-danger/30 text-danger text-xs font-medium text-left">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {message}
                                </div>
                            )}

                            <button
                                className="flex items-center justify-center w-full h-[38px] bg-text-primary hover:bg-white text-bg font-medium text-[14px] rounded-[6px] transition-colors disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="size-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></span>
                                ) : (
                                    'Send reset link'
                                )}
                            </button>
                        </form>

                        <div className="mt-5 text-center">
                            <Link className="group flex items-center justify-center gap-1.5 text-[13px] text-text-secondary hover:text-accent transition-colors" to="/login">
                                <span className="text-[12px] group-hover:-translate-x-0.5 transition-transform">←</span>
                                Back to log in
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
