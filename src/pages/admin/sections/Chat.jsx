// src/pages/admin/sections/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import chatService from '../../../services/chatService';
import userService from '../../../services/userService';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  const ASSET_BASE = API_BASE.replace(/\/api$/, '');
  const resolveMediaUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${ASSET_BASE}${url.startsWith('/') ? url : `/${url}`}`;
  };

  useEffect(() => {
    loadConversations();
    loadUsers();

    // Conectar al socket
    if (user?.id) {
      socketRef.current = chatService.connect(user.id);

      // Suscribirse a nuevos mensajes
      chatService.onNewMessage((message) => {
        if (selectedConversation && message.conversationId === selectedConversation.id) {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        } else {
          // Actualizar lista de conversaciones
          loadConversations();
        }
      });

      // Suscribirse a notificaciones
      chatService.onMessageNotification((notification) => {
        loadConversations();
      });
    }

    return () => {
      chatService.offNewMessage();
      chatService.offMessageNotification();
      chatService.disconnect();
    };
  }, [user, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const response = await chatService.getConversations();
      const list = Array.isArray(response) ? response : response.data || [];
      // Mostrar solo conversaciones que tienen al menos un mensaje
      const withMessages = list.filter((c) => Boolean(c?.ultimoMensaje));
      setConversations(withMessages);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const [empleados, clientes] = await Promise.all([
        userService.getEmpleados().catch(() => []),
        userService.getClientes().catch(() => []),
      ]);
      const allUsers = [
        ...(Array.isArray(empleados) ? empleados : []),
        ...(Array.isArray(clientes) ? clientes : []),
      ];
      setUsers(allUsers);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await chatService.getMessages(conversationId);
      setMessages(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
    }
  };

  const handleStartConversation = async (userId) => {
    try {
      const response = await chatService.createConversation(userId);
      const conversation = Array.isArray(response) ? response[0] : response.data || response;
      setSelectedConversation(conversation);
      loadConversations();
    } catch (err) {
      console.error('Error al crear conversación:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedConversation) return;
    if (!newMessage.trim() && !selectedFile) return;

    setSending(true);
    try {
      let mediaUrl = '';
      if (selectedFile) {
        const upload = await chatService.uploadMedia(selectedFile);
        mediaUrl = upload.url;
      }

      await chatService.sendMessage(selectedConversation.id, {
        mensaje: newMessage.trim(),
        mediaUrl: mediaUrl || undefined,
      });
      setNewMessage('');
      setSelectedFile(null);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    } finally {
      setSending(false);
    }
  };

  const getConversationUser = (conversation) => {
    if (!conversation.participantes || conversation.participantes.length === 0) return null;
    const otherUser = conversation.participantes.find((p) => p.id !== user?.id);
    return otherUser || conversation.participantes[0];
  };

  const getUnreadCount = (conversation) => {
    // Implementar lógica de mensajes no leídos si el backend lo proporciona
    return 0;
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] ui-card overflow-hidden">
      {/* Lista de conversaciones */}
      <div className="w-80 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold ui-title">Conversaciones</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
              Cargando...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No hay conversaciones</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {conversations.map((conversation) => {
                const otherUser = getConversationUser(conversation);
                const isSelected = selectedConversation?.id === conversation.id;
                const unreadCount = getUnreadCount(conversation);

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-5 text-left hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'ring-2 ring-blue-600/60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 ui-icon-badge rounded-full">
                          <User className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium ui-title truncate">
                          {otherUser?.nombre || 'Usuario'}
                        </p>
                        <p className="text-xs ui-text truncate">
                          {conversation.ultimoMensaje || 'Sin mensajes'}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <span className="flex-shrink-0 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* (Se movió la lista de usuarios al panel derecho) */}
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header de conversación */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 ui-icon-badge rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium ui-title">
                    {getConversationUser(selectedConversation)?.nombre || 'Usuario'}
                  </p>
                  <p className="text-xs ui-text">En línea</p>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {messages.map((message) => {
                const isOwn = message.remitenteId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800/60 text-slate-100'
                      }`}
                    >
                      {message.mediaUrl ? (
                        <div className="mb-2">
                          <img
                            src={resolveMediaUrl(message.mediaUrl)}
                            alt="adjunto"
                            className="rounded-md max-h-48"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                      {message.mensaje && <p className="text-sm break-words">{message.mensaje}</p>}
                      <p
                        className={`text-xs mt-2 ${
                          isOwn ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {new Date(message.fecha || message.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 space-y-3">
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="text-sm ui-text"
                  disabled={sending}
                />
                {selectedFile && (
                  <span className="text-xs ui-text truncate">{selectedFile.name}</span>
                )}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2 border rounded-lg"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !selectedFile) || sending}
                  className="px-4 py-2 ui-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="ui-text">Selecciona una conversación para comenzar</p>
            </div>
          </div>
        )}
      </div>

      {/* Panel derecho: Iniciar chat separado por rol */}
      <aside className="w-72 border-l border-gray-700 p-4 overflow-y-auto">
        <p className="text-xs font-semibold ui-text uppercase mb-4">Iniciar chat</p>
        <div className="space-y-5">
          {/* Empleados Section */}
          <div className="pb-4 border-b border-gray-700">
            <p className="text-[11px] font-semibold ui-text uppercase mb-3 pl-1 opacity-80">Empleados</p>
            <div className="space-y-2">
              {users
                .filter((u) => u.id !== user?.id && u.rol === 'empleado')
                .map((userItem) => (
                  <button
                    key={userItem.id}
                    onClick={() => handleStartConversation(userItem.id)}
                    className="w-full flex items-center gap-3 p-3 ui-btn hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-sm">{userItem.nombre}</span>
                  </button>
                ))}
              {users.filter((u) => u.id !== user?.id && u.rol === 'empleado').length === 0 && (
                <p className="text-xs ui-text opacity-60">No hay empleados disponibles</p>
              )}
            </div>
          </div>

          {/* Clientes Section */}
          <div>
            <p className="text-[11px] font-semibold ui-text uppercase mb-3 pl-1 opacity-80">Clientes</p>
            <div className="space-y-2">
              {users
                .filter((u) => u.id !== user?.id && u.rol === 'cliente')
                .map((userItem) => (
                  <button
                    key={userItem.id}
                    onClick={() => handleStartConversation(userItem.id)}
                    className="w-full flex items-center gap-3 p-3 ui-btn hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-sm">{userItem.nombre}</span>
                  </button>
                ))}
              {users.filter((u) => u.id !== user?.id && u.rol === 'cliente').length === 0 && (
                <p className="text-xs ui-text opacity-60">No hay clientes disponibles</p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Chat;

