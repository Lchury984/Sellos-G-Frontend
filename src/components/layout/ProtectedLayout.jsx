import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const ProtectedLayout = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol?.toLowerCase())) {
    // Ruta consistente con AppRoutes (/no-autorizado)
    return <Navigate to="/no-autorizado" replace />;
  }
  
  return (
    <div className="h-screen w-full bg-gray-50 overflow-auto">
      {children}
    </div>
  );
};

export default ProtectedLayout;