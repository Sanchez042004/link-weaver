import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ActionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    onAnalytics: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete, onAnalytics }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Update position when opening
    React.useLayoutEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Calculate position
            // Fixed positioning relative to viewport
            // rect.bottom is the Y coordinate of the bottom of the button
            // rect.right is the X coordinate of the right of the button

            // We align the right side of the menu with the right side of the button
            // The menu width is w-48 (12rem = 192px)
            const menuWidth = 192;

            setPosition({
                top: rect.bottom + 8, // 8px spacing
                left: rect.right - menuWidth
            });
        } else if (!isOpen) {
            // Reset position when menu closes to prevent stale position data
            setPosition(null);
        }
    }, [isOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Handle clicks outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        // Close on scroll to prevent detached floating menu
        const handleScroll = () => {
            if (isOpen) setIsOpen(false);
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleScroll);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isOpen]);

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center size-8 rounded-lg transition-colors ${isOpen ? 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                title="More Options"
            >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>

            {isOpen && position && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        top: position.top,
                        // Using calculate left to align right edges.
                        // rect.right is X coordinate of right edge.
                        // We want menu's right edge at rect.right.
                        left: position.left,
                        width: '12rem', // w-48
                        zIndex: 9999
                    }}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right"
                >
                    <div className="py-1">
                        <button
                            onClick={() => { onEdit(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            Edit Link
                        </button>
                        <button
                            onClick={() => { onAnalytics(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                            Analytics
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                        <button
                            onClick={() => { onDelete(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            Delete
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default ActionMenu;
