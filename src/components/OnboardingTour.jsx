import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OnboardingTour = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  const steps = [
    {
      id: 'welcome',
      title: '¡Bienvenido a Tupãmbae!',
      content: 'Te guiaremos para que descubras cómo conectar con productores locales y encontrar productos frescos.',
      target: null,
      position: 'center',
      action: null
    },
    {
      id: 'search',
      title: 'Busca Productos',
      content: 'Usa la barra de búsqueda para encontrar lo que necesitas. Filtra por categoría, zona o palabras clave.',
      target: '[data-tour="search"]',
      position: 'bottom',
      action: () => navigate('/')
    },
    {
      id: 'map',
      title: 'Explora el Mapa',
      content: 'Encuentra productores cercanos en el mapa interactivo. Haz clic en los marcadores para ver sus productos.',
      target: '[data-tour="map"]',
      position: 'top',
      action: () => navigate('/mapa')
    },
    {
      id: 'categories',
      title: 'Descubre Categorías',
      content: 'Navega por las diferentes categorías de productos: verduras, frutas, lácteos, y más.',
      target: '[data-tour="categories"]',
      position: 'right',
      action: () => navigate('/categorias')
    },
    {
      id: 'profile',
      title: 'Tu Perfil',
      content: 'Gestiona tus productos favoritos, historial de trueques y preferencias desde tu perfil.',
      target: '[data-tour="profile"]',
      position: 'left',
      action: () => navigate('/perfil')
    },
    {
      id: 'add-product',
      title: 'Publica tu Producto',
      content: '¿Eres productor? Comparte tus productos con la comunidad. Es fácil y rápido.',
      target: '[data-tour="add-product"]',
      position: 'bottom',
      action: () => navigate('/publicar')
    },
    {
      id: 'complete',
      title: '¡Listo para Empezar!',
      content: 'Ahora estás listo para explorar Tupãmbae. Conecta con productores locales y disfruta de productos frescos.',
      target: null,
      position: 'center',
      action: null
    }
  ];

  const calculatePosition = useCallback(() => {
    const step = steps[currentStep];
    if (!step.target) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const element = document.querySelector(step.target);
    if (!element) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const rect = element.getBoundingClientRect();
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;

    let top, left;

    switch (step.position) {
      case 'top':
        top = rect.top + scrollY - 120;
        left = rect.left + scrollX + rect.width / 2;
        return { top: `${top}px`, left: `${left}px`, transform: 'translateX(-50%)' };
      
      case 'bottom':
        top = rect.bottom + scrollY + 20;
        left = rect.left + scrollX + rect.width / 2;
        return { top: `${top}px`, left: `${left}px`, transform: 'translateX(-50%)' };
      
      case 'left':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.left + scrollX - 20;
        return { top: `${top}px`, left: `${left}px`, transform: 'translateY(-50%)' };
      
      case 'right':
        top = rect.top + scrollY + rect.height / 2;
        left = rect.right + scrollX + 20;
        return { top: `${top}px`, left: `${left}px`, transform: 'translateY(-50%)' };
      
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  }, [currentStep, steps]);

  useEffect(() => {
    if (isOpen) {
      const newPosition = calculatePosition();
      setPosition(newPosition);
      
      const step = steps[currentStep];
      if (step.action) {
        step.action();
      }

      // Highlight target element
      if (step.target) {
        const element = document.querySelector(step.target);
        if (element) {
          element.style.boxShadow = '0 0 0 4px #10b981';
          element.style.zIndex = '9999';
          element.style.position = 'relative';
        }
      }

      return () => {
        // Remove highlight
        if (step.target) {
          const element = document.querySelector(step.target);
          if (element) {
            element.style.boxShadow = '';
            element.style.zIndex = '';
            element.style.position = '';
          }
        }
      };
    }
  }, [isOpen, currentStep, calculatePosition, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
          style={position}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress indicator */}
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? 'w-8 bg-green-600' : 
                    index < currentStep ? 'w-2 bg-green-400' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <motion.div
              key={currentStep}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {currentStepData.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {currentStepData.content}
              </p>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Saltar tutorial
            </button>
            
            <div className="flex space-x-3">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Anterior
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                {isLastStep ? 'Comenzar' : 'Siguiente'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
