// src/pages/cliente/sections/Catalog.jsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Filter, Tag, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import orderService from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';

const Catalog = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [showPromotions, setShowPromotions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, showPromotions]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      const productsData = Array.isArray(response) ? response : response.data || [];
      setProducts(productsData);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      const categoriesData = Array.isArray(response) ? response : response.data || [];
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filtrar por categoría
    if (selectedCategory !== 'todas') {
      filtered = filtered.filter(
        (p) => p.categoriaId === selectedCategory || p.categoria?.id === selectedCategory
      );
    }

    // Filtrar por promociones
    if (showPromotions) {
      const now = new Date();
      filtered = filtered.filter((p) => {
        if (!p.descuento || p.descuento === 0) return false;
        const inicio = p.fechaInicioPromocion ? new Date(p.fechaInicioPromocion) : null;
        const fin = p.fechaFinPromocion ? new Date(p.fechaFinPromocion) : null;
        if (inicio && fin) {
          return now >= inicio && now <= fin;
        }
        return p.descuento > 0;
      });
    }

    setFilteredProducts(filtered);
  };

  const isInPromotion = (product) => {
    if (!product.descuento || product.descuento === 0) return false;
    const now = new Date();
    const inicio = product.fechaInicioPromocion ? new Date(product.fechaInicioPromocion) : null;
    const fin = product.fechaFinPromocion ? new Date(product.fechaFinPromocion) : null;
    if (inicio && fin) {
      return now >= inicio && now <= fin;
    }
    return product.descuento > 0;
  };

  const calculatePrice = (product) => {
    if (isInPromotion(product)) {
      const discount = product.descuento || 0;
      const basePrice = product.precioBase || product.precio;
      return basePrice * (1 - discount / 100);
    }
    return product.precio;
  };

  const handleOrderProduct = async (productId) => {
    try {
      setError('');
      setSuccess('');

      // Crear pedido simple desde catálogo
      await orderService.createOrder({
        productoId: productId,
        clienteId: user?.id,
        tipo: 'producto',
        estado: 'pendiente',
      });

      setSuccess('Pedido realizado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al realizar el pedido');
    }
  };

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
                <option key={cat.id} value={cat.id}>
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
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isAvailable = product.estado === 'disponible';
            const inPromotion = isInPromotion(product);
            const finalPrice = calculatePrice(product);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Imagen del producto */}
                <div className="relative h-48 bg-gray-100">
                  {product.imagen ? (
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  {inPromotion && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      -{product.descuento}%
                    </div>
                  )}
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.nombre}</h3>
                  {product.descripcion && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.descripcion}
                    </p>
                  )}

                  {/* Precio */}
                  <div className="mb-3">
                    {inPromotion ? (
                      <div>
                        <span className="text-lg font-bold text-red-600">
                          ${finalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${(product.precioBase || product.precio).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${product.precio?.toFixed(2) || '0.00'}
                      </span>
                    )}
                  </div>

                  {/* Botón realizar pedido */}
                  <button
                    onClick={() => handleOrderProduct(product.id)}
                    disabled={!isAvailable}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isAvailable
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isAvailable ? 'Realizar Pedido' : 'No Disponible'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Catalog;

