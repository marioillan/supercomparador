import { useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'
import logo from './assets/logo.png';

function App() {

  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);

  const buscar = async (e) => {
    e.preventDefault();

    if (busqueda.trim() === '') return;

    try {
      const res = await fetch(`http://localhost:3001/productos?nombre=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }
  };



  return (
    <div className='App'>
      <header>
        <a href="#"><img src={logo} alt="logo supercomparador"/></a>

        <nav>
          <ul>
            <li><a href="#">Supermercados</a></li>
            <li><a href="#">Productos</a></li>
            <li><a href="#">Sobre Nosotros</a></li>
          </ul>
        </nav>

        <div className='usuario-inicio'>
          <div className='inicio-sesion'>
          <input 
              type="text" 
              placeholder="Nombre Usuario" 
              name="usuario"
          />
          <input 
              type="password" 
              placeholder="Contraseña" 
              name="contraseña"
          />
            <button type="submit" className='boton-usuario'>Iniciar Sesión</button>
          </div>
          <button className='boton-usuario'><a href="#">Registrarse</a></button>
        </div>

      </header>

      <main>
        <section className='buscador'>
          <h2>Buscar productos:</h2>
          <form onSubmit={buscar}>
            <input 
              type="text" 
              placeholder="Producto..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button type="submit" className='boton-buscar'>Buscar</button>
          </form>
        </section>
        <section className='lista-productos'>
          <ul>
            {productos.map((producto, index) => (
              <li key={index} className='producto-caja'>
                <img src={producto.imagen_url} alt={producto.nombre} className='imagen-producto' />
                <h3>{producto.nombre}</h3>
                <p>{producto.categoria}</p>
              </li>
            ))}
          </ul>

          {productos.length === 0 && busqueda !== '' && (
            <p>No se encontraron productos relacionados.</p>
          )}
        </section>

      </main>

      <footer>
        <div className='footer-descripcion'>
          <h3>SUPERCOMPARADOR</h3>
          <p>Haz que tu compra sea efectiva y rápida con nuestros servicios</p>
        </div>
        <p className='proyecto-footer'>PROYECTO SUPER COMPARADOR 2025 ISI</p>
        <h4>Integrantes:</h4>
        <p>Mario Illán Valero</p>
        <p>José Antonio </p>

      </footer>

    </div>

  );
}

export default App;
