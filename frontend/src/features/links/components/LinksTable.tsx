import React, { useState } from 'react';
import { type Url } from '../../../api/url.api';
import { LinkActionMenu } from './LinkActionMenu';

interface LinksTableProps {
    urls: Url[];
    isLoading: boolean;
    onEdit: (url: Url) => void;
    onDelete: (id: string) => void;
    onAnalytics: (alias: string) => void;
}

export const LinksTable: React.FC<LinksTableProps> = ({ urls, isLoading, onEdit, onDelete, onAnalytics }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (isLoading) {
        return (
            <div className="w-full overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-slate-700/50">
                                <td className="p-4"><div className="h-6 w-32 bg-slate-700/50 rounded animate-pulse" /></td>
                                <td className="p-4"><div className="h-6 w-24 bg-slate-700/50 rounded animate-pulse" /></td>
                                <td className="p-4"><div className="h-6 w-20 bg-slate-700/50 rounded animate-pulse" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (urls.length === 0) {
        return (
            <div className="w-full p-8 text-center rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
                <p className="text-slate-500 dark:text-slate-400">No links created yet. Click "Create New Link" to get started!</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-800/60 border-b border-slate-700/50">
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-6">Original URL</th>
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short Link</th>
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:table-cell">Date</th>
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Clicks</th>
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right px-6">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                    {urls.map((url) => (
                        <tr key={url.id} className="group hover:bg-slate-700/20 transition-colors">
                            <td className="p-4 px-6 max-w-[200px] sm:max-w-[300px]">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">public</span>
                                    </div>
                                    <p className="truncate text-sm text-slate-600 dark:text-slate-300 font-medium" title={url.longUrl}>{url.longUrl}</p>
                                </div>
                            </td>
                            <td className="p-4">
                                <a href={url.shortUrl} target="_blank" rel="noreferrer" className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold border border-primary/20 hover:underline truncate max-w-[150px]">
                                    {url.shortUrl.replace(/^https?:\/\//, '')}
                                </a>
                            </td>
                            <td className="p-4 hidden sm:table-cell">
                                <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(url.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="p-4 text-center">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                    {url.clicks}
                                </span>
                            </td>
                            <td className="p-4 px-6 text-right">
                                <div className="flex gap-2 justify-end items-center">
                                    <button
                                        onClick={() => copyToClipboard(url.shortUrl, url.id)}
                                        className={`inline - flex items - center justify - center size - 8 rounded - lg transition - colors ${copiedId === url.id
                                            ? 'text-primary bg-primary/10'
                                            : 'text-slate-400 hover:text-primary hover:bg-primary/10'
                                            } `}
                                        title={copiedId === url.id ? "Copied!" : "Copy Short Link"}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {copiedId === url.id ? 'check' : 'content_copy'}
                                        </span>
                                    </button>
                                    <LinkActionMenu
                                        onEdit={() => onEdit(url)}
                                        onAnalytics={() => onAnalytics(url.alias)}
                                        onDelete={() => onDelete(url.id)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
