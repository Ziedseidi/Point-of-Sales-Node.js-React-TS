import React, { useEffect, useState } from 'react';
import { FaUserTag, FaTrashAlt, FaEdit, FaPowerOff, FaEllipsisV } from 'react-icons/fa';
import { User } from '../../../types_and_interfaces/User.interface'; // Import User interface
import Cookies from 'js-cookie';
import { ModulePermission } from '../../../types_and_interfaces/ModulePermissions.interface';

// Définition de l'interface pour les permissions des modules


// Définition de l'interface pour l'utilisateur courant
interface CurrentUser {
  id: string;
  username: string;
  email: string;
  modulePermissions: ModulePermission[];
}

// Hook personnalisé pour obtenir l'utilisateur courant


// Fonction pour vérifier les permissions


interface ActionsMenuProps {
  user: User;
  actionsMenuOpen: string | null;
  onToggleActionsMenu: (userName: string) => void;
  onAssignRole: (userName: string) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onDisableUser: (userId: string, isDisabled: boolean) => void;
  actionsMenuRef: React.RefObject<HTMLDivElement>;
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

const ActionsMenu: React.FC<ActionsMenuProps> = ({
  user,
  actionsMenuOpen,
  onToggleActionsMenu,
  onAssignRole,
  onEditUser,
  onDeleteUser,
  onDisableUser,
  actionsMenuRef,
}) => {

  
  const { currentUser } = useCurrentUser();
  const hasPermission = (moduleName: string, permission: string) => {
    return currentUser?.role?.modulePermissions?.some(
      (modulePermission) =>
        modulePermission.module === moduleName &&
        modulePermission.permissions.includes(permission)
    );
  };

  console.log(currentUser);



  return (
    <div className="relative" ref={actionsMenuRef}>
      <button
        onClick={() => onToggleActionsMenu(user.userName)}
        className="text-gray-500 hover:text-gray-900"
        aria-label="Actions"
      >
        <FaEllipsisV />
      </button>
      {actionsMenuOpen === user.userName && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
          {hasPermission('users', 'update') && (
              <li>
                <button
                  onClick={() => onAssignRole(user.userName)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaUserTag className="inline mr-2" /> Assign Role
                </button>
              </li>
            )}
            {hasPermission('users', 'update') && (
              <li>
                <button
                  onClick={() => onEditUser(user)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaEdit className="inline mr-2" /> Edit User
                </button>
              </li>
            )}
            {hasPermission('users', 'update') && (
              <li> 
                <button
                  onClick={() => onDisableUser(user._id, user.isDisabled)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaPowerOff className="inline mr-2" />
                  {user.isDisabled ? 'Enable User' : 'Disable User'}
                </button>
              </li>
            )}
            {hasPermission('users', 'delete') && (
              <li>
                <button
                  onClick={() => onDeleteUser(user._id)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaTrashAlt className="inline mr-2" /> Delete User
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;
