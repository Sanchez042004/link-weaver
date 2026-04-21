import React from 'react';

interface Referrer {
    name: string;
    value: number;
    device?: string;
    os?: string;
}

interface ReferrersTableProps {
    referrers: Referrer[];
    loading: boolean;
}

const ReferrersTable: React.FC<ReferrersTableProps> = ({ referrers, loading }) => {
    return (
        <div className="space-y-6">
            <h4 className="text-[11px] font-label font-semibold text-text-secondary uppercase tracking-widest ml-1">Top Referrers</h4>
            <div className="bg-surface rounded-xl overflow-hidden border border-border-primary">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-primary bg-surface-hover/30">
                            <th className="px-6 py-4 text-[10px] font-label font-bold text-text-secondary uppercase tracking-widest">Source</th>
                            <th className="px-6 py-4 text-[10px] font-label font-bold text-text-secondary uppercase tracking-widest text-right">Clicks</th>
                        </tr>
                    </thead>
                    <tbody className="text-text-primary divide-y divide-border-primary">
                        {!loading && referrers?.length > 0 ? (
                            referrers.slice(0, 5).map((ref, idx) => {
                                const isDirect = ref.name === 'Direct' || ref.name === 'direct' || !ref.name;
                                const isMobile = ref.device === 'mobile' || ref.os?.match(/android|ios|iphone|ipad/i);
                                const sourceLabel = isDirect
                                    ? (isMobile ? 'mobile' : 'desktop')
                                    : ref.name;
                                const sourceIcon = isDirect
                                    ? (isMobile ? 'smartphone' : 'computer')
                                    : 'language';
                                return (
                                    <tr key={idx} className="hover:bg-surface-hover transition-colors">
                                        <td className="px-6 py-4 flex items-center space-x-3">
                                            <div className="w-6 h-6 rounded bg-bg flex items-center justify-center border border-border-primary shrink-0">
                                                <span className="material-symbols-outlined !text-[14px] text-text-secondary">{sourceIcon}</span>
                                            </div>
                                            <span className="text-sm truncate max-w-[200px]">{sourceLabel}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm">{ref.value.toLocaleString()}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-text-secondary text-sm italic">
                                    No referrer data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReferrersTable;
