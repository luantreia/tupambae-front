import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RoleSwitch from './RoleSwitch';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100]">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <div className="bg-green-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <span className="text-2xl">🌱</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              TUPAMBAÉ
            </span>
          </Link>
          
          <div className="hidden lg:block" data-tour="role-switch">
            <RoleSwitch />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/explorar" 
            className="text-sm font-black text-gray-500 hover:text-green-600 uppercase tracking-widest transition-colors px-2 py-1"
            data-tour="map"
          >
            Explorar
          </Link>
          {user ? (
            <>
              <Link 
                to="/mis-pedidos" 
                className="text-sm font-black text-gray-500 hover:text-green-600 uppercase tracking-widest transition-colors px-2 py-1"
              >
                {user.rolActivo === 'productor' ? 'Ventas' : 'Pedidos'}
              </Link>

              <Link 
                to="/red-de-confianza" 
                className="text-sm font-black text-gray-500 hover:text-green-600 uppercase tracking-widest transition-colors px-2 py-1 flex items-center gap-1"
              >
                🤝 Red
              </Link>
              
              {user.rolActivo === 'productor' && (
                <>
                  <Link 
                    to="/mis-trueques" 
                    className="text-sm font-black text-blue-500 hover:text-blue-600 uppercase tracking-widest transition-colors px-2 py-1 flex items-center gap-1"
                  >
                    🤝 Trueques
                  </Link>
                  <Link 
                    to="/mis-publicaciones" 
                    className="text-sm font-black text-gray-500 hover:text-green-600 uppercase tracking-widest transition-colors px-2 py-1"
                  >
                    Publicaciones
                  </Link>
                  <Link 
                    to="/editar-perfil" 
                    className="text-sm font-black text-gray-500 hover:text-green-600 uppercase tracking-widest transition-colors px-2 py-1"
                  >
                    Perfil
                  </Link>
                  <Link 
                    to="/crear-producto" 
                    className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-100 transition-colors"
                    data-tour="add-product"
                  >
                    + Producto
                  </Link>
                </>
              )}
              <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
              <Link 
                to="/editar-perfil-usuario" 
                className="text-sm font-black text-gray-500 hover:text-green-600 uppercase tracking-widest transition-colors px-2 py-1 flex items-center gap-2 group relative"
                title="Mi Perfil"
                data-tour="profile"
              >
                {user.rolActivo === 'productor' && (
                  <>
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-black">
                      {(user.tokens / 100).toFixed(1)} TOKENS
                    </span>
                    {/* Tooltip simple */}
                    <div className="absolute top-full mt-2 right-0 w-40 bg-gray-900 text-white text-[9px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[110] shadow-xl font-bold">
                      Los tokens se ganan participando en la comunidad
                    </div>
                  </>
                )}
                👤
              </Link>
              <NotificationBell />
              <button 
                onClick={handleLogout} 
                className="text-sm font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="text-sm font-black text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors"
              >
                Ingresar
              </Link>
              <Link 
                to="/register" 
                className="bg-green-600 text-white px-6 py-2 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
              >
                Unirse
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <NotificationBell />}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Simplificado */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-200">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-3">
            {/* Navegación principal */}
            <div className="space-y-2">
              <Link 
                to="/explorar" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-black text-gray-700 uppercase tracking-widest p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <span className="text-xl">🗺️</span>
                Explorar
              </Link>
              
              {user && (
                <Link 
                  to="/mis-pedidos" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-lg font-black text-gray-700 uppercase tracking-widest p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-xl">📦</span>
                  {user.rolActivo === 'productor' ? 'Ventas' : 'Pedidos'}
                </Link>
              )}
            </div>

            {user ? (
              <>
                {/* Sección de perfil */}
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="bg-gray-50 p-3 rounded-xl mb-3">
                    <RoleSwitch />
                  </div>
                  
                  <div className="space-y-2">
                    <Link 
                      to="/editar-perfil-usuario" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-black text-gray-600 uppercase tracking-widest p-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <span className="text-xl">👤</span>
                      Mi Perfil
                    </Link>
                    
                    <Link 
                      to="/red-de-confianza" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-black text-gray-600 uppercase tracking-widest p-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <span className="text-xl">🤝</span>
                      Red de Confianza
                    </Link>
                  </div>
                </div>

                {/* Acciones rápidas - Solo para productores */}
                {user.rolActivo === 'productor' && (
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3">
                      Acciones Rápidas
                    </p>
                    <div className="space-y-2">
                      <Link 
                        to="/mis-trueques" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-lg font-black text-blue-600 uppercase tracking-widest p-3 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <span className="text-xl">🔄</span>
                        Trueques
                      </Link>
                      <Link 
                        to="/mis-publicaciones" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-lg font-black text-gray-600 uppercase tracking-widest p-3 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <span className="text-xl">📋</span>
                        Publicaciones
                      </Link>
                    </div>
                  </div>
                )}

                {/* Cerrar sesión */}
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-lg font-black text-red-500 uppercase tracking-widest p-3 text-left hover:bg-red-50 rounded-xl transition-colors w-full"
                  >
                    <span className="text-xl">🚪</span>
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              /* Sección no autenticado */
              <div className="space-y-3 pt-3">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-lg font-black text-gray-700 uppercase tracking-widest p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-xl">🔑</span>
                  Ingresar
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsOpen(false)}
                  className="bg-green-600 text-white p-4 rounded-xl font-black text-center uppercase tracking-widest shadow-lg shadow-green-100 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🌱</span>
                  Unirse a Tupambaé
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
