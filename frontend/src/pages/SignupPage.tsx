import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const SignupPage: React.FC = () => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const isLengthValid = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isMatching = password === confirmPassword && confirmPassword !== '';
    const showMatchError = confirmPassword !== '' && !isMatching;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        try {
            await register(username, email, password);
            setIsSuccess(true);
            // Ya no navegamos inmediatamente al dashboard, esperamos verificación o mostramos mensaje
            // navigate('/dashboard'); 
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row w-full page-transition">
            {/* Left Panel: Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-10 lg:p-16 xl:p-20 relative z-10 bg-background-light dark:bg-background-dark min-h-screen">
                {/* Header / Logo */}
                <div className="mb-auto">
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col justify-center max-w-md w-full mx-auto my-auto py-8">
                    <div className="mb-4">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-slate-900 dark:text-white">
                            Start shortening.<br />Start connecting.
                        </h1>
                        <p className="text-slate-600 dark:text-[#b9a69d] text-xs leading-relaxed">
                            Unlock advanced analytics and seamless link management for your team.
                        </p>
                    </div>

                    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                        {isSuccess ? (
                            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-primary/10 border border-primary/20 text-center animate-in zoom-in duration-300">
                                <span className="material-symbols-outlined text-4xl text-primary">mark_email_read</span>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check your email</h3>
                                    <p className="text-xs text-slate-600 dark:text-[#b9a69d]">
                                        We've sent a verification link to <b>{email}</b>. Please verify your account to continue.
                                    </p>
                                </div>
                                <Link to="/login" className="text-primary font-bold text-xs hover:underline mt-2">
                                    Back to Login
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Username Field */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-slate-900 dark:text-white text-xs font-medium" htmlFor="username">
                                        Username
                                    </label>
                                    <input
                                        className="form-input w-full rounded-lg border border-slate-300 dark:border-[#3f322c] bg-white dark:bg-[#2c201a] focus:border-primary focus:ring-1 focus:ring-primary h-10 px-4 text-sm placeholder:text-slate-400 dark:placeholder:text-[#b9a69d] dark:text-white transition-colors"
                                        id="username"
                                        placeholder="johndoe"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-slate-900 dark:text-white text-xs font-medium" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        className="form-input w-full rounded-lg border border-slate-300 dark:border-[#3f322c] bg-white dark:bg-[#2c201a] focus:border-primary focus:ring-1 focus:ring-primary h-10 px-4 text-sm placeholder:text-slate-400 dark:placeholder:text-[#b9a69d] dark:text-white transition-colors"
                                        id="email"
                                        placeholder="name@company.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-slate-900 dark:text-white text-xs font-medium" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            className="form-input w-full rounded-lg border border-slate-300 dark:border-[#3f322c] bg-white dark:bg-[#2c201a] focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-4 pr-12 text-sm placeholder:text-slate-400 dark:placeholder:text-[#b9a69d] dark:text-white transition-colors"
                                            id="password"
                                            placeholder="At least 8 characters"
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
                                    {password !== '' && (
                                        <div className="grid grid-cols-2 gap-y-1 mt-2">
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
                                                    One uppercase letter
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
                                                    One special character
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-slate-900 dark:text-white text-xs font-medium" htmlFor="confirm-password">
                                        Confirm Password
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            className="form-input w-full rounded-lg border border-slate-300 dark:border-[#3f322c] bg-white dark:bg-[#2c201a] focus:border-primary focus:ring-1 focus:ring-primary h-10 pl-4 pr-12 text-sm placeholder:text-slate-400 dark:placeholder:text-[#b9a69d] dark:text-white transition-colors"
                                            id="confirm-password"
                                            placeholder="Re-enter password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            className="absolute right-4 text-slate-400 dark:text-[#b9a69d] hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-center select-none"
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <span className="material-symbols-outlined text-[20px] select-none">
                                                {showConfirmPassword ? 'visibility' : 'visibility_off'}
                                            </span>
                                        </button>
                                    </div>
                                    {showMatchError && (
                                        <div className="flex items-center gap-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <span className="material-symbols-outlined text-[14px] text-red-500">error</span>
                                            <span className="text-[10px] font-medium text-red-500">
                                                Passwords do not match
                                            </span>
                                        </div>
                                    )}
                                    {isMatching && (
                                        <div className="flex items-center gap-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
                                            <span className="text-[10px] font-medium text-green-500">
                                                Passwords match
                                            </span>
                                        </div>
                                    )}
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
                                    className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-[#d14e0f] text-white text-sm font-bold transition-all shadow-lg shadow-primary/20"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        'Create Free Account'
                                    )}
                                </button>
                            </>
                        )}
                    </form>

                    <p className="mt-3 text-center text-slate-600 dark:text-[#b9a69d] text-xs">
                        Already a member?{' '}
                        <Link to="/login" className="text-primary hover:text-[#d14e0f] font-bold transition-colors">
                            Log in
                        </Link>
                    </p>
                </div >

                {/* Footer placeholder to balance flex space */}
                < div className="mt-auto pt-4 text-xs text-slate-400 dark:text-[#54433b]" >
                    © {new Date().getFullYear()} Knot.ly URL Shortener.Made with ❤️ by Andrés.
                </div >
            </div >

            {/* Right Panel: Visual Section */}
            < div className="hidden lg:flex lg:w-1/2 relative bg-[#2c201a] overflow-hidden" >
                {/* Background Image */}
                < div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80 mix-blend-screen"
                    style={{
                        backgroundImage:
                            "url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuBdV5el7JfcrwecoyMNXytQrU_UNwFYMnDKIHD3dsFzfyYN5wTaBDsBfl8rlPvyGSyhLr1W-KRa-sJMTHcBSLkQMfaBmfsP7VRRRSGefwjRU1w0oot32V7O3Eln8wxIGf1IWkTmwdXdsHw1kWOCkNrlKCflmXWd-18TK7Xf666blvS3KvY5MhTSM-Tt_uiZSGeGzgFNzAY4XDCLCq5oHytQFb7MFgnw2vCEdXo2BI8gp7a-DbQV7zeQZ6Gp9XWT0NrWZQPgTDlAarUL\')",
                    }}
                ></div >

                {/* Gradient Overlay for better integration */}
                < div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark/20 opacity-90" ></div >
                <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent"></div>

                {/* Decorative Elements */}
                <div className="absolute bottom-10 left-10 right-10 z-20">
                    <div className="glass-panel backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl max-w-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                            <span className="text-white font-bold text-sm tracking-wide">REAL-TIME ANALYTICS</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">
                            "Knot.ly transformed how we track our campaigns. The data flow is incredible."
                        </p>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default SignupPage;
