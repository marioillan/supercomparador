import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';
import './App.css';

function Header() {
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [usuario, setUsuario] = useState(null);
  const [errorLogin, setErrorLogin] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const obtenerSesion = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (userId) {
        const { data } = await supabase
          .from('usuarios')
          .select('usuario')
          .eq('id', userId)
          .single();
        if (data) {
          setUsuario({ id: userId, nombreUsuario: data.usuario });
        }
      }

        setIsLoading(false);

    };

    obtenerSesion();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('usuarios')
          .select('usuario')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUsuario({ id: session.user.id, nombreUsuario: data.usuario });
            }
          });
      } else {
        setUsuario(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleChangeLogin = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const iniciarSesion = async () => {
    const { data: session, error } = await supabase.auth.signInWithPassword({
      email: credenciales.email,
      password: credenciales.password
    });

    if (error) {
      setErrorLogin('Credenciales incorrectas');
    } else {
      setErrorLogin('');
      setCredenciales({ email: '', password: '' });

      const userId = session.user.id;
      const { data } = await supabase
        .from('usuarios')
        .select('usuario')
        .eq('id', userId)
        .single();
      if (data) {
        setUsuario({ id: userId, nombreUsuario: data.usuario });
      }
    }
  };


  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  return (
    <header>
      <Link to="/">
        <img src={logo} alt="logo supercomparador" />
      </Link>

      <nav>
        <ul>
          <li><Link to="/supermercados"><p>Supermercados</p></Link></li>
          <li><Link to="/productos"><p>Productos</p></Link></li>
          <li><Link to="/nutricion"><p>Nutrición</p></Link></li>
          <li><Link to="/catalogos"><p>Catálogos</p></Link></li>
        </ul>
      </nav>

      <div className='usuario-inicio'>
        {isLoading ? (
            null
        ) : usuario ? (
          <div className='sesion'>
            <p>{usuario.nombreUsuario}</p>
            <Link to="/menu-usuario">
              <button className='boton-usuario'>Menú usuario</button>
            </Link>
            <button className='boton-usuario' onClick={cerrarSesion}>Cerrar sesión</button>
          </div>
        ) : (
          <div className='inicio-sesion'>
            <input
              type="text"
              placeholder="Correo electrónico"
              name="email"
              value={credenciales.email}
              onChange={handleChangeLogin}
            />
            <input
              type="password"
              placeholder="Contraseña"
              name="password"
              value={credenciales.password}
              onChange={handleChangeLogin}
            />
            <button type="button" className='boton-usuario' onClick={iniciarSesion}>Iniciar Sesión</button>
            {errorLogin && <p className='alerta-error'>{errorLogin}</p>}
          </div>
        )}

        <Link to="/registro">
          <button className='boton-usuario'>Registrarse</button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
