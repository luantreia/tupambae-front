import React, { useState, useEffect, useContext } from 'react';
import { producerService } from '../services/api';
import { Link } from 'react-router-dom';
import MapaProductores from '../components/MapaProductores';
import SkeletonLoader, { ProductListSkeleton, MapSkeleton } from '../components/SkeletonLoader';
import { useRol } from '../hooks/useRol';
import { useToast } from '../context/ToastContext';
import { useLocation } from '../context/LocationContext';

const Home = () => {
  const { esProductor, cambiarRol } = useRol();
  const { showToast } = useToast();
  const { 
    coords, 
    radio, 
    setRadio, 
    isLocating, 
    setIsLocating, 
    locationSource, 
    updateLocation, 
    clearLocation 
  } = useLocation();
  
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualMode, setManualMode] = useState(false);

  const fetchProducers = async (params = {}) => {
    setLoading(true);
    try {
      const res = await producerService.getAll(params);
      setProducers(res.data);
    } catch (err) {
      console.error('Error fetching producers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords) {
      fetchProducers({ ...coords, radio });
    } else {
      fetchProducers();
    }
  }, [coords, radio]);

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      showToast('Tu navegador no soporta geolocalización', 'error');
      setManualMode(true);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        updateLocation(newCoords, 'gps');
        setIsLocating(false);
        setManualMode(false);
        showToast('Ubicación obtenida vía GPS');
      },
      (err) => {
        showToast('No pudimos obtener tu ubicación. Podés seleccionarla manualmente en el mapa.', 'error');
        setIsLocating(false);
        setManualMode(true);
      }
    );
  };

  const handleMapClick = (latlng) => {
    if (manualMode || coords) {
      const newCoords = { lat: latlng[0], lng: latlng[1] };
      updateLocation(newCoords, 'manual');
      showToast('Ubicación seleccionada manualmente');
    }
  };

  const handleRadioChange = (e) => {
    setRadio(e.target.value);
  };

  const handleClearFilter = () => {
    clearLocation();
    setManualMode(false);
  };

  if (loading && producers.length === 0) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <MapSkeleton />
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-black text-gray-800 mb-4 uppercase tracking-widest">Productores cerca de tu zona</h3>
        <ProductListSkeleton count={4} />
      </div>
    </div>
  );
}

  return (
    <div className="max-w-6xl mx-auto">
      {esProductor && (
        <div className="mb-8 bg-gray-900 text-white p-4 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛒</span>
            <p className="text-sm font-medium">
              Estás en <strong>Modo Productor</strong>. Cambiá a modo consumidor para realizar pedidos.
            </p>
          </div>
          <button 
            onClick={cambiarRol}
            className="bg-white text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all"
          >
            Cambiar ahora
          </button>
        </div>
      )}
      
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tighter">Mercado Local</h1>
          <p className="text-lg text-gray-600 font-medium">Conecta directamente con productores de tu zona</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <button 
            onClick={handleNearMe}
            disabled={isLocating}
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
              coords && locationSource === 'gps' 
                ? 'bg-green-600 text-white shadow-lg shadow-green-100' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isLocating ? (
              <>
                <span className="animate-spin">⏳</span> Buscando...
              </>
            ) : (
              <>
                <span>📍</span> {coords && locationSource === 'gps' ? 'GPS Activo' : 'Cerca de mí'}
              </>
            )}
          </button>

          <button 
            onClick={() => setManualMode(!manualMode)}
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              manualMode || (coords && locationSource === 'manual')
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>🔍</span> {coords && locationSource === 'manual' ? 'Zona Manual' : 'Buscar en Mapa'}
          </button>
          
          {coords && (
            <>
              <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>
              <select 
                value={radio} 
                onChange={handleRadioChange}
                className="bg-gray-50 border-none text-xs font-black uppercase tracking-widest rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="3">3 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
              </select>
              <button 
                onClick={handleClearFilter}
                className="bg-red-50 text-red-500 hover:bg-red-100 p-2 rounded-xl transition-colors"
                title="Quitar filtro"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
        </div>
      </header>

      {manualMode && !coords && (
        <div className="mb-6 bg-amber-50 border border-amber-100 p-4 rounded-2xl animate-in fade-in slide-in-from-left duration-300">
          <p className="text-amber-800 text-sm font-bold flex items-center gap-2">
            <span>👆</span> Hacé click en cualquier punto del mapa para buscar productores en esa zona.
          </p>
        </div>
      )}

      <MapaProductores 
        producers={producers} 
        center={coords ? [coords.lat, coords.lng] : undefined} 
        onMapClick={handleMapClick}
        userLocation={coords ? [coords.lat, coords.lng] : null}
      />

      {producers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-100 text-center">
          <div className="text-6xl mb-4">🚜</div>
          <p className="text-xl text-gray-400 font-black uppercase tracking-widest">No se encontraron productores</p>
          <p className="text-gray-400 mt-2">Probá ampliando el radio de búsqueda o seleccionando otra zona.</p>
          <button onClick={handleClearFilter} className="text-green-600 font-black mt-6 hover:underline uppercase text-sm tracking-widest">Ver todos los productores</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {producers.map(p => (
            <div key={p._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="h-3 bg-green-600 w-full"></div>
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-green-700 transition-colors">{p.user?.nombre}</h2>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">📍 {p.zona}</span>
                </div>
                <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed italic">"{p.descripcion}"</p>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Link 
                  to={`/productor/${p._id}`} 
                  className="block w-full text-center bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-md"
                >
                  Ver Productos
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
