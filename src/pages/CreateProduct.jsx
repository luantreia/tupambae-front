import React, { useState, useEffect, useContext } from 'react';
import { producerService, productService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PRODUCT_CATEGORIES } from '../constants/categories';
import ProductForm from '../components/ProductForm';
import 'leaflet/dist/leaflet.css';

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([position.lat, position.lng]);
  }, [position, map]);
  return null;
};

const LocationPicker = ({ onLocationSelected, initialPos }) => {
  const [position, setPosition] = useState(initialPos || { lat: -34.6037, lng: -58.3816 });

  useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      onLocationSelected(newPos);
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
};

const CreateProduct = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ 
    descripcion: '', 
    zona: '', 
    contacto: '', 
    categoria: PRODUCT_CATEGORIES[0].key, 
    ubicacion: { lat: -34.6037, lng: -58.3816 } 
  });
  const [isLocating, setIsLocating] = useState(false);
  const [saving, setSaving] = useState(false);
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
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Error fetching profile', err);
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await producerService.upsertProfile(profileForm);
      setProfile(res.data);
      showToast('Perfil creado con éxito', 'success');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error al crear perfil', 'error');
    }
  };

  const handleProductSubmit = async (productData) => {
    setSaving(true);
    try {
      await productService.create(productData);
      showToast('Producto creado con éxito', 'success');
      await refreshUser();
      navigate('/mis-publicaciones');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Error al crear producto', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">¡Bienvenido, productor!</h2>
          <p className="text-gray-500 font-medium">Crea tu perfil público para empezar a vender.</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">¿Qué produces?</label>
              <textarea 
                placeholder="Ej: Frutas orgánicas de estación y conservas caseras..." 
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700 min-h-[100px]" 
                value={profileForm.descripcion} 
                onChange={(e) => setProfileForm({...profileForm, descripcion: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Categoría Principal</label>
              <div className="grid grid-cols-2 gap-2">
                {PRODUCT_CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setProfileForm(prev => ({ ...prev, categoria: cat.key }))}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                      profileForm.categoria === cat.key 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Zona de entrega</label>
                <input 
                  type="text" 
                  placeholder="Ej: Palermo / Envios a CABA" 
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700" 
                  value={profileForm.zona} 
                  onChange={(e) => setProfileForm({...profileForm, zona: e.target.value})} 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">WhatsApp / Teléfono</label>
                <input 
                  type="text" 
                  placeholder="Ej: +54 9 11 ..." 
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none font-bold text-gray-700" 
                  value={profileForm.contacto} 
                  onChange={(e) => setProfileForm({...profileForm, contacto: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Ubicación Aproximada</label>
                <button 
                  type="button"
                  onClick={handleGetLocation}
                  className="text-[10px] font-black text-green-600 hover:text-green-700 uppercase tracking-widest"
                >
                  {isLocating ? 'Obteniendo...' : '📍 Usar GPS'}
                </button>
              </div>
              <div className="h-[200px] rounded-3xl overflow-hidden border-2 border-gray-50 shadow-inner">
                <MapContainer center={[profileForm.ubicacion.lat, profileForm.ubicacion.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <RecenterMap position={profileForm.ubicacion} />
                  <LocationPicker 
                    initialPos={profileForm.ubicacion}
                    onLocationSelected={(loc) => setProfileForm({ ...profileForm, ubicacion: loc })} 
                  />
                </MapContainer>
              </div>
              <p className="text-[9px] text-gray-400 uppercase font-bold text-center tracking-tighter">
                Toca el mapa para marcar tu zona. No mostramos tu dirección exacta.
              </p>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white p-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-green-100 transition-all transform active:scale-[0.98]"
            >
              Crear Perfil
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Publicar Producto</h2>
        <p className="text-gray-500 font-medium">Agregá lo que tenés disponible para hoy.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <ProductForm 
          onSubmit={handleProductSubmit}
          buttonText="Publicar Ahora"
          loading={saving}
        />
      </div>
    </div>
  );
};

export default CreateProduct;
