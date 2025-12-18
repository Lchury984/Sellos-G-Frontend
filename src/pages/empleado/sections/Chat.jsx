// src/pages/empleado/sections/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, Loader2, Shield } from 'lucide-react';
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
      setConversations(Array.isArray(response) ? response : response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // Empleado puede chatear con admin y clientes
      const [admins, clientes] = await Promise.all([
        userService.getAdmins().catch(() => []),
        userService.getClientes().catch(() => []),
      ]);
      const allUsers = [
        ...(Array.isArray(admins) ? admins : []),
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
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Chat</h2>
        <p className="mt-1 text-sm text-gray-600">
          Comunícate con administradores y clientes en tiempo real
        </p>
      </div>

      <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Lista de conversaciones */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Conversaciones</h3>
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
              <div className="divide-y divide-gray-200">
                {conversations.map((conversation) => {
                  const otherUser = getConversationUser(conversation);
                  const isSelected = selectedConversation?.id === conversation.id;
                  const unreadCount = getUnreadCount(conversation);

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            otherUser?.rol === 'administrador' ? 'bg-purple-100' : 'bg-blue-100'
                          }`}>
                            {otherUser?.rol === 'administrador' ? (
                              <Shield className="w-5 h-5 text-purple-600" />
                            ) : (
                              <User className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {otherUser?.nombre || 'Usuario'}
                            </p>
                            {otherUser?.rol === 'administrador' && (
                              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-semibold rounded">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
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

          {/* Lista de usuarios para iniciar conversación */}
          <div className="border-t border-gray-200 p-4 max-h-64 overflow-y-auto space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase">Iniciar chat</p>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase mb-1">Administrador</p>
              <div className="space-y-1">
                {users
                  .filter((u) => u.id !== user?.id && u.rol === 'administrador')
                  .map((userItem) => (
                    <button
                      key={userItem.id}
                      onClick={() => handleStartConversation(userItem.id)}
                      className="w-full flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="truncate">{userItem.nombre}</span>
                    </button>
                  ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase mb-1">Clientes</p>
              <div className="space-y-1">
                {users
                  .filter((u) => u.id !== user?.id && u.rol === 'cliente')
                  .map((userItem) => (
                    <button
                      key={userItem.id}
                      onClick={() => handleStartConversation(userItem.id)}
                      className="w-full flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{userItem.nombre}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header de conversación */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    getConversationUser(selectedConversation)?.rol === 'administrador' 
                      ? 'bg-purple-100' 
                      : 'bg-blue-100'
                  }`}>
                    {getConversationUser(selectedConversation)?.rol === 'administrador' ? (
                      <Shield className="w-5 h-5 text-purple-600" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {getConversationUser(selectedConversation)?.nombre || 'Usuario'}
                      </p>
                      {getConversationUser(selectedConversation)?.rol === 'administrador' && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">En línea</p>
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.mediaUrl ? (
                          <div className="mb-2">
                            {message.mediaUrl.match(/\.(mp4|mov|avi|mkv)$/i) ? (
                              <video src={message.mediaUrl} controls className="rounded-md max-h-48" />
                            ) : (
                              <img src={message.mediaUrl} alt="adjunto" className="rounded-md max-h-48" />
                            )}
                          </div>
                        ) : null}
                        {message.mensaje && <p className="text-sm break-words">{message.mensaje}</p>}
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? 'text-blue-100' : 'text-gray-500'
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
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 space-y-2">
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="text-sm text-gray-600"
                    disabled={sending}
                  />
                  {selectedFile && (
                    <span className="text-xs text-gray-500 truncate">{selectedFile.name}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={(!newMessage.trim() && !selectedFile) || sending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Selecciona una conversación para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
