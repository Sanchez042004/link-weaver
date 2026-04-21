import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { usePasswordValidation } from '../hooks/usePasswordValidation';
import Input from '../components/ui/Input';

const SignupPage: React.FC = () => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const { isLengthValid, hasUppercase, hasNumber, hasSpecialChar, isValid } = usePasswordValidation(password);

    const isMatching = password === confirmPassword && confirmPassword !== '';
    const showMatchError = confirmPassword !== '' && !isMatching;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isValid) {
            setError('Password does not meet requirements');
            return;
        }

        setIsLoading(true);
        try {
            await register(username, email, password);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-6 bg-bg page-transition">
        <div className="w-full max-w-[380px] flex flex-col items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center justify-center mb-8">
                <img src="/logo.png" alt="Knot.ly" className="h-[46px] w-auto" />
            </Link>

            {isSuccess ? (
                <>
                    <div className="mb-8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[32px] text-accent">mark_email_read</span>
                    </div>

                    <h1 className="text-[24px] font-semibold tracking-[-0.03em] leading-[1.1] text-text-primary mb-2 font-headline">
                        Check your email.
                    </h1>

                    <p className="text-[13px] leading-relaxed text-text-secondary mb-10 max-w-[320px] text-center">
                        We sent a verification link to <span className="text-text-primary font-medium">{email}</span>. Please verify your account to continue.
                    </p>

                    <div className="mt-5 text-center">
                        <Link className="flex items-center justify-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors duration-200 font-medium" to="/login">
                            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                            Back to log in
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    {/* Headline */}
                    <h1 className="text-[24px] font-semibold text-text-primary text-center mb-6 font-headline">Create your account.</h1>

                    {/* Form */}
                    <form className="flex flex-col w-full" onSubmit={handleSubmit}>
                        <>
                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 flex items-center gap-2 p-3 rounded-[6px] bg-danger-soft border border-danger/30 text-danger text-xs font-medium">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {error}
                                </div>
                            )}

                            {/* Username */}
                            <div className="mb-3">
                                <Input
                                    id="username"
                                    placeholder="Username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <Input
                                    id="email"
                                    placeholder="Email address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <Input
                                    id="password"
                                    placeholder="Password (min. 8 characters)"
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
                                                One uppercase letter
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
                                                One special character
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-5">
                                <Input
                                    id="confirm-password"
                                    placeholder="Confirm password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    error={showMatchError ? 'Passwords do not match' : null}
                                />
                                {isMatching && (
                                    <div className="flex items-center gap-1.5 mt-1.5 px-1">
                                        <span className="material-symbols-outlined text-[13px] text-accent">check_circle</span>
                                        <span className="text-[10px] font-medium text-accent">Passwords match</span>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                className="flex items-center justify-center w-full h-[38px] bg-text-primary text-bg font-medium text-[14px] rounded-[6px] hover:bg-white transition-colors duration-200 mb-6 disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="size-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-[13px] text-text-secondary mt-6">
                        Already a member? <Link className="text-accent hover:opacity-80 transition-opacity font-medium" to="/login">Log in</Link>
                    </p>
                </>
            )}
        </div>
        </div>
    );
};

export default SignupPage;
