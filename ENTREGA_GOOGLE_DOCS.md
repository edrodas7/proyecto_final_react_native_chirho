# Documento final - StockTrack Mobile Chirho

## 1. Definición del proyecto

**Nombre:** StockTrack Mobile Chirho

**Temática:** Gestión de inventario para pequeños negocios.

**Problema a resolver:** Muchos negocios pequeños controlan inventario en hojas de cálculo o notas manuales, lo que provoca errores de stock, pérdida de historial y dificultad para detectar productos agotados. StockTrack Mobile Chirho centraliza el control de productos, entradas, salidas y alertas desde una interfaz móvil.

**Público objetivo:** Dueños, encargados de bodega, vendedores y personal operativo de tiendas pequeñas, ferreterías, bodegas o emprendimientos.

## 2. Funcionalidades principales

- Dashboard con métricas generales del inventario.
- Lista de productos con búsqueda y filtros por categoría.
- Registro y edición de productos.
- Detalle de producto con stock, precio, SKU, categoría y descripción.
- Registro de movimientos de entrada y salida.
- Alertas de bajo stock.
- Persistencia local para conservar datos en el dispositivo.
- Sincronización offline simulada mediante estados pendientes y sincronizados.

## 3. Organización del repositorio

```text
src/
  App.js
  App.css
  inventory.js
  index.js
  index.css
public/
  index.html
README.md
```

La estructura separa la interfaz, los estilos y la lógica de inventario. `App.js` contiene las pantallas y componentes; `inventory.js` centraliza datos iniciales, persistencia y funciones reutilizables.

## 4. Arquitectura técnica

```mermaid
flowchart TD
  A[Usuario] --> B[UI Screens]
  B --> C[Componentes reutilizables]
  C --> D[Reglas de negocio]
  D --> E[Repositorio local]
  E --> F[localStorage]
  D --> G[Servicio de sincronización simulado]
```

La arquitectura separa responsabilidades para facilitar mantenimiento. Las pantallas no escriben directamente lógica compleja de datos; usan funciones auxiliares como `loadInventoryStateChirho`, `saveInventoryStateChirho`, `getInventoryMetricsChirho`, `buildProductChirho` y `applyMovementChirho`.

## 5. Persistencia local

La persistencia se implementa con `localStorage`, una tecnología disponible en navegadores modernos. La app guarda un objeto con productos, movimientos y fecha de última sincronización.

Fragmento representativo:

```js
export function saveInventoryStateChirho(stateChirho) {
  window.localStorage.setItem(STORAGE_KEY_CHIRHO, JSON.stringify(stateChirho));
}
```

Esta decisión permite que el usuario cierre la aplicación y conserve los datos creados. En una versión productiva, esta capa podría migrarse a SQLite, Room, Hive o AsyncStorage, manteniendo la misma separación de responsabilidades.

## 6. Sincronización offline

La app simula conectividad con un control `Online/Offline`.

- Si la app está offline, los cambios quedan con `syncStatus: "pending"`.
- Si la app está online, los cambios pueden marcarse como sincronizados.
- El botón `Sincronizar` procesa productos y movimientos pendientes.
- La estrategia de resolución de conflictos propuesta es `last-write-wins`, usando `updatedAt`.

Flujo:

```mermaid
flowchart TD
  A[Crear o modificar datos] --> B{Hay conexión}
  B -->|Sí| C[Guardar como synced]
  B -->|No| D[Guardar como pending]
  D --> E[Cola local de cambios]
  E --> F{Conexión recuperada}
  F -->|Sí| G[Sincronizar pendientes]
  G --> H[Actualizar lastSyncAt]
```

## 7. Funcionalidades core

La funcionalidad central es el control de stock mediante productos y movimientos. Cada movimiento modifica la cantidad disponible del producto.

Fragmento representativo:

```js
export function applyMovementChirho(productChirho, movementTypeChirho, quantityChirho, onlineChirho) {
  const deltaChirho = movementTypeChirho === 'entry' ? quantityChirho : -quantityChirho;
  return {
    ...productChirho,
    quantity: Math.max(productChirho.quantity + deltaChirho, 0),
    syncStatus: onlineChirho ? productChirho.syncStatus : 'pending',
    updatedAt: new Date().toISOString()
  };
}
```

## 8. Componentización

La interfaz reutiliza componentes como:

- `MetricChirho`: muestra indicadores del dashboard.
- `StatusBadgeChirho`: muestra estados de bajo stock, pendiente o disponible.
- `ProductListChirho`: renderiza productos y acciones principales.

Esta componentización evita duplicación y facilita extender la app con más pantallas.

## 9. Wireframes

Se incluyen wireframes de baja fidelidad en la carpeta `docs/wireframes/`. Estos bocetos muestran la estructura de las pantallas principales y el flujo offline:

1. `dashboard.svg`: pantalla inicial con métricas, estado de conexión y alertas de bajo stock.
2. `products.svg`: lista de productos con búsqueda, filtro y tarjetas de inventario.
3. `detail-movement.svg`: detalle de producto, formulario de movimiento e historial.
4. `product-form.svg`: formulario para crear o editar productos.
5. `offline-sync-flow.svg`: flujo donde los cambios se guardan localmente como pendientes y luego se sincronizan.

Explicación del flujo: el usuario inicia en el dashboard, revisa alertas o entra a la lista de productos. Desde la lista puede abrir el detalle de un producto, registrar entradas o salidas, o editar la información. Si necesita agregar un producto nuevo, usa el formulario. Cuando la app está offline, los cambios quedan pendientes; al volver online, se sincronizan manualmente desde el dashboard.

## 10. Evidencia visual

Agregar capturas reales de:

- App en modo offline.
- Producto con bajo stock.
- Creación de producto.
- Registro de movimiento.
- Cambio pendiente.
- Sincronización completada en modo online.

## 11. Conclusiones técnicas

StockTrack Mobile Chirho demuestra cómo construir una solución móvil organizada para controlar inventario de forma local. El mayor desafío fue modelar un flujo offline comprensible sin depender de un backend real. La solución adoptada fue guardar los cambios en el dispositivo y etiquetarlos con estados de sincronización.

Como mejora futura, se podría integrar autenticación, backend real, escaneo de códigos de barras, exportación a PDF/Excel y almacenamiento local más robusto mediante SQLite o una base de datos móvil.

## 12. Enlaces

**Repositorio GitHub:** https://github.com/edrodas7/proyecto_final_react_native_chirho

**APK descargable:** opcional, pegar enlace aquí si aplica.
