import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useOnboarding = () => {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();

  // Verificar si el usuario ya completó el onboarding
  const hasCompletedOnboarding = useCallback(() => {
    return localStorage.getItem('onboarding-completed') === 'true';
  }, []);

  // Marcar onboarding como completado
  const completeOnboarding = useCallback(() => {
    localStorage.setItem('onboarding-completed', 'true');
    setIsOnboardingVisible(false);
  }, []);

  // Iniciar onboarding para nuevos usuarios
  const startOnboarding = useCallback(() => {
    if (!hasCompletedOnboarding() && user) {
      setIsOnboardingVisible(true);
      setCurrentStep(0);
    }
  }, [user, hasCompletedOnboarding]);

  // Reiniciar onboarding (para propósitos de desarrollo)
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem('onboarding-completed');
    setCurrentStep(0);
    setIsOnboardingVisible(false);
  }, []);

  // Saltar onboarding
  const skipOnboarding = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  // Ir al siguiente paso
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4)); // Máximo 5 pasos (0-4)
  }, []);

  // Ir al paso anterior
  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Ir a un paso específico
  const goToStep = useCallback((step) => {
    setCurrentStep(Math.max(0, Math.min(step, 4)));
  }, []);

  // Auto-iniciar onboarding para usuarios nuevos
  useEffect(() => {
    if (user && !hasCompletedOnboarding()) {
      // Pequeño delay para que se cargue la UI
      const timer = setTimeout(() => {
        setIsOnboardingVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user, hasCompletedOnboarding]);

  return {
    isOnboardingVisible,
    currentStep,
    hasCompletedOnboarding,
    startOnboarding,
    completeOnboarding,
    resetOnboarding,
    skipOnboarding,
    nextStep,
    previousStep,
    goToStep
  };
};
