import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<> ]/.test(password);

        if (password.length < 8 || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
            setError("Password does not meet all requirements");
            return;
        }

        setIsSubmitting(true);
        try {
            await register(username, email, password);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsSubmitting(false);
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
                            <span className="hidden sm:block text-sm font-medium text-slate-500 dark:text-slate-400">Already have an account?</span>
                            <Link to="/login" className="flex items-center justify-center rounded-lg h-10 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold transition-colors">
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 pt-24 relative overflow-hidden">
                <div className="w-full max-w-[480px] z-10 animate-fade-in-up">
                    <div className="mb-6 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white mb-2">Create an Account</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Get started for free. No credit card required.</p>
                    </div>

                    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-[#324467] shadow-xl p-6 sm:p-8">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        className="form-input w-full h-12 rounded-lg bg-white dark:bg-[#111722] border border-gray-300 dark:border-[#324467] text-slate-900 dark:text-white pl-4 pr-11 transition-all focus:ring-1 focus:ring-primary focus:border-primary"
                                        placeholder="e.g. johndoe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                    <div className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        className="form-input w-full h-12 rounded-lg bg-white dark:bg-[#111722] border border-gray-300 dark:border-[#324467] text-slate-900 dark:text-white pl-4 pr-11 transition-all focus:ring-1 focus:ring-primary focus:border-primary"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-input w-full h-12 rounded-lg bg-white dark:bg-[#111722] border border-gray-300 dark:border-[#324467] text-slate-900 dark:text-white pl-4 pr-11 transition-all focus:ring-1 focus:ring-primary focus:border-primary"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? "visibility" : "visibility_off"}
                                        </span>
                                    </button>
                                </div>
                                {passwordFocused && (
                                    <div className="mt-2 p-3 rounded-lg bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#324467]">
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Password must contain:</p>
                                        <ul className="space-y-1">
                                            <PasswordReq label="Minimum 8 characters" met={password.length >= 8} />
                                            <PasswordReq label="At least one uppercase letter" met={/[A-Z]/.test(password)} />
                                            <PasswordReq label="At least one lowercase letter" met={/[a-z]/.test(password)} />
                                            <PasswordReq label="At least one number" met={/[0-9]/.test(password)} />
                                            <PasswordReq label="At least one special character" met={/[!@#$%^&*(),.?":{}|<> ]/.test(password)} />
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Confirm Password</label>
                                <div className="relative group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-input w-full h-12 rounded-lg bg-white dark:bg-[#111722] border border-gray-300 dark:border-[#324467] text-slate-900 dark:text-white pl-4 pr-11 transition-all focus:ring-1 focus:ring-primary focus:border-primary"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onFocus={() => setConfirmPasswordFocused(true)}
                                        onBlur={() => setConfirmPasswordFocused(false)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showConfirmPassword ? "visibility" : "visibility_off"}
                                        </span>
                                    </button>
                                </div>
                                {confirmPasswordFocused && confirmPassword.length > 0 && (
                                    <div className="mt-2 text-xs flex items-center gap-2">
                                        {confirmPassword === password ? (
                                            <div className="text-green-500 font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">check_circle</span> Passwords match
                                            </div>
                                        ) : (
                                            <div className="text-red-500 font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">cancel</span> Passwords do not match
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>


                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 mt-2 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

const PasswordReq = ({ label, met }: { label: string, met: boolean }) => (
    <li className={`text-xs flex items-center gap-2 transition-colors ${met ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
        <span className={`material-symbols-outlined text-[14px] ${met ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
            {met ? 'check_circle' : 'circle'}
        </span>
        {label}
    </li>
);

export default SignupPage;
