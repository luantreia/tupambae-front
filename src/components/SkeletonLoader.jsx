import React from 'react';

// Skeleton para tarjetas de productos/productores
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
    <div className="flex items-start gap-4">
      {/* Avatar/Imagen */}
      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
      
      {/* Contenido */}
      <div className="flex-1 space-y-3">
        {/* Título */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {/* Descripción */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        {/* Meta información */}
        <div className="flex items-center gap-4">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton para lista de productos
export const ProductListSkeleton = ({ count = 6 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton para mapa
export const MapSkeleton = () => (
  <div className="h-[450px] w-full rounded-3xl overflow-hidden shadow-inner border border-gray-100">
    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

// Skeleton para perfil de productor
export const ProducerProfileSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
    {/* Header */}
    <div className="flex items-start gap-4 mb-6">
      <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
    
    {/* Stats */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="text-center">
          <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
        </div>
      ))}
    </div>
    
    {/* Productos */}
    <div className="space-y-3">
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-16 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

// Skeleton para tabla/pedidos
export const OrderTableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-4 border-b border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton para formulario
export const FormSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="space-y-6">
      {/* Título */}
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      
      {/* Campos del formulario */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      
      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  </div>
);

// Skeleton para notificaciones
export const NotificationSkeleton = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Componente principal que carga el skeleton apropiado
export const SkeletonLoader = ({ type, count, ...props }) => {
  const skeletons = {
    productCard: ProductCardSkeleton,
    productList: ProductListSkeleton,
    map: MapSkeleton,
    producerProfile: ProducerProfileSkeleton,
    orderTable: OrderTableSkeleton,
    form: FormSkeleton,
    notification: NotificationSkeleton
  };

  const SkeletonComponent = skeletons[type];
  if (!SkeletonComponent) return null;

  return <SkeletonComponent count={count} {...props} />;
};

export default SkeletonLoader;
