require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

// Configuración del pool usando variables del .env
const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL
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
