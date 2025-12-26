import React, { useState, useEffect, useMemo, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { producerService, productService } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_CATEGORIES, getCategoryIcon, getCategoryLabel } from '../constants/categories';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createCustomIcon = (group, mode) => {
  const count = group.items.length;
  
  if (mode === 'productores') {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-xl border-2 border-green-600 transform hover:scale-110 transition-transform">
          <span class="text-xl">👨‍🌾</span>
          ${count > 1 ? `<span class="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">${count}</span>` : ''}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
  }

  // Mode: Productos
  const categories = [...new Set(group.items.map(p => p.categoria))];
  const isMixed = categories.length > 1;
  const mainIcon = isMixed ? '📦' : getCategoryIcon(categories[0]);
  const bgColor = isMixed ? 'bg-gray-900' : 'bg-white';
  const borderColor = isMixed ? 'border-gray-700' : 'border-green-500';

  // Stack logic
  const stackCount = Math.min(count, 3);
  let stackHtml = '';
  if (!isMixed && count > 1) {
    for (let i = 1; i < stackCount; i++) {
      stackHtml += `<div class="absolute inset-0 ${bgColor} rounded-full border-2 ${borderColor} shadow-md" style="transform: translate(${i * 4}px, -${i * 4}px); z-index: -${i}"></div>`;
    }
  }

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative w-10 h-10">
        ${stackHtml}
        <div class="relative flex items-center justify-center w-10 h-10 ${bgColor} rounded-full shadow-xl border-2 ${borderColor} transform hover:scale-110 transition-transform z-10">
          <span class="text-xl">${mainIcon}</span>
          ${count > 1 ? `<span class="absolute -top-2 -right-2 ${isMixed ? 'bg-gray-900' : 'bg-green-600'} text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">${count}</span>` : ''}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
};

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13);
  }, [center, map]);
  return null;
};

const ExplorarMapa = () => {
  const navigate = useNavigate();
  const { coords } = useLocation();
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState('productores'); // 'productores' | 'productos'
  const [producers, setProducers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState('');
  const [soloConfianza, setSoloConfianza] = useState(false);
  const [minReputacion, setMinReputacion] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          soloConfianza,
          minReputacion: minReputacion > 0 ? minReputacion : undefined
        };
        const [resP, resPr] = await Promise.all([
          producerService.getAll(params),
          productService.getAll()
        ]);
        setProducers(resP.data);
        setProducts(resPr.data);
      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [soloConfianza, minReputacion]);

  const filteredProducts = useMemo(() => {
    // Get IDs of producers that passed the trust/reputation filter
    const validProducerIds = new Set(producers.map(p => p._id));

    return products.filter(p => {
      const matchCat = filterCategory === 'Todas' || p.categoria === filterCategory;
      const matchPrice = !maxPrice || p.precio <= parseFloat(maxPrice);
      const matchProducer = validProducerIds.has(p.productor?._id || p.productor);
      return matchCat && matchPrice && matchProducer;
    });
  }, [products, producers, filterCategory, maxPrice]);

  // Grouping logic for markers
  const markers = useMemo(() => {
    const groups = {};
    if (mode === 'productores') {
      producers.forEach(p => {
        if (p.ubicacion?.lat) {
          const key = `${p.ubicacion.lat.toFixed(4)},${p.ubicacion.lng.toFixed(4)}`;
          if (!groups[key]) groups[key] = { lat: p.ubicacion.lat, lng: p.ubicacion.lng, items: [] };
          groups[key].items.push(p);
        }
      });
    } else {
      filteredProducts.forEach(p => {
        if (p.productor?.ubicacion?.lat) {
          const key = `${p.productor.ubicacion.lat.toFixed(4)},${p.productor.ubicacion.lng.toFixed(4)}`;
          if (!groups[key]) groups[key] = { lat: p.productor.ubicacion.lat, lng: p.productor.ubicacion.lng, items: [] };
          groups[key].items.push(p);
        }
      });
    }
    return Object.values(groups);
  }, [mode, producers, filteredProducts]);

  if (loading) return (
    <div className="fixed inset-0 bg-white z-[2000] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-xs uppercase tracking-widest text-gray-400">Cargando mapa...</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-0">
      {/* Floating Controls */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md flex flex-col gap-3">
        {/* Mode Switch */}
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-white/20 flex gap-1">
          <button 
            onClick={() => setMode('productores')}
            className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              mode === 'productores' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            👨‍🌾 Productores
          </button>
          <button 
            onClick={() => setMode('productos')}
            className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              mode === 'productos' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            🍎 Productos
          </button>
        </div>

        {/* Filters Toggle */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl border border-white/20 font-black text-[10px] uppercase tracking-widest text-gray-700 flex items-center justify-between"
          >
            <span>Filtros {(filteredProducts.length !== products.length || soloConfianza || minReputacion > 0) && '•'}</span>
            <span>{showFilters ? '✕' : '⚙️'}</span>
          </button>

          {showFilters && (
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 animate-in slide-in-from-top-2 duration-200 flex flex-col gap-4">
              {mode === 'productos' && (
                <>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Categoría</label>
                    <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Todas">Todas las categorías</option>
                      {PRODUCT_CATEGORIES.map(cat => (
                        <option key={cat.key} value={cat.key}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio Máximo ($)</label>
                    <input 
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Ej: 5000"
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className={`flex items-center gap-3 cursor-pointer group ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${soloConfianza ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={soloConfianza} 
                      disabled={!user}
                      onChange={() => setSoloConfianza(!soloConfianza)} 
                    />
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${soloConfianza ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Solo Confianza</span>
                    {!user && <span className="text-[8px] text-red-400 font-bold uppercase">Inicia sesión para usar</span>}
                  </div>
                </label>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Reputación Mínima: {minReputacion}{minReputacion >= 500 ? '+' : ''}</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="500" 
                    step="10"
                    value={minReputacion}
                    onChange={(e) => setMinReputacion(e.target.value)}
                    className="w-full accent-green-600"
                  />
                </div>
              </div>

              <button 
                onClick={() => { 
                  setFilterCategory('Todas'); 
                  setMaxPrice(''); 
                  setSoloConfianza(false); 
                  setMinReputacion(0); 
                }}
                className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors text-center"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <MapContainer 
        center={coords ? [coords.lat, coords.lng] : [-34.6037, -58.3816]} 
        zoom={12} 
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController center={coords ? [coords.lat, coords.lng] : null} />

        {markers.map((group, idx) => (
          <Marker 
            key={idx} 
            position={[group.lat, group.lng]}
            icon={createCustomIcon(group, mode)}
          >
            <Popup minWidth={280} className="custom-popup">
              <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar py-2">
                {mode === 'productores' ? (
                  <div className="space-y-4">
                    {group.items.map(p => (
                      <div key={p._id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-black text-gray-900 text-lg leading-tight">{p.user?.nombre}</h3>
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                            <span className="text-[10px]">⭐</span>
                            <span className="text-[10px] font-black text-amber-700">{p.user?.reputationScore || 0}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="bg-green-50 text-green-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-green-100">
                            {p.categoria}
                          </span>
                          {p.trustLevel > 0 && (
                            <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-blue-100">
                              🤝 Nivel {p.trustLevel}
                            </span>
                          )}
                          {!p.user?.isSelecto && (
                            <span className="bg-gray-50 text-gray-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-gray-100">
                              🌐 Público
                            </span>
                          )}
                          {p.user?.isSelecto && p.trustLevel === 0 && (
                            <span className="bg-amber-50 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-amber-100">
                              🔒 Selecto
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => navigate(`/productor/${p._id}`)}
                          className="w-full bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-green-600 transition-colors"
                        >
                          Ver Perfil
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-2 pb-2 border-b border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Productos en esta zona</p>
                    </div>
                    {group.items.map(p => (
                      <div key={p._id} className="flex justify-between items-start gap-4 border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs" title={getCategoryLabel(p.categoria)}>{getCategoryIcon(p.categoria)}</span>
                            <h4 className="font-bold text-gray-900 text-sm">{p.nombre}</h4>
                          </div>
                          <p className="text-green-600 font-black text-xs">${p.precio} / {p.unidad}</p>
                          
                          {p.tags && p.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {p.tags.map((tag, i) => (
                                <span key={i} className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-[9px] text-gray-400 font-medium mt-1">Por: {p.productor?.user?.nombre}</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/productor/${p.productor?._id}`)}
                          className="bg-gray-100 text-gray-900 p-2 rounded-lg hover:bg-green-600 hover:text-white transition-all mt-1"
                        >
                          →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>
        {`
          .custom-div-icon {
            background: none !important;
            border: none !important;
          }
          .custom-popup .leaflet-popup-content-wrapper {
            border-radius: 1.5rem;
            padding: 0.5rem;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #10b981;
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default ExplorarMapa;
