import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { ButtonWithSpinner } from '../components/Spinner';

const Register = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', rol: 'consumidor', zona: '', telefono: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      showToast('¡Cuenta creada con éxito!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error al registrarse', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Crea tu cuenta</h2>
      <p className="text-gray-500 mb-8">Únete a la red de comercio local</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
          <input 
            type="text" 
            placeholder="Ej: Juan Pérez" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
            value={formData.nombre} 
            onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            placeholder="tu@email.com" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono / WhatsApp</label>
          <input 
            type="text" 
            placeholder="Ej: +54 9 11 1234-5678" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
            value={formData.telefono} 
            onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            placeholder="Mínimo 6 caracteres" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Zona / Barrio</label>
          <input 
            type="text" 
            placeholder="Ej: Palermo, CABA" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" 
            value={formData.zona} 
            onChange={(e) => setFormData({...formData, zona: e.target.value})} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">¿Qué quieres hacer?</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition bg-white" 
            value={formData.rol} 
            onChange={(e) => setFormData({...formData, rol: e.target.value})}
          >
            <option value="consumidor">Quiero comprar productos locales</option>
            <option value="productor">Quiero vender mis productos</option>
          </select>
        </div>
        <ButtonWithSpinner
          type="submit"
          loading={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition transform active:scale-[0.98] mt-4"
        >
          Registrarse
        </ButtonWithSpinner>
      </form>
    </div>
  );
};

export default Register;
