import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './header';
import Footer from './footer';
import videoSuper from './assets/videosuper.mp4';


function Home() {

  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  return (
    <>
      <Header />

      <main>

          <div className="homecontenido">
            <h1>Bienvenido a SUPERCOMPARADOR</h1>
            <p>Compara precios, elige inteligentemente y ahorra en tus compras</p>
          </div>

      </main>

      <Footer />

    </>

  );
}

export default Home;