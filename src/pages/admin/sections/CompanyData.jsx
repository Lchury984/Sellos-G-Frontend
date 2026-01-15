// src/pages/admin/sections/CompanyData.jsx
import { useState, useEffect } from 'react';
import { Building2, Upload, Save, Loader2, Info } from 'lucide-react';
import companyService from '../../../services/companyService';

const CompanyData = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tagline: '',
    telefono: '',
    direccion: '',
    email: '',
    logoUrl: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const data = await companyService.getSettings();
        setFormData({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          tagline: data.tagline || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          email: data.email || '',
          logoUrl: data.logoUrl || '',
        });
        if (data.logoUrl) {
          setLogoPreview(data.logoUrl);
        }
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Error al cargar datos' });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'El logo no debe exceder 2MB' });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let logoBase64 = formData.logoUrl;

      // Si hay un nuevo logo, convertirlo a base64
      if (logoFile) {
        logoBase64 = logoPreview;
      }

      const dataToSend = {
        ...formData,
        logoUrl: logoBase64
      };

      await companyService.updateSettings(dataToSend);
      setMessage({ type: 'success', text: 'Datos actualizados. Los cambios se reflejarán en el landing page.' });
      setLogoFile(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar datos' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Datos de la Empresa
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Gestiona la información que aparece en el landing page público
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Estos datos aparecen en el landing page público</p>
          <p>Los cambios se reflejarán inmediatamente en la página principal que ven los visitantes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        {/* Logo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo de la Empresa
          </label>
          <p className="text-xs text-gray-500 mb-3">Aparece en el navbar del landing. Máximo 2MB.</p>
          <div className="flex items-center gap-4">
            {logoPreview && (
              <div className="w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden bg-white p-2">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <Upload className="w-5 h-5" />
              {logoFile || logoPreview ? 'Cambiar Logo' : 'Subir Logo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Sellos-G"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Aparece en el título y footer</p>
          </div>

          {/* Tagline */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Ej: Sellos y Publicidad desde 2015"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Aparece en el hero del landing</p>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción breve de tu empresa..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Aparece debajo del título principal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Contacto
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="info@sellos-g.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Aparece en el footer</p>
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+503 0000-0000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Aparece en el footer</p>
          </div>
        </div>

        {/* Dirección */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="San Salvador, El Salvador"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Aparece en el footer</p>
        </div>

        {/* Mensajes */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CompanyData;

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const data = await companyService.getCompanyData();
        setFormData({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          email: data.email || '',
          logo: null,
        });
        if (data.logo) {
          setLogoPreview(data.logo);
        }
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Error al cargar datos' });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await companyService.updateCompanyData(formData);
      setMessage({ type: 'success', text: 'Datos de la empresa actualizados correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar datos' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Datos de la Empresa
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Gestiona la información y el logo de tu empresa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        {/* Logo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo de la Empresa
          </label>
          <div className="flex items-center gap-4">
            {logoPreview && (
              <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              <Upload className="w-5 h-5" />
              {formData.logo ? 'Cambiar Logo' : 'Subir Logo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Empresa
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Teléfono */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Dirección */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Mensajes */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CompanyData;

