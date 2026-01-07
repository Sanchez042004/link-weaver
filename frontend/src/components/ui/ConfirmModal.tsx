import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    verificationValue?: string;
    verificationPlaceholder?: string;
    isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info',
    verificationValue,
    verificationPlaceholder,
    isLoading = false
}) => {
    const [inputValue, setInputValue] = useState('');

    // Reset input when modal closes
    useEffect(() => {
        if (!isOpen) {
            setInputValue('');
        }
    }, [isOpen]);

    const isVerified = verificationValue ? inputValue === verificationValue : true;

    const colors = {
        danger: 'bg-red-500 hover:bg-red-600 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)]',
        warning: 'bg-orange-500 hover:bg-orange-600 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]',
        info: 'bg-primary hover:bg-orange-600 shadow-[0_4px_14px_0_rgba(236,91,19,0.39)]'
    };

    const iconColors = {
        danger: 'text-red-400',
        warning: 'text-orange-400',
        info: 'text-primary'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                    <div className={`p-2 bg-surface-highlight rounded-lg flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined text-[24px] ${iconColors[type]}`}>
                            {type === 'danger' ? 'report' : type === 'warning' ? 'warning' : 'help'}
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-300 text-sm leading-relaxed">{message}</p>
                    </div>
                </div>

                {verificationValue && (
                    <div className="bg-surface-highlight/30 p-4 rounded-xl border border-border-dark/50">
                        <p className="text-[11px] text-slate-500 mb-2 tracking-wider font-bold">
                            Please type <span className="text-white select-all">{verificationValue}</span> to confirm
                        </p>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={verificationPlaceholder || "Type here..."}
                            className="w-full bg-surface-dark border border-border-dark/50 rounded-lg h-10 px-3 text-white text-sm focus:border-primary/50 transition-colors focus:ring-0"
                        />
                    </div>
                )}

                <div className="flex gap-3 mt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 h-11 rounded-xl border border-border-dark/60 text-slate-400 text-sm font-bold hover:bg-surface-highlight hover:text-white transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        disabled={!isVerified || isLoading}
                        onClick={onConfirm}
                        className={`flex-1 h-11 rounded-xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 ${colors[type]} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                        <span>{confirmText}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
