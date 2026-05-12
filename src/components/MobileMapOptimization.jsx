import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const MobileMapOptimization = ({ map, isMobile }) => {
  const [isTouching, setIsTouching] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(13);
  const mapRef = useRef(map);

  // Optimizaciones para móvil
  useEffect(() => {
    if (!map || !isMobile) return;

    // Deshabilitar zoom con scroll en móvil
    map.scrollWheelZoom.disable();
    
    // Habilitar zoom con pinch
    map.touchZoom.enable();
    
    // Optimizar rendimiento en móvil
    map.options.zoomSnap = 0.25;
    map.options.zoomDelta = 0.5;

    // Ajustar controles para móvil
    if (window.innerWidth < 768) {
      map.zoomControl.setPosition('bottomright');
      map.dragging.enable();
    }

    // Manejar zoom con doble tap
    let lastTapTime = 0;
    map.on('touchstart', () => {
      setIsTouching(true);
      const now = Date.now();
      if (now - lastTapTime < 300) {
        // Doble tap detectado - zoom in
        const currentZoom = map.getZoom();
        map.setZoom(Math.min(currentZoom + 1, 18));
      }
      lastTapTime = now;
    });

    map.on('touchend', () => {
      setIsTouching(false);
    });

    return () => {
      map.off('touchstart');
      map.off('touchend');
    };
  }, [map, isMobile]);

  // Zoom optimizado para móvil
  const handleZoom = useCallback((delta) => {
    if (!mapRef.current) return;
    
    const currentZoom = mapRef.current.getZoom();
    const newZoom = Math.max(10, Math.min(currentZoom + delta, 18));
    
    // Animación suave solo en desktop
    if (!isMobile) {
      mapRef.current.flyTo(mapRef.current.getCenter(), newZoom, {
        duration: 0.5
      });
    } else {
      mapRef.current.setView(mapRef.current.getCenter(), newZoom);
    }
    
    setZoomLevel(newZoom);
  }, [map, isMobile]);

  // Navegación táctil optimizada
  const TouchNavigation = () => {
    if (!mapRef.current || !isMobile) return null;

    return (
      <div className="absolute bottom-20 left-4 z-10 md:hidden">
        <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
          {/* Botón de zoom in */}
          <button
            onClick={() => handleZoom(1)}
            className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Acercar mapa"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H8" />
            </svg>
          </button>

          {/* Botón de zoom out */}
          <button
            onClick={() => handleZoom(-1)}
            className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Alejar mapa"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          {/* Botón de centrar */}
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    mapRef.current.flyTo([latitude, longitude], 16);
                  },
                  () => {
                    console.warn('No se pudo obtener la ubicación');
                  }
                );
              }
            }}
            className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Centrar en mi ubicación"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 0-2.827 0l-4.244-4.243a8 8 0 0 0-.001.004l4.244 4.244a8 8 0 0 0 .001-.004l4.244-4.244a8 8 0 0 0-.001.004l-4.244-4.244a8 8 0 0 0-.001.004z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v-2m0 0v2m0 0h-2m2 0h2" />
            </svg>
          </button>

          {/* Indicador de zoom */}
          <div className="text-xs text-gray-600 text-center font-medium">
            {zoomLevel}
          </div>
        </div>
      </div>
    );
  };

  // Feedback táctil visual
  const TouchFeedback = () => {
    return (
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
          isTouching ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-green-500/10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 bg-green-500/20 rounded-full border-2 border-green-500"></div>
        </div>
      </div>
    );
  };

  if (!isMobile) return null;

  return (
    <>
      <TouchNavigation />
      <TouchFeedback />
    </>
  );
};

export default MobileMapOptimization;
