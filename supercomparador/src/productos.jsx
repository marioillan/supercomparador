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
    const [mensajesFavoritos, setMensajesFavoritos] = useState({});

    const agregarAFavoritos = async (producto) => {
      if (!usuario) {
        const nuevosMensajes = { ...mensajesFavoritos };
        nuevosMensajes[producto.id] = "Debes iniciar sesión para añadir favoritos";
        setMensajesFavoritos(nuevosMensajes);
        return;
      }

      if (!producto.id) {
        const nuevosMensajes = { ...mensajesFavoritos };
        nuevosMensajes[producto.id] = "Este producto no puede guardarse como favorito";
        setMensajesFavoritos(nuevosMensajes);
        return;
      }

      const { data: yaExiste } = await supabase
        .from('favoritos')
        .select('id')
        .eq('usuario_id', usuario.id)
        .eq('producto_id', producto.id)
        .single();

      if (yaExiste) {
        const nuevosMensajes = { ...mensajesFavoritos };
        nuevosMensajes[producto.id] = "Este producto ya está en tus favoritos";
        setMensajesFavoritos(nuevosMensajes);
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

      const nuevosMensajes = { ...mensajesFavoritos };
      if (error) {
        nuevosMensajes[producto.id] = "No se pudo añadir el producto a favoritos";
      } else {
        nuevosMensajes[producto.id] = "Producto añadido a favoritos";
      }

      setMensajesFavoritos(nuevosMensajes);

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
                    <p style={{ marginTop: '5px', color: 'green' }}>
                      {mensajesFavoritos[producto.id]}
                    </p>
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
