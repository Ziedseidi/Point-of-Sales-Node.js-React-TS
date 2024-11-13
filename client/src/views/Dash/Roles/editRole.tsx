import React, { useState, useEffect } from 'react';
import { Role } from '../../../types_and_interfaces/role.interface';
import Cookies from 'js-cookie';

interface EditRolePopupProps {
  role: Role | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRole: Role) => void;
}

const EditRolePopup: React.FC<EditRolePopupProps> = ({ role, isOpen, onClose, onSave }) => {
  const [roleName, setRoleName] = useState(role?.name || '');
  const [roleDescription, setRoleDescription] = useState(role?.description || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setRoleDescription(role.description);
    }
  }, [role]);

  const handleSave = async () => {
    if (!roleName || !roleDescription) {
      setError('Both fields are required.');
      return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:4000/api/roles/${role?._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roleName,
          description: roleDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      const updatedRole = await response.json();
      onSave(updatedRole);
      onClose();
    } catch (error) {
      setError('Failed to update role');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Role</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Role Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Role Description</label>
          <input
            type="text"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRolePopup;
