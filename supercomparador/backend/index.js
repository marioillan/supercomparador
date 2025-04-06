require('dotenv').config();
const { Pool } = require('pg');

// Configuración del pool usando variables del .env
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Prueba de conexión
async function probarConexion() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa:', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al conectar:', err);
    process.exit(1);
  }
}

probarConexion();
