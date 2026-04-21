import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShortUrlRedirect: React.FC = () => {
    const { alias } = useParams<{ alias: string }>();

    useEffect(() => {
        if (alias && alias.toLowerCase() !== '404') {
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-accent/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="flex flex-col items-center gap-8 relative z-10 p-8">
                {/* Logo/Icon */}
                <div className="size-16 bg-surface border border-border-primary rounded-2xl flex items-center justify-center shadow-xl shadow-background">
                    <span className="material-symbols-outlined text-[32px] text-accent animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                        link
                    </span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-surface-hover border-t-accent rounded-full animate-spin"></div>
                    <p className="text-[#8a8a8a] font-mono text-sm tracking-widest uppercase font-bold">Redirecting...</p>
                </div>
            </div>
        </div>
    );
};

export default ShortUrlRedirect;
