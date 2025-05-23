import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './header';

function Catalogos() {

  const [folletosDia, setFolletosDia] = useState([]);

  return (
    <>
        <Header />

      <main>


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

export default Catalogos;