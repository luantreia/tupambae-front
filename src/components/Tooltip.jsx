import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from './AccessibilityProvider';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 500,
  className = '',
  showOnFocus = false,
  showOnHover = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const tooltipRef = useRef(null);
  const { reducedMotion } = useAccessibility();

  const showTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const handleMouseEnter = () => {
      if (showOnHover) {
        showTooltip();
      }
    };

    const handleMouseLeave = () => {
      if (showOnHover) {
        hideTooltip();
      }
    };

    const handleFocus = () => {
      if (showOnFocus) {
        showTooltip();
      }
    };

    const handleBlur = () => {
      if (showOnFocus) {
        hideTooltip();
      }
    };

    const handleClick = () => {
      hideTooltip();
    };

    // Event listeners para el trigger
    tooltip.addEventListener('mouseenter', handleMouseEnter);
    tooltip.addEventListener('mouseleave', handleMouseLeave);
    tooltip.addEventListener('focus', handleFocus);
    tooltip.addEventListener('blur', handleBlur);
    tooltip.addEventListener('click', handleClick);

    // Cerrar tooltip con Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        hideTooltip();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      tooltip.removeEventListener('mouseenter', handleMouseEnter);
      tooltip.removeEventListener('mouseleave', handleMouseLeave);
      tooltip.removeEventListener('focus', handleFocus);
      tooltip.removeEventListener('blur', handleBlur);
      tooltip.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showOnHover, showOnFocus, delay]);

  if (!content) return children;

  const getPositionClasses = () => {
    const baseClasses = 'absolute z-50';
    
    switch (position) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
    }
  };

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-0 h-0 border-4 border-transparent';
    
    switch (position) {
      case 'top':
        return `${baseClasses} border-b-gray-900 top-full left-1/2 transform -translate-x-1/2 -mt-1`;
      case 'bottom':
        return `${baseClasses} border-t-gray-900 bottom-full left-1/2 transform -translate-x-1/2 -mb-1`;
      case 'left':
        return `${baseClasses} border-r-gray-900 left-full top-1/2 transform -translate-y-1/2 -ml-1`;
      case 'right':
        return `${baseClasses} border-l-gray-900 right-full top-1/2 transform -translate-y-1/2 -mr-1`;
      default:
        return `${baseClasses} border-b-gray-900 top-full left-1/2 transform -translate-x-1/2 -mt-1`;
    }
  };

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <div 
        ref={tooltipRef}
        className={className}
        tabIndex={showOnFocus ? 0 : undefined}
        role="button"
        aria-describedby={isVisible ? 'tooltip-content' : undefined}
        aria-expanded={isVisible}
      >
        {children}
      </div>

      {/* Tooltip content */}
      {isVisible && (
        <div 
          id="tooltip-content"
          role="tooltip"
          className={`
            ${getPositionClasses()}
            ${reducedMotion ? '' : 'transition-all duration-200 ease-out'}
            bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg 
            max-w-xs whitespace-nowrap z-50
          `}
        >
          {/* Arrow */}
          <div className={getArrowClasses()}></div>
          
          {/* Content */}
          <div className="relative z-10">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

// Tooltip simple para uso rápido
export const SimpleTooltip = ({ children, content, className = '' }) => {
  return (
    <Tooltip content={content} className={className}>
      {children}
    </Tooltip>
  );
};

export default Tooltip;
