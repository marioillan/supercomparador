import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import './App.css';
import logo from './assets/logo.png';

function Home() {
  
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const buscar = async (e) => {
    e.preventDefault();
  
    if (busqueda.trim() === '') return;

    try {
      const { data, error } = await supabase
        .from('productos')
        .select('nombre, categoria, imagen_url')
        .ilike('nombre', `%${busqueda}%`);
  
      if (error) throw error;
  
      setProductos(data);
      setMostrarResultados(true);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }
  };

  return (
    <div className='home'>
      <header>
        <Link to="/">
            <img src={logo} alt="logo supercomparador"/>
        </Link>
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
          <Link to="/registro">
            <button className="boton-usuario">Registrarse</button>
          </Link>
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
        {mostrarResultados && (
          <section className='lista-productos'>
            <ul>
              {productos.map((producto, index) => (
                <li key={index} className='producto-caja'>
                  <img src={producto.imagen_url} alt={producto.nombre} className='imagen-producto' />
                  <h3>{producto.nombre}</h3>
                  <p>Categoría: {producto.categoria}</p>
                </li>
              ))}
            </ul>

            {productos.length === 0 && (
              <p>No se encontraron productos relacionados.</p>
            )}
          </section>

        )} 

      </main>

      <footer>
        <div className='footer-descripcion'>
          <h3>SUPERCOMPARADOR</h3>
          <p>Haz que tu compra sea efectiva y rápida con nuestros servicios</p>
          <p>Confia en nosotros</p>
        </div>
        <div className='proyectoISI'>
          <h4>PROYECTO SUPER COMPARADOR 2025 ISI</h4>
          <p>Integrantes:</p>
          <p>Mario Illán Valero</p>
          <p>José Antonio Villarejo Caballero</p>
        </div>
      </footer>

    </div>

  );
}

export default Home;