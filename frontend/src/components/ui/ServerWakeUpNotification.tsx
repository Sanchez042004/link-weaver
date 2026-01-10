import { useBackendStatus } from '../../context/BackendStatusContext';
import { BiServer } from 'react-icons/bi';

export const ServerWakeUpNotification = () => {
    const { isBackendWakingUp } = useBackendStatus();

    if (!isBackendWakingUp) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-blue-500/30 backdrop-blur-md bg-blue-600/90">
                <div className="relative">
                    <BiServer className="text-2xl animate-pulse" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                </div>
                <div>
                    <h4 className="font-bold text-sm">Servidor iniciándose</h4>
                    <p className="text-xs text-blue-100">Esto puede tomar unos segundos...</p>
                </div>
            </div>
        </div>
    );
};
