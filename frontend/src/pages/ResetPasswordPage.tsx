import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // Validaciones en tiempo real
    const isLengthValid = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isMatching = password === confirmPassword && confirmPassword !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setStatus('error');
            setMessage('No reset token found.');
            return;
        }

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            await resetPassword(password, token);
            setStatus('success');
            setMessage('Your password has been successfully reset.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Failed to reset password. The link might be expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
                <div className="w-full max-w-[380px] flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-[32px] text-danger mb-6">error</span>
                    <h1 className="text-[24px] font-semibold text-text-primary mb-2 font-headline">Invalid Link</h1>
                    <p className="text-[13px] text-text-secondary mb-8">This reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" className="text-accent hover:opacity-80 transition-opacity text-[13px] font-medium">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg page-transition">
            <div className="w-full max-w-[380px] flex flex-col items-center text-center">
                {/* Logo */}
                <div className="mb-8">
                    <Link to="/" className="transition-opacity">
                        <img src="/logo.png" alt="Knotly" className="h-[44px] w-auto mx-auto" />
                    </Link>
                </div>

                {status === 'success' ? (
                    <>
                        <div className="mb-6 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[32px] text-accent">check_circle</span>
                        </div>
                        <h1 className="text-[24px] font-semibold tracking-[-0.03em] leading-[1.1] text-text-primary mb-2 font-headline">
                            Password reset.
                        </h1>
                        <p className="text-[13px] leading-relaxed text-text-secondary mb-6 max-w-[320px]">
                            {message}
                        </p>
                        <p className="text-[11px] text-text-disabled">Redirecting to login...</p>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <h1 className="text-[24px] font-semibold text-text-primary leading-[1.1] tracking-[-0.03em] mb-2 font-headline">Set new password</h1>
                            <p className="text-[13px] text-text-secondary leading-relaxed max-w-[300px] mx-auto">
                                Choose a strong password to protect your account.
                            </p>
                        </div>

                        <form className="w-full space-y-3" onSubmit={handleSubmit}>
                            {/* New Password */}
                            <div className="w-full">
                                <input
                                    className="w-full bg-surface border border-border rounded-[6px] px-[14px] py-[10px] text-[14px] text-text-primary placeholder-text-disabled focus:ring-0 focus:border-accent transition-colors focus:outline-none"
                                    id="password"
                                    placeholder="New password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {password !== '' && (
                                    <div className="grid grid-cols-2 gap-y-1.5 mt-2.5 px-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`material-symbols-outlined text-[13px] ${isLengthValid ? 'text-accent' : 'text-text-disabled'}`}>
                                                {isLengthValid ? 'check_circle' : 'circle'}
                                            </span>
                                            <span className={`text-[10px] font-medium ${isLengthValid ? 'text-accent' : 'text-text-disabled'}`}>
                                                Min. 8 characters
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`material-symbols-outlined text-[13px] ${hasUppercase ? 'text-accent' : 'text-text-disabled'}`}>
                                                {hasUppercase ? 'check_circle' : 'circle'}
                                            </span>
                                            <span className={`text-[10px] font-medium ${hasUppercase ? 'text-accent' : 'text-text-disabled'}`}>
                                                One uppercase
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`material-symbols-outlined text-[13px] ${hasNumber ? 'text-accent' : 'text-text-disabled'}`}>
                                                {hasNumber ? 'check_circle' : 'circle'}
                                            </span>
                                            <span className={`text-[10px] font-medium ${hasNumber ? 'text-accent' : 'text-text-disabled'}`}>
                                                One number
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`material-symbols-outlined text-[13px] ${hasSpecialChar ? 'text-accent' : 'text-text-disabled'}`}>
                                                {hasSpecialChar ? 'check_circle' : 'circle'}
                                            </span>
                                            <span className={`text-[10px] font-medium ${hasSpecialChar ? 'text-accent' : 'text-text-disabled'}`}>
                                                One special char
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="w-full">
                                <input
                                    className="w-full bg-surface border border-border rounded-[6px] px-[14px] py-[10px] text-[14px] text-text-primary placeholder-text-disabled focus:ring-0 focus:border-accent transition-colors focus:outline-none"
                                    id="confirm-password"
                                    placeholder="Confirm password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                {confirmPassword !== '' && !isMatching && (
                                    <p className="text-[10px] text-danger mt-1.5 px-1 font-medium text-left">Passwords don't match</p>
                                )}
                                {isMatching && (
                                    <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                        <span className="material-symbols-outlined text-[13px] text-accent">check_circle</span>
                                        <span className="text-[10px] font-medium text-accent">Passwords match</span>
                                    </div>
                                )}
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
                                disabled={isLoading || !isMatching || !isLengthValid}
                            >
                                {isLoading ? (
                                    <span className="size-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></span>
                                ) : (
                                    'Reset password'
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

export default ResetPasswordPage;
