import React, { useState, useEffect, useContext } from 'react';
import { producerService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PRODUCT_CATEGORIES } from '../constants/categories';
import 'leaflet/dist/leaflet.css';

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([position.lat, position.lng]);
  }, [position, map]);
  return null;
};

const LocationPicker = ({ onLocationSelected, initialPos }) => {
  const [position, setPosition] = useState(initialPos);

  useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      onLocationSelected(newPos);
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [profileForm, setProfileForm] = useState({ 
    descripcion: '', 
    zona: '', 
    contacto: '', 
    categoria: PRODUCT_CATEGORIES[0].key,
    ubicacion: { lat: -34.6037, lng: -58.3816 } 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.rolActivo !== 'productor') {
      navigate('/');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await producerService.getMe();
        if (res.data) {
          setProfileForm(res.data);
          setOriginalProfile(res.data);
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return showToast('Geolocalización no soportada', 'error');
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setProfileForm({ ...profileForm, ubicacion: newLoc });
        setIsLocating(false);
      },
      () => {
        showToast('No se pudo obtener la ubicación', 'error');
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await producerService.updateProfile(profileForm);
      showToast('Perfil actualizado con éxito', 'success');
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      // El error ya es manejado por el interceptor de la API
      console.error('Error al actualizar perfil de productor:', err);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(profileForm) !== JSON.stringify(originalProfile);

  if (loading) return <div className="text-center py-20 font-black text-gray-400 uppercase tracking-widest">Cargando perfil...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-green-600"></div>
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Editar Perfil</h2>
          <p className="text-gray-500 font-medium">Actualiza tu información pública para los consumidores.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Descripción de tu producción</label>
            <textarea 
              placeholder="Ej: Frutas orgánicas de estación y conservas caseras..." 
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-medium min-h-[120px]" 
              value={profileForm.descripcion} 
              onChange={(e) => setProfileForm({...profileForm, descripcion: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Categoría Principal</label>
            <select 
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-medium"
              value={profileForm.categoria}
              onChange={(e) => setProfileForm({...profileForm, categoria: e.target.value})}
            >
              {PRODUCT_CATEGORIES.map(cat => (
                <option key={cat.key} value={cat.key}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">Zona de entrega</label>
              <input 
                type="text" 
                placeholder="Ej: Palermo / Envios a CABA" 
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-medium" 
                value={profileForm.zona} 
                onChange={(e) => setProfileForm({...profileForm, zona: e.target.value})} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider mb-2">WhatsApp / Teléfono</label>
              <input 
                type="text" 
                placeholder="Ej: +54 9 11 ..." 
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-medium" 
                value={profileForm.contacto} 
                onChange={(e) => setProfileForm({...profileForm, contacto: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-black text-gray-700 uppercase tracking-wider">Ubicación Aproximada</label>
              <button 
                type="button"
                onClick={handleGetLocation}
                className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-widest"
              >
                {isLocating ? 'Obteniendo...' : '📍 Usar mi ubicación actual'}
              </button>
            </div>
            <div className="h-[200px] rounded-2xl overflow-hidden border-2 border-gray-100">
              <MapContainer center={[profileForm.ubicacion.lat, profileForm.ubicacion.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap position={profileForm.ubicacion} />
                <LocationPicker 
                  initialPos={profileForm.ubicacion}
                  onLocationSelected={(loc) => setProfileForm({ ...profileForm, ubicacion: loc })} 
                />
              </MapContainer>
            </div>
            <p className="text-[10px] text-gray-400 uppercase font-bold text-center">
              Haz clic en el mapa para ajustar tu ubicación. Se guardará de forma aproximada.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 text-gray-500 p-5 rounded-2xl font-black text-xl hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving || !hasChanges}
              className={`flex-[2] p-5 rounded-2xl font-black text-xl shadow-xl transition-all transform active:scale-[0.98] ${
                !hasChanges ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700 text-white shadow-green-100'
              }`}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
