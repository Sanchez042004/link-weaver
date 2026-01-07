import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark">
                <div className="max-w-md w-full text-center">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invalid Link</h1>
                    <p className="text-slate-600 dark:text-[#b9a69d] mb-8">This reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" title="Request a new link" className="text-primary font-bold">Request a new reset link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark page-transition">
            <div className="mb-12">
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            <div className="max-w-md w-full bg-white dark:bg-[#2c201a] rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-[#3f322c]">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
                    Set New Password
                </h1>
                <p className="text-slate-600 dark:text-[#b9a69d] text-sm text-center mb-8">
                    Choose a strong password to protect your account.
                </p>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="size-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>
                        <p className="text-slate-600 dark:text-[#b9a69d] mb-4 text-sm">
                            {message}
                        </p>
                        <p className="text-xs text-slate-400">Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* New Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-slate-900 dark:text-white text-xs font-medium" htmlFor="password">
                                New Password
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    className="form-input w-full rounded-lg border border-slate-300 dark:border-[#3f322c] bg-white dark:bg-[#2c201a] focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-4 pr-12 text-sm placeholder:text-slate-400 dark:placeholder:text-[#b9a69d] dark:text-white transition-colors"
                                    id="password"
                                    placeholder="Enter new password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="absolute right-4 text-slate-400 dark:text-[#b9a69d] hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-center select-none"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px] select-none">
                                        {showPassword ? 'visibility' : 'visibility_off'}
                                    </span>
                                </button>
                            </div>

                            {/* Restrictions list from SignupPage */}
                            {password !== '' && (
                                <div className="grid grid-cols-2 gap-y-1 mt-3 pb-2 border-b border-border-dark/30">
                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-[14px] ${isLengthValid ? 'text-green-500' : 'text-slate-400'}`}>
                                            {isLengthValid ? 'check_circle' : 'circle'}
                                        </span>
                                        <span className={`text-[10px] font-medium ${isLengthValid ? 'text-green-500' : 'text-slate-400'}`}>
                                            Min. 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-[14px] ${hasUppercase ? 'text-green-500' : 'text-slate-400'}`}>
                                            {hasUppercase ? 'check_circle' : 'circle'}
                                        </span>
                                        <span className={`text-[10px] font-medium ${hasUppercase ? 'text-green-500' : 'text-slate-400'}`}>
                                            One uppercase
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-[14px] ${hasNumber ? 'text-green-500' : 'text-slate-400'}`}>
                                            {hasNumber ? 'check_circle' : 'circle'}
                                        </span>
                                        <span className={`text-[10px] font-medium ${hasNumber ? 'text-green-500' : 'text-slate-400'}`}>
                                            One number
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-[14px] ${hasSpecialChar ? 'text-green-500' : 'text-slate-400'}`}>
                                            {hasSpecialChar ? 'check_circle' : 'circle'}
                                        </span>
                                        <span className={`text-[10px] font-medium ${hasSpecialChar ? 'text-green-500' : 'text-slate-400'}`}>
                                            One special char
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-slate-900 dark:text-white text-xs font-medium" htmlFor="confirm-password">
                                Confirm Password
                            </label>
                            <input
                                className="form-input w-full rounded-lg border border-slate-300 dark:border-[#3f322c] bg-white dark:bg-[#2c201a] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-sm placeholder:text-slate-400 dark:placeholder:text-[#b9a69d] dark:text-white transition-colors"
                                id="confirm-password"
                                placeholder="Repeat password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {confirmPassword !== '' && !isMatching && (
                                <p className="text-[10px] text-red-500 mt-1 font-medium">Passwords don't match</p>
                            )}
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
                            disabled={isLoading || !isMatching || !isLengthValid}
                        >
                            {isLoading ? (
                                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}
            </div>

            <p className="mt-8 text-slate-400 dark:text-[#54433b] text-xs">
                © {new Date().getFullYear()} Knot.ly URL Shortener.
            </p>
        </div>
    );
};

export default ResetPasswordPage;
