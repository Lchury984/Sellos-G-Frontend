// src/pages/admin/sections/Statistics.jsx
import { useState, useEffect } from 'react';
import { Download, FileText, BarChart3, Calendar, Loader2 } from 'lucide-react';
import reportService from '../../../services/reportService';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const Statistics = () => {
  const [reportType, setReportType] = useState('ventas'); // 'ventas' o 'inventario'
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  // Establecer fechas por defecto (último mes)
  useEffect(() => {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    
    setFechaFin(hoy.toISOString().split('T')[0]);
    setFechaInicio(haceUnMes.toISOString().split('T')[0]);
  }, []);

  const handleGenerateReport = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('Por favor selecciona un rango de fechas');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      let response;
      if (reportType === 'ventas') {
        response = await reportService.getSalesData(fechaInicio, fechaFin);
      } else {
        response = await reportService.getInventoryData(fechaInicio, fechaFin);
      }
      
      setData(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      setError(err.message || 'Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!data || data.length === 0) {
      setError('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let yPosition = 20;

    // Título
    doc.setFontSize(18);
    doc.text(
      `Reporte de ${reportType === 'ventas' ? 'Ventas' : 'Inventario'}`,
      margin,
      yPosition
    );
    yPosition += 10;

    // Fechas
    doc.setFontSize(12);
    doc.text(`Desde: ${fechaInicio}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Hasta: ${fechaFin}`, margin, yPosition);
    yPosition += 10;

    // Encabezados de tabla
    doc.setFontSize(10);
    const headers = Object.keys(data[0]);
    const colWidth = (pageWidth - 2 * margin) / headers.length;
    let xPosition = margin;

    headers.forEach((header) => {
      doc.text(header.toUpperCase(), xPosition, yPosition);
      xPosition += colWidth;
    });
    yPosition += 5;

    // Datos
    data.forEach((row) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      xPosition = margin;
      headers.forEach((header) => {
        const value = row[header]?.toString() || '';
        doc.text(value.substring(0, 20), xPosition, yPosition);
        xPosition += colWidth;
      });
      yPosition += 5;
    });

    doc.save(`reporte_${reportType}_${fechaInicio}_${fechaFin}.pdf`);
  };

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      setError('No hay datos para exportar');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

    XLSX.writeFile(
      workbook,
      `reporte_${reportType}_${fechaInicio}_${fechaFin}.xlsx`
    );
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Estadísticas y Reportes</h2>
        <p className="mt-1 text-sm text-gray-600">
          Genera reportes de ventas e inventario con filtros por fecha
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ventas">Ventas</option>
              <option value="inventario">Inventario</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  Generar Reporte
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Resultados */}
      {data && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados del Reporte ({data.length} registros)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Exportar PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(0, 50).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {value?.toString() || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 50 && (
              <p className="mt-4 text-sm text-gray-500 text-center">
                Mostrando 50 de {data.length} registros. Exporta el reporte para ver todos los datos.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay datos */}
      {!data && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">
            Selecciona un rango de fechas y genera un reporte para ver los datos
          </p>
        </div>
      )}
    </>
  );
};

export default Statistics;

