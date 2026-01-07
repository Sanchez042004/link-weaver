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
        <Modal isOpen={isOpen} onClose={onClose} title="QR Code" width="sm">
            <div className="flex flex-col items-center gap-6">
                <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-200">
                    <QRCodeCanvas
                        id="qr-code-canvas"
                        value={url}
                        size={200}
                        level={"H"}
                        includeMargin={true}
                    />
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Scan this code to visit the link immediately from your mobile device.
                </p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={downloadQRCode}
                        className="flex-1 h-10 bg-primary hover:bg-orange-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/50 hover:scale-[1.02] active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Download PNG
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 bg-[#1a120e] hover:bg-[#392e28] text-gray-300 hover:text-white border border-[#392e28] font-bold rounded-lg transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};
