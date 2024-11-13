import React, { useState, useEffect, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';
import { FaUserTag, FaTrashAlt, FaEdit, FaPowerOff, FaEllipsisV } from 'react-icons/fa';
import EditUserForm from './editUserForm';
import { User } from '../../../types_and_interfaces/User.interface'; // Import User interface
import { Role } from '../../../types_and_interfaces/role.interface'; // Import User interface
import UserTable from './UserTable';
import{ConfirmationModal} from "../../../components/forms/confirmationModal";




const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToDisable, setUserToDisable] = useState<string | null>(null);
  const [roleToAssign, setRoleToAssign] = useState<Role | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const roleSelectorRef = useRef<HTMLDivElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const usersResponse = await fetch('http://localhost:4000/api/users', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const rolesResponse = await fetch('http://localhost:4000/api/roles', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (usersResponse.ok && rolesResponse.ok) {
          const usersData = await usersResponse.json();
          const rolesData = await rolesResponse.json();
          setUsers(usersData);
          setRoles(rolesData);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching users or roles:', error);
      }
    };

    fetchData();
  }, []);

  const handleRoleSelection = (role: Role) => {
    setRoleToAssign(role);
    setIsConfirmationModalOpen(true); // Open confirmation modal
  };

  const handleAssignRole = (userName: string) => {
    setSelectedUserName(userName);
    setIsRoleSelectorOpen(true);
  };

  const handleSaveRole = async () => {
    if (selectedUserName && roleToAssign) {
      try {
        const token = Cookies.get('token');
        const response = await fetch('http://localhost:4000/api/assign-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userName: selectedUserName,
            roleName: roleToAssign.name,
          }),
        });

        if (response.ok) {
          const updatedUsers = users.map(user =>
            user.userName === selectedUserName ? { ...user, role: roleToAssign } : user
          );
          setUsers(updatedUsers);
          setSelectedRole(null);
          setSelectedUserName(null);
        } else {
          console.error('Failed to assign role');
        }
      } catch (error) {
        console.error('Error assigning role:', error);
      } finally {
        setIsConfirmationModalOpen(false);
        setRoleToAssign(null);
      }
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`http://localhost:4000/api/users/${userToDelete}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const updatedUsers = users.filter(user => user._id !== userToDelete);
          setUsers(updatedUsers);
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleDisableUser = async (userId: string, isDisabled: boolean) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:4000/api/disable/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isDisabled: !isDisabled }),
      });

      if (response.ok) {
        const updatedUsers = users.map(user =>
          user._id === userId ? { ...user, isDisabled: !isDisabled } : user
        );
        setUsers(updatedUsers);
        setUserToDisable(null);
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const cancelDisable = () => {
    setUserToDisable(null);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      roleSelectorRef.current &&
      !roleSelectorRef.current.contains(event.target as Node) &&
      actionsMenuRef.current &&
      !actionsMenuRef.current.contains(event.target as Node)
    ) {
      setIsRoleSelectorOpen(false);
      setActionsMenuOpen(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleActionsMenu = (userName: string) => {
    if (actionsMenuOpen === userName) {
      setActionsMenuOpen(null);
    } else {
      setActionsMenuOpen(userName);
    }
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
  };

  const closeEditForm = () => {
    setUserToEdit(null);
  };

  const handleSaveEdit = (updatedUser: User) => {
    const updatedUsers = users.map(user => (user._id === updatedUser._id ? updatedUser : user));
    setUsers(updatedUsers);
    closeEditForm();
  };

  return (
    <div className="relative mt-12 pt-10"> {/* Added margin-top */}
      <UserTable
        users={users}
        roles={roles}
        actionsMenuOpen={actionsMenuOpen}
        onToggleActionsMenu={toggleActionsMenu}
        onAssignRole={handleAssignRole}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onDisableUser={handleDisableUser}
        roleSelectorRef={roleSelectorRef}
        actionsMenuRef={actionsMenuRef}
        isRoleSelectorOpen={isRoleSelectorOpen}
        onRoleSelection={handleRoleSelection}
        roleToAssign={roleToAssign}
        isModalOpen={isModalOpen}
        isConfirmationModalOpen={isConfirmationModalOpen}
        onCloseConfirmationModal={() => setIsConfirmationModalOpen(false)}
        onSaveRole={handleSaveRole}
        onCloseModal={() => setIsModalOpen(false)}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
        userToDisable={userToDisable}
        onConfirmDisable={() => userToDisable && handleDisableUser(userToDisable, users.find(user => user._id === userToDisable)!.isDisabled)}
        onCancelDisable={cancelDisable}
        userToEdit={userToEdit}
      />
      {userToEdit && (
        <EditUserForm
          user={userToEdit}
          onClose={closeEditForm}
          onSave={handleSaveEdit}
        />
      )}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={() => roleToAssign && handleSaveRole()}
        onCancel={() => setIsConfirmationModalOpen(false)}
        message={`Are you sure you want to assign the role "${roleToAssign?.name}"?`}
        icon={<FaUserTag />}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
        message={`Are you sure you want to delete this user?`}
        icon={<FaTrashAlt />}
        confirmButtonText="Delete"
      />
      <ConfirmationModal
        isOpen={!!userToDisable}
        onConfirm={() => userToDisable && handleDisableUser(userToDisable, users.find(user => user._id === userToDisable)!.isDisabled)}
        onCancel={cancelDisable}
        message={`Are you sure you want to ${users.find(user => user._id === userToDisable)?.isDisabled ? 'enable' : 'disable'} this user?`}
        icon={<FaPowerOff />}
        confirmButtonText="Confirm"
      />"
    </div>
   
  );
};

export default ManageUsers;
