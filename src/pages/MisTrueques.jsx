import React, { useState, useEffect, useContext } from 'react';
import { truequeService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const MisTrueques = () => {
  const [trueques, setTrueques] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshUser } = useContext(AuthContext);
  const { showToast } = useToast();

  const fetchTrueques = async () => {
    try {
      const res = await truequeService.getMe();
      setTrueques(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrueques();
  }, []);

  const handleStatusUpdate = async (id, nuevoEstado) => {
    try {
      await truequeService.updateStatus(id, nuevoEstado);
      showToast(`Trueque ${nuevoEstado}`, 'success');
      if (nuevoEstado === 'aceptado' || nuevoEstado === 'completado') {
        await refreshUser();
      }
      fetchTrueques();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Mis Trueques</h1>
        <p className="text-gray-500 font-medium">Gestiona tus intercambios con otros productores</p>
      </header>

      {trueques.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
          <div className="text-5xl mb-4">🤝</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay trueques aún</h3>
          <p className="text-gray-500">Explora el mapa para encontrar otros productores y proponer intercambios.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {trueques.map(t => {
            const esRecibido = t.productorB._id === user.id;
            const otroProductor = esRecibido ? t.productorA : t.productorB;
            
            return (
              <div key={t._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {/* Info del Trueque */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                          t.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                          t.estado === 'aceptado' ? 'bg-green-100 text-green-700' :
                          t.estado === 'rechazado' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {t.estado}
                        </span>
                        <h3 className="text-xl font-black text-gray-900 mt-2">
                          {esRecibido ? 'Propuesta recibida de' : 'Propuesta enviada a'} {otroProductor.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">📍 {otroProductor.zona}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ajuste</p>
                        <p className={`text-lg font-black ${t.ajusteTokens > 0 ? 'text-green-600' : t.ajusteTokens < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {t.ajusteTokens > 0 ? `+${t.ajusteTokens}` : t.ajusteTokens} tokens
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Oferta de {t.productorA.nombre}</p>
                        <p className="font-bold text-gray-800">{t.ofertaA.cantidad}x {t.ofertaA.producto?.nombre || 'Producto eliminado'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Oferta de {t.productorB.nombre}</p>
                        <p className="font-bold text-gray-800">{t.ofertaB.cantidad}x {t.ofertaB.producto?.nombre || 'Producto eliminado'}</p>
                      </div>
                    </div>

                    {t.mensaje && (
                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-xs italic text-blue-800">"{t.mensaje}"</p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="md:w-48 flex flex-col justify-center gap-2">
                    {t.estado === 'pendiente' && esRecibido && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(t._id, 'aceptado')}
                          className="w-full bg-green-600 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-700 transition-all"
                        >
                          Aceptar
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(t._id, 'rechazado')}
                          className="w-full bg-white text-red-600 border-2 border-red-100 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-50 transition-all"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {t.estado === 'aceptado' && (
                      <button 
                        onClick={() => handleStatusUpdate(t._id, 'completado')}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all"
                      >
                        Marcar Completado
                      </button>
                    )}
                    {t.estado === 'pendiente' && !esRecibido && (
                      <p className="text-center text-xs font-bold text-gray-400 italic">Esperando respuesta...</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MisTrueques;
