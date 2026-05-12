import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TooltipGuide = ({ 
  children, 
  content, 
  position = 'top',
  delay = 1000,
  duration = 5000,
  showOnce = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const timeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if this tooltip has been shown before
    if (showOnce) {
      const shown = localStorage.getItem(`tooltip-${content}`);
      if (shown) {
        setHasBeenShown(true);
        return;
      }
    }

    // Show tooltip after delay
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      
      // Auto-hide after duration
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        if (showOnce) {
          localStorage.setItem(`tooltip-${content}`, 'true');
          setHasBeenShown(true);
        }
      }, duration);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [delay, duration, showOnce, content]);

  const handleManualClose = () => {
    setIsVisible(false);
    if (showOnce) {
      localStorage.setItem(`tooltip-${content}`, 'true');
      setHasBeenShown(true);
    }
  };

  if (hasBeenShown) return children;

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute z-50 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg ${
              position === 'top' ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2' :
              position === 'bottom' ? 'top-full mt-2 left-1/2 transform -translate-x-1/2' :
              position === 'left' ? 'right-full mr-2 top-1/2 transform -translate-y-1/2' :
              position === 'right' ? 'left-full ml-2 top-1/2 transform -translate-y-1/2' :
              'top-full mt-2 left-1/2 transform -translate-x-1/2'
            }`}
          >
            {/* Arrow */}
            <div className={`absolute w-3 h-3 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1' :
              position === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 -mt-1' :
              position === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 -mr-1' :
              position === 'right' ? 'left-full top-1/2 transform -translate-y-1/2 -ml-1' :
              'top-full left-1/2 transform -translate-x-1/2 -mt-1'
            }`} />
            
            <div className="relative z-10">
              <p className="text-xs leading-relaxed">{content}</p>
              <button
                onClick={handleManualClose}
                className="mt-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TooltipGuide;
