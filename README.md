# TaskManager - Frontend React

Este es el frontend de la aplicación **TaskManager**, desarrollado con React y Vite.

---

## 🚀 Requisitos

- Node.js 16+  
- npm o yarn  

---

## 🔧 Instalación

1. Clona el repositorio:

``` sh
git clone https://github.com/JosueMasterPro/TaskManager.git
```
cd TaskManager

## Dependencias
- react: "^19.1.0",
- react-bootstrap: "^2.10.10",
- react-dom: "^19.1.0",
- react-icons: "^5.5.0",
- react-router-dom: "^7.6.1",
- react-scripts: "5.0.1",
- web-vitals: "^2.1.4"

## Instala Dependencias
```sh
npm install
```
## 🏃‍♂️ Ejecutar en modo desarrollo
```sh
npm run dev o npm start
```
- Esto abrira un enlace en localhost:3000

## 📦 Generar versión de producción
```sh
npm run build
```

## 🚀 Despliegue
- Sube el contenido de la carpeta dist/ a tu hosting preferido (Netlify, Vercel, cPanel, etc.).
- Si tu hosting tiene integración con GitHub, puedes configurar deploy automático.
- Importante: Cambia las URLs de las llamadas API (fetch o axios) para que apunten al backend en producción (no a localhost).