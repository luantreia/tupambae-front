import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProducerDetail from './pages/ProducerDetail';
import MyOrders from './pages/MyOrders';
import CreateProduct from './pages/CreateProduct';
import EditProfile from './pages/EditProfile';
import EditUserProfile from './pages/EditUserProfile';
import MisPublicaciones from './pages/MisPublicaciones';
import ExplorarMapa from './pages/ExplorarMapa';
import EditProduct from './pages/EditProduct';
import MisTrueques from './pages/MisTrueques';
import TrustNetwork from './pages/TrustNetwork';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50/50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 md:py-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explorar" element={<ExplorarMapa />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/productor/:id" element={<ProducerDetail />} />
            <Route path="/mis-pedidos" element={<MyOrders />} />
            <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
            <Route path="/crear-producto" element={<CreateProduct />} />
            <Route path="/editar-producto/:id" element={<EditProduct />} />
            <Route path="/editar-perfil" element={<EditProfile />} />
            <Route path="/editar-perfil-usuario" element={<EditUserProfile />} />
            <Route path="/mis-trueques" element={<MisTrueques />} />
            <Route path="/red-de-confianza" element={<TrustNetwork />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
