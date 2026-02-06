# Dashboard de Vigilancia Epidemiológica COVID-19 🏥📊

Este proyecto es una aplicación web interactiva diseñada para la vigilancia y monitoreo de casos de COVID-19 en Perú. Permite la integración de múltiples fuentes de datos para visualizar patrones geoespaciales y temporales, facilitando la toma de decisiones en salud pública.

## ✨ Características Principales

- **🌎 Mapa Choropleth Interactivo**: Visualización por departamentos y provincias con escalas de colores basadas en la densidad de casos.
- **� Puntos Georreferenciados**: Representación elegante de reportes individuales mediante micro-marcadores con popups informativos.
- **�📈 Análisis de Tendencias**: Gráficos lineales que muestran la evolución de reportes en los últimos 7 días.
- **🔍 Filtrado Avanzado**: Segmentación por temporalidad (24h, 7d, 30d), ubicación geográfica (Departamento, Provincia, Distrito) y fuente de datos.
- **📂 Gestión de Fichas**: Visualización detallada de reportes individuales con opción de exportación a PDF.
- **🎨 Diseño Premium**: Interfaz moderna con efectos de *Glassmorphism*, modo claro optimizado y diseño responsivo.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React.js (Vite)
- **Mapas**: Leaflet & React-Leaflet
- **Gráficos**: Chart.js & React-Chartjs-2
- **Estilos**: Vanilla CSS con enfoque moderno y Bootstrap 5 para el layout.
- **PDF**: jsPDF & html2canvas

## 📂 Estructura del Proyecto y Código

### 1. Datos (`src/data/`)
- `reportes.json`: Base de datos ficticia principal con +1600 registros. Contiene campos como `id_reporte`, `fecha_reporte`, `tipo_reporte`, `latitud`, `longitud`, `departamento`, `provincia`, `distrito`, `estado_caso`, y `fuente_dato`.
- `ubigeo_peru.json`: Diccionario de jerarquía geográfica para los selectores de búsqueda.

### 2. Componentes Clave (`src/components/`)
- **`MapView.jsx`**: El corazón del dashboard. Utiliza `GeoJSON` para dibujar los límites del Perú y aplica lógica de colores dinámica basada en el volumen de casos.
- **`StatsCards.jsx`**: Muestra indicadores clave (KPIs) en la parte superior. Calcula automáticamente totales para categorías como "Sintomáticos", "Sospechosos" y "Confirmados".
- **`Filters.jsx`**: Gestiona el estado global de los filtros, permitiendo activar/desactivar capas de información (SIVAPRE, NOTI, NETLAB).
- **`SidePanel.jsx`**: Lista las fichas epidemiológicas más recientes y maneja la lógica de exportación a PDF.

### 3. Utilidades (`src/utils/`)
- **`mapUtils.js`**: Contiene la lógica matemática para la asignación de colores según rangos de severidad y la generación de la leyenda dinámica.

## 🚀 Instalación y Uso

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📝 Cumplimiento del Reto Académico

Este proyecto cumple con todos los requisitos del reto:
- **Fuente de Datos**: Implementada en JSON con todos los campos mínimos requeridos.
- **Requisitos del Mapa**: Capas activables, diferenciación por tipo de reporte y visualización espacial correcta.
- **Interactividad**: Panel de control funcional y popups integrados.

---
**Desarrollado para el Reto Académico de Vigilancia Epidemiológica - 2026**