import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg page-transition">
            <div className="w-full max-w-[380px] flex flex-col items-center text-center">
                {/* Logo */}
                <div className="mb-8">
                    <Link to="/" className="hover:opacity-80 transition-opacity">
                        <span className="text-[15px] font-medium text-text-primary tracking-tighter lowercase font-mono">knot.ly</span>
                    </Link>
                </div>

                <div className="mb-6 flex items-center justify-center">
                    {status === 'loading' && (
                        <span className="size-8 border-2 border-border border-t-text-primary rounded-full animate-spin"></span>
                    )}
                    {status === 'success' && (
                        <span className="material-symbols-outlined text-[32px] text-accent">check_circle</span>
                    )}
                    {status === 'error' && (
                        <span className="material-symbols-outlined text-[32px] text-danger">error</span>
                    )}
                </div>

                <h1 className="text-[24px] font-semibold text-text-primary mb-2 font-headline tracking-[-0.03em] leading-[1.1]">
                    {status === 'loading' && 'Verifying Email'}
                    {status === 'success' && 'Email Verified!'}
                    {status === 'error' && 'Verification Failed'}
                </h1>

                <p className="text-[13px] leading-relaxed text-text-secondary mb-10 max-w-[320px]">
                    {message}
                </p>

                {status !== 'loading' && (
                    <Link
                        to="/login"
                        className="flex items-center justify-center w-full h-[38px] bg-text-primary text-bg font-medium text-[14px] rounded-[6px] hover:bg-white transition-colors duration-200"
                    >
                        Go to login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
