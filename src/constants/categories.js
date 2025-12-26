export const PRODUCT_CATEGORIES = [
  { key: 'Verduras', label: 'Verduras', icon: '🥬' },
  { key: 'Frutas', label: 'Frutas', icon: '🍎' },
  { key: 'Lácteos', label: 'Lácteos', icon: '🧀' },
  { key: 'Carnes', label: 'Carnes', icon: '🥩' },
  { key: 'Panificados', label: 'Panificados', icon: '🥖' },
  { key: 'Conservas', label: 'Conservas', icon: '🍯' },
  { key: 'Otros', label: 'Otros', icon: '📦' }
];

export const getCategoryLabel = (key) => {
  const cat = PRODUCT_CATEGORIES.find(c => c.key === key);
  return cat ? cat.label : key;
};

export const getCategoryIcon = (key) => {
  const cat = PRODUCT_CATEGORIES.find(c => c.key === key);
  return cat ? cat.icon : '📦';
};
