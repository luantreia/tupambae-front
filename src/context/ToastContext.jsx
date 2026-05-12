import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const ToastContext = createContext();

const toastConfig = {
  success: {
    icon: '✅',
    bgColor: 'bg-green-600',
    textColor: 'text-white',
    duration: 3000
  },
  error: {
    icon: '❌',
    bgColor: 'bg-red-600',
    textColor: 'text-white',
    duration: 5000
  },
  warning: {
    icon: '⚠️',
    bgColor: 'bg-yellow-500',
    textColor: 'text-white',
    duration: 4000
  },
  info: {
    icon: 'ℹ️',
    bgColor: 'bg-blue-600',
    textColor: 'text-white',
    duration: 3000
  },
  loading: {
    icon: '⏳',
    bgColor: 'bg-gray-700',
    textColor: 'text-white',
    duration: 0 // No auto-dismiss para loading
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', options = {}) => {
    const id = Date.now() + Math.random();
    const config = toastConfig[type] || toastConfig.success;
    
    const newToast = {
      id,
      message,
      type,
      icon: options.icon || config.icon,
      bgColor: options.bgColor || config.bgColor,
      textColor: options.textColor || config.textColor,
      duration: options.duration !== undefined ? options.duration : config.duration,
      persistent: options.persistent || type === 'loading'
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss si no es persistente
    if (!newToast.persistent && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Métodos de conveniencia
  const showSuccess = useCallback((message, options) => showToast(message, 'success', options), [showToast]);
  const showError = useCallback((message, options) => showToast(message, 'error', options), [showToast]);
  const showWarning = useCallback((message, options) => showToast(message, 'warning', options), [showToast]);
  const showInfo = useCallback((message, options) => showToast(message, 'info', options), [showToast]);
  const showLoading = useCallback((message, options) => showToast(message, 'loading', { ...options, persistent: true }), [showToast]);

  // Ocultar loading manualmente
  const hideLoading = useCallback(() => {
    setToasts(prev => prev.filter(toast => toast.type !== 'loading'));
  }, []);

  useEffect(() => {
    const handleToastEvent = (e) => {
      if (e.detail) {
        showToast(e.detail.message, e.detail.type, e.detail.options);
      }
    };
    window.addEventListener('show-toast', handleToastEvent);
    return () => window.removeEventListener('show-toast', handleToastEvent);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ 
      showToast, 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo, 
      showLoading, 
      hideLoading,
      removeToast 
    }}>
      {children}
      
      {/* Contenedor de toasts */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm uppercase tracking-widest flex items-center gap-3 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-md ${toast.bgColor} ${toast.textColor}`}
          >
            <span className="text-lg">{toast.icon}</span>
            <span className="flex-1">{toast.message}</span>
            
            {/* Botón de cerrar para toasts persistentes */}
            {toast.persistent && (
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 hover:opacity-75 transition-opacity"
                aria-label="Cerrar notificación"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
