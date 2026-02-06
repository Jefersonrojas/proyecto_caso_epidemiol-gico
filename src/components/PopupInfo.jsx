export default function PopupInfo({ reporte }) {
  return (
    <div>
      <strong>Departamento:</strong> {reporte.departamento}<br />
      <strong>Provincia:</strong> {reporte.provincia}<br />
      <strong>Distrito:</strong> {reporte.distrito}<br />
      <strong>Fecha:</strong> {reporte.fecha_reporte}<br />
      <strong>Tipo:</strong> {reporte.tipo_reporte}<br />
      <strong>Estado:</strong> {reporte.estado_caso}<br />
      <strong>Fuente:</strong> {reporte.fuente_dato}
    </div>
  );
}
