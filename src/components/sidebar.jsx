// src/components/Sidebar.jsx
import {
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ title, role, menuSections = [] }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo y título */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Sellos-G</h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{role}</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuSections.map((section, index) => (
            <div key={index} className="mt-4">
              <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">
                {section.title}
              </p>
              {section.items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href || "#"}
                  className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Perfil de usuario */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nombre}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="ml-2 flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
