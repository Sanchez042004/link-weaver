import React from 'react';

interface Country {
    name: string;
    value: number;
}

interface LocationsTableProps {
    countries: Country[];
    totalClicks: number;
    loading: boolean;
}

const LocationsTable: React.FC<LocationsTableProps> = ({ countries, totalClicks, loading }) => {
    return (
        <div className="space-y-6">
            <h4 className="text-[11px] font-label font-semibold text-text-secondary uppercase tracking-widest ml-1">Top Locations</h4>
            <div className="bg-surface rounded-xl overflow-hidden border border-border-primary">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-primary bg-surface-hover/30">
                            <th className="px-6 py-4 text-[10px] font-label font-bold text-text-secondary uppercase tracking-widest">Country</th>
                            <th className="px-6 py-4 text-[10px] font-label font-bold text-text-secondary uppercase tracking-widest text-right">Activity</th>
                        </tr>
                    </thead>
                    <tbody className="text-text-primary divide-y divide-border-primary">
                        {!loading && countries?.length > 0 ? (
                            countries.slice(0, 5).map((loc, idx) => {
                                const percentage = totalClicks > 0 ? Math.round((loc.value / totalClicks) * 100) : 0;
                                return (
                                    <tr key={idx} className="hover:bg-surface-hover transition-colors">
                                        <td className="px-6 py-4 text-sm truncate max-w-[150px]">
                                            {loc.name}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-3">
                                                <span className="font-mono text-sm">{percentage}%</span>
                                                <div className="w-24 h-1.5 bg-bg rounded-full overflow-hidden">
                                                    <div className="h-full bg-accent" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-text-secondary text-sm italic">
                                    No location data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LocationsTable;
