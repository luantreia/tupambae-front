import React from 'react';
import SkeletonLoader from './SkeletonLoader';

// Spinner básico
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <svg
        className="w-full h-full text-green-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

// Botón con spinner integrado
export const ButtonWithSpinner = ({ 
  children, 
  loading, 
  disabled, 
  className = '', 
  spinnerSize = 'sm',
  ...props 
}) => {
  return (
    <button
      className={`${className} ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {children}
      </span>
      
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size={spinnerSize} />
        </span>
      )}
    </button>
  );
};

// Overlay de carga para secciones completas
export const LoadingOverlay = ({ 
  show, 
  text = 'Cargando...', 
  spinnerSize = 'lg',
  className = ''
}) => {
  if (!show) return null;

  return (
    <div className={`absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-xl ${className}`}>
      <Spinner size={spinnerSize} />
      <p className="mt-4 text-sm font-medium text-gray-600">{text}</p>
    </div>
  );
};

// Loading para tarjetas específicas
export const CardLoading = ({ show, children }) => {
  return (
    <div className="relative">
      {children}
      <LoadingOverlay 
        show={show} 
        text="Procesando..."
        spinnerSize="md"
        className="rounded-xl"
      />
    </div>
  );
};

// Loading para formularios
export const FormLoading = ({ show, children }) => {
  return (
    <div className="relative">
      <div className={show ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>
      
      {show && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl z-10">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-sm font-medium text-gray-600">Guardando cambios...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading para operaciones de geolocalización
export const GeoLoading = ({ show, text = 'Obteniendo ubicación...' }) => {
  if (!show) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl">
      <Spinner size="sm" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

// Loading inline para listas
export const InlineLoading = ({ text = 'Cargando más elementos...' }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3 text-gray-500">
        <Spinner size="sm" />
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );
};

// Loading skeleton con spinner combinado
export const HybridLoading = ({ 
  showSkeleton = true, 
  showSpinner = false, 
  skeletonCount = 3,
  type = 'productCard'
}) => {
  if (showSkeleton) {
    return <SkeletonLoader type={type} count={skeletonCount} />;
  }

  if (showSpinner) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Spinner;
