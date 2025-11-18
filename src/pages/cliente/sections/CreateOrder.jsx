// src/pages/cliente/sections/CreateOrder.jsx
import { useState } from 'react';
import { Upload, File, X, Package, Loader2 } from 'lucide-react';
import orderService from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';

const CreateOrder = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tipo: '',
    clasificacion: '',
    descripcion: '',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'pdf'].includes(extension);
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Solo se permiten archivos .jpg, .png o .pdf');
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.tipo || !formData.clasificacion || !formData.descripcion) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      const orderFormData = new FormData();
      orderFormData.append('tipo', formData.tipo);
      orderFormData.append('clasificacion', formData.clasificacion);
      orderFormData.append('descripcion', formData.descripcion);
      orderFormData.append('clienteId', user?.id);
      orderFormData.append('estado', 'pendiente');

      // Adjuntar archivos
      files.forEach((file, index) => {
        orderFormData.append(`archivos`, file);
      });

      await orderService.createOrder(orderFormData);

      setSuccess('Pedido realizado exitosamente');
      setFormData({
        tipo: '',
        clasificacion: '',
        descripcion: '',
      });
      setFiles([]);

      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Error al realizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Realizar Pedido</h2>
        <p className="mt-1 text-sm text-gray-600">
          Solicita un trabajo específico y adjunta archivos de referencia
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de pedido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Trabajo *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un tipo</option>
              <option value="diseño">Diseño</option>
              <option value="impresion">Impresión</option>
              <option value="sellos">Sellos</option>
              <option value="personalizado">Personalizado</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Clasificación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clasificación *
            </label>
            <select
              name="clasificacion"
              value={formData.clasificacion}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una clasificación</option>
              <option value="urgente">Urgente</option>
              <option value="normal">Normal</option>
              <option value="baja_prioridad">Baja Prioridad</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Trabajo *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe detalladamente el trabajo que necesitas realizar..."
            />
          </div>

          {/* Adjuntar archivos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivos de Referencia (JPG, PNG, PDF)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 mb-1">
                  Haz clic para seleccionar archivos
                </span>
                <span className="text-xs text-gray-500">
                  Formatos permitidos: .jpg, .png, .pdf
                </span>
              </label>
            </div>

            {/* Lista de archivos */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mensajes */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                Realizar Pedido
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateOrder;

