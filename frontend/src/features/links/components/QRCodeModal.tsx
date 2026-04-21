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
                <div className="bg-[#e2e2e2] p-4 rounded-xl border border-border-secondary">
                    <QRCodeCanvas
                        id="qr-code-canvas"
                        value={url}
                        size={200}
                        level={"H"}
                        includeMargin={true}
                        fgColor="#000000"
                        bgColor="#e2e2e2"
                    />
                </div>
                <p className="text-center text-[12px] font-mono text-[#8a8a8a] max-w-xs leading-relaxed">
                    Scan this code to visit the link immediately from your mobile device.
                </p>
                <div className="flex gap-3 w-full pt-4 border-t border-border-primary">
                    <button
                        onClick={onClose}
                        className="flex-1 px-5 py-2.5 rounded-lg border border-border-secondary text-[#e2e2e2] text-xs font-semibold hover:bg-surface-hover transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={downloadQRCode}
                        className="flex-1 px-5 py-2.5 bg-accent hover:opacity-90 text-white text-xs font-semibold rounded-lg transition-opacity flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined !text-[16px]">download</span>
                        Download
                    </button>
                </div>
            </div>
        </Modal>
    );
};
