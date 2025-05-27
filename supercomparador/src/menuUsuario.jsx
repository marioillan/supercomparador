import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import Header from './header';
import Footer from './footer';
import './menuUsuario.css';

function MenuUsuario() {
  const { usuario } = useAuth();
  const [nuevaCiudad, setNuevaCiudad] = useState('');
  const [ciudadActual, setCiudadActual] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mensajeGuardado, setMensajeGuardado] = useState('');

  useEffect(() => {
    if (!usuario) return;

    const obtenerDatos = async () => {
      //Obtener la ciudad actual
      const { data: ciudadData } = await supabase
        .from('usuarios')
        .select('ciudad')
        .eq('id', usuario.id)
        .single();

      if (ciudadData?.ciudad) {
        setCiudadActual(ciudadData.ciudad);
        setNuevaCiudad(ciudadData.ciudad);
      }

      //Obtener productos favoritos del usuario con información relacionada
      const { data: favoritosData, error } = await supabase
        .from('favoritos')
        .select(`
          id,
          producto_id,
          productos (
            id,
            nombre,
            imagen,
            supermercado,
            precio
          )
        `)
        .eq('usuario_id', usuario.id);

      if (error) {
        console.error('Error al obtener favoritos:', error);
      } else {
        setFavoritos(favoritosData);
      }
    };

    obtenerDatos();
  }, [usuario]);

  const guardarCiudad = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ ciudad: nuevaCiudad })
      .eq('id', usuario.id)
      .select();

    if (!error) {
      setMensajeGuardado('Ciudad actualizada correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      alert('Error al actualizar la ciudad');
    }
  };

  const eliminarFavorito = async (id) => {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('id', id);

    if (!error) {
      setFavoritos((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert('Error al eliminar el producto');
    }
  };

  return (
    <>
      <Header />
      <main className="mainMenu">
        <div className='ciudad'>
          <h2>Cambiar ciudad</h2>
          <p>Ciudad actual: <strong>{ciudadActual}</strong></p>
          <select value={nuevaCiudad} onChange={(e) => setNuevaCiudad(e.target.value)}>
            <option value="Granada">Granada</option>
            <option value="Jaen">Jaén</option>
            <option value="Almeria">Almería</option>
            <option value="Sevilla">Sevilla</option>
            <option value="Cordoba">Córdoba</option>
            <option value="Huelva">Huelva</option>
          </select>
          <button onClick={guardarCiudad} className="boton-usuario">Guardar ciudad</button>
          {mensajeGuardado && <p className="mensaje-ok">{mensajeGuardado}</p>}
        </div>

        <div className='favoritos'>
          <h2 style={{ marginTop: '3rem' }}>Mis productos favoritos</h2>
          {favoritos.length === 0 ? (
            <p>No tienes productos guardados.</p>
          ) : (
            <ul className="lista-favoritos">
              {favoritos.map((item) => (
                <li key={item.id} className="favorito-item">
                  <img
                    src={item.productos.imagen}
                    alt={item.productos.nombre}
                    className="favorito-img"
                  />
                  <div className="favorito-detalles">
                    <span className="nombre-producto">Nombre producto: {item.productos.nombre}</span>
                    <span className="supermercado-producto">Supermercado: {item.productos.supermercado}</span>
                    <span className="precio-producto">Precio: {item.productos.precio} €</span>
                  </div>
                  <button onClick={() => eliminarFavorito(item.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MenuUsuario;
