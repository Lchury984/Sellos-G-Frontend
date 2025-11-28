// src/pages/admin/sections/UsersManagement.jsx
import { useState, useEffect } from 'react';
import { UserCog, Users, Mail, Plus, Edit, X, Save } from 'lucide-react';
import userService from '../../../services/userService';

const UsersManagement = () => {
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', correo: '', edad: '', password: '', rol: 'empleado' });

  const fetchAll = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const [emps, clis] = await Promise.all([
        userService.getEmpleados().catch((e) => { throw { source: 'empleados', e }; }),
        userService.getClientes().catch((e) => { throw { source: 'clientes', e }; }),
      ]);
      setEmpleados(Array.isArray(emps) ? emps : emps.data || []);
      setClientes(Array.isArray(clis) ? clis : clis.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err?.e?.message || err?.message || 'Error al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id, rol) => {
    if (!id) return;
    if (!window.confirm(`¿Eliminar ${rol === 'empleado' ? 'empleado' : 'cliente'}?`)) return;
    try {
      await userService.deleteUser(id, rol);
      setMessage({ type: 'success', text: `${rol} eliminado correctamente` });
      await fetchAll();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al eliminar usuario' });
    }
  };

  const openNewEmployee = () => {
    setEditingUser(null);
    setFormData({ nombre: '', correo: '', edad: '', password: '', rol: 'empleado' });
    setShowModal(true);
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || '',
      correo: user.correo || user.email || '',
      edad: user.edad ?? '',
      password: '',
      rol: user.rol || 'empleado'
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ type: '', text: '' });

    // Basic validation
    if (!formData.nombre || !formData.correo || (!editingUser && !formData.password)) {
      setMessage({ type: 'error', text: 'Por favor complete nombre, correo y contraseña (al crear).' });
      setFormLoading(false);
      return;
    }

    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id || editingUser._id, {
          nombre: formData.nombre,
          correo: formData.correo,
          edad: formData.edad,
          rol: formData.rol
        });
        setMessage({ type: 'success', text: 'Empleado actualizado correctamente' });
      } else {
        await userService.createUser({
          nombre: formData.nombre,
          correo: formData.correo,
          edad: formData.edad,
          password: formData.password,
          rol: 'empleado'
        });
        setMessage({ type: 'success', text: 'Empleado creado correctamente' });
      }
      setShowModal(false);
      await fetchAll();
    } catch (err) {
      console.error('Error en formulario empleado:', err);
      setMessage({ type: 'error', text: err?.message || 'Error al procesar la solicitud' });
    } finally {
      setFormLoading(false);
    }
  };

  const renderTable = (rows, title, rolKey) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5" />{title}</h3>
        <div className="text-sm text-gray-500">{rows.length} registros</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay registros</td>
              </tr>
            ) : (
              rows.map((user) => (
                <tr key={user.id || user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id || user._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nombre || user.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.edad ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><div className="flex items-center gap-2"><Mail className="w-4 h-4"/>{user.correo || user.email || '-'}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.rol || rolKey}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => openEditUser(user)} className="text-blue-600 hover:text-blue-900">Editar</button>
                      <button onClick={() => handleDelete(user.id || user._id, rolKey)} className="text-red-600 hover:text-red-900">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

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
            <UserCog className="w-6 h-6" />
            Gestión de Usuarios
          </h2>
          <p className="mt-1 text-sm text-gray-600">Visualiza empleados y clientes registrados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="px-4 py-2 bg-gray-100 rounded">Refrescar</button>
          <button onClick={openNewEmployee} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Nuevo Empleado
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {renderTable(empleados, 'Empleados', 'empleado')}
      {renderTable(clientes, 'Clientes', 'cliente')}

      {/* Modal Crear/Editar Empleado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{editingUser ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                  <input type="number" name="edad" value={formData.edad} onChange={handleFormChange} min="1" max="120" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" name="correo" value={formData.correo} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                    <input type="password" name="password" value={formData.password} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">Cancelar</button>
                  <button type="submit" disabled={formLoading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                    <Save className="w-5 h-5" />
                    {formLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;

