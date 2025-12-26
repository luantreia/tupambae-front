import React, { useState, useEffect, useContext } from 'react';
import { productService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getCategoryIcon, getCategoryLabel } from '../constants/categories';

const MisPublicaciones = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.rolActivo !== 'productor') {
        navigate('/');
      } else {
        fetchMyProducts();
      }
    }
  }, [user, authLoading]);

  const fetchMyProducts = async () => {
    try {
      const res = await productService.getMe();
      setProducts(res.data);
    } catch (err) {
      showToast('Error al cargar tus publicaciones', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = !product.disponible;
      await productService.update(product._id, { disponible: newStatus });
      setProducts(products.map(p => p._id === product._id ? { ...p, disponible: newStatus } : p));
      showToast(`Producto ${newStatus ? 'activado' : 'pausado'} correctamente`);
    } catch (err) {
      showToast('Error al actualizar el estado', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) return;
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p._id !== id));
      showToast('Publicación eliminada', 'success');
    } catch (err) {
      showToast('Error al eliminar la publicación', 'error');
    }
  };

  if (loading) return <div className="text-center py-20 font-black text-gray-400 uppercase tracking-widest">Cargando tus publicaciones...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Mis Publicaciones</h1>
          <p className="text-gray-500 font-medium">Gestioná tu catálogo de productos y disponibilidad</p>
        </div>
        <Link 
          to="/crear-producto" 
          className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-green-700 shadow-lg shadow-green-100 transition-all text-center"
        >
          + Nueva Publicación
        </Link>
      </div>

      {/* Dashboard de métricas (Estructura futura) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
          <p className="text-3xl font-black text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Activos</p>
          <p className="text-3xl font-black text-green-600">{products.filter(p => p.disponible).length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pausados</p>
          <p className="text-3xl font-black text-amber-500">{products.filter(p => !p.disponible).length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ventas (Próximamente)</p>
          <p className="text-3xl font-black text-gray-300">--</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border-2 border-dashed border-gray-100 text-center">
          <div className="text-6xl mb-6">📦</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">No tenés publicaciones aún</h2>
          <p className="text-gray-500 mb-8">Empezá a vender tus productos en la red de Tupambaé.</p>
          <Link 
            to="/crear-producto" 
            className="text-green-600 font-black uppercase tracking-widest text-sm hover:underline"
          >
            Crear mi primera publicación
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map(product => (
            <div 
              key={product._id} 
              className={`bg-white p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                product.disponible ? 'border-gray-100 shadow-sm' : 'border-gray-200 bg-gray-50/50 opacity-75'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg" title={getCategoryLabel(product.categoria)}>{getCategoryIcon(product.categoria)}</span>
                  <h3 className="text-xl font-black text-gray-900">{product.nombre}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                    product.disponible 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {product.disponible ? 'Activo' : 'Pausado'}
                  </span>
                </div>
                <p className="text-2xl font-black text-green-600">
                  ${product.precio} <span className="text-gray-400 text-sm font-normal">/ {product.unidad}</span>
                </p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.map((tag, i) => (
                      <span key={i} className="text-[8px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(product)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                    product.disponible 
                      ? 'bg-white text-amber-600 border-amber-100 hover:bg-amber-50' 
                      : 'bg-white text-green-600 border-green-100 hover:bg-green-50'
                  }`}
                >
                  {product.disponible ? 'Pausar' : 'Activar'}
                </button>

                <button
                  onClick={() => navigate(`/editar-producto/${product._id}`)}
                  className="flex-1 md:flex-none px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-gray-100 hover:bg-gray-50 text-gray-600"
                >
                  Editar
                </button>
                
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Eliminar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPublicaciones;
