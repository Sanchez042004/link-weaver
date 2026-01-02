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
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Redirecting you...</p>
            </div>
        </div>
    );
};

export default ShortUrlRedirect;
