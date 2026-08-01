import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  applyMovementChirho,
  buildProductChirho,
  createInitialStateChirho,
  formatCurrencyChirho,
  formatDateTimeChirho,
  getInventoryMetricsChirho,
  loadInventoryStateChirho,
  saveInventoryStateChirho,
  STORAGE_KEY_CHIRHO
} from './inventory';

const emptyProductFormChirho = {
  name: '',
  sku: '',
  category: 'Materiales',
  quantity: 0,
  minStock: 5,
  price: 0,
  description: ''
};

const categoriesChirho = ['Todos', 'Materiales', 'EPP', 'Electricidad', 'Herramientas'];

function AppChirho() {
  const [inventoryStateChirho, setInventoryStateChirho] = useState(loadInventoryStateChirho);
  const [activeTabChirho, setActiveTabChirho] = useState('dashboard');
  const [selectedProductIdChirho, setSelectedProductIdChirho] = useState(inventoryStateChirho.products[0]?.id || null);
  const [queryChirho, setQueryChirho] = useState('');
  const [categoryChirho, setCategoryChirho] = useState('Todos');
  const [isOnlineChirho, setIsOnlineChirho] = useState(false);
  const [productFormChirho, setProductFormChirho] = useState(emptyProductFormChirho);
  const [editingProductIdChirho, setEditingProductIdChirho] = useState(null);
  const [movementFormChirho, setMovementFormChirho] = useState({
    productId: inventoryStateChirho.products[0]?.id || '',
    type: 'entry',
    quantity: 1,
    reason: ''
  });

  useEffect(() => {
    saveInventoryStateChirho(inventoryStateChirho);
  }, [inventoryStateChirho]);

  const metricsChirho = useMemo(
    () => getInventoryMetricsChirho(inventoryStateChirho.products, inventoryStateChirho.movements),
    [inventoryStateChirho.products, inventoryStateChirho.movements]
  );

  const filteredProductsChirho = useMemo(() => {
    return inventoryStateChirho.products.filter((product) => {
      const matchesQuery = `${product.name} ${product.sku} ${product.category}`
        .toLowerCase()
        .includes(queryChirho.toLowerCase());
      const matchesCategory = categoryChirho === 'Todos' || product.category === categoryChirho;
      return matchesQuery && matchesCategory;
    });
  }, [inventoryStateChirho.products, queryChirho, categoryChirho]);

  const selectedProductChirho =
    inventoryStateChirho.products.find((product) => product.id === selectedProductIdChirho) || inventoryStateChirho.products[0];

  const selectedMovementsChirho = inventoryStateChirho.movements
    .filter((movement) => movement.productId === selectedProductChirho?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  function updateProductFieldChirho(field, value) {
    setProductFormChirho((current) => ({ ...current, [field]: value }));
  }

  function startEditingProductChirho(product) {
    setEditingProductIdChirho(product.id);
    setProductFormChirho({
      name: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.quantity,
      minStock: product.minStock,
      price: product.price,
      description: product.description
    });
    setActiveTabChirho('form');
  }

  function resetProductFormChirho() {
    setEditingProductIdChirho(null);
    setProductFormChirho(emptyProductFormChirho);
  }

  function handleProductSubmitChirho(event) {
    event.preventDefault();
    if (!productFormChirho.name.trim() || !productFormChirho.sku.trim()) return;

    const existing = inventoryStateChirho.products.find((product) => product.id === editingProductIdChirho);
    const nextProduct = buildProductChirho(productFormChirho, existing, isOnlineChirho);

    setInventoryStateChirho((current) => {
      const products = existing
        ? current.products.map((product) => (product.id === existing.id ? nextProduct : product))
        : [nextProduct, ...current.products];

      return {
        ...current,
        products
      };
    });

    setSelectedProductIdChirho(nextProduct.id);
    resetProductFormChirho();
    setActiveTabChirho('products');
  }

  function handleMovementSubmitChirho(event) {
    event.preventDefault();
    const quantity = Number(movementFormChirho.quantity);
    const product = inventoryStateChirho.products.find((item) => item.id === movementFormChirho.productId);
    if (!product || quantity <= 0) return;

    const movement = {
      id: `mov-${Date.now()}`,
      productId: product.id,
      type: movementFormChirho.type,
      quantity,
      reason: movementFormChirho.reason.trim() || 'Ajuste de inventario',
      createdAt: new Date().toISOString(),
      syncStatus: isOnlineChirho ? 'synced' : 'pending'
    };

    setInventoryStateChirho((current) => ({
      ...current,
      products: current.products.map((item) =>
        item.id === product.id ? applyMovementChirho(item, movementFormChirho.type, quantity, isOnlineChirho) : item
      ),
      movements: [movement, ...current.movements]
    }));

    setSelectedProductIdChirho(product.id);
    setMovementFormChirho((current) => ({ ...current, quantity: 1, reason: '' }));
    setActiveTabChirho('detail');
  }

  function syncPendingChangesChirho() {
    if (!isOnlineChirho) return;

    setInventoryStateChirho((current) => ({
      products: current.products.map((product) => ({ ...product, syncStatus: 'synced' })),
      movements: current.movements.map((movement) => ({ ...movement, syncStatus: 'synced' })),
      lastSyncAt: new Date().toISOString()
    }));
  }

  function resetDemoDataChirho() {
    const nextState = createInitialStateChirho();
    window.localStorage.setItem(STORAGE_KEY_CHIRHO, JSON.stringify(nextState));
    setInventoryStateChirho(nextState);
    setSelectedProductIdChirho(nextState.products[0]?.id || null);
    setMovementFormChirho({
      productId: nextState.products[0]?.id || '',
      type: 'entry',
      quantity: 1,
      reason: ''
    });
    resetProductFormChirho();
    setActiveTabChirho('dashboard');
  }

  return (
    <main className="app-shell-chirho">
      <header className="topbar-chirho">
        <div>
          <p className="eyebrow-chirho">Gestor de inventario</p>
          <h1>StockTrack Mobile Chirho</h1>
        </div>
        <button
          className={`connection-toggle-chirho ${isOnlineChirho ? 'online' : 'offline'}`}
          type="button"
          onClick={() => setIsOnlineChirho((current) => !current)}
          title="Cambiar estado de conexión"
        >
          <span aria-hidden="true">{isOnlineChirho ? '●' : '○'}</span>
          {isOnlineChirho ? 'Online' : 'Offline'}
        </button>
      </header>

      <nav className="tabs-chirho" aria-label="Navegación principal">
        <button className={activeTabChirho === 'dashboard' ? 'active' : ''} onClick={() => setActiveTabChirho('dashboard')}>
          Inicio
        </button>
        <button className={activeTabChirho === 'products' ? 'active' : ''} onClick={() => setActiveTabChirho('products')}>
          Productos
        </button>
        <button className={activeTabChirho === 'detail' ? 'active' : ''} onClick={() => setActiveTabChirho('detail')}>
          Detalle
        </button>
        <button className={activeTabChirho === 'form' ? 'active' : ''} onClick={() => setActiveTabChirho('form')}>
          Nuevo
        </button>
      </nav>

      {activeTabChirho === 'dashboard' && (
        <section className="screen-chirho">
          <div className="metric-grid-chirho">
            <MetricChirho label="Productos" value={metricsChirho.totalProducts} />
            <MetricChirho label="Bajo stock" value={metricsChirho.lowStockCount} tone="warning" />
            <MetricChirho label="Pendientes" value={metricsChirho.pendingSyncCount} tone="danger" />
            <MetricChirho label="Valor" value={formatCurrencyChirho(metricsChirho.inventoryValue)} />
          </div>

          <section className="sync-panel-chirho">
            <div>
              <h2>Sincronización local</h2>
              <p>
                Cambios guardados en el dispositivo. Última sincronización:{' '}
                <strong>{formatDateTimeChirho(inventoryStateChirho.lastSyncAt)}</strong>
              </p>
            </div>
            <button type="button" onClick={syncPendingChangesChirho} disabled={!isOnlineChirho || metricsChirho.pendingSyncCount === 0}>
              Sincronizar
            </button>
          </section>

          <section className="section-block-chirho">
            <div className="section-heading-chirho">
              <h2>Alertas de bajo stock</h2>
              <button type="button" onClick={() => setActiveTabChirho('products')}>
                Ver productos
              </button>
            </div>
            <ProductListChirho
              products={inventoryStateChirho.products.filter((product) => product.quantity <= product.minStock)}
              onSelect={(product) => {
                setSelectedProductIdChirho(product.id);
                setActiveTabChirho('detail');
              }}
              onEdit={startEditingProductChirho}
            />
          </section>

          <button className="secondary-chirho full-chirho" type="button" onClick={resetDemoDataChirho}>
            Restaurar datos demo
          </button>
        </section>
      )}

      {activeTabChirho === 'products' && (
        <section className="screen-chirho">
          <div className="filters-chirho">
            <label>
              Buscar
              <input
                value={queryChirho}
                onChange={(event) => setQueryChirho(event.target.value)}
                placeholder="Nombre, SKU o categoría"
              />
            </label>
            <label>
              Categoría
              <select value={categoryChirho} onChange={(event) => setCategoryChirho(event.target.value)}>
                {categoriesChirho.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <ProductListChirho
            products={filteredProductsChirho}
            onSelect={(product) => {
              setSelectedProductIdChirho(product.id);
              setActiveTabChirho('detail');
            }}
            onEdit={startEditingProductChirho}
          />
        </section>
      )}

      {activeTabChirho === 'detail' && (
        <section className="screen-chirho">
          {selectedProductChirho ? (
            <>
              <article className="detail-panel-chirho">
                <div className="detail-title-chirho">
                  <div>
                    <p className="eyebrow-chirho">{selectedProductChirho.sku}</p>
                    <h2>{selectedProductChirho.name}</h2>
                  </div>
                  <StatusBadgeChirho product={selectedProductChirho} />
                </div>
                <p>{selectedProductChirho.description}</p>
                <div className="detail-grid-chirho">
                  <MetricChirho label="Stock actual" value={selectedProductChirho.quantity} />
                  <MetricChirho label="Stock mínimo" value={selectedProductChirho.minStock} />
                  <MetricChirho label="Precio" value={formatCurrencyChirho(selectedProductChirho.price)} />
                  <MetricChirho label="Categoría" value={selectedProductChirho.category} />
                </div>
                <button type="button" onClick={() => startEditingProductChirho(selectedProductChirho)}>
                  Editar producto
                </button>
              </article>

              <form className="form-panel-chirho" onSubmit={handleMovementSubmitChirho}>
                <h2>Registrar movimiento</h2>
                <label>
                  Producto
                  <select
                    value={movementFormChirho.productId}
                    onChange={(event) =>
                      setMovementFormChirho((current) => ({ ...current, productId: event.target.value }))
                    }
                  >
                    {inventoryStateChirho.products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="inline-fields-chirho">
                  <label>
                    Tipo
                    <select
                      value={movementFormChirho.type}
                      onChange={(event) =>
                        setMovementFormChirho((current) => ({ ...current, type: event.target.value }))
                      }
                    >
                      <option value="entry">Entrada</option>
                      <option value="exit">Salida</option>
                    </select>
                  </label>
                  <label>
                    Cantidad
                    <input
                      type="number"
                      min="1"
                      value={movementFormChirho.quantity}
                      onChange={(event) =>
                        setMovementFormChirho((current) => ({ ...current, quantity: event.target.value }))
                      }
                    />
                  </label>
                </div>
                <label>
                  Motivo
                  <textarea
                    value={movementFormChirho.reason}
                    onChange={(event) =>
                      setMovementFormChirho((current) => ({ ...current, reason: event.target.value }))
                    }
                    placeholder="Ej. venta, compra, ajuste, traslado"
                  />
                </label>
                <button type="submit">Guardar movimiento</button>
              </form>

              <section className="section-block-chirho">
                <h2>Historial</h2>
                <div className="movement-list-chirho">
                  {selectedMovementsChirho.length === 0 && <p className="empty-chirho">Sin movimientos registrados.</p>}
                  {selectedMovementsChirho.map((movement) => (
                    <article className="movement-row-chirho" key={movement.id}>
                      <div>
                        <strong>{movement.type === 'entry' ? 'Entrada' : 'Salida'}</strong>
                        <p>{movement.reason}</p>
                      </div>
                      <div className="movement-meta-chirho">
                        <span>{movement.type === 'entry' ? '+' : '-'}{movement.quantity}</span>
                        <small>{movement.syncStatus === 'synced' ? 'Sincronizado' : 'Pendiente'}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <p className="empty-chirho">No hay productos registrados.</p>
          )}
        </section>
      )}

      {activeTabChirho === 'form' && (
        <section className="screen-chirho">
          <form className="form-panel-chirho" onSubmit={handleProductSubmitChirho}>
            <div className="section-heading-chirho">
              <h2>{editingProductIdChirho ? 'Editar producto' : 'Nuevo producto'}</h2>
              {editingProductIdChirho && (
                <button className="secondary-chirho" type="button" onClick={resetProductFormChirho}>
                  Cancelar
                </button>
              )}
            </div>
            <label>
              Nombre
              <input
                value={productFormChirho.name}
                onChange={(event) => updateProductFieldChirho('name', event.target.value)}
                placeholder="Ej. Taladro inalámbrico"
                required
              />
            </label>
            <label>
              SKU
              <input
                value={productFormChirho.sku}
                onChange={(event) => updateProductFieldChirho('sku', event.target.value)}
                placeholder="HER-TAL-001"
                required
              />
            </label>
            <div className="inline-fields-chirho">
              <label>
                Categoría
                <select
                  value={productFormChirho.category}
                  onChange={(event) => updateProductFieldChirho('category', event.target.value)}
                >
                  {categoriesChirho
                    .filter((item) => item !== 'Todos')
                    .map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                </select>
              </label>
              <label>
                Precio
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productFormChirho.price}
                  onChange={(event) => updateProductFieldChirho('price', event.target.value)}
                />
              </label>
            </div>
            <div className="inline-fields-chirho">
              <label>
                Cantidad
                <input
                  type="number"
                  min="0"
                  value={productFormChirho.quantity}
                  onChange={(event) => updateProductFieldChirho('quantity', event.target.value)}
                />
              </label>
              <label>
                Stock mínimo
                <input
                  type="number"
                  min="0"
                  value={productFormChirho.minStock}
                  onChange={(event) => updateProductFieldChirho('minStock', event.target.value)}
                />
              </label>
            </div>
            <label>
              Descripción
              <textarea
                value={productFormChirho.description}
                onChange={(event) => updateProductFieldChirho('description', event.target.value)}
                placeholder="Detalle corto del producto"
              />
            </label>
            <button type="submit">{editingProductIdChirho ? 'Guardar cambios' : 'Crear producto'}</button>
          </form>
        </section>
      )}
    </main>
  );
}

function MetricChirho({ label, value, tone = 'default' }) {
  return (
    <div className={`metric-chirho ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadgeChirho({ product }) {
  const isLow = product.quantity <= product.minStock;
  const label = isLow ? 'Bajo stock' : product.syncStatus === 'pending' ? 'Pendiente' : 'Disponible';
  const className = isLow ? 'low' : product.syncStatus === 'pending' ? 'pending' : 'ok';

  return <span className={`status-chirho ${className}`}>{label}</span>;
}

function ProductListChirho({ products, onSelect, onEdit }) {
  if (products.length === 0) {
    return <p className="empty-chirho">No hay productos para mostrar.</p>;
  }

  return (
    <div className="product-list-chirho">
      {products.map((product) => (
        <article className="product-card-chirho" key={product.id}>
          <button type="button" className="product-main-chirho" onClick={() => onSelect(product)}>
            <span className="product-name-chirho">{product.name}</span>
            <span className="product-code-chirho">{product.sku}</span>
            <span className="product-meta-chirho">
              {product.category} · Stock {product.quantity}
            </span>
          </button>
          <div className="product-actions-chirho">
            <StatusBadgeChirho product={product} />
            <button className="secondary-chirho compact-chirho" type="button" onClick={() => onEdit(product)}>
              Editar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default AppChirho;
