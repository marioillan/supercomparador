import {Routes, Route, Link} from 'react-router-dom';
import Home from './home';
import Registro from './registro';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  );
}
