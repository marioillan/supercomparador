import { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import './registro.css';
import { Link } from 'react-router-dom';
import Header from './header';

function Registro() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombre: '',
    apellidos: '',
    usuario: ''
  });

    const [mensajeError, setMensajeError] = useState('');
    const [registroCompletado, setRegistroCompletado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensajeError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Valida si se han rellenado todos los campos
    if (!form.nombre || !form.apellidos || !form.usuario || !form.email || !form.password) {
      setMensajeError('Por favor, completa todos los campos.');
      return;
    }

    //Verifica si el usuario existe ya
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', form.usuario)
      .single();

      const { data: correoExistente } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', form.email)
      .single();

    if (usuarioExistente) {
      setMensajeError('El nombre de usuario ya está en uso. Elige otro.');
      return;
    }

    if (correoExistente) {
      setMensajeError('El correo electrónico ya está en uso. Introduce otro.');
      return;
    }

    //Utilizamos Supabase Auth para registrar al usuario con el email y la contraseña
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (error) {
      alert('Error al registrar: ' + error.message);
      return;
    }

    if (!data.user) {
      alert("Error: El usuario no está confirmado o no se ha creado correctamente.");
      return;
    }

    //Igualmente insertamos los datos en la tabla de usuarios de la base de datos
    const userId = data.user.id;
    const { error: dbError } = await supabase.from('usuarios').insert({
      id: userId,
      nombre: form.nombre,
      apellidos: form.apellidos,
      usuario: form.usuario,
      email: form.email,
      fecha_registro: new Date().toISOString()
    });

    if (dbError) {
      alert('Error al guardar en la base de datos: ' + dbError.message);
    } else {
      setRegistroCompletado(true);
    }
  };

  return (
    <>
        <Header />
          <main>

            {registroCompletado ? (
                <div className="mensaje-confirmacion">
                    <h2>Registro exitoso</h2>
                    <Link to="/"><p>Volver al Inicio</p></Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="formulario-registro">
                    {mensajeError && <div className="alerta-error">{mensajeError}</div>}

                    <input name="nombre" placeholder="Nombre" onChange={handleChange} />
                    <input name="apellidos" placeholder="Apellidos" onChange={handleChange} />
                    <input name="usuario" placeholder="Usuario" onChange={handleChange} />
                    <input name="email" placeholder="Email" type="email" onChange={handleChange} />
                    <input name="password" placeholder="Contraseña" type="password" onChange={handleChange} />
                    <button type="submit">Registrarse</button>
                </form>
            )}
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

export default Registro;
