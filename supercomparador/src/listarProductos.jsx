import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';
import './ListaProductos.css';
import Header from './header';
import Footer from './footer';

function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const productosPorPagina = 10;

  useEffect(() => {
    cargarProductos();
  }, [paginaActual]);

  async function cargarProductos() {
    const desde = (paginaActual - 1) * productosPorPagina;
    const hasta = desde + productosPorPagina - 1;

    const resultadoTotal = await supabase
      .from('productos_openfoodfacts')
      .select('id', { count: 'exact', head: true });

    if (resultadoTotal.count) {
      const total = resultadoTotal.count;
      setTotalPaginas(Math.ceil(total / productosPorPagina));
    }

    const resultado = await supabase
      .from('productos_openfoodfacts')
      .select('*')
      .order('nombre', { ascending: true })
      .range(desde, hasta);

    if (resultado.data) {
      setProductos(resultado.data);
    }
  }

  function irPaginaAnterior() {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  }

  function irPaginaSiguiente() {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  }

  return (
    <>
      <Header />
      <main className="lista-producto">
        <h2>Consultar valores nutricionales</h2>

        <ul>
          {productos.map(producto => (
            <li key={producto.id} className="producto-detalle">
              {producto.imagen && <img src={producto.imagen} alt={producto.nombre} />}
              <div>
                <h3>{producto.nombre}</h3>
                <p><strong>Marca:</strong> {producto.marca}</p>
                <p><strong>Nutri-score:</strong> {producto.nutriscore?.toUpperCase()}</p>
                <p><strong>Calorías:</strong> {producto.energia_100g} kcal</p>
                <p><strong>Grasas:</strong> {producto.grasas_100g} g</p>
                <p><strong>Azúcares:</strong> {producto.azucares_100g} g</p>
                <p><strong>Ingredientes:</strong> {producto.ingredientes}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="paginacion">
          <button onClick={irPaginaAnterior} disabled={paginaActual === 1}>Anterior</button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button onClick={irPaginaSiguiente} disabled={paginaActual === totalPaginas}>Siguiente</button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ListaProductos;
