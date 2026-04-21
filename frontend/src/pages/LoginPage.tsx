import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="flex-grow flex items-center justify-center p-6 bg-bg page-transition overflow-hidden">
            <div className="w-full max-w-[380px] flex flex-col">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center mb-8">
                    <img src="/logo.png" alt="Knot.ly" className="h-[46px] w-auto" />
                </Link>
                
                {/* Headline */}
                <h1 className="text-[24px] font-semibold text-text-primary text-center mb-6 font-headline">Welcome back.</h1>
                
                {/* Form */}
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-danger-soft border border-danger/30 text-danger text-xs font-medium">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className="mb-3">
                        <input 
                            className="w-full bg-surface border border-border rounded-[6px] px-[14px] py-[10px] text-[14px] text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent focus:ring-0 transition-colors" 
                            id="email" 
                            placeholder="Email address" 
                            required 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    {/* Password */}
                    <div className="mb-5">
                        <div className="flex justify-end mb-1.5">
                            <Link className="text-[11px] text-accent hover:opacity-80 transition-opacity font-label" to="/forgot-password">Forgot password?</Link>
                        </div>
                        <input 
                            className="w-full bg-surface border border-border rounded-[6px] px-[14px] py-[10px] text-[14px] text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent focus:ring-0 transition-colors" 
                            id="password" 
                            placeholder="Password" 
                            required 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {/* Button */}
                    <button 
                        className="flex items-center justify-center w-full h-[38px] bg-text-primary text-bg font-medium text-[14px] rounded-[6px] hover:bg-white transition-colors duration-200 mb-6 disabled:opacity-50" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="size-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></span>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>
                
                {/* Footer */}
                <p className="text-center text-[13px] text-text-secondary">
                    Don't have an account? <Link className="text-accent hover:opacity-80 transition-opacity font-medium" to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
