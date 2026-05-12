import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

// Hook para obtener la instancia del mapa y pasarla a componentes hijos
const MapInstanceHook = ({ onMapReady }) => {
  const map = useMap();
  const mapRef = useRef(map);

  useEffect(() => {
    if (onMapReady && mapRef.current) {
      onMapReady(mapRef.current);
    }
  }, [onMapReady, map]);

  return null;
};

export default MapInstanceHook;
