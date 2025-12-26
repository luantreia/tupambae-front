import React, { useState } from 'react';
import { useRol } from '../hooks/useRol';
import { useToast } from '../context/ToastContext';

const RoleSwitch = () => {
  const { rolActivo, cambiarRol, tieneAmbosRoles, esProductor, activarModoProductor } = useRol();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    setLoading(true);
    try {
      await cambiarRol();
      const nuevoModo = !esProductor ? 'Productor' : 'Consumidor';
      showToast(`Modo ${nuevoModo} activado`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    setLoading(true);
    try {
      await activarModoProductor();
      showToast('¡Modo Productor activado! Ya podés crear tu perfil.', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!tieneAmbosRoles) {
    return (
      <button 
        onClick={handleActivate}
        disabled={loading}
        className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 transition-all border border-amber-200 flex items-center gap-2"
      >
        <span>👨‍🌾</span> Quiero vender
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modo actual:</span>
        <div className="flex items-center bg-gray-100 p-1 rounded-2xl w-fit">
          <button
            onClick={!esProductor ? null : handleSwitch}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              !esProductor 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Consumidor
          </button>
          <button
            onClick={esProductor ? null : handleSwitch}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              esProductor 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Productor
          </button>
        </div>
      </div>
      
      <button 
        onClick={handleSwitch}
        disabled={loading}
        className="text-[9px] font-bold text-gray-400 hover:text-green-600 uppercase tracking-tighter text-left pl-2 transition-colors"
      >
        {esProductor 
          ? 'Cambiar a modo Consumidor – Explorá productores y realizá pedidos' 
          : 'Cambiar a modo Productor – Gestioná tus productos y pedidos'}
      </button>
    </div>
  );
};

export default RoleSwitch;
