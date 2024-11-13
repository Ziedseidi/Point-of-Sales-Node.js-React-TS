import React from 'react';
import { User } from '../../../types_and_interfaces/User.interface';
import { Role } from '../../../types_and_interfaces/role.interface';
import ActionsMenu from './ActionMenu';

interface UserTableProps {
  users: User[];
  roles: Role[];
  actionsMenuOpen: string | null;
  onToggleActionsMenu: (userName: string) => void;
  onAssignRole: (userName: string) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onDisableUser: (userId: string, isDisabled: boolean) => void;
  roleSelectorRef: React.RefObject<HTMLDivElement>;
  actionsMenuRef: React.RefObject<HTMLDivElement>;
  isRoleSelectorOpen: boolean;
  onRoleSelection: (role: Role) => void;
  roleToAssign: Role | null;
  isModalOpen: boolean;
  isConfirmationModalOpen: boolean;
  onCloseConfirmationModal: () => void;
  onSaveRole: () => void;
  onCloseModal: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  userToDisable: string | null;
  onConfirmDisable: () => void;
  onCancelDisable: () => void;
  userToEdit: User | null;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  roles,
  actionsMenuOpen,
  onToggleActionsMenu,
  onAssignRole,
  onEditUser,
  onDeleteUser,
  onDisableUser,
  roleSelectorRef,
  actionsMenuRef,
  isRoleSelectorOpen,
  onRoleSelection,
  roleToAssign,
  isModalOpen,
  isConfirmationModalOpen,
  onCloseConfirmationModal,
  onSaveRole,
  onCloseModal,
  onConfirmDelete,
  onCancelDelete,
  userToDisable,
  onConfirmDisable,
  onCancelDisable,
  userToEdit,
}) => {
  return (
    <div className="relative mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.filter(user => user.role?.name !== 'admin').map(user => {
           const profilePhotoPath = user.profileImage
           ? `/uploads/${user.profileImage}`
           : 'https://via.placeholder.com/150';
         
            
            return (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={profilePhotoPath}
                    alt={user.userName}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role?.name || 'Unassigned'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.isDisabled ? 'Inactive' : 'Active'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ActionsMenu
                    user={user}
                    actionsMenuOpen={actionsMenuOpen}
                    onToggleActionsMenu={onToggleActionsMenu}
                    onAssignRole={onAssignRole}
                    onEditUser={onEditUser}
                    onDeleteUser={onDeleteUser}
                    onDisableUser={onDisableUser}
                    actionsMenuRef={actionsMenuRef}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isRoleSelectorOpen && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg" ref={roleSelectorRef}>
          <ul className="py-1">
            {roles.map(role => (
              <li key={role._id}>
                <button
                  onClick={() => onRoleSelection(role)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  {role.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserTable;
