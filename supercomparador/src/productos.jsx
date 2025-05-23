import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './header';
import Footer from './footer';

function Productos() {
  
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
    <>
      <Header />

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

      <Footer />

    </>

  );
}

export default Productos;