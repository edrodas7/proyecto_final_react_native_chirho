export const STORAGE_KEY_CHIRHO = 'stocktrack-mobile-chirho-state-v1';

export const initialProductsChirho = [
  {
    id: 'prod-001',
    name: 'Cemento gris 42.5kg',
    sku: 'MAT-CEM-001',
    category: 'Materiales',
    quantity: 18,
    minStock: 12,
    price: 79.5,
    description: 'Sacos disponibles para proyectos de obra civil.',
    syncStatus: 'synced',
    updatedAt: '2026-08-01T09:10:00.000Z'
  },
  {
    id: 'prod-002',
    name: 'Guantes anticorte',
    sku: 'EPP-GUA-014',
    category: 'EPP',
    quantity: 6,
    minStock: 10,
    price: 34,
    description: 'Par de guantes para operación de herramientas.',
    syncStatus: 'pending',
    updatedAt: '2026-08-01T10:35:00.000Z'
  },
  {
    id: 'prod-003',
    name: 'Cable THHN calibre 12',
    sku: 'ELE-CAB-212',
    category: 'Electricidad',
    quantity: 120,
    minStock: 40,
    price: 5.75,
    description: 'Inventario medido por metro lineal.',
    syncStatus: 'synced',
    updatedAt: '2026-07-31T16:00:00.000Z'
  },
  {
    id: 'prod-004',
    name: 'Filtro para mascarilla',
    sku: 'EPP-FIL-020',
    category: 'EPP',
    quantity: 4,
    minStock: 8,
    price: 22.25,
    description: 'Repuesto para mascarillas de protección respiratoria.',
    syncStatus: 'pending',
    updatedAt: '2026-08-01T11:15:00.000Z'
  }
];

export const initialMovementsChirho = [
  {
    id: 'mov-001',
    productId: 'prod-002',
    type: 'exit',
    quantity: 4,
    reason: 'Entrega a cuadrilla norte',
    createdAt: '2026-08-01T10:35:00.000Z',
    syncStatus: 'pending'
  },
  {
    id: 'mov-002',
    productId: 'prod-003',
    type: 'entry',
    quantity: 60,
    reason: 'Compra proveedor local',
    createdAt: '2026-07-31T16:00:00.000Z',
    syncStatus: 'synced'
  }
];

export function createInitialStateChirho() {
  return {
    products: initialProductsChirho,
    movements: initialMovementsChirho,
    lastSyncAt: null
  };
}

export function loadInventoryStateChirho() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY_CHIRHO);
    if (!stored) return createInitialStateChirho();
    const parsed = JSON.parse(stored);
    return {
      products: Array.isArray(parsed.products) ? parsed.products : initialProductsChirho,
      movements: Array.isArray(parsed.movements) ? parsed.movements : initialMovementsChirho,
      lastSyncAt: parsed.lastSyncAt || null
    };
  } catch {
    return createInitialStateChirho();
  }
}

export function saveInventoryStateChirho(stateChirho) {
  window.localStorage.setItem(STORAGE_KEY_CHIRHO, JSON.stringify(stateChirho));
}

export function getInventoryMetricsChirho(productsChirho, movementsChirho) {
  const lowStockChirho = productsChirho.filter((productChirho) => productChirho.quantity <= productChirho.minStock);
  const pendingProductsChirho = productsChirho.filter((productChirho) => productChirho.syncStatus === 'pending');
  const pendingMovementsChirho = movementsChirho.filter((movementChirho) => movementChirho.syncStatus === 'pending');
  const inventoryValueChirho = productsChirho.reduce(
    (totalChirho, productChirho) => totalChirho + productChirho.quantity * productChirho.price,
    0
  );

  return {
    totalProducts: productsChirho.length,
    lowStockCount: lowStockChirho.length,
    pendingSyncCount: pendingProductsChirho.length + pendingMovementsChirho.length,
    inventoryValue: inventoryValueChirho
  };
}

export function formatCurrencyChirho(valueChirho) {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    maximumFractionDigits: 2
  }).format(valueChirho);
}

export function formatDateTimeChirho(valueChirho) {
  if (!valueChirho) return 'Sin sincronizar';
  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(valueChirho));
}

export function buildProductChirho(formChirho, currentProductChirho, onlineChirho) {
  const nowChirho = new Date().toISOString();
  return {
    id: currentProductChirho?.id || `prod-${Date.now()}`,
    name: formChirho.name.trim(),
    sku: formChirho.sku.trim().toUpperCase(),
    category: formChirho.category,
    quantity: Number(formChirho.quantity),
    minStock: Number(formChirho.minStock),
    price: Number(formChirho.price),
    description: formChirho.description.trim(),
    syncStatus: onlineChirho ? 'synced' : 'pending',
    updatedAt: nowChirho
  };
}

export function applyMovementChirho(productChirho, movementTypeChirho, quantityChirho, onlineChirho) {
  const deltaChirho = movementTypeChirho === 'entry' ? quantityChirho : -quantityChirho;
  return {
    ...productChirho,
    quantity: Math.max(productChirho.quantity + deltaChirho, 0),
    syncStatus: onlineChirho ? productChirho.syncStatus : 'pending',
    updatedAt: new Date().toISOString()
  };
}
