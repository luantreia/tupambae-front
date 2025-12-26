import React, { useState, useContext, useRef, useEffect } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-green-600 transition-colors rounded-full hover:bg-gray-100"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[200] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-green-600 hover:text-green-700 uppercase tracking-tighter"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n._id} 
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative ${!n.read ? 'bg-green-50/30' : ''}`}
                  onClick={() => !n.read && markAsRead(n._id)}
                >
                  {!n.read && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  )}
                  <div className="pl-2">
                    <p className={`text-sm ${!n.read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                      {n.message}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(n.createdAt).toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {n.cta && (
                        <Link 
                          to={n.cta} 
                          onClick={() => setIsOpen(false)}
                          className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline"
                        >
                          Ver pedido →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <Link 
            to="/mis-pedidos" 
            onClick={() => setIsOpen(false)}
            className="block p-3 text-center text-xs font-bold text-gray-500 hover:bg-gray-50 border-t border-gray-50"
          >
            Ver todos mis pedidos
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
