# 🎨 Knot.ly - Frontend SPA

Esta es la interfaz de usuario de Knot.ly, una Single Page Application (SPA) moderna construida para ofrecer una gestión de enlaces fluida y analíticas visuales de alto impacto.

## 🚀 Experiencia de Usuario (UX) y Características

-   ⚡ **Powered by React 19**: Aprovechando las últimas mejoras de rendimiento y manejo de estado de React.
-   🌓 **Dynamic Theming**: Soporte nativo para modo claro y oscuro con transiciones suaves, respetando las preferencias del sistema.
-   📱 **Mobile-First Design**: Layout completamente responsive construido con TailwindCSS, garantizando una experiencia óptima en cualquier tamaño de pantalla.
-   📈 **Data Visualization**: Integración de **Recharts** para transformar datos crudos de clics en gráficas interactivas y comprensibles.

## 🏗️ Organización del Código: Feature-Based Structure

El proyecto sigue una estructura organizada por "features" o dominios, facilitando la escalabilidad y el mantenimiento:

```
frontend/src/
├── api/            # Configuración de Axios e interceptores
├── components/     # Componentes UI reutilizables (Botones, Inputs, etc.)
├── features/       # Lógica encapsulada por dominio
│   ├── auth/       # Registro, Login, Gestión de JWT
│   ├── dashboard/  # Panel de control de usuario
│   └── links/      # Creación y edición de URLs
├── hooks/          # Custom hooks para lógica compartida
└── layouts/        # Esqueletos de página (Navbars, Footers)
```

## ⚡ Optimizaciones de Rendimiento

-   **Code Splitting**: Implementación de `React.lazy` y `Suspense` para reducir el tamaño del bundle inicial y acelerar el tiempo de carga.
-   **Vite Engine**: Utilización de Vite para un entorno de desarrollo instantáneo y builds de producción altamente optimizados.
-   **Strict Typing**: Uso de TypeScript en modo estricto para eliminar errores en tiempo de ejecución y mejorar la documentación del código.

## 🛠️ Stack Tecnológico

-   **Framework**: React 19 + TypeScript
-   **Routing**: React Router 7
-   **Styling**: TailwindCSS
-   **HTTP Client**: Axios
-   **Icons**: React Icons

## 📦 Scripts de Trabajo

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Compilación optimizada para despliegue
npm run lint      # Análisis estático de código
```
