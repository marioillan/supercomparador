# SuperComparador

Proyecto web desarrollado en React + Vite para el frontend y Node.js + Express con PostgreSQL para el backend. Permite comparar supermercados, productos y gestionar usuarios.

---

## 🚀 Instalación y puesta en marcha

### 1. Requisitos previos

- Node.js (última versión)
- npm
- PostgreSQL 16
- Visual Studio Code
- pgAdmin

---

### 2. Clonar el repositorio

---

### 3. Instalar dependencias

#### Frontend:
```bash
npm install
```

#### Backend:
```bash
cd backend
npm install
```

---

### 4. Configuración de la base de datos

1. Crea una base de datos llamada `supercomparadorDB` en PostgreSQL
2. Configura el archivo `.env` en `backend/` con tus credenciales:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=supercomparadorDB
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

> 🔼 Cambia los valores según tu configuración local. Asegúrate de que PostgreSQL esté corriendo.

---

### 5. Ejecutar el backend

```bash
cd backend
node index.js
```

Si la conexión es correcta, verás algo como:
```bash
✅ Conexión exitosa: { now: ... }
```

Backend disponible en: `http://localhost:3001`

---

### 6. Ejecutar el frontend

```bash
cd ..
npm run dev
```

Abre el navegador en: `http://localhost:5173`

---

``


---

© 2025 - SuperComparador
