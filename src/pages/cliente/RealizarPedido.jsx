// src/pages/cliente/RealizarPedido.jsx
import { useState } from 'react';
import { 
  FileUp, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  X
} from 'lucide-react';
import pedidoService from '../../services/pedidoService';

const RealizarPedido = () => {
  const [formData, setFormData] = useState({
    tipoTrabajo: '',
    prioridad: 'normal',
    descripcion: ''
  });
  const [archivo, setArchivo] = useState(null);
  const [archivoPreview, setArchivoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const tiposTrabajoOpciones = [
    { value: 'diseño', label: 'Diseño Gráfico', icon: '🎨' },
    { value: 'impresion', label: 'Impresión', icon: '🖨️' },
    { value: 'sellos', label: 'Sellos', icon: '📝' },
    { value: 'personalizado', label: 'Personalizado', icon: '✨' },
    { value: 'otro', label: 'Otro', icon: '📦' }
  ];

  const prioridadOpciones = [
    { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-700 border-red-300', icon: '🔴' },
    { value: 'normal', label: 'Normal', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: '🟡' },
    { value: 'baja', label: 'Baja Prioridad', color: 'bg-green-100 text-green-700 border-green-300', icon: '🟢' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'El archivo no debe exceder 10MB' });
        return;
      }

      // Validar tipo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Solo se permiten archivos JPG, PNG o PDF' });
        return;
      }

      setArchivo(file);
      
      // Preview para imágenes
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setArchivoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setArchivoPreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setArchivo(null);
    setArchivoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validar campos
      if (!formData.tipoTrabajo) {
        setMessage({ type: 'error', text: 'Selecciona un tipo de trabajo' });
        setLoading(false);
        return;
      }

      if (!formData.descripcion.trim()) {
        setMessage({ type: 'error', text: 'Escribe una descripción del trabajo' });
        setLoading(false);
        return;
      }

      // Crear FormData para enviar
      const formDataToSend = new FormData();
      formDataToSend.append('tipoTrabajo', formData.tipoTrabajo);
      formDataToSend.append('prioridad', formData.prioridad);
      formDataToSend.append('descripcion', formData.descripcion);
      
      if (archivo) {
        formDataToSend.append('archivo', archivo);
      }

      await pedidoService.crearPedidoPersonalizado(formDataToSend);

      setMessage({ 
        type: 'success', 
        text: '✅ ¡Pedido enviado exitosamente! El administrador se pondrá en contacto contigo pronto.' 
      });

      // Limpiar formulario
      setFormData({
        tipoTrabajo: '',
        prioridad: 'normal',
        descripcion: ''
      });
      setArchivo(null);
      setArchivoPreview(null);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.msg || 'Error al enviar el pedido' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Realizar Pedido Personalizado</h1>
          <p className="mt-1 text-sm text-gray-600">
            Describe tu proyecto y un administrador se pondrá en contacto contigo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Trabajo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Trabajo *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tiposTrabajoOpciones.map((tipo) => (
                <button
                  key={tipo.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, tipoTrabajo: tipo.value })}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.tipoTrabajo === tipo.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{tipo.icon}</div>
                  <div className="text-sm font-medium">{tipo.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Prioridad *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {prioridadOpciones.map((prioridad) => (
                <button
                  key={prioridad.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, prioridad: prioridad.value })}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    formData.prioridad === prioridad.value
                      ? prioridad.color + ' font-semibold'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{prioridad.icon}</div>
                  <div className="text-sm">{prioridad.label}</div>
                </button>
              ))}
            </div>
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
              rows={6}
              placeholder="Describe tu proyecto con el mayor detalle posible..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.descripcion.length} caracteres
            </p>
          </div>

          {/* Archivo de Referencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo de Referencia (Opcional)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Sube una imagen o documento de referencia (JPG, PNG, PDF - Máx. 10MB)
            </p>

            {!archivo ? (
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="text-center">
                  <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Haz clic para seleccionar un archivo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG o PDF (máx. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {archivoPreview ? (
                      <img 
                        src={archivoPreview} 
                        alt="Preview" 
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                        <FileUp className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{archivo.name}</p>
                      <p className="text-xs text-gray-500">
                        {(archivo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mensajes */}
          {message.text && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Botón Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Pedido
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RealizarPedido;
