import React, { createContext, useState, useContext, useCallback } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [radio, setRadio] = useState(5);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSource, setLocationSource] = useState(null); // 'gps' | 'manual'

  const updateLocation = useCallback((newCoords, source = 'manual') => {
    setCoords(newCoords);
    setLocationSource(source);
  }, []);

  const clearLocation = useCallback(() => {
    setCoords(null);
    setLocationSource(null);
  }, []);

  return (
    <LocationContext.Provider value={{ 
      coords, 
      radio, 
      setRadio, 
      isLocating, 
      setIsLocating, 
      locationSource, 
      updateLocation, 
      clearLocation 
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation debe usarse dentro de un LocationProvider');
  }
  return context;
};
