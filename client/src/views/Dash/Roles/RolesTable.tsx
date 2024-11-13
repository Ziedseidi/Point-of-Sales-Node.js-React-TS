import React, { useEffect, useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { Role } from '../../../types_and_interfaces/role.interface';
import Cookies from 'js-cookie';
import { ModulePermission } from '../../../types_and_interfaces/ModulePermissions.interface';

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  modulePermissions: ModulePermission[];
}

interface RoleTableProps {
  roles: Role[];
  openDropdown: number | null;
  toggleDropdown: (index: number) => void;
  handleActionClick: (roleId: string, action: string) => void;
}

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

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
          console.log('Fetched user data:', data); // Ajouté pour voir la réponse API
          setCurrentUser(data.user); // Modifié pour accéder à data.user
        } else {
          console.error('Failed to fetch current user:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching the current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser };
};

const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  openDropdown,
  toggleDropdown,
  handleActionClick,
}) => {


  const { currentUser } = useCurrentUser();
  const hasPermission = (moduleName: string, permission: string) => {
    const result= currentUser?.role?.modulePermissions?.some(
      (modulePermission) =>
        modulePermission.module === moduleName &&
        modulePermission.permissions.includes(permission)
    );
    console.log(currentUser);
    console.log(`Checking permission for module: ${moduleName}, permission: ${permission}`);
    console.log(`Has permission: ${result}`);
    return result;
  };
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
        {roles.map((role, index) => (
          <tr key={role._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{role.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{role.description}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="relative inline-block text-left">
                <button type="button" onClick={() => toggleDropdown(index)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <FaEllipsisV className="w-5 h-5" />
                </button>
                {openDropdown === index && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                    {hasPermission('roles', 'update') && (<button onClick={() => handleActionClick(role._id, 'edit')} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Edit Role</button>)}
                    {hasPermission('roles', 'update') && (<button onClick={() => handleActionClick(role._id, 'add-permissions')} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Assign Permissions</button>)}
                    {hasPermission('roles', 'delete') && (<button onClick={() => handleActionClick(role._id, 'delete')} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Delete Role</button>)}
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoleTable;
