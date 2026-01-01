# 🎨 Link Weaver - Frontend

Frontend moderno para Link Weaver, construido con React, TypeScript y TailwindCSS.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/              # Clientes API (axios)
│   ├── assets/           # Imágenes, fuentes, etc.
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Context API (Auth, Theme)
│   ├── features/         # Features organizados por dominio
│   │   ├── auth/         # Autenticación
│   │   ├── dashboard/    # Dashboard
│   │   ├── landing/      # Página de inicio
│   │   └── links/        # Gestión de enlaces
│   ├── hooks/            # Custom hooks
│   ├── layouts/          # Layouts de páginas
│   ├── pages/            # Páginas principales
│   ├── App.tsx           # Componente raíz
│   └── main.tsx          # Punto de entrada
├── public/               # Archivos estáticos
├── index.html            # HTML base
├── vite.config.ts        # Configuración de Vite
├── tailwind.config.js    # Configuración de Tailwind
└── tsconfig.json         # Configuración de TypeScript
```

## 🛠️ Tecnologías

- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rápido
- **TailwindCSS** - Utility-first CSS
- **React Router v7** - Routing
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos y visualizaciones
- **React Icons** - Iconos

## 📝 Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
npm run lint      # Ejecutar ESLint
```

## 🎨 Características

- ✅ **Modo Oscuro** - Tema claro/oscuro automático
- ✅ **Responsive** - Optimizado para móvil, tablet y desktop
- ✅ **Animaciones** - Transiciones suaves
- ✅ **Accesibilidad** - Siguiendo mejores prácticas
- ✅ **Type-Safe** - TypeScript en todo el proyecto
- ✅ **Code Splitting** - Carga optimizada

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001/api
```

### Build de Producción

```bash
npm run build
```

Los archivos compilados estarán en `/dist` listos para ser desplegados.

### Despliegue

El frontend es una SPA estática que puede ser desplegada en:

- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- Cualquier servidor web estático

## 🎯 Mejores Prácticas

- Componentes funcionales con hooks
- TypeScript estricto
- Organización por features
- Custom hooks para lógica reutilizable
- Context API para estado global
- Lazy loading de rutas

## 📦 Dependencias Principales

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.11.0",
  "axios": "^1.13.2",
  "tailwindcss": "^3.4.17",
  "recharts": "^3.6.0"
}
```

## 🐛 Troubleshooting

### Error: Cannot connect to API

Verifica que:
1. El backend esté corriendo en `http://localhost:3001`
2. La variable `VITE_API_URL` esté configurada correctamente
3. No haya problemas de CORS

### Build falla

```bash
# Limpiar caché y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
