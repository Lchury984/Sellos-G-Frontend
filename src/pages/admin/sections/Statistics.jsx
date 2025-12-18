// src/pages/admin/sections/Statistics.jsx
import { useState, useEffect } from 'react';
import { Download, FileText, BarChart3, Calendar, Loader2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const Statistics = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');

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
      const response = await axios.get(
        `${API_BASE}/inventario/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!data || data.length === 0) {
      setError('No hay datos para exportar');
      return;
    }

    try {
      const doc = new jsPDF();

      // Título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte de Inventario', 14, 20);

      // Fechas
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Periodo: ${fechaInicio} al ${fechaFin}`, 14, 28);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 34);

      // Tabla
      const tableData = data.map((row) => [
        row.producto,
        `${row.salidas} ${row.unidad}`,
        `${row.stockActual} ${row.unidad}`,
        row.estado,
        row.alertaActivada
      ]);

      autoTable(doc, {
        head: [['Producto', 'Salidas', 'Stock Actual', 'Estado', 'Alerta Activada']],
        body: tableData,
        startY: 40,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 40 }
      });

      doc.save(`reporte_inventario_${fechaInicio}_${fechaFin}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setError('Error al generar el PDF. Verifica la consola para más detalles.');
    }
  };

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      setError('No hay datos para exportar');
      return;
    }

    const excelData = data.map((row) => ({
      'Producto': row.producto,
      'Salidas': row.salidas,
      'Entradas': row.entradas,
      'Unidad': row.unidad,
      'Stock Actual': row.stockActual,
      'Stock Mínimo': row.stockMinimo,
      'Estado': row.estado,
      'Alerta Activada': row.alertaActivada
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    
    // Ajustar anchos de columna
    worksheet['!cols'] = [
      { wch: 25 }, // Producto
      { wch: 12 }, // Salidas
      { wch: 12 }, // Entradas
      { wch: 12 }, // Unidad
      { wch: 15 }, // Stock Actual
      { wch: 15 }, // Stock Mínimo
      { wch: 15 }, // Estado
      { wch: 18 }  // Alerta Activada
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Inventario');
    XLSX.writeFile(workbook, `reporte_inventario_${fechaInicio}_${fechaFin}.xlsx`);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Estadísticas de Inventario</h2>
        <p className="mt-1 text-sm text-gray-600">
          Genera reportes detallados de movimientos de inventario con filtros por fecha
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      {data && data.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados del Reporte ({data.length} materiales)
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salidas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alerta Activada
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr key={index} className={row.estado === 'Bajo stock' ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{row.producto}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.salidas} {row.unidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.stockActual} {row.unidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.estado === 'Bajo stock' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Bajo stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.alertaActivada}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay movimientos */}
      {data && data.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">
            No se encontraron movimientos de inventario en el rango de fechas seleccionado
          </p>
        </div>
      )}

      {/* Mensaje cuando no hay datos */}
      {!data && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Generar Reporte de Inventario
          </h3>
          <p className="text-gray-500">
            Selecciona un rango de fechas y genera un reporte de inventario para ver los movimientos
          </p>
        </div>
      )}
    </>
  );
};

export default Statistics;

