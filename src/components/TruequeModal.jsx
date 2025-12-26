import React, { useState, useEffect } from 'react';
import { productService, truequeService } from '../services/api';
import { useToast } from '../context/ToastContext';

const TruequeModal = ({ isOpen, onClose, targetProducerId, targetProducerName, targetProducts }) => {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ofertaA: { producto: '', cantidad: 1 },
    ofertaB: { producto: '', cantidad: 1 },
    ajusteTokens: 0,
    mensaje: ''
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchMyProducts();
    }
  }, [isOpen]);

  const fetchMyProducts = async () => {
    try {
      const res = await productService.getMe();
      setMyProducts(res.data);
      setLoading(false);
    } catch (err) {
      showToast('Error al cargar tus productos', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ofertaA.producto || !formData.ofertaB.producto) {
      return showToast('Debes seleccionar ambos productos para el trueque', 'error');
    }

    try {
      await truequeService.create({
        productorB: targetProducerId,
        ...formData
      });
      showToast('Propuesta de trueque enviada', 'success');
      onClose();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Proponer Trueque</h2>
            <p className="text-sm text-gray-500 font-medium">Con {targetProducerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Oferta A (Mía) */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-green-600 uppercase tracking-widest">Lo que ofreces</label>
            <div className="grid grid-cols-3 gap-3">
              <select 
                className="col-span-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.ofertaA.producto}
                onChange={(e) => setFormData({...formData, ofertaA: {...formData.ofertaA, producto: e.target.value}})}
              >
                <option value="">Selecciona un producto...</option>
                {myProducts.map(p => (
                  <option key={p._id} value={p._id}>{p.nombre} (${p.precio})</option>
                ))}
              </select>
              <input 
                type="number" 
                min="1"
                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Cant."
                value={formData.ofertaA.cantidad}
                onChange={(e) => setFormData({...formData, ofertaA: {...formData.ofertaA, cantidad: parseInt(e.target.value)}})}
              />
            </div>
          </div>

          {/* Oferta B (Del otro) */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest">Lo que pides</label>
            <div className="grid grid-cols-3 gap-3">
              <select 
                className="col-span-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.ofertaB.producto}
                onChange={(e) => setFormData({...formData, ofertaB: {...formData.ofertaB, producto: e.target.value}})}
              >
                <option value="">Selecciona un producto...</option>
                {targetProducts.map(p => (
                  <option key={p._id} value={p._id}>{p.nombre} (${p.precio})</option>
                ))}
              </select>
              <input 
                type="number" 
                min="1"
                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Cant."
                value={formData.ofertaB.cantidad}
                onChange={(e) => setFormData({...formData, ofertaB: {...formData.ofertaB, cantidad: parseInt(e.target.value)}})}
              />
            </div>
          </div>

          {/* Ajuste de Tokens */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Ajuste de Tokens (Opcional)</label>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-gray-500 outline-none"
                placeholder="Ej: 2 (das tokens) o -2 (pides tokens)"
                value={formData.ajusteTokens}
                onChange={(e) => setFormData({...formData, ajusteTokens: parseInt(e.target.value) || 0})}
              />
              <div className="text-[10px] font-bold text-gray-400 max-w-[150px] leading-tight">
                Usa valores positivos para ofrecer tokens extra, o negativos para pedirlos.
              </div>
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Mensaje para el productor</label>
            <textarea 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none min-h-[80px]"
              placeholder="Hola! Me interesa cambiar mi..."
              value={formData.mensaje}
              onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 text-white p-4 rounded-2xl font-black text-lg shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-[0.98]"
          >
            Enviar Propuesta
          </button>
        </form>
      </div>
    </div>
  );
};

export default TruequeModal;
