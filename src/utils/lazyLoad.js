import { lazy } from 'react';
import { Suspense } from 'react';
import SkeletonLoader from '../components/SkeletonLoader';

// Componente de carga para lazy loading
const LazyWrapper = ({ children, fallback }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Lazy loading para páginas principales
export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyLogin = lazy(() => import('../pages/Login'));
export const LazyRegister = lazy(() => import('../pages/Register'));
export const LazyProducerDetail = lazy(() => import('../pages/ProducerDetail'));
export const LazyMyOrders = lazy(() => import('../pages/MyOrders'));
export const LazyCreateProduct = lazy(() => import('../pages/CreateProduct'));
export const LazyEditProfile = lazy(() => import('../pages/EditProfile'));
export const LazyEditUserProfile = lazy(() => import('../pages/EditUserProfile'));
export const LazyMisPublicaciones = lazy(() => import('../pages/MisPublicaciones'));
export const LazyExplorarMapa = lazy(() => import('../pages/ExplorarMapa'));
export const LazyEditProduct = lazy(() => import('../pages/EditProduct'));
export const LazyMisTrueques = lazy(() => import('../pages/MisTrueques'));
export const LazyTrustNetwork = lazy(() => import('../pages/TrustNetwork'));

// Lazy loading para componentes pesados
export const LazyMapaProductores = lazy(() => import('../components/MapaProductores'));
export const LazyProductForm = lazy(() => import('../components/ProductForm'));
export const LazyTruequeModal = lazy(() => import('../components/TruequeModal'));

// Componentes con fallback específicos
export const LazyHomeWithFallback = () => (
  <LazyWrapper fallback={<SkeletonLoader type="productList" count={3} />}>
    <LazyHome />
  </LazyWrapper>
);

export const LazyMapaWithFallback = () => (
  <LazyWrapper fallback={<SkeletonLoader type="map" />}>
    <LazyMapaProductores />
  </LazyWrapper>
);

export const LazyProducerDetailWithFallback = () => (
  <LazyWrapper fallback={<SkeletonLoader type="producerProfile" />}>
    <LazyProducerDetail />
  </LazyWrapper>
);

export const LazyOrdersWithFallback = () => (
  <LazyWrapper fallback={<SkeletonLoader type="orderTable" count={5} />}>
    <LazyMyOrders />
  </LazyWrapper>
);

export const LazyCreateProductWithFallback = () => (
  <LazyWrapper fallback={<SkeletonLoader type="form" />}>
    <LazyCreateProduct />
  </LazyWrapper>
);

export const LazyRegisterWithFallback = () => (
  <LazyWrapper fallback={<SkeletonLoader type="form" />}>
    <LazyRegister />
  </LazyWrapper>
);

export default {
  LazyWrapper,
  LazyHome,
  LazyLogin,
  LazyRegister,
  LazyProducerDetail,
  LazyMyOrders,
  LazyCreateProduct,
  LazyEditProfile,
  LazyEditUserProfile,
  LazyMisPublicaciones,
  LazyExplorarMapa,
  LazyEditProduct,
  LazyMisTrueques,
  LazyTrustNetwork,
  LazyMapaProductores,
  LazyProductForm,
  LazyTruequeModal,
  LazyHomeWithFallback,
  LazyMapaWithFallback,
  LazyProducerDetailWithFallback,
  LazyOrdersWithFallback,
  LazyCreateProductWithFallback,
  LazyRegisterWithFallback
};
