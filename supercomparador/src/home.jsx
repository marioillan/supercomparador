import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './header';

function Home() {

  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  return (
    <>
      <Header />

      <main>
        {/* <section className='buscador'>
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
          
        */}

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

    </>

  );
}

export default Home;