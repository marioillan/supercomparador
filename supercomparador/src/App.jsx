import { useState } from 'react'
import './App.css'
import logo from './assets/logo.png';

function App() {

  return (
    <>
      <header>
        <a href="#"><img src={logo} alt="logo supercomparador"/></a>

        <nav>
          <ul>
            <li><a href="#">Supermercados</a></li>
            <li><a href="#">Productos</a></li>
            <li><a href="#">Sobre Nosotros</a></li>
          </ul>
        </nav>

        <div className='usuario-inicio'>
          <div className='inicio-sesion'>
          <input 
              type="text" 
              placeholder="Nombre Usuario" 
              name="usuario"
          />
          <input 
              type="password" 
              placeholder="Contraseña" 
              name="contraseña"
          />
            <button type="submit" className='boton-usuario'>Iniciar Sesión</button>
          </div>
          <button className='boton-usuario'><a href="#">Registrarse</a></button>
        </div>

      </header>

      <main>
        <section>
          <h2>Buscar productos:</h2>
          <form>
            <input 
              type="text" 
              placeholder="Buscar..." 
              name="busqueda"
            />
            <button type="submit" className='boton-buscar'>Buscar</button>
          </form>
        </section>

      </main>

      <footer>



      </footer>

    </>

  );
}

export default App
