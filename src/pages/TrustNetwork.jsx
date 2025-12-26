import React, { useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import VisibilityToggle from '../components/VisibilityToggle';

const TrustNetwork = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await authService.getContacts();
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await authService.searchUsers(query);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddContact = async (contactId) => {
    try {
      await authService.addContact(contactId);
      showToast('Contacto agregado con éxito', 'success');
      setSearchQuery('');
      setSearchResults([]);
      fetchContacts();
      refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveContact = async (contactId) => {
    if (!window.confirm('¿Quitar este contacto de tu red de confianza?')) return;
    try {
      await authService.removeContact(contactId);
      showToast('Contacto eliminado', 'success');
      fetchContacts();
      refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Red de Confianza</h1>
          <p className="text-gray-500 font-medium">Gestiona quién puede ver tu perfil y productos</p>
        </div>
        <div className="w-full md:w-72">
          <VisibilityToggle user={user} onUpdate={() => refreshUser()} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Buscador */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight">Agregar Contactos</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition font-bold text-gray-700"
              />
              {searching && (
                <div className="absolute right-4 top-4 animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              )}
            </div>

            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {searchResults.map(res => (
                <div key={res._id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                  <div>
                    <p className="font-black text-gray-800 text-sm">{res.nombre}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{res.zona} • ⭐ {res.reputationScore}</p>
                  </div>
                  <button
                    onClick={() => handleAddContact(res._id)}
                    disabled={contacts.some(c => c._id === res._id)}
                    className="bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-30"
                  >
                    {contacts.some(c => c._id === res._id) ? 'Agregado' : 'Agregar'}
                  </button>
                </div>
              ))}
              {searchQuery.length >= 3 && searchResults.length === 0 && !searching && (
                <p className="text-center py-4 text-xs text-gray-400 font-bold">No se encontraron usuarios</p>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Contactos */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight">Tus Contactos ({contacts.length})</h2>
            {loading ? (
              <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <span className="text-4xl mb-2 block">🤝</span>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Aún no tienes contactos</p>
                <p className="text-[10px] text-gray-400 mt-1">Agrega amigos para expandir tu red de confianza</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map(contact => (
                  <div key={contact._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-gray-800">{contact.nombre}</p>
                        <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Nivel {contact.trustLevel}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold">{contact.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveContact(contact._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-100"
                      title="Quitar contacto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustNetwork;
