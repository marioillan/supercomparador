import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useAuth } from './AuthContext';
import Header from './header';
import Footer from './footer';
import './supermercados.css';
import diaImg from './assets/dialogo.png';
import alcampoImg from './assets/alcampologo.png';
import hipercorImg from './assets/hipercorlogo.png';
import carrefourImg from './assets/carrefourlogo.png';
import masImg from './assets/maslogo.png';

function Supermercados() {
  const { usuario, isLoading } = useAuth();
  const [ciudad, setCiudad] = useState(null);
  const [coordenadas, setCoordenadas] = useState(null);
  const [supermercados, setSupermercados] = useState([]);
  const LIBRERIAS_GOOGLE = ['places'];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBt6pZaXpUv947P3rFd9MkziQMYVn2GB2U',
    libraries: LIBRERIAS_GOOGLE,
  });

  // Paso 1: Obtener la ciudad del usuario
  useEffect(() => {
    console.log('useEffect usuario ejecutado. Usuario:', usuario);
    const obtenerCiudad = async () => {
      if (usuario?.id) {
        const { data, error } = await supabase
          .from('usuarios')
          .select('ciudad')
          .eq('id', usuario.id)
          .single();

        console.log('Ciudad obtenida de Supabase:', data?.ciudad);
        if (data?.ciudad) {
          setCiudad(data.ciudad);
        }
      }
    };

    if (usuario) {
      obtenerCiudad();
    }
  }, [usuario]);

  // Paso 2: Convertir ciudad a coordenadas
  useEffect(() => {
    if (ciudad && isLoaded) {
      console.log('Ciudad a geocodificar:', ciudad);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: `${ciudad}, España` }, (resultados, estado) => {
      console.log('Resultado geocoding:', resultados);
      console.log('Estado geocoding:', estado);
        if (estado === 'OK' && resultados.length > 0) {
          const ubicacion = resultados[0].geometry.location;
          setCoordenadas({ lat: ubicacion.lat(), lng: ubicacion.lng() });
        } else {
          console.error('No se pudo geocodificar la ciudad');
        }
      });
    }
  }, [ciudad, isLoaded]);

  // Paso 3: Buscar supermercados en la ciudad
  useEffect(() => {
    if (coordenadas && isLoaded) {
      const servicio = new window.google.maps.places.PlacesService(document.createElement('div'));

      const solicitud = {
        location: coordenadas,
        radius: 3000,
        type: 'supermarket',
      };

      servicio.nearbySearch(solicitud, (resultados, estado) => {
        if (estado === window.google.maps.places.PlacesServiceStatus.OK && resultados) {
          const filtrados = resultados.filter((lugar) => {
            const nombre = lugar.name.toLowerCase();
            return (
              nombre.includes('mercadona') ||
              nombre.includes('dia') ||
              nombre.includes('alcampo') ||
              nombre.includes('carrefour') ||
              nombre.includes('supermercado mas')
            );
          });
          setSupermercados(filtrados);
        }
      });
    }
  }, [coordenadas, isLoaded]);

  return (
    <>
      <Header />
      <main className='mainSupermercados'>
        <h2>Supermercados cercanos</h2>
        <div className='supermercados'>
        {!usuario && !isLoading ? (
          <p>Debes iniciar sesión para ver supermercados en tu ciudad.</p>
        ) : isLoaded && coordenadas ? (
          <GoogleMap
            center={coordenadas}
            zoom={13}
            mapContainerClassName='contenedor-mapa'
          >
            {supermercados.map((lugar, index) => (
              <Marker
                key={index}
                position={{
                  lat: lugar.geometry.location.lat(),
                  lng: lugar.geometry.location.lng(),
                }}
                title={lugar.name}
              />
            ))}
          </GoogleMap>
        ) : (
          <p>Cargando mapa...</p>
        )}

        <div className='supermercadosDisponibles'>
            <div className='supermercadoCard'>
              <div className='imgSupermercado'><a href="https://www.dia.es/?gad_source=1&gad_campaignid=22340470548&gbraid=0AAAAADdKPtKdRnB_OGl7aKKjSTcisHkbn&gclid=CjwKCAjw3MXBBhAzEiwA0vLXQSg3ynHPJzuqPh_PDpfXuqPakS8FNJftgxFloquahCAkfNdnE8CX2BoCwUYQAvD_BwE&gclsrc=aw.ds"><img src={diaImg} alt="img DIA" /></a></div>
              <div className='infoSupermercado'>
                <h4>Supermercados DIA</h4>
                <p>Horario:</p><p>9:00-21:00</p>
              </div>
            </div>
            <div className='supermercadoCard'>
              <div className='imgSupermercado'><a href="https://www.compraonline.alcampo.es/?srsltid=AfmBOopP0WO_QYNue_PhWIwA4NRJ7l5Mwac_0YPWYEsVb9OOyoJwYSG3"><img src={alcampoImg} alt="img alcampo" /></a></div>
              <div className='infoSupermercado'>
                <h4>Supermercados Alcampo</h4>
                <p>Horario:</p><p>9:00-22:00</p>
              </div>
            </div>
            <div className='supermercadoCard'>
              <div className='imgSupermercado'><a href="https://www.hipercor.es/"><img src={hipercorImg} alt="img hipercor" /></a></div>
              <div className='infoSupermercado'>
                <h4>Supermercados Hipercor</h4>
                <p>Horario:</p><p>10:00-22:00</p>
              </div>
            </div>
            <div className='supermercadoCard'>
              <div className='imgSupermercado'><a href="https://www.carrefour.es/"><img src={carrefourImg} alt="img carrefour" /></a></div>
              <div className='infoSupermercado'>
                <h4>Supermercados Carrefour</h4>
                <p>Horario:</p><p>9:00-22:00</p>
              </div>
            </div>
            <div className='supermercadoCard'>
              <div className='imgSupermercado'><a href="https://www.supermercadosmas.com/"><img src={masImg} alt="img mas" /></a></div>
              <div className='infoSupermercado'>
                <h4>Supermercados MAS</h4>
                <p>Horario:</p><p>9:00-21:30</p>
              </div>
            </div>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}

export default Supermercados;