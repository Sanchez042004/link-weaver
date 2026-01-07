import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShortUrlRedirect: React.FC = () => {
    const { alias } = useParams<{ alias: string }>();

    useEffect(() => {
        if (alias) {
            // Obtener la URL del API desde las variables de entorno
            // Importante: VITE_API_URL termina en /api (ej: ...onrender.com/api)
            // La ruta de redirección en el backend suele estar en la RAÍZ del servidor Express 
            // (fuera de /api) para ser más corta, pero según nuestro app.ts actual:
            // app.get('/:alias', redirectController.redirect);

            // Así que construimos la URL de redirección base (sin el /api)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const serverBaseUrl = apiUrl.replace(/\/api$/, '');

            // Redirigir al backend para procesar el clic
            window.location.href = `${serverBaseUrl}/${alias}`;
        }
    }, [alias]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-pattern relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="flex flex-col items-center gap-8 relative z-10 p-8">
                {/* Logo/Icon */}
                <div className="size-16 bg-[#2e201a] border border-[#ec5b13]/20 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-900/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary animate-pulse">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path>
                    </svg>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#392e28] border-t-primary rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium text-lg tracking-wide">Redirecting to destination...</p>
                </div>
            </div>
        </div>
    );
};

export default ShortUrlRedirect;
