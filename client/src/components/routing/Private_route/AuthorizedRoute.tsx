import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ModulePermission } from '../../../types_and_interfaces/ModulePermissions.interface';


interface CurrentUser {
  id: string;
  username: string;
  email: string;
  modulePermissions: ModulePermission[];
}

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await fetch('http://localhost:4000/api/current-user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user); // Assurez-vous que `data.user` est correctement formaté
        } else {
          console.error('Failed to fetch current user:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching the current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, loading };
};




interface ProtectedRouteProps {
  element: React.ReactElement;
  moduleName: string;
  permission: string;
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, moduleName, permission, redirectTo }) => {
  const { currentUser, loading } = useCurrentUser();

  if (loading) {
    return null; // or return a loading spinner or a placeholder
  }

  const hasPermission = currentUser?.role?.modulePermissions?.some(
    (modulePermission) =>
      modulePermission.module === moduleName &&
      modulePermission.permissions.includes(permission)
  );

  console.log(currentUser);
  console.log(`Checking permissionssssssssssssss for module: ${moduleName}, permission: ${permission}`);
  console.log(`Has permission: ${hasPermission}`);

  return hasPermission ? element : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;


