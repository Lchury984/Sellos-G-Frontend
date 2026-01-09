// src/pages/cliente/sections/Notifications.jsx
import { useState, useEffect } from 'react';
import {
  Bell,
  MessageSquare,
  ShoppingCart,
  CheckCircle,
  Package,
  X,
  CheckCheck,
} from 'lucide-react';
import notificationService from '../../../services/notificationService';

const Notifications = ({ onNotificationsChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas'); // 'todas', 'no-leidas'

  useEffect(() => {
    loadNotifications();
    // Polling cada 30 segundos para nuevas notificaciones
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response =
        filter === 'no-leidas'
          ? await notificationService.getUnreadNotifications()
          : await notificationService.getNotifications();
      setNotifications(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
      // Actualizar contador en el Dashboard
      if (onNotificationsChange) {
        onNotificationsChange();
      }
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      loadNotifications();
      // Actualizar contador en el Dashboard
      if (onNotificationsChange) {
        onNotificationsChange();
      }
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      loadNotifications();
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'mensaje':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'pedido':
        return <ShoppingCart className="w-5 h-5 text-green-600" />;
      case 'estado_pedido':
        return <Package className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (tipo) => {
    switch (tipo) {
      case 'mensaje':
        return 'bg-blue-50 border-blue-200';
      case 'pedido':
        return 'bg-green-50 border-green-200';
      case 'estado_pedido':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES');
  };

  const unreadCount = notifications.filter((n) => !n.leida).length;

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2>
            <p className="mt-1 text-sm text-gray-600">
              Mantente informado sobre tus pedidos y mensajes
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('todas')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'todas'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('no-leidas')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'no-leidas'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            No leídas ({unreadCount})
          </button>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
            Cargando notificaciones...
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No hay notificaciones</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
                notification.leida ? 'border-gray-200' : 'border-blue-500'
              } ${getNotificationColor(notification.tipo)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {notification.titulo || 'Nueva notificación'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{notification.mensaje}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(notification.fecha || notification.createdAt)}
                      </p>
                    </div>
                    {!notification.leida && (
                      <span className="ml-2 flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.leida && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Marcar como leída"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Notifications;

