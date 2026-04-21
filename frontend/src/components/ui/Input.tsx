import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | null;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-[11px] font-label font-bold text-text-secondary uppercase tracking-widest mb-2 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-surface border border-border rounded-[6px] px-[14px] py-[10px] text-[14px] text-text-primary placeholder-text-disabled focus:outline-none focus:border-accent focus:ring-0 transition-colors ${
                    error ? 'border-danger focus:border-danger' : ''
                } ${className}`}
                {...props}
            />
            {error && (
                <p className="text-[10px] font-medium text-danger mt-1.5 ml-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
