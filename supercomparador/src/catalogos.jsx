import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import './App.css';
import logo from './assets/logo.png';

function Catalogos() {

  return (
    <div className='home'>
      <header>
        <Link to="/">
            <img src={logo} alt="logo supercomparador"/>
        </Link>
        <nav>
          <ul>
            <li><Link to="/supermercados"><p>Supermercados</p></Link></li>
            <li><Link to="/productos"><p>Productos</p></Link></li>
            <li><Link to="/catalogos"><p>Catálogos</p></Link></li>
          </ul>
        </nav>

        <div className='usuario-inicio'>
          <div className='inicio-sesion'>
          <input 
              type="text" 
              placeholder="Correo electrónico" 
              name="correo"
          />
          <input 
              type="password" 
              placeholder="Contraseña" 
              name="contraseña"
          />
            <button type="submit" className='boton-usuario'>Iniciar Sesión</button>
          </div>
          <Link to="/registro">
            <button className="boton-usuario">Registrarse</button>
          </Link>
        </div>

      </header>

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

    </div>

  );
}

export default Catalogos;