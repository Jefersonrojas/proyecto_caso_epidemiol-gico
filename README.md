# Informe Técnico: Dashboard de Vigilancia Epidemiológica COVID-19

**Estimado Profesor,**

A continuación, le  presento el desarrollo y la sustentacion de  este proyecto. Este dashboard ha sido diseñado no solo como una herramienta de visualización, sino como un sistema modular de análisis epidemiológico basado en React. A continuación, detallo cada aspecto del sistema, desde la ingesta de datos hasta la representación visual.

---

## 1. Arquitectura del Proyecto y Tecnologías Usadas

El proyecto esta echo con **Componentes Funcionales de React** bajo el ecosistema de **Vite**. Escogi estas  herramientas debido a su alto rendimiento y eficiencia en el manejo del estado global.

- **React v18**: Manejo de interfaces declarativas.
- **Leaflet + React-Leaflet**: Motor para la representación cartográfica geoespacial.
- **Chart.js**: Motor de renderizado de tendencias temporales.
- **Bootstrap 5 & Custom CSS**: Estructura de rejilla (Grid) y diseño estético premium con efectos de *Glassmorphism*.

---

## 2. Análisis Detallado de Archivos y Carpetas

### `src/data/` (Capa de Datos)
Aquí reside la "fuente de la verdad" del sistema:
- **`reportes.json`**: Base de datos epidemiológica con +1600 registros. Cada entrada incluye `id_reporte`, `tipo_reporte` (Sintomático, Sospechoso, Confirmado), coordenadas (latitud y longitud), y jerarquía de UBIGEO.
- **`ubigeo_peru.json`**: Diccionario jerárquico que permite que los filtros geográficos sean dinámicos y dependientes entre sí.

### `src/services/` (Capa de Servicio)
- **`dataService.js`**: Implementa el patrón *Service*. Centraliza el acceso a los datos, permitiendo que en el futuro la transición de JSON estático a una API REST sea transparente para los componentes.

### 📁 `src/utils/` (Capa de Lógica de Negocio)
- **`mapUtils.js`**: Contiene la inteligencia del mapa.
    - `contarCasosPorDepartamento()`: Agrupa y totaliza los reportes por región geográfica.
    - `obtenerColor()`: Algoritmo de semaforización que asigna tonalidades cromáticas basadas en la densidad de casos (Escala de severidad).

---

## 🔍 3. Extracción y Flujo de Datos (Data Pipeline)

El flujo de información se gestiona mediante un ciclo de vida unidireccional:

1.  **Ingesta**: Carga inicial de datos mediante el servicio centralizado.
2.  **Filtrado Dinámico**: El componente `Dashboard.jsx` utiliza un estado de filtros que, al cambiar, dispara una nueva ejecución de filtrado sobre el dataset original.
3.  **Sincronización de Estado**: Los datos filtrados se distribuyen vía *props* a todos los componentes visuales simultáneamente.

---

## 🗺️ 4. Componentes Visuales

- **`MapView.jsx`**: Renderiza el mapa interactivo. Utiliza capas de calor y marcadores individuales con popups informativos.
- **`StatsCards.jsx`**: Paneles dinámicos que resumen los indicadores clave de rendimiento (KPIs) en tiempo real.
- **`SidePanel.jsx`**: Visualizador de registros individuales, añadi la funcion que permite exportación a PDF mediante las librerías `jsPDF` y `html2canvas`.
- **`WeeklyTrend.jsx`**: Análisis de series temporales para observar la evolución de la pandemia en los últimos 7 días.

---

## 🎨 5. Diseño y Usabilidad

Se ha aplicado un enfoque de **Diseño Moderno y Responsivo**:
- **Estética Premium**: Uso de gradientes, sombras suaves y efectos de desenfoque de fondo (*Backdrop Blur*).
- **Accesibilidad**: Tipografía optimizada y contrastes de color validados para facilitar la lectura de datos críticos.

---

## 🚀 6. Conclusión del Desarrollo

Este proyecto integra con éxito la ingeniería de software moderna con las necesidades de la salud pública. La estructura modular garantiza que el sistema sea escalable, mantenible y funcional para la toma de decisiones basada en datos.

---

## ⚡ 7. Preparación para Despliegue (DevOps)

Para garantizar la disponibilidad del sistema, se han configurado:
- **`vercel.json`**: Reglas de redirección para Single Page Applications (SPA).
- **`.gitignore`**: Exclusión de archivos de entorno y dependencias para un repositorio limpio.

---
**Desarrollado por el Alumno: [Tu Nombre]**
**Curso: Desarrollo de Sistemas Epidemiológicos**
**2026**
