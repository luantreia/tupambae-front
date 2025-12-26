import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import VisibilityToggle from '../components/VisibilityToggle';

const EditUserProfile = () => {
  const { user, setUser, logout, refreshUser } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    zona: ''
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        zona: user.zona || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.updateMe(formData);
      
      // Actualizar el contexto global del usuario con los datos frescos del servidor
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      showToast('Perfil actualizado con éxito', 'success');
      
      // Pequeño delay para que el usuario vea el toast antes de navegar
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err) {
      // El error ya es manejado por el interceptor de la API (Toast global)
      console.error('Error al actualizar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción desactivará tu perfil y tus productos, pero mantendrá el historial de tus transacciones por seguridad. No podrás volver a iniciar sesión con este correo.')) {
      setDeleting(true);
      try {
        await authService.deleteAccount(user._id);
        showToast('Cuenta eliminada con éxito', 'success');
        logout();
        navigate('/');
      } catch (err) {
        console.error('Error al eliminar cuenta:', err);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Mi Perfil</h2>
          <p className="text-gray-500 font-medium">Gestiona tu información personal</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              <span className="text-xs">⭐</span>
              <span className="text-xs font-black text-amber-700">{user?.reputationScore || 0} Reputación</span>
            </div>
            <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
              <div 
                className="h-full bg-amber-400 transition-all duration-500" 
                style={{ width: `${Math.min((user?.reputationScore || 0) / 5, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        {user?.rolActivo === 'productor' && (
          <div className="group relative flex flex-col items-end">
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2 shadow-sm">
              <span className="text-xl">🪙</span>
              <span className="text-lg font-black">{(user.tokens / 100).toFixed(1)}</span>
            </div>
            {/* Tooltip */}
            <div className="absolute top-full mt-2 right-0 w-48 bg-gray-900 text-white text-[10px] p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl font-bold leading-relaxed">
              <p className="mb-1 text-blue-400 uppercase tracking-widest">Sistema de Tokens</p>
              <p className="mb-2">Los tokens se ganan participando en la comunidad.</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Ganás tokens cuando vendés o intercambiás.</li>
                <li>• Los tokens no se compran ni se venden.</li>
                <li>• Sirven para mejorar tu experiencia en la app.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nombre Completo</label>
          <input 
            type="text" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition font-bold text-gray-700" 
            value={formData.nombre} 
            onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
          <input 
            type="email" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition font-bold text-gray-700" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Teléfono / WhatsApp</label>
          <input 
            type="text" 
            placeholder="Ej: +54 9 11 1234-5678"
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition font-bold text-gray-700" 
            value={formData.telefono} 
            onChange={(e) => setFormData({...formData, telefono: e.target.value})} 
            required 
          />
          <p className="mt-2 text-[10px] text-amber-600 font-bold uppercase tracking-tighter">
            * Obligatorio para realizar pedidos
          </p>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Zona / Barrio</label>
          <input 
            type="text" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition font-bold text-gray-700" 
            value={formData.zona} 
            onChange={(e) => setFormData({...formData, zona: e.target.value})} 
            required 
          />
        </div>

        <VisibilityToggle 
          user={user} 
          onUpdate={async () => {
            await refreshUser();
          }} 
        />

        <div className="pt-4 flex gap-3">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-4 rounded-2xl transition uppercase tracking-widest text-xs"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading || deleting}
            className="flex-2 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-green-100 transition transform active:scale-[0.98] uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-4">Zona de Peligro</h3>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="w-full p-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition flex items-center justify-center gap-2 text-xs uppercase tracking-widest border border-red-100"
        >
          {deleting ? 'Eliminando...' : 'Eliminar mi cuenta'}
        </button>
      </div>
    </div>
  );
};

export default EditUserProfile;
