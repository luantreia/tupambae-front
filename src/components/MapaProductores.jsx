import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { getCategoryIcon, getCategoryLabel } from '../constants/categories';

// Fix para los iconos de Leaflet en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Componente para controlar el movimiento del mapa
const MapController = ({ center, zoom, forceFly }) => {
  const map = useMap();
  useEffect(() => {
    if (center && forceFly) {
      map.flyTo(center, zoom || 14, {
        duration: 1.5
      });
    }
  }, [center, zoom, map, forceFly]);
  return null;
};

// Componente para capturar clicks y seleccionar ubicación manual
const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

// Función para agrupar productores por cercanía geográfica
const groupProducersByLocation = (producers) => {
  const groups = {};
  producers.forEach(p => {
    if (p.ubicacion && p.ubicacion.lat && p.ubicacion.lng) {
      // Agrupamos por coordenadas redondeadas a 3 decimales (~110m de precisión)
      const key = `${p.ubicacion.lat.toFixed(3)},${p.ubicacion.lng.toFixed(3)}`;
      if (!groups[key]) {
        groups[key] = {
          lat: p.ubicacion.lat,
          lng: p.ubicacion.lng,
          producers: []
        };
      }
      groups[key].producers.push(p);
    }
  });
  return Object.values(groups);
};

const MapaProductores = ({ producers, center = [-34.6037, -58.3816], zoom = 12, onMapClick, userLocation }) => {
  const navigate = useNavigate();
  const groupedProducers = groupProducersByLocation(producers);
  const hasCustomCenter = !!userLocation;

  return (
    <div className="h-[450px] w-full rounded-3xl overflow-hidden shadow-inner border border-gray-100 mb-8 z-0 relative">
      <style>
        {`
          .leaflet-popup-content-wrapper {
            border-radius: 1.5rem;
            padding: 0.5rem;
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
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center} zoom={hasCustomCenter ? 14 : zoom} forceFly={hasCustomCenter} />
        {onMapClick && <ClickHandler onMapClick={onMapClick} />}

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center font-black text-[10px] uppercase tracking-widest text-green-600">
                Tu ubicación seleccionada
              </div>
            </Popup>
          </Marker>
        )}

        {groupedProducers.map((group, idx) => (
          <Marker key={idx} position={[group.lat, group.lng]}>
            <Popup minWidth={250} maxWidth={300}>
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {group.producers.length > 1 && (
                  <div className="mb-3 pb-2 border-b border-gray-100">
                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                      {group.producers.length} Productores en esta zona
                    </span>
                  </div>
                )}
                
                <div className="space-y-4">
                  {group.producers.map(p => (
                    <div key={p._id} className="group/item">
                      <h3 className="font-black text-gray-900 text-lg leading-tight mb-1 group-hover/item:text-green-600 transition-colors">
                        {p.user.nombre}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="bg-green-50 text-green-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-green-100">
                          {getCategoryIcon(p.categoria)} {getCategoryLabel(p.categoria)}
                        </span>
                        <span className="bg-gray-50 text-gray-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-gray-100">
                          📍 {p.zona}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2 italic mb-3">
                        "{p.descripcion}"
                      </p>
                      <button 
                        onClick={() => navigate(`/productor/${p._id}`)}
                        className="w-full bg-gray-900 text-white py-2 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-green-600 transition-colors shadow-sm"
                      >
                        Ver Catálogo
                      </button>
                      {group.producers.length > 1 && <div className="mt-4 border-b border-gray-50"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="bg-amber-50 p-2 text-center text-[10px] text-amber-700 font-bold uppercase tracking-widest">
        ⚠️ Ubicaciones aproximadas para proteger la privacidad de los productores
      </div>
    </div>
  );
};

export default MapaProductores;
