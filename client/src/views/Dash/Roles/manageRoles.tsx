import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import RoleTable from './RolesTable';
import EditRolePopup from './editRole';
import { Role } from '../../../types_and_interfaces/role.interface';

const ManageRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await fetch('http://localhost:4000/api/roles', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }

        const rolesData = await response.json();
        setRoles(rolesData);
      } catch (error) {
        setError('Failed to load roles');
        console.error(error);
      }
    };

    fetchRoles();
  }, []);

  const handleActionClick = async (roleId: string, action: string) => {
    const role = roles.find((r) => r._id === roleId);

    if (action === 'edit' && role) {
      setSelectedRole(role);
      setIsModalOpen(true);
    } else if (action === 'add-permissions') {
      navigate('/dashboard/assignPermissions', { state: { roleId } });
    } else if (action === 'delete') {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await fetch(`http://localhost:4000/api/roles/${roleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete role');
        }

        // Remove the deleted role from the state
        setRoles(prevRoles => prevRoles.filter(role => role._id !== roleId));
        console.log('Role deleted successfully');
      } catch (error) {
        setError('Failed to delete role');
        console.error(error);
      }
    }
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleRoleSave = (updatedRole: Role) => {
    setRoles(prevRoles => prevRoles.map(role => role._id === updatedRole._id ? updatedRole : role));
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Roles</h1>
        {error && <p className="text-red-500">{error}</p>}
        <RoleTable
          roles={roles}
          openDropdown={openDropdown}
          toggleDropdown={toggleDropdown}
          handleActionClick={handleActionClick}
        />
      </div>
      <EditRolePopup
        isOpen={isModalOpen}
        onClose={handleModalClose}
        role={selectedRole}
        onSave={handleRoleSave}
      />
    </section>
  );
};

export default ManageRoles;
