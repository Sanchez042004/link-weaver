import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: 'sm' | 'md' | 'lg' | 'xl';
    hideHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, width = 'md', hideHeader = false }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const widthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0a0a]/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className={`bg-surface w-full ${widthClasses[width]} rounded-xl shadow-2xl border border-border-primary overflow-hidden animate-in zoom-in-95 duration-200 relative`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header */}
                {!hideHeader && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary bg-surface-hover/30">
                        <h3 id="modal-title" className="text-[13px] font-headline font-bold text-[#e2e2e2]">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-md hover:bg-surface-hover text-[#8a8a8a] hover:text-[#e2e2e2] transition-colors flex items-center justify-center"
                            aria-label="Close modal"
                        >
                            <span className="material-symbols-outlined !text-[18px]">close</span>
                        </button>
                    </div>
                )}

                {/* Absolute Close Button if Header is Hidden */}
                {hideHeader && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-surface-hover text-[#8a8a8a] transition-colors z-10 flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        <span className="material-symbols-outlined !text-[18px]">close</span>
                    </button>
                )}

                {/* Content */}
                <div className="p-6 bg-surface">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
