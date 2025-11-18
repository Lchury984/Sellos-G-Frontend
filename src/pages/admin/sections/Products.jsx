// src/pages/admin/sections/Products.jsx
import { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, X, Save, Image as ImageIcon, Tag, Calendar } from 'lucide-react';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    precioBase: '',
    categoriaId: '',
    estado: 'disponible',
    descripcion: '',
    imagen: null,
    descuento: '',
    fechaInicioPromocion: '',
    fechaFinPromocion: '',
  });
  const [categoryFormData, setCategoryFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ]);
      setProducts(Array.isArray(productsData) ? productsData : productsData.data || []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        setMessage({ type: 'success', text: 'Producto actualizado correctamente' });
      } else {
        await productService.createProduct(formData);
        setMessage({ type: 'success', text: 'Producto creado correctamente' });
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al guardar producto' });
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, categoryFormData);
        setMessage({ type: 'success', text: 'Categoría actualizada correctamente' });
      } else {
        await categoryService.createCategory(categoryFormData);
        setMessage({ type: 'success', text: 'Categoría creada correctamente' });
      }
      setShowCategoryModal(false);
      setCategoryFormData({ nombre: '', descripcion: '' });
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al guardar categoría' });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre || '',
      precio: product.precio || '',
      precioBase: product.precioBase || product.precio || '',
      categoriaId: product.categoriaId || product.categoria?.id || '',
      estado: product.estado || 'disponible',
      descripcion: product.descripcion || '',
      imagen: null,
      descuento: product.descuento || '',
      fechaInicioPromocion: product.fechaInicioPromocion || '',
      fechaFinPromocion: product.fechaFinPromocion || '',
    });
    setImagePreview(product.imagen || null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productService.deleteProduct(id);
        setMessage({ type: 'success', text: 'Producto eliminado correctamente' });
        fetchData();
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Error al eliminar producto' });
      }
    }
  };

  const handleCategoryDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await categoryService.deleteCategory(id);
        setMessage({ type: 'success', text: 'Categoría eliminada correctamente' });
        fetchData();
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Error al eliminar categoría' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      precio: '',
      precioBase: '',
      categoriaId: '',
      estado: 'disponible',
      descripcion: '',
      imagen: null,
      descuento: '',
      fechaInicioPromocion: '',
      fechaFinPromocion: '',
    });
    setImagePreview(null);
    setEditingProduct(null);
  };

  const isProductOnPromotion = (product) => {
    if (!product.descuento || !product.fechaInicioPromocion || !product.fechaFinPromocion) {
      return false;
    }
    const now = new Date();
    const start = new Date(product.fechaInicioPromocion);
    const end = new Date(product.fechaFinPromocion);
    return now >= start && now <= end;
  };

  const calculatePromotionPrice = (precioBase, descuento) => {
    return precioBase - (precioBase * descuento / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowCategoryModal(true);
              setEditingCategory(null);
              setCategoryFormData({ nombre: '', descripcion: '' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Tag className="w-5 h-5" />
            Nueva Categoría
          </button>
          <button
            onClick={() => {
              setShowModal(true);
              resetForm();
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
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Lista de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => {
          const onPromotion = isProductOnPromotion(product);
          const promotionPrice = onPromotion
            ? calculatePromotionPrice(product.precioBase || product.precio, product.descuento)
            : null;

          return (
            <div
              key={product.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                onPromotion ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              {/* Badge de Promoción */}
              {onPromotion && (
                <div className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 text-center">
                  🔥 {product.descuento}% OFF
                </div>
              )}

              {/* Imagen */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.imagen ? (
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>

              {/* Información */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.nombre}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {categories.find(c => c.id === product.categoriaId || c.id === product.categoria?.id)?.nombre || 'Sin categoría'}
                </p>
                <div className="flex items-center justify-between mb-2">
                  {onPromotion ? (
                    <div>
                      <span className="text-lg font-bold text-orange-600">
                        ${promotionPrice?.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ${(product.precioBase || product.precio).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      ${product.precio?.toFixed(2) || '0.00'}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      product.estado === 'disponible'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.estado === 'disponible' ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
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

      {/* Modal de Producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Base
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="precioBase"
                      value={formData.precioBase}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Actual
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen
                  </label>
                  {imagePreview && (
                    <div className="mb-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Promociones */}
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
                        value={formData.descuento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inicio
                      </label>
                      <input
                        type="date"
                        name="fechaInicioPromocion"
                        value={formData.fechaInicioPromocion}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fin
                      </label>
                      <input
                        type="date"
                        name="fechaFinPromocion"
                        value={formData.fechaFinPromocion}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-5 h-5" />
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Categoría */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setCategoryFormData({ nombre: '', descripcion: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={categoryFormData.nombre}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={categoryFormData.descripcion}
                    onChange={handleCategoryChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setEditingCategory(null);
                      setCategoryFormData({ nombre: '', descripcion: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-5 h-5" />
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Categorías */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold text-gray-900">{category.nombre}</h4>
                {category.descripcion && (
                  <p className="text-sm text-gray-500 mt-1">{category.descripcion}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setCategoryFormData({
                      nombre: category.nombre || '',
                      descripcion: category.descripcion || '',
                    });
                    setShowCategoryModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCategoryDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

