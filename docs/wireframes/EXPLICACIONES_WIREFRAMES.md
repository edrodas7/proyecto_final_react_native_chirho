# Explicaciones de wireframes - StockTrack Mobile Chirho

## Wireframe 1: Dashboard

El dashboard es la pantalla inicial de StockTrack Mobile Chirho. Su objetivo es mostrar un resumen rápido del estado del inventario para que el usuario pueda tomar decisiones sin revisar producto por producto.

En esta pantalla se muestran cuatro métricas principales: total de productos registrados, productos con bajo stock, cambios pendientes de sincronización y valor estimado del inventario. También incluye el estado de conexión de la aplicación, que puede estar en modo online u offline.

El flujo principal inicia aquí porque el usuario puede identificar productos críticos, revisar alertas de bajo stock y ejecutar la sincronización cuando vuelve la conexión. Esta pantalla sirve como centro de control de la aplicación.

## Wireframe 2: Lista de productos

La pantalla de lista de productos permite consultar el inventario completo. Incluye un campo de búsqueda para localizar productos por nombre, SKU o categoría, además de un filtro por categoría.

Cada producto se presenta como una tarjeta con información resumida: nombre, código SKU, categoría, cantidad disponible y estado. Desde esta pantalla el usuario puede abrir el detalle de un producto o editarlo.

Este flujo está pensado para que el usuario encuentre rápidamente un artículo dentro del inventario, sin necesidad de navegar por muchas pantallas. Es la vista principal para consulta y mantenimiento de productos.

## Wireframe 3: Detalle de producto y movimiento

La pantalla de detalle muestra la información completa de un producto seleccionado: nombre, SKU, descripción, stock actual, stock mínimo, precio y categoría.

Desde esta pantalla también se registra el movimiento de inventario. El usuario puede seleccionar si el movimiento es una entrada o una salida, indicar la cantidad y escribir el motivo del cambio. Al guardar el movimiento, la app actualiza automáticamente el stock del producto.

Debajo se muestra el historial de movimientos asociados al producto. Este flujo permite mantener trazabilidad sobre por qué cambió la cantidad disponible y facilita detectar ventas, compras, ajustes o traslados.

## Wireframe 4: Formulario de producto

El formulario de producto permite crear nuevos artículos o editar productos existentes. Incluye campos para nombre, SKU, categoría, precio, cantidad, stock mínimo y descripción.

El SKU funciona como identificador operativo del producto, mientras que el stock mínimo permite activar alertas cuando la cantidad disponible cae por debajo del nivel definido.

Este flujo permite mantener el inventario actualizado y organizado. Al crear o editar un producto, la información se guarda localmente y recibe un estado de sincronización según la conexión disponible.

## Wireframe 5: Flujo offline y sincronización

El flujo offline explica cómo la aplicación maneja cambios cuando no hay conexión a internet. La regla principal es que toda acción del usuario se guarda primero en el dispositivo.

Si la aplicación está online, el producto o movimiento se guarda con estado `synced`, indicando que ya está sincronizado. Si la aplicación está offline, el cambio se guarda con estado `pending`, indicando que queda pendiente de sincronización.

Cuando la conexión vuelve, el usuario puede presionar el botón de sincronización desde el dashboard. La aplicación procesa los cambios pendientes y actualiza su estado a `synced`. Este modelo permite que el usuario siga trabajando aunque no tenga internet.

La estrategia propuesta para resolver conflictos es `last-write-wins`, usando el campo `updatedAt`. Esto significa que, si dos versiones del mismo registro entran en conflicto, se conserva la modificación más reciente.

## Flujo general de navegación

El usuario inicia en el dashboard, donde revisa métricas y alertas. Desde ahí puede ir a la lista de productos para buscar un artículo específico. Al seleccionar un producto, entra al detalle, donde puede consultar información completa o registrar entradas y salidas.

Si necesita agregar un nuevo producto, usa la pantalla de formulario. Cada operación se guarda localmente. Si la app está offline, los cambios quedan pendientes; si está online, pueden sincronizarse.

Este flujo cubre las operaciones principales de un gestor de inventario móvil: consulta, creación, edición, control de stock, trazabilidad de movimientos y trabajo sin conexión.
