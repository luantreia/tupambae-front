import React, { useState, useEffect, useContext } from 'react';
import { orderService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useRol } from '../hooks/useRol';
import { useToast } from '../context/ToastContext';

const MyOrders = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const { esProductor } = useRol();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMe();
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders', err);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o._id === orderId ? { ...o, estado: newStatus } : o));
      showToast(`Pedido ${newStatus}`, 'success');
      
      // Si se completa, refrescar tokens
      if (newStatus === 'completado') {
        await refreshUser();
      }
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error al actualizar pedido', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pendiente: "bg-amber-100 text-amber-700 border-amber-200",
      aceptado: "bg-blue-100 text-blue-700 border-blue-200",
      rechazado: "bg-red-100 text-red-700 border-red-200",
      completado: "bg-green-100 text-green-700 border-green-200",
      cancelado: "bg-gray-100 text-gray-500 border-gray-200"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${styles[status] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          {user.rolActivo === 'productor' ? 'Gestión de Ventas' : 'Mis Pedidos'}
        </h1>
        <div className="h-1 w-24 bg-green-600 rounded-full"></div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-400 text-xl font-medium">
            {user.rolActivo === 'productor' ? 'Aún no has recibido ventas.' : 'Aún no tienes pedidos registrados.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map(o => (
            <div key={o._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        ID: {o._id.slice(-8).toUpperCase()}
                      </p>
                      <span className="text-gray-300">•</span>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(o.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {user.rolActivo === 'productor' ? o.consumidor?.nombre : o.productor?.user?.nombre}
                    </h3>
                    {user.rolActivo === 'productor' && o.consumidor?.zona && (
                      <p className="text-sm text-green-600 font-medium">📍 {o.consumidor.zona}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(o.estado)}
                  </div>
                </div>

                {/* Información de Contacto (Solo si está aceptado o completado) */}
                {(o.estado === 'aceptado' || o.estado === 'completado') && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">Contacto para coordinar:</p>
                    <div className="flex flex-wrap gap-4">
                      {user.rolActivo === 'productor' ? (
                        <>
                          {o.consumidor?.telefono && (
                            <a href={`https://wa.me/${o.consumidor.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-700">
                              <span>📱 WhatsApp:</span> {o.consumidor.telefono}
                            </a>
                          )}
                          <span className="flex items-center gap-2 text-sm font-bold text-blue-700">
                            <span>📧 Email:</span> {o.consumidor?.email}
                          </span>
                        </>
                      ) : (
                        <a href={`https://wa.me/${o.productor?.contacto?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-700">
                          <span>📱 WhatsApp Productor:</span> {o.productor?.contacto}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <ul className="space-y-2">
                    {o.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          <span className="font-bold text-gray-900">{item.cantidad || 0}x</span> {item.nombre || 'Producto'}
                          <span className="text-xs text-gray-400 ml-1">({item.unidad || 'u'})</span>
                        </span>
                        <span className="font-medium text-gray-900">
                          ${((item.precio || 0) * (item.cantidad || 0)).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-500">Total</span>
                    <span className="text-2xl font-black text-green-700">
                      ${(o.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {user.rolActivo === 'productor' && o.estado === 'pendiente' && (
                    <>
                      <button 
                        onClick={() => updateStatus(o._id, 'aceptado')}
                        className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-100"
                      >
                        Aceptar Pedido
                      </button>
                      <button 
                        onClick={() => updateStatus(o._id, 'rechazado')}
                        className="flex-1 min-w-[140px] bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 py-3 rounded-xl font-bold transition-colors"
                      >
                        Rechazar
                      </button>
                    </>
                  )}

                  {user.rolActivo === 'productor' && o.estado === 'aceptado' && (
                    <button 
                      onClick={() => updateStatus(o._id, 'completado')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-100"
                    >
                      Marcar como Entregado
                    </button>
                  )}

                  {(o.estado === 'pendiente' || (o.estado === 'aceptado' && user.rolActivo === 'consumidor')) && (
                    <button 
                      onClick={() => updateStatus(o._id, 'cancelado')}
                      className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl font-bold transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
