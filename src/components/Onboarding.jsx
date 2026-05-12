import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  // Verificar si el usuario ya completó el onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
    if (!hasCompletedOnboarding && user) {
      // Pequeño delay para que se cargue la UI
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, [user]);

  const steps = [
    {
      id: 1,
      title: '¡Bienvenido a Tupãmbae! 🌱',
      description: 'Conecta con productores locales y descubre productos frescos y sostenibles.',
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🌱</span>
          </div>
          <p className="text-gray-600">
            Somos una plataforma que conecta directamente a consumidores con productores locales, 
            fomentando el comercio justo y sostenible.
          </p>
        </div>
      ),
      action: 'Continuar'
    },
    {
      id: 2,
      title: 'Explora el Mapa 🗺️',
      description: 'Encuentra productores cerca de tu ubicación usando nuestro mapa interactivo.',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🗺️ Mapa de Productores</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Los círculos verdes muestran grupos de productores</li>
              <li>• Haz clic para ver detalles y productos</li>
              <li>• Usa tu ubicación para encontrar los más cercanos</li>
              <li>• Filtra por categoría de productos</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ),
      action: 'Entendido'
    },
    {
      id: 3,
      title: 'Crea tu Perfil 👤',
      description: 'Completa tu información para que otros puedan conocerte mejor.',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">👤 Tu Perfil</h4>
            <ul className="text-sm text-purple-700 space-y-2">
              <li>• Agrega tu foto y descripción</li>
              <li>• Especifica tu zona de cobertura</li>
              <li>• Activa tus roles (productor/consumidor)</li>
              <li>• Construye tu reputación con trueques</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ),
      action: 'Completar Perfil'
    },
    {
      id: 4,
      title: 'Publica tus Productos 📦',
      description: 'Si eres productor, muestra lo que ofreces a la comunidad.',
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">📦 Tus Productos</h4>
            <ul className="text-sm text-orange-700 space-y-2">
              <li>• Sube fotos de alta calidad</li>
              <li>• Describe tus productos en detalle</li>
              <li>• Establece precios justos</li>
              <li>• Especifica métodos de entrega</li>
              <li>• Actualiza tu inventario regularmente</li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ),
      action: 'Publicar Productos'
    },
    {
      id: 5,
      title: 'Participa en Trueques 🔄',
      description: 'Intercambia productos directamente con otros miembros de la comunidad.',
      content: (
        <div className="space-y-4">
          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="font-semibold text-teal-900 mb-2">🔄 Trueques</h4>
            <p className="text-sm text-teal-700 mb-3">
              El trueque es el corazón de nuestra comunidad. Intercambia productos y servicios 
              sin necesidad de dinero, fortaleciendo la economía local.
            </p>
            <ul className="text-sm text-teal-700 space-y-2">
              <li>• Ofrece productos que quieras intercambiar</li>
              <li>• Propón trueques con otros productores</li>
              <li>• Construye confianza con cada intercambio</li>
              <li>• Gana reputación en la red de confianza</li>
            </ul>
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="text-2xl animate-bounce">🔄</div>
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      ),
      action: 'Explorar Trueques'
    }
  ];

  const currentStep = steps[step];

  const handleNext = useCallback(() => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  }, [step]);

  const handlePrevious = useCallback(() => {
    if (step > 0) {
      setStep(step - 1);
    }
  }, [step]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, []);

  const handleComplete = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem('onboarding-completed', 'true');
    showSuccess('¡Bienvenido a Tupãmbae! 🎉', { duration: 5000 });
    
    // Redirigir según el rol del usuario
    if (user?.rolActivo === 'productor') {
      navigate('/crear-producto');
    } else {
      navigate('/explorar');
    }
  }, [user, showSuccess, navigate]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevious();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleSkip();
    }
  }, [handleNext, handlePrevious, handleSkip]);

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isVisible, handleKeyPress]);

  if (!isVisible || !currentStep) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
              <p className="text-green-100">{currentStep.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-white/20 px-2 py-1 rounded">
                {step + 1} / {steps.length}
              </span>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/80 hover:text-white transition-colors p-2"
                aria-label="Cerrar tutorial"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="min-h-[400px] flex items-center justify-center">
            {currentStep.content}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Anterior
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                {step === steps.length - 1 ? 'Comenzar' : currentStep.action}
              </button>
            </div>
            
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Saltar tutorial
            </button>
          </div>
          
          {/* Keyboard shortcuts hint */}
          <div className="mt-4 text-center text-xs text-gray-500">
            Usa <kbd className="px-2 py-1 bg-gray-200 rounded">←</kbd> y{' '}
            <kbd className="px-2 py-1 bg-gray-200 rounded">→</kbd> para navegar,{' '}
            <kbd className="px-2 py-1 bg-gray-200 rounded">Espacio</kbd> para continuar,{' '}
            <kbd className="px-2 py-1 bg-gray-200 rounded">Esc</kbd> para saltar
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
