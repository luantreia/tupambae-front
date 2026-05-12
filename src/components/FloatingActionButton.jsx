import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const FloatingActionButton = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickAction = (action) => {
    setIsOpen(false);
    if (typeof action === 'string') {
      navigate(action);
    }
  };

  // Acciones rápidas según rol activo
  const getQuickActions = () => {
    if (!user) return [];

    const actions = [
      {
        icon: '🔍',
        label: 'Explorar',
        action: '/explorar',
        color: 'bg-blue-500'
      }
    ];

    if (user.rolActivo === 'productor') {
      actions.push(
        {
          icon: '➕',
          label: 'Nuevo Producto',
          action: '/crear-producto',
          color: 'bg-green-500'
        },
        {
          icon: '📦',
          label: 'Mis Publicaciones',
          action: '/mis-publicaciones',
          color: 'bg-purple-500'
        }
      );
    } else {
      actions.push(
        {
          icon: '🛒',
          label: 'Mis Pedidos',
          action: '/mis-pedidos',
          color: 'bg-orange-500'
        }
      );
    }

    return actions;
  };

  const quickActions = getQuickActions();

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      {/* Menú expandido */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className={`flex items-center gap-3 ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap`}
              style={{
                animation: `slideInUp 0.3s ease-out ${index * 0.1}s both`
              }}
            >
              <span className="text-lg">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Botón principal FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center ${isOpen ? 'rotate-45' : ''}`}
        aria-label="Acciones rápidas"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingActionButton;
