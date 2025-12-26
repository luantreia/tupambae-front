import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from '../context/ToastContext';

const VisibilityToggle = ({ user, onUpdate }) => {
  const [isSelecto, setIsSelecto] = useState(user?.isSelecto || false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      setIsSelecto(user.isSelecto);
    }
  }, [user]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await authService.toggleVisibility();
      const newState = res.data.isSelecto;
      setIsSelecto(newState);
      if (onUpdate) onUpdate(newState);
      showToast(res.data.msg, 'success');
    } catch (err) {
      console.error('Error al cambiar visibilidad:', err);
      showToast('No se pudo actualizar la visibilidad', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Visibilidad</span>
          <span className={`text-xs font-black ${isSelecto ? 'text-blue-600' : 'text-green-600'} transition-colors`}>
            {isSelecto ? '🔒 SELECTO' : '🌐 PÚBLICO'}
          </span>
        </div>
        
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none ${
            isSelecto ? 'bg-blue-500 shadow-lg shadow-blue-100' : 'bg-green-500 shadow-lg shadow-green-100'
          } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="sr-only">Cambiar visibilidad</span>
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center text-[10px] ${
              isSelecto ? 'translate-x-8' : 'translate-x-1'
            }`}
          >
            {loading ? (
              <div className="w-2.5 h-2.5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              isSelecto ? '🔒' : '🌐'
            )}
          </span>
        </button>
      </div>
      <p className="text-[8px] text-gray-400 font-bold px-2 leading-tight">
        {isSelecto 
          ? "* Solo tu red de confianza (hasta nivel 3) puede verte." 
          : "* Tu perfil es visible para toda la comunidad."}
      </p>
    </div>
  );
};

export default VisibilityToggle;
