import {Routes, Route, Link} from 'react-router-dom';
import Home from './home';
import Registro from './registro';
import Supermercados from './supermercados';
import Catalogos from './catalogos';
import Productos from './productos';
import MenuUsuario from './menuUsuario';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/supermercados" element={<Supermercados />} />
      <Route path="/catalogos" element={<Catalogos />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/menu-usuario" element={<MenuUsuario />} />
    </Routes>
  );
}
