import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './header';
import Footer from './footer';

function Catalogos() {

  const [folletosDia, setFolletosDia] = useState([]);

  return (
    <>
        <Header />

      <main>


      </main>

      <Footer />

    </>

  );
}

export default Catalogos;