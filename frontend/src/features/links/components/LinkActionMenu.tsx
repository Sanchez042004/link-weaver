import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LinkActionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    onAnalytics: () => void;
}

export const LinkActionMenu: React.FC<LinkActionMenuProps> = ({ onEdit, onDelete, onAnalytics }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 8,
                left: rect.right - 192 // Align right edge
            });
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = () => setIsOpen(false);
        const handleScroll = () => setIsOpen(false);

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center size-8 rounded-lg transition-colors ${isOpen ? 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                aria-label="More options"
            >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>

            {isOpen && position && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        zIndex: 9999
                    }}
                    className="w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-100 dark:border-border-dark overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="py-1">
                        <button onClick={() => { onEdit(); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">edit</span> Edit Link
                        </button>
                        <button onClick={() => { onAnalytics(); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">bar_chart</span> Analytics
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                        <button onClick={() => { onDelete(); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
