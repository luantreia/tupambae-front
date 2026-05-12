import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    fontSize: 'medium', // small, medium, large
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusVisible: true
  });

  // Cargar configuración guardada
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // Guardar configuración cuando cambia
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Aplicar clases al body
    const body = document.body;
    
    // Remover clases anteriores
    body.classList.remove('text-small', 'text-medium', 'text-large', 
                         'high-contrast', 'reduced-motion', 'focus-visible');
    
    // Aplicar nuevas clases
    if (settings.fontSize !== 'medium') {
      body.classList.add(`text-${settings.fontSize}`);
    }
    
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    }
    
    if (settings.reducedMotion) {
      body.classList.add('reduced-motion');
    }
    
    if (settings.focusVisible) {
      body.classList.add('focus-visible');
    }
    
  }, [settings]);

  // Detectar preferencias del sistema
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion && !settings.reducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
    
    if (prefersHighContrast && !settings.highContrast) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const value = {
    settings,
    updateSetting,
    toggleSetting,
    // Métodos de conveniencia
    increaseFontSize: () => {
      const sizes = ['small', 'medium', 'large'];
      const currentIndex = sizes.indexOf(settings.fontSize);
      const nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
      updateSetting('fontSize', sizes[nextIndex]);
    },
    decreaseFontSize: () => {
      const sizes = ['small', 'medium', 'large'];
      const currentIndex = sizes.indexOf(settings.fontSize);
      const prevIndex = Math.max(currentIndex - 1, 0);
      updateSetting('fontSize', sizes[prevIndex]);
    },
    resetSettings: () => {
      setSettings({
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false,
        screenReader: false,
        keyboardNavigation: true,
        focusVisible: true
      });
    }
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider;
