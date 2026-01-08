// src/pages/cliente/sections/Catalog.jsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Filter, Tag, CheckCircle, XCircle, Loader2, Package, Calendar } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const Catalog = () => {
  const [productosAgrupados, setProductosAgrupados] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [showPromotions, setShowPromotions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriasRes, productosRes] = await Promise.all([
        axios.get(`${API_BASE}/productos/categorias`),
        axios.get(`${API_BASE}/productos/agrupados`),
      ]);

      setCategories(categoriasRes.data || []);
      setProductosAgrupados(productosRes.data || []);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isProductOnPromotion = (product) => {
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

  // Filtrar productos por categoría y promoción
  const filteredGrupos = productosAgrupados
    .map(grupo => ({
      ...grupo,
      productos: grupo.productos.filter(product => {
        // Filtrar por categoría
        if (selectedCategory !== 'todas' && grupo.categoria._id !== selectedCategory) {
          return false;
        }
        // Filtrar por promoción
        if (showPromotions && !isProductOnPromotion(product)) {
          return false;
        }
        return true;
      })
    }))
    .filter(grupo => grupo.productos.length > 0);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h2>
        <p className="mt-1 text-sm text-gray-600">
          Explora nuestros productos disponibles y realiza tus pedidos
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="promociones"
              checked={showPromotions}
              onChange={(e) => setShowPromotions(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="promociones" className="text-sm text-gray-700 flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Solo promociones
            </label>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Grid de productos */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      ) : filteredGrupos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredGrupos.map((grupo, idx) => (
            <div key={idx}>
              {/* Encabezado de Categoría */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{grupo.categoria.nombre}</h3>
              </div>

              {/* Grid de productos de esta categoría */}
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grupo.productos.slice(0, expandedCategories[grupo.categoria._id] ? grupo.productos.length : 3).map((product) => {
                    const isAvailable = product.estado === 'disponible';
                    const onPromotion = isProductOnPromotion(product);
                    const diasRestantes = onPromotion ? daysUntilPromoEnd(product.fechaFinPromocion) : 0;
                    const promoPrice = onPromotion ? calculatePromoPrice(product.precioActual, product.descuento) : null;

                    return (
                      <div
                        key={product._id}
                        className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all ${
                          onPromotion ? 'ring-2 ring-orange-500' : ''
                        }`}
                      >
                        {/* Badge de promoción */}
                        {onPromotion && (
                          <div className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 text-center">
                            🔥 {product.descuento}% OFF
                          </div>
                        )}

                        {/* Imagen del producto */}
                        <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                          {product.imagenUrl ? (
                            <img
                              src={product.imagenUrl}
                              alt={product.nombre}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          ) : (
                            <Package className="w-16 h-16 text-gray-400" />
                          )}

                          {/* Badge de disponibilidad */}
                          <div className="absolute top-2 left-2">
                            {isAvailable ? (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Disponible
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" />
                                No disponible
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Información del producto */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {product.nombre}
                          </h3>
                          {product.descripcion && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.descripcion}
                            </p>
                          )}

                          {/* Precio */}
                          <div className="mb-3">
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
                                ${product.precioActual?.toFixed(2) || '0.00'}
                              </span>
                            )}
                          </div>

                          {/* Info de promoción */}
                          {onPromotion && (
                            <div className="mb-3 space-y-1">
                              <p className="text-xs text-orange-600 font-medium">
                                ⏰ Termina en {diasRestantes} {diasRestantes === 1 ? 'día' : 'días'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Hasta: {new Date(product.fechaFinPromocion).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          )}

                          {/* Botón Solicitar */}
                          <button
                            onClick={() => console.log('Solicitar producto:', product)}
                            disabled={!isAvailable}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                              isAvailable
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {isAvailable ? 'Solicitar' : 'No Disponible'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {grupo.productos.length > 3 && (
                  <div className="flex justify-center mb-8 mt-4">
                    <button
                      onClick={() => toggleCategoryExpanded(grupo.categoria._id)}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      {expandedCategories[grupo.categoria._id] ? 'Ver menos' : 'Ver más'}
                    </button>
                  </div>
                )}
              </>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Catalog;

