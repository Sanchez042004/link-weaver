import React from 'react';

interface DeviceData {
    name: string;
    value: number;
}

interface DevicesTableProps {
    devices: DeviceData[];
    loading: boolean;
}

const DevicesTable: React.FC<DevicesTableProps> = ({ devices, loading }) => {
    // Sort devices to put desktop/mobile first
    const sortedDevices = [...(devices || [])].sort((a, b) => b.value - a.value);

    return (
        <div className="space-y-6">
            <h4 className="text-[11px] font-label font-semibold text-text-secondary uppercase tracking-widest ml-1">Device Statistics</h4>
            <div className="bg-surface rounded-xl overflow-hidden border border-border-primary">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-primary bg-surface-hover/30">
                            <th className="px-6 py-4 text-[10px] font-label font-bold text-text-secondary uppercase tracking-widest">Platform</th>
                            <th className="px-6 py-4 text-[10px] font-label font-bold text-text-secondary uppercase tracking-widest text-right">Clicks</th>
                        </tr>
                    </thead>
                    <tbody className="text-text-primary divide-y divide-border-primary">
                        {!loading && sortedDevices.length > 0 ? (
                            sortedDevices.map((device, idx) => {
                                const isMobile = device.name.toLowerCase().match(/mobile|phone|tablet|handheld/i);
                                const isDesktop = device.name.toLowerCase().match(/desktop|pc|computer/i) || (!isMobile && device.name !== 'Other');
                                
                                const label = isMobile ? 'Mobile Device' : (isDesktop ? 'Desktop / PC' : 'Other');
                                const icon = isMobile ? 'smartphone' : (isDesktop ? 'computer' : 'devices_other');

                                return (
                                    <tr key={idx} className="hover:bg-surface-hover transition-colors">
                                        <td className="px-6 py-4 flex items-center space-x-3">
                                            <div className="w-6 h-6 rounded bg-bg flex items-center justify-center border border-border-primary shrink-0">
                                                <span className="material-symbols-outlined !text-[14px] text-text-secondary">{icon}</span>
                                            </div>
                                            <span className="text-sm font-medium">{label}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm">{device.value.toLocaleString()}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-text-secondary text-sm italic">
                                    No device data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DevicesTable;
