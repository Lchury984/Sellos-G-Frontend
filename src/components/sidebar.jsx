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
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-2xl">
      <div className="flex flex-col h-full">
        {/* Logo y título */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Sellos-G</h1>
          <p className="text-sm text-slate-400 mt-1 capitalize font-medium">{role}</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuSections.map((section, index) => (
            <div key={index} className="mt-4">
              <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {section.title}
              </p>
              {section.items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href || "#"}
                  className={`flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-all duration-300 group mb-1 border border-transparent hover:border-blue-500/30`}
                >
                  <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Perfil de usuario */}
        <div className="p-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
          <div className="flex items-center">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.nombre}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="ml-2 flex items-center justify-center p-2 text-red-400 hover:bg-red-500/20 rounded-xl hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/30"
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
