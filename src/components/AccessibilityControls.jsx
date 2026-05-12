import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

const AccessibilityControls = () => {
  const { settings, updateSetting, toggleSetting, increaseFontSize, decreaseFontSize, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Alt + A para abrir controles de accesibilidad
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      // Alt + + para aumentar fuente
      if (e.altKey && e.key === '+') {
        e.preventDefault();
        increaseFontSize();
      }
      // Alt + - para disminuir fuente
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        decreaseFontSize();
      }
      // Alt + H para alto contraste
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        toggleSetting('highContrast');
      }
      // Alt + R para resetear
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        resetSettings();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, increaseFontSize, decreaseFontSize, toggleSetting, resetSettings]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Controles de Accesibilidad (Alt+A)"
        aria-label="Abrir controles de accesibilidad"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 id="accessibility-title" className="text-2xl font-bold text-gray-900">
              Accesibilidad
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar controles de accesibilidad"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tamaño de Fuente */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tamaño de Fuente</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={decreaseFontSize}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Disminuir tamaño de fuente"
                disabled={settings.fontSize === 'small'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <div className="flex-1 text-center">
                <span className="text-sm font-medium text-gray-600">
                  {settings.fontSize === 'small' ? 'Pequeño' : 
                   settings.fontSize === 'medium' ? 'Mediano' : 'Grande'}
                </span>
                <div className="flex justify-center gap-1 mt-1">
                  {['small', 'medium', 'large'].map((size, index) => (
                    <div
                      key={size}
                      className={`h-2 w-8 rounded-full ${
                        settings.fontSize === size ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={increaseFontSize}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Aumentar tamaño de fuente"
                disabled={settings.fontSize === 'large'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Atajo: Alt + +/-</p>
          </div>

          {/* Alto Contraste */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Contraste</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Alto Contraste</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={() => toggleSetting('highContrast')}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  settings.highContrast ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              </div>
            </label>
            <p className="text-xs text-gray-500 mt-2">Atajo: Alt + H</p>
          </div>

          {/* Movimiento Reducido */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Animaciones</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Reducir Movimiento</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={() => toggleSetting('reducedMotion')}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  settings.reducedMotion ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              </div>
            </label>
            <p className="text-xs text-gray-500 mt-2">Reduce animaciones para usuarios sensibles al movimiento</p>
          </div>

          {/* Navegación por Teclado */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Navegación</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Navegación por Teclado</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.keyboardNavigation}
                  onChange={() => toggleSetting('keyboardNavigation')}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  settings.keyboardNavigation ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              </div>
            </label>
            <p className="text-xs text-gray-500 mt-2">Mejora la visibilidad del foco para navegación con teclado</p>
          </div>

          {/* Atajos de Teclado */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Atajos de Teclado</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Abrir accesibilidad</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + A</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aumentar fuente</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + +</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Disminuir fuente</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + -</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Alto contraste</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + H</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Restablecer</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + R</kbd>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={resetSettings}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Restablecer
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityControls;
