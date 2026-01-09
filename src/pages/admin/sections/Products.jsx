import { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, X, Save, Image as ImageIcon, Tag, Calendar, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const Products = () => {
  const [productosAgrupados, setProductosAgrupados] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [formDataProduct, setFormDataProduct] = useState({
    nombre: '',
    precioBase: '',
    precioActual: '',
    categoria: '',
    estado: 'disponible',
    descripcion: '',
    imagenUrl: '',
    descuento: '',
    fechaInicioPromocion: '',
    fechaFinPromocion: '',
  });
  const [formDataCategory, setFormDataCategory] = useState({
    nombre: '',
    descripcion: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriasRes, productosRes] = await Promise.all([
        axios.get(`${API_BASE}/productos/categorias`),
        axios.get(`${API_BASE}/productos/agrupados`),
      ]);

      setCategories(categoriasRes.data || []);
      setProductosAgrupados(productosRes.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setMessage({ type: 'error', text: 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setFormDataProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormDataCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'La imagen no debe exceder 5MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormDataProduct(prev => ({ ...prev, imagenUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar que si hay descuento, también hay fechas
      if (formDataProduct.descuento && formDataProduct.descuento > 0) {
        if (!formDataProduct.fechaInicioPromocion || !formDataProduct.fechaFinPromocion) {
          setMessage({ type: 'error', text: 'Si estableces un descuento, debes incluir fechas de inicio y fin' });
          return;
        }
      }

      const payload = {
        nombre: formDataProduct.nombre,
        descripcion: formDataProduct.descripcion,
        categoria: formDataProduct.categoria || null,
        precioBase: parseFloat(formDataProduct.precioBase),
        precioActual: parseFloat(formDataProduct.precioActual),
        estado: formDataProduct.estado,
        imagenUrl: formDataProduct.imagenUrl,
        descuento: formDataProduct.descuento ? parseFloat(formDataProduct.descuento) : 0,
        fechaInicioPromocion: formDataProduct.fechaInicioPromocion || null,
        fechaFinPromocion: formDataProduct.fechaFinPromocion || null
      };

      if (editingProduct) {
        await axios.put(`${API_BASE}/productos/${editingProduct._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Producto actualizado correctamente' });
      } else {
        await axios.post(`${API_BASE}/productos`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Producto creado correctamente' });
      }

      setShowProductModal(false);
      resetProductForm();
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Error al guardar producto' });
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${API_BASE}/productos/categorias/${editingCategory._id}`, formDataCategory, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Categoría actualizada correctamente' });
      } else {
        await axios.post(`${API_BASE}/productos/categorias`, formDataCategory, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Categoría creada correctamente' });
      }
      setShowCategoryModal(false);
      setFormDataCategory({ nombre: '', descripcion: '' });
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Error al guardar categoría' });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormDataProduct({
      nombre: product.nombre || '',
      precioBase: product.precioBase || '',
      precioActual: product.precioActual || '',
      categoria: product.categoria?._id || '',
      estado: product.estado || 'disponible',
      descripcion: product.descripcion || '',
      imagenUrl: product.imagenUrl || '',
      descuento: product.descuento || '',
      fechaInicioPromocion: product.fechaInicioPromocion ? product.fechaInicioPromocion.split('T')[0] : '',
      fechaFinPromocion: product.fechaFinPromocion ? product.fechaFinPromocion.split('T')[0] : '',
    });
    setImagePreview(product.imagenUrl || null);
    setShowProductModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormDataCategory({
      nombre: category.nombre || '',
      descripcion: category.descripcion || '',
    });
    setShowCategoryModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`${API_BASE}/productos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Producto eliminado correctamente' });
        fetchData();
      } catch (error) {
        setMessage({ type: 'error', text: error.response?.data?.msg || 'Error al eliminar' });
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await axios.delete(`${API_BASE}/productos/categorias/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Categoría eliminada correctamente' });
        fetchData();
      } catch (error) {
        setMessage({ type: 'error', text: error.response?.data?.msg || 'Error al eliminar' });
      }
    }
  };

  const resetProductForm = () => {
    setFormDataProduct({
      nombre: '',
      precioBase: '',
      precioActual: '',
      categoria: '',
      estado: 'disponible',
      descripcion: '',
      imagenUrl: '',
      descuento: '',
      fechaInicioPromocion: '',
      fechaFinPromocion: '',
    });
    setImagePreview(null);
    setEditingProduct(null);
  };

  const isProductOnPromotion = (product) => {
    // Verifica si hay descuento y fecha fin válida (sin depender de tienePromocion del DB)
    if (!product.descuento || product.descuento <= 0) return false;
    if (!product.fechaFinPromocion) return false;
    return new Date() <= new Date(product.fechaFinPromocion);
  };

  const daysUntilPromoEnd = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const calculatePromoPrice = (precioActual, descuento) => {
    return (precioActual - (precioActual * descuento / 100)).toFixed(2);
  };

  const toggleCategoryExpanded = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Productos
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona tus productos, categorías y promociones
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowCategoryModal(true);
              setEditingCategory(null);
              setFormDataCategory({ nombre: '', descripcion: '' });
            }}
            className="flex items-center gap-2 ui-btn-primary"
          >
            <Tag className="w-5 h-5" />
            Nueva Categoría
          </button>
          <button
            onClick={() => {
              setShowProductModal(true);
              resetProductForm();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Mensajes */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Productos por Categoría */}
      <div className="space-y-8">
        {productosAgrupados && productosAgrupados.length > 0 ? (
          productosAgrupados.map((grupo, idx) => (
            <div key={idx}>
              {/* Encabezado de Categoría */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{grupo.categoria.nombre}</h3>
                  <p className="text-sm text-gray-600 mt-1">{grupo.categoria.descripcion}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(grupo.categoria)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Editar categoría"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(grupo.categoria._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {grupo.productos && grupo.productos.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {grupo.productos.slice(0, expandedCategories[grupo.categoria._id] ? grupo.productos.length : 3).map((product) => {
                    const onPromotion = isProductOnPromotion(product);
                    const promoPrice = onPromotion
                      ? calculatePromoPrice(product.precioActual, product.descuento)
                      : null;
                    const diasRestantes = onPromotion ? daysUntilPromoEnd(product.fechaFinPromocion) : 0;

                    return (
                      <div
                        key={product._id}
                        className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-lg ${
                          onPromotion ? 'ring-2 ring-orange-500' : ''
                        }`}
                      >
                        {onPromotion && (
                          <div className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 text-center">
                            🔥 {product.descuento}% OFF
                          </div>
                        )}

                        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                          {product.imagenUrl ? (
                            <img
                              src={product.imagenUrl}
                              alt={product.nombre}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          ) : (
                            <ImageIcon className="w-16 h-16 text-gray-400" />
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.nombre}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.descripcion}</p>

                          <div className="flex items-center justify-between mb-2">
                            {onPromotion ? (
                              <div>
                                <span className="text-lg font-bold text-orange-600">
                                  ${promoPrice}
                                </span>
                                <span className="text-sm text-gray-400 line-through ml-2">
                                  ${product.precioActual.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                ${product.precioActual.toFixed(2)}
                              </span>
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                product.estado === 'disponible'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {product.estado === 'disponible' ? 'Disponible' : 'No disponible'}
                            </span>
                          </div>

                          {onPromotion && (
                            <div className="space-y-1">
                              <p className="text-xs text-orange-600 mb-1 font-medium">
                                ⏰ Termina en {diasRestantes} {diasRestantes === 1 ? 'día' : 'días'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Hasta: {new Date(product.fechaFinPromocion).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                  {grupo.productos.length > 3 && (
                    <div className="flex justify-center mb-8">
                      <button
                        onClick={() => toggleCategoryExpanded(grupo.categoria._id)}
                        className="ui-btn-secondary"
                      >
                        {expandedCategories[grupo.categoria._id] ? 'Ver menos' : 'Ver más'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                  No hay productos en esta categoría
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay productos registrados</p>
          </div>
        )}
      </div>

      {/* Modal Producto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  resetProductForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formDataProduct.nombre}
                  onChange={handleProductChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Base *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="precioBase"
                    value={formDataProduct.precioBase}
                    onChange={handleProductChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Actual *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="precioActual"
                    value={formDataProduct.precioActual}
                    onChange={handleProductChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="categoria"
                  value={formDataProduct.categoria}
                  onChange={handleProductChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  name="estado"
                  value={formDataProduct.estado}
                  onChange={handleProductChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="disponible">Disponible</option>
                  <option value="no_disponible">No Disponible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formDataProduct.descripcion}
                  onChange={handleProductChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen
                </label>
                {imagePreview && (
                  <div className="mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Promoción (Opcional)
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descuento (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="descuento"
                      value={formDataProduct.descuento}
                      onChange={handleProductChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      name="fechaInicioPromocion"
                      value={formDataProduct.fechaInicioPromocion}
                      onChange={handleProductChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      name="fechaFinPromocion"
                      value={formDataProduct.fechaFinPromocion}
                      onChange={handleProductChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    resetProductForm();
                  }}
                  className="flex-1 ui-btn-ghost"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 ui-btn-primary"
                >
                  <Save className="w-5 h-5" />
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Categoría */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                  setFormDataCategory({ nombre: '', descripcion: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formDataCategory.nombre}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formDataCategory.descripcion}
                  onChange={handleCategoryChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setFormDataCategory({ nombre: '', descripcion: '' });
                  }}
                  className="flex-1 ui-btn-ghost"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 ui-btn-primary"
                >
                  <Save className="w-5 h-5" />
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

