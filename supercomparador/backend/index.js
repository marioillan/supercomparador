require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configuración del pool usando variables del .env
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

//Configuración del endpoint
app.get('/productos', async (req, res) => {
  const { nombre } = req.query;

  try {
    const result = await pool.query(
      'SELECT nombre, categoria, imagen_url FROM productos WHERE LOWER(nombre) LIKE LOWER($1)',
      [`%${nombre}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al buscar productos:', err);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
});

//Hacemos la llamada al endpoint
const handleBuscar = async (e) => {
  e.preventDefault(); // para que no se recargue la página

  if (busqueda.trim() === '') return;

  try {
    const res = await fetch(`http://localhost:3001/productos?nombre=${encodeURIComponent(busqueda)}`);
    const data = await res.json();
    setProductos(data); // esto actualiza lo que se muestra
  } catch (error) {
    console.error('Error al buscar productos:', error);
  }
};

// Prueba de conexión
//async function probarConexion() {
//  try {
//    const res = await pool.query('SELECT NOW()');
//    console.log('✅ Conexión exitosa:', res.rows[0]);
//    process.exit(0);
//  } catch (err) {
//    console.error('❌ Error al conectar:', err);
//    process.exit(1);
//  }
//}

//probarConexion();
