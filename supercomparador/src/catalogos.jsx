import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import './App.css';
import './catalogos.css'
import Header from './header';
import Footer from './footer';
import { useAuth } from './AuthContext';

function Catalogos() {

  const [folletos, setFolletos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerFolletos = async () => {
      setCargando(true);

      try {
        const resDia = await fetch('http://localhost:5000/api/folletos-dia');
        const resMas = await fetch("http://localhost:5000/api/folletos-mas");
        const datosDia = await resDia.json(); 
        const datosMas = await resMas.json();

        const folletosValidosDia = datosDia.filter(f => f.imagen_portada && f.enlace_pdf);
        const folletosValidosMas = datosMas.filter(f => f.imagen_portada && f.enlace_pdf);

        const todosLosFolletos = [...folletosValidosDia, ...folletosValidosMas];
        setFolletos(todosLosFolletos);

      } catch (error) {
        console.error('Error al obtener los folletos:', error);
        setFolletos([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerFolletos();
  }, []);



  return (
    <>
        <Header />

      <main className='mainCatalogos'>
          <h1>Catálogos disponibles</h1>

            {cargando && <p>Cargando catálogos. Espere un momento...</p>}

            {!cargando && folletos.length === 0 && (
              <p>No hay catálogos disponibles en este momento.</p>
            )}

          {!cargando && (
            <div className="catalogos-lista">
              {folletos.map((folleto, index) => (
                <div key={index} className="catalogo">
                  <h2>Folleto {folleto.supermercado}</h2>
                  <img
                    src={folleto.imagen_portada}
                    alt="Portada del folleto"
                    className="imagen-folleto"
                  />
                  <a
                    href={folleto.enlace_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="boton-descarga"
                  >
                    Descargar folleto en PDF
                  </a>
                </div>
              ))}
            </div>
          )}

      </main>

      <Footer />

    </>

  );
}

export default Catalogos;