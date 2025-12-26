import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductForm from '../components/ProductForm';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useContext(AuthContext);
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getAll(); // We don't have getById yet, but we can filter or add it
        const found = res.data.find(p => p._id === id);
        
        if (!found) {
          showToast('Producto no encontrado', 'error');
          navigate('/mis-publicaciones');
          return;
        }

        // Check ownership (simplified for MVP)
        setProduct({
          ...found,
          tags: found.tags ? found.tags.join(', ') : ''
        });
      } catch (err) {
        showToast('Error al cargar el producto', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await productService.update(id, data);
      showToast('Producto actualizado con éxito', 'success');
      await refreshUser();
      navigate('/mis-publicaciones');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error al actualizar', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargando producto...</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4">
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-green-600 transition-colors flex items-center gap-2 mb-4"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Editar Producto</h1>
        <p className="text-gray-500 font-medium">Actualiza la información de tu publicación.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <ProductForm 
          initialData={product}
          onSubmit={handleSubmit}
          buttonText="Guardar Cambios"
          loading={saving}
        />
      </div>
    </div>
  );
};

export default EditProduct;
