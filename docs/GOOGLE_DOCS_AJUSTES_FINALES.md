# Ajustes finales para Google Docs

## Tabla de contenido navegable

En Google Docs, lo mejor es crearla con la función nativa para que sea navegable:

1. Colocar el cursor al inicio del documento, después de la portada o del título principal.
2. Ir a `Insertar`.
3. Seleccionar `Tabla de contenido`.
4. Elegir la opción con enlaces.

Google Docs generará automáticamente una tabla de contenido navegable usando los títulos del documento. Para que funcione bien, las secciones deben estar formateadas como `Título 1`, `Título 2` o `Título 3`.

Secciones sugeridas:

1. Definición del proyecto
2. Resumen ejecutivo
3. Instalación y ejecución
4. Funcionalidades principales
5. Organización del repositorio
6. Arquitectura técnica
7. Persistencia local
8. Sincronización offline
9. Funcionalidades core
10. Componentización
11. Wireframes
12. Evidencia visual
13. Conclusiones técnicas
14. Enlaces

## Resumen ejecutivo

StockTrack Mobile Chirho es una aplicación móvil-first para gestionar inventario de pequeños negocios. La solución permite registrar productos, controlar entradas y salidas, detectar bajo stock y trabajar sin conexión mediante persistencia local y sincronización simulada.

El proyecto resuelve el problema de llevar inventarios en hojas de cálculo, notas manuales o registros poco confiables. La app centraliza la información clave del inventario en una interfaz sencilla, reproducible y preparada para evolucionar hacia una solución productiva con backend y base de datos móvil.

## Instalación y ejecución

Para ejecutar el proyecto en un entorno local se requiere tener instalado Node.js y npm.

1. Clonar el repositorio:

```bash
git clone git@github.com:edrodas7/proyecto_final_react_native_chirho.git
```

2. Entrar a la carpeta del proyecto:

```bash
cd proyecto_final_react_native_chirho
```

3. Instalar dependencias:

```bash
npm install
```

4. Ejecutar la aplicación en modo desarrollo:

```bash
npm start
```

5. Abrir la app en el navegador:

```text
http://localhost:3000
```

6. Ejecutar pruebas unitarias:

```bash
npm test -- --watchAll=false
```

7. Generar build de producción:

```bash
npm run build
```
