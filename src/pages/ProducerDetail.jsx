import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { producerService, productService, orderService, authService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useRol } from '../hooks/useRol';
import { useToast } from '../context/ToastContext';
import { getCategoryIcon, getCategoryLabel } from '../constants/categories';
import TruequeModal from '../components/TruequeModal';

const ProducerDetail = () => {
  const { id } = useParams();
  const { user, refreshUser } = useContext(AuthContext);
  const { esConsumidor, esProductor, cambiarRol } = useRol();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [producer, setProducer] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isTruequeModalOpen, setIsTruequeModalOpen] = useState(false);
  const [isContact, setIsContact] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);

  const esDuenio = user && producer && (user.id === producer.user?._id || user.id === producer.user);

  const fetchData = async () => {
    try {
      const [resP, resPr] = await Promise.all([
        producerService.getById(id),
        productService.getByProducer(id)
      ]);
      setProducer(resP.data);
      setProducts(resPr.data);
      
      if (user && resP.data.user) {
        const targetUserId = resP.data.user._id || resP.data.user;
        setIsContact(user.contacts?.includes(targetUserId));
      }
    } catch (err) {
      console.error('Error fetching producer details', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user?.contacts]);

  const handleToggleContact = async () => {
    if (!user) return navigate('/login');
    setLoadingContact(true);
    try {
      const targetUserId = producer.user._id || producer.user;
      if (isContact) {
        await authService.removeContact(targetUserId);
        showToast('Contacto eliminado', 'success');
      } else {
        await authService.addContact(targetUserId);
        showToast('Contacto agregado a tu red de confianza', 'success');
      }
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContact(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await productService.delete(productId);
      showToast('Producto eliminado', 'success');
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      showToast('Error al eliminar producto', 'error');
    }
  };

  const handleQuantity = (prodId, delta) => {
    if (esProductor) {
      showToast('Cambiá a modo Consumidor para comprar', 'error');
      return;
    }
    setCart(prev => ({
      ...prev,
      [prodId]: Math.max(0, (prev[prodId] || 0) + delta)
    }));
  };

  const handleOrder = async () => {
    if (!user) return navigate('/login');
    if (user.rolActivo === 'productor') {
      showToast('Cambiá a modo Consumidor para realizar pedidos', 'error');
      return;
    }
    
    if (!user.telefono) {
      showToast('Por favor, completa tu teléfono en tu perfil para que el productor pueda contactarte', 'error');
      navigate('/editar-perfil-usuario');
      return;
    }

    const items = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([prodId, qty]) => ({ producto: prodId, cantidad: qty }));

    if (items.length === 0) return showToast('Selecciona al menos un producto', 'error');

    try {
      await orderService.create({ productor: id, items });
      showToast('¡Pedido realizado con éxito!', 'success');
      navigate('/mis-pedidos');
    } catch (err) {
      // Interceptor maneja el error
    }
  };

  const totalItems = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
  const totalPrice = Object.entries(cart).reduce((acc, [id, qty]) => {
    const prod = products.find(p => p._id === id);
    return acc + (prod ? prod.precio * qty : 0);
  }, 0);

  if (!producer) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-green-600"></div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">{producer.user.nombre}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                <span className="text-sm">⭐</span>
                <span className="text-sm font-black text-amber-700">{producer.user.reputationScore || 0} Reputación</span>
              </div>
              {producer.trustLevel > 0 && (
                <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <span className="text-sm">🤝</span>
                  <span className="text-sm font-black text-blue-700">Nivel {producer.trustLevel} de confianza</span>
                </div>
              )}
              {(!producer.user.contacts || producer.user.contacts.length === 0) && (
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <span className="text-sm">🌐</span>
                  <span className="text-sm font-black text-gray-400">Visible públicamente</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              {user?.rolActivo === 'productor' && producer.user._id === user.id && (
                <button 
                  onClick={() => navigate('/editar-perfil')}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Editar Perfil
                </button>
              )}
              {user?.rolActivo === 'productor' && producer.user._id !== user.id && (
                <button 
                  onClick={() => setIsTruequeModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                >
                  🤝 Proponer Trueque
                </button>
              )}
            </div>
            
            {!esDuenio && user && (
              <button
                onClick={handleToggleContact}
                disabled={loadingContact}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${
                  isContact 
                    ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                    : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                }`}
              >
                {loadingContact ? '...' : isContact ? '✕ Quitar de mi red' : '✚ Agregar a mi red'}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500 mb-4">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            {getCategoryIcon(producer.categoria)} {getCategoryLabel(producer.categoria)}
          </span>
          <span className="flex items-center gap-1">📍 {producer.zona}</span>
          <span className="flex items-center gap-1">📞 {producer.contacto}</span>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-gray-100 pl-4 italic">
          {producer.descripcion}
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-green-600 w-2 h-8 rounded-full"></span>
          Productos disponibles
        </h2>
        {esDuenio && (
          <button 
            onClick={() => navigate('/crear-producto')}
            className="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center gap-2"
          >
            <span>+</span> Nuevo Producto
          </button>
        )}
      </div>
      
      <div className="grid gap-4">
        {products.map(p => (
          <div key={p._id} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm" title={getCategoryLabel(p.categoria)}>{getCategoryIcon(p.categoria)}</span>
                <h3 className="font-bold text-xl text-gray-800">{p.nombre}</h3>
              </div>
              <p className="text-green-700 font-black text-lg">
                ${p.precio} <span className="text-gray-400 text-sm font-normal">/ {p.unidad}</span>
              </p>
              {p.tags && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {esDuenio ? (
              <button 
                onClick={() => handleDeleteProduct(p._id)}
                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Eliminar producto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <button 
                  onClick={() => handleQuantity(p._id, -1)} 
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 active:scale-90 transition-transform"
                >
                  -
                </button>
                <span className="font-black text-xl w-6 text-center text-gray-800">{cart[p._id] || 0}</span>
                <button 
                  onClick={() => handleQuantity(p._id, 1)} 
                  className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 active:scale-90 transition-transform"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalItems > 0 && user?.rolActivo === 'consumidor' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t shadow-2xl md:relative md:bg-transparent md:border-none md:shadow-none md:p-0 md:mt-12 z-50">
          <button 
            onClick={handleOrder} 
            className="w-full bg-green-600 hover:bg-green-700 text-white p-5 rounded-2xl font-black text-xl shadow-xl transition-all transform active:scale-[0.98] flex justify-between items-center px-8"
          >
            <span>Confirmar Pedido</span>
            <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </button>
        </div>
      )}
      
      {totalItems === 0 && user?.rolActivo === 'consumidor' && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mt-8">
          <p className="text-gray-400 font-medium italic">Selecciona cantidades para armar tu pedido</p>
        </div>
      )}

      {esProductor && (
        <div className="mt-12 p-8 bg-amber-50 text-amber-800 rounded-3xl border border-amber-100 flex flex-col md:flex-row items-center gap-6">
          <span className="text-4xl">🔄</span>
          <div className="flex-1 text-center md:text-left">
            <p className="font-black uppercase text-xs tracking-widest mb-1">Modo Productor Activo</p>
            <p className="text-sm font-medium">
              Para realizar pedidos, necesitas cambiar a <strong>Modo Consumidor</strong>.
            </p>
          </div>
          <button 
            onClick={cambiarRol}
            className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
          >
            Cambiar a Consumidor ahora
          </button>
        </div>
      )}

      {!user && (
        <div className="mt-12 p-6 bg-gray-50 text-gray-600 rounded-2xl border border-gray-200 text-center">
          <p className="font-medium mb-4">Inicia sesión para realizar un pedido</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-green-600 transition-colors"
          >
            Ingresar ahora
          </button>
        </div>
      )}

      {/* Floating Cart Summary */}
      {!esDuenio && totalItems > 0 && (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50">
          <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tu Pedido</span>
              <span className="text-lg font-black">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} • ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button 
              onClick={handleOrder}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      <TruequeModal 
        isOpen={isTruequeModalOpen}
        onClose={() => setIsTruequeModalOpen(false)}
        targetProducerId={producer.user._id}
        targetProducerName={producer.user.nombre}
        targetProducts={products}
      />
    </div>
  );
};

export default ProducerDetail;
