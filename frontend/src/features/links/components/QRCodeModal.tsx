import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Modal } from '../../../components/ui/Modal';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    alias: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, url, alias }) => {
    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `qr-${alias || 'link'}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Main QR Code" width="sm">
            <div className="flex flex-col items-center gap-6">
                <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200">
                    <QRCodeCanvas
                        id="qr-code-canvas"
                        value={url}
                        size={200}
                        level={"H"}
                        includeMargin={true}
                    />
                </div>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Scan this code to visit the link immediately from your mobile device.
                </p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={downloadQRCode}
                        className="flex-1 h-10 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Download PNG
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};
