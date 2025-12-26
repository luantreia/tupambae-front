import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useRol = () => {
  const { user, switchRole, activateProducer } = useContext(AuthContext);

  const esProductor = user?.rolActivo === 'productor';
  const esConsumidor = user?.rolActivo === 'consumidor';
  
  const tieneAmbosRoles = user?.roles?.consumidor && user?.roles?.productor?.activo;

  const cambiarRol = async () => {
    if (!tieneAmbosRoles) return;
    const nuevoRol = esProductor ? 'consumidor' : 'productor';
    return await switchRole(nuevoRol);
  };

  const activarModoProductor = async () => {
    if (user?.roles?.productor?.activo) return;
    return await activateProducer();
  };

  return {
    rolActivo: user?.rolActivo,
    esProductor,
    esConsumidor,
    tieneAmbosRoles,
    cambiarRol,
    activarModoProductor,
    user
  };
};
