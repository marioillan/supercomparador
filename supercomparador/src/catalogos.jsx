import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import './App.css';
import './catalogos.css'
import Header from './header';
import Footer from './footer';
import { useAuth } from './AuthContext';



function Catalogos() {

  const [folletosDia, setFolletosDia] = useState(null);
  const [cargando, setCargando] = useState(true);


    useEffect(() => {
      const obtenerFolletoDia = async () => {
        try {
          const respuesta = await fetch('http://localhost:5000/api/folleto-dia');
          const datos = await respuesta.json();
          setFolletosDia(datos);
        } catch (error) {
          console.error('Error al obtener el folleto DIA:', error);
        } finally {
          setCargando(false);
        }
    };
        obtenerFolletoDia();
  }, []);


  return (
    <>
        <Header />

      <main>
        <div className='catalogos'>
          <h1>Catálogos disponibles</h1>

            {cargando && <p>Cargando catálogos. Espere un momento...</p>}

            {!cargando && folletosDia && (
              <div className="catalogo">
                <h2>Folleto DIA</h2>
                <img
                  src={folletosDia.imagen_portada}
                  alt="Portada del folleto DIA"
                  className="imagen-folleto"
                />
                <a
                  href={folletosDia.enlace_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="boton-descarga"
                >
                  Descargar folleto en PDF
                </a>
              </div>
              )}

             {/* Aquí tenemos que añadir los otros folletos de los supermercados */}


        </div>

      </main>

      <Footer />

    </>

  );
}

export default Catalogos;