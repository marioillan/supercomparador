import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './header';
import Footer from './footer';
import { useAuth } from './AuthContext';

function Productos() {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [supermercadoFiltro, setSupermercadoFiltro] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('');
  const { usuario } = useAuth();

  const agregarAFavoritos = async (producto) => {
    if (!usuario) {
      alert("Debes iniciar sesión para añadir favoritos");
      return;
    }

    if (!producto.id) {
      console.error('El producto no tiene ID');
      alert("Este producto no puede guardarse como favorito");
      return;
    }

    const { data, error } = await supabase
      .from('favoritos')
      .insert([
        {
          usuario_id: usuario.id,
          producto_id: producto.id,
        },
      ]);

    if (error) {
      console.error('Error al añadir a favoritos:', error.message);
      alert('No se pudo añadir el producto a favoritos');
    } else {
      alert('Producto añadido a favoritos');
    }
  };

  const buscar = async (e) => {
    e.preventDefault();
    if (busqueda.trim() === '') return;

    try {
      let query = supabase
        .from('productos')
        .select('id, nombre, categoria, imagen, supermercado, precio') // 👈 Incluye el ID
        .ilike('nombre', `%${busqueda}%`);

      if (supermercadoFiltro) {
        query = query.eq('supermercado', supermercadoFiltro);
      }

      if (ordenPrecio) {
        query = query.order('precio', { ascending: ordenPrecio === 'asc' });
      }

      const { data, error } = await query;

      if (error) throw error;

      setProductos(data);
      setMostrarResultados(true);
    } catch (error) {
      console.error('Error al buscar productos:', error.message);
    }
  };

  return (
    <div className='app-container'>
      <Header />

      <main>
        <section className='buscador'>
          <h2>Buscar productos:</h2>
          <form onSubmit={buscar} className='formulario-busqueda'>
            <input 
              type="text" 
              placeholder="Producto..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select value={supermercadoFiltro} onChange={(e) => setSupermercadoFiltro(e.target.value)}>
              <option value="">Todos los supermercados</option>
              <option value="Carrefour">Carrefour</option>
              <option value="Dia">Dia</option>
            </select>

            <select value={ordenPrecio} onChange={(e) => setOrdenPrecio(e.target.value)}>
              <option value="">Ordenar por precio</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
            </select>

            <button type="submit" className='boton-buscar'>Buscar</button>
          </form>
        </section>

        {mostrarResultados && (
          <section className='lista-productos'>
            <ul>
              {productos.map((producto, index) => (
                <li key={index} className='producto-caja'>
                  <img src={producto.imagen} alt={producto.nombre} className='imagen-producto' />
                  <h3>{producto.nombre}</h3>
                  <p><strong>Supermercado:</strong> {producto.supermercado}</p>
                  <p><strong>Precio:</strong> {producto.precio} €</p>
                  <button onClick={() => agregarAFavoritos(producto)}> Añadir a favoritos</button>
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
    </div>
  );
}

export default Productos;
