import React, { useState } from 'react';
import { PRODUCT_CATEGORIES } from '../constants/categories';

const ProductForm = ({ initialData, onSubmit, buttonText, loading }) => {
  const [formData, setFormData] = useState(initialData || {
    nombre: '',
    precio: '',
    unidad: 'unidad',
    categoria: PRODUCT_CATEGORIES[0].key,
    tags: '',
    disponible: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process tags: string to array
    const processedData = {
      ...formData,
      precio: parseFloat(formData.precio),
      tags: typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
        : formData.tags
    };
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre */}
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre del Producto *</label>
        <input 
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Miel de Monte"
          className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700"
          required
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Categoría *</label>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, categoria: cat.key }))}
              className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                formData.categoria === cat.key 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Precio y Unidad */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Precio ($) *</label>
          <input 
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Unidad</label>
          <select 
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700 appearance-none"
          >
            <option value="unidad">Por Unidad</option>
            <option value="kg">Por Kilo (kg)</option>
            <option value="litro">Por Litro (L)</option>
            <option value="docena">Por Docena</option>
            <option value="bolsa">Por Bolsa</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Etiquetas (Opcional)</label>
        <input 
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Orgánico, Sin TACC, Casero..."
          className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700"
        />
        <p className="text-[9px] text-gray-400 font-medium mt-2 ml-1 uppercase tracking-tighter">Separa con comas para agregar varias</p>
      </div>

      {/* Submit */}
      <button 
        type="submit"
        disabled={loading}
        className={`w-full p-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-xl ${
          loading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100 active:scale-[0.98]'
        }`}
      >
        {loading ? 'Procesando...' : buttonText}
      </button>
    </form>
  );
};

export default ProductForm;
