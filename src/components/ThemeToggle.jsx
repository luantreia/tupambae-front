import React, { useState, useEffect, useContext } from 'react';
import { useAccessibility } from './AccessibilityProvider';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const { updateSetting, toggleSetting } = useAccessibility();

  // Detectar preferencia del sistema
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  // Aplicar tema
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clases anteriores
    root.classList.remove('light', 'dark', 'sepia', 'high-contrast');
    
    // Aplicar nuevo tema
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    // Actualizar meta tag para mobile
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === 'dark' ? '#1f2937' : '#ffffff';
    }
  }, [theme]);

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return '🌙';
      case 'sepia':
        return '🌅';
      default:
        return '☀️';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Modo Oscuro';
      case 'sepia':
        return 'Modo Sepia';
      default:
        return 'Modo Claro';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      {/* Botón principal de tema */}
      <button
        onClick={toggleTheme}
        className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
        title={`Cambiar a ${getThemeLabel()}`}
        aria-label={`Tema actual: ${getThemeLabel()}. Click para cambiar.`}
      >
        <span className="text-2xl group-hover:scale-110 transition-transform">
          {getThemeIcon()}
        </span>
      </button>

      {/* Tooltip */}
      <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          <div className="font-medium mb-1">{getThemeLabel()}</div>
          <div className="text-xs text-gray-300">Click para cambiar</div>
        </div>
      </div>

      {/* Panel extendido (opcional) */}
      <div className="absolute top-full mt-2 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[200px]">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tema Rápido</div>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'light', icon: '☀️', label: 'Claro' },
              { value: 'dark', icon: '🌙', label: 'Oscuro' },
              { value: 'sepia', icon: '🌅', label: 'Sepia' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  theme === option.value
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                title={`Cambiar a ${option.label}`}
                aria-label={`Tema ${option.label} ${theme === option.value ? '(activo)' : ''}`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-xs font-medium">{option.label}</div>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Accesibilidad</div>
            
            <button
              onClick={() => toggleSetting('highContrast')}
              className={`w-full p-2 rounded text-xs font-medium transition-colors ${
                theme === 'high-contrast'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              🎨 Alto Contraste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
