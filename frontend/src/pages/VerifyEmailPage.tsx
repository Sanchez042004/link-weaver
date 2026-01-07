import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const VerifyEmailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { verifyEmail } = useAuth();
    const token = searchParams.get('token');
    const calledOnce = React.useRef(false);

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verify = async () => {
            if (calledOnce.current) return;
            calledOnce.current = true;

            if (!token) {
                setStatus('error');
                setMessage('No verification token found.');
                return;
            }

            try {
                await verifyEmail(token);
                setStatus('success');
                setMessage('Your email has been verified successfully!');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || 'Verification failed. The link might be expired.');
            }
        };

        verify();
    }, [token, verifyEmail]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark page-transition">
            <div className="mb-12">
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            <div className="max-w-md w-full bg-white dark:bg-[#2c201a] rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-[#3f322c] text-center">
                <div className="mb-6 flex justify-center">
                    {status === 'loading' && (
                        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    )}
                    {status === 'success' && (
                        <div className="size-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="size-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl">error</span>
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {status === 'loading' && 'Verifying Email'}
                    {status === 'success' && 'Email Verified!'}
                    {status === 'error' && 'Verification Failed'}
                </h1>

                <p className="text-slate-600 dark:text-[#b9a69d] mb-8">
                    {message}
                </p>

                {status !== 'loading' && (
                    <Link
                        to="/login"
                        className="inline-flex w-full items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-[#d14e0f] text-white font-bold transition-all shadow-lg shadow-primary/20"
                    >
                        Go to Login
                    </Link>
                )}
            </div>

            <p className="mt-8 text-slate-400 dark:text-[#54433b] text-xs">
                © {new Date().getFullYear()} Knot.ly URL Shortener.
            </p>
        </div>
    );
};

export default VerifyEmailPage;
