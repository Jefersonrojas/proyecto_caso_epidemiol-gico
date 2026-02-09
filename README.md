# Informe Técnico: Dashboard de Vigilancia Epidemiológica COVID-19

**Estimado Profesor,**

A continuación, le  presento el desarrollo y la sustentacion de  este proyecto. Este dashboard ha sido diseñado no solo como una herramienta de visualización, sino como un sistema modular de análisis epidemiológico basado en React. A continuación, detallo cada aspecto del sistema, desde la ingesta de datos hasta la representación visual.

---

## Arquitectura del Proyecto y Tecnologías Usadas

El proyecto esta echo con **Componentes Funcionales de React** bajo el ecosistema de **Vite**. Escogi estas  herramientas debido a su alto rendimiento y eficiencia en el manejo del estado global.

- **React v18**: Manejo de interfaces declarativas.
- **Leaflet + React-Leaflet**: Motor para la representación cartográfica geoespacial.
- **Chart.js**: Motor de renderizado de tendencias temporales.
- **Bootstrap 5 & Custom CSS**: Estructura de rejilla (Grid) y diseño estético premium con efectos de *Glassmorphism*.

---

##  Análisis Detallado de Archivos y Carpetas

### `src/data/` (Capa de Datos)
Aquí estan los datos creados del sistema en este caso decidí  enfocarme solo  en algunos departamentos del peru para la visualizacion de datos en el mapa :
- **`reportes.json`**: Base de datos epidemiológica con  mas de 1600 registros. Cada entrada incluye `id_reporte`, `tipo_reporte` (Sintomático, Sospechoso, Confirmado), coordenadas (latitud y longitud), y jerarquía de UBIGEO.
- **`ubigeo_peru.json`**: Diccionario jerárquico que permite que los filtros geográficos sean dinámicos y dependientes entre sí.

### `src/services/` (Capa de Servicio)
- **`dataService.js`**: Implementa el patrón *Service*. Permite el acceso a los datos,para que en el futuro la transición de JSON estático a una API REST sea transparente para los componentes.

###  `src/utils/` 
- **`mapUtils.js`**: Contiene la inteligencia del mapa.
    - `contarCasosPorDepartamento()`: Agrupa y totaliza los reportes por región geográfica.
    - `obtenerColor()`: Este algoritmo de semaforización nos sirve  para dar las tonalidades cromáticas basadas en la densidad de casos.
  
###  `public/geo/`
En esta carpeta estan  los archivos GeoJSON (peru_departamentos.geojson y peru_provincias.geojson), estos archivos son muy importantes  ya que me dan los polígonos  para  dibujar las  fronteras de las regiones y darle el color correspondiente a cada departamento de acuerdo a la gravedad del caso. Cabe recalcar que los datos de los archivos los descargue de github.

---

##  Extracción y Flujo de Datos 

El flujo de información se gestiona mediante un ciclo de vida unidireccional:

1.  **Toma**: Carga inicial de datos mediante el servicio centralizado.
2.  **Filtrado Dinámico**: El componente `Dashboard.jsx` utiliza un estado de filtros que, al cambiar da una nueva ejecución de filtrado sobre el dataset original.
3.  **Sincronización de Estado**: Los datos filtrados se distribuyen vía *props* a todos los componentes visuales simultáneamente.

---

##  Componentes Visuales

- **`MapView.jsx`**:  Usa capas de calor y marcadores individuales con popups informativos y gestiona  los archivos GeoJSON para dibujar los bordes de los departamentos.
- **`StatsCards.jsx`**: Son los 4 cuadros superiores. Hacen sumas del total de casos filtrados para dar una visión macro del estado del país.
- **`SidePanel.jsx`**: Para visualizar los  registros individuales, añadi la funcion que permite exportación a PDF mediante las librerías `jsPDF` y `html2canvas`.Es la barra lateral derecha que muestra una lista de los 10 reportes más recientes.
- **`WeeklyTrend.jsx`**:Genera el gráfico lineal al final del panel lateral y analiza las fechas de los reportes para mostrar si la curva de contagios está subiendo o bajando en los últimos 7 días.
- **`Header.jsx`**:Es la barra superior que muestra el nombre del sistema (SIVAPRE) y los iconos de perfil
- **`Filters.jsx`**: Contiene la lógica de los menús desplegables y interruptores. Cuando cambias un filtro, este componente emite un evento que el Dashboard escucha para actualizar todo el mapa.


---


##  . Conclusión del Desarrollo

Este proyecto cumple con los requisitos requeridos con una estructura modular que  garantiza que el sistema sea escalable, mantenible y funcional para la toma de decisiones basada en datos.

---

## Despliegue 

Para garantizar la disponibilidad del sistema, decidi desplegarlo en vercel :
- **`vercel.json`**: Reglas de redirección para Single Page Applications (SPA).
- **`.gitignore`**: Exclusión de archivos de entorno y dependencias para un repositorio limpio.
- A continaucion puede visualizar el **[Despligue del Dashboard](https://proyecto-caso-epidemiol-gico-80wwkf4q1.vercel.app/)** 

---
**Desarrollado por : Heiser Jeferson Rojas Burgos**


