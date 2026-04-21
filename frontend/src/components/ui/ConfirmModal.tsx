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

    useEffect(() => {
        if (!isOpen) {
            setInputValue('');
        }
    }, [isOpen]);

    const isVerified = verificationValue ? inputValue === verificationValue : true;

    // Define monolithic button styles
    const buttonStyles = {
        danger: 'bg-danger/10 border border-danger text-danger hover:bg-danger hover:text-white text-xs',
        warning: 'bg-surface-hover border border-border-secondary text-[#e2e2e2] hover:bg-[#e2e2e2] hover:text-[#0a0a0a] text-xs',
        info: 'bg-accent hover:opacity-90 text-white text-xs border border-transparent'
    };

    const iconColors = {
        danger: 'text-danger',
        warning: 'text-[#e2e2e2]',
        info: 'text-accent'
    };

    const iconBackgrounds = {
        danger: 'bg-danger/10',
        warning: 'bg-surface-hover',
        info: 'bg-accent/10'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                    <div className={`p-2.5 ${iconBackgrounds[type]} rounded-lg flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined !text-[20px] ${iconColors[type]}`}>
                            {type === 'danger' ? 'report' : type === 'warning' ? 'warning' : 'help'}
                        </span>
                    </div>
                    <div>
                        <p className="text-[#8a8a8a] text-sm leading-relaxed">{message}</p>
                    </div>
                </div>

                {verificationValue && (
                    <div className="bg-[#0a0a0a]/50 p-4 rounded-xl border border-border-secondary flex flex-col gap-2">
                        <p className="text-[11px] text-[#8a8a8a] font-headline font-semibold tracking-widest uppercase">
                            Please type <span className="text-[#e2e2e2] select-all font-mono font-normal">{verificationValue}</span> to confirm
                        </p>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={verificationPlaceholder || "Type here..."}
                            className="w-full bg-[#0e0e0e] border border-border-secondary rounded-lg h-11 px-3 text-[#e2e2e2] text-sm focus:border-danger focus:ring-1 focus:ring-danger transition-colors font-mono placeholder:text-outline-variant"
                        />
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-primary">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-border-secondary text-[#e2e2e2] text-xs font-semibold hover:bg-surface-hover transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        disabled={!isVerified || isLoading}
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${buttonStyles[type]} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>}
                        <span>{confirmText}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
