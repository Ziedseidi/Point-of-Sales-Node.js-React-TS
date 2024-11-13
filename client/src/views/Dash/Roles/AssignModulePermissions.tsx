import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import ModulePermissionsTable from './PermissionsTable';
import { ModulePermission } from '../../../types_and_interfaces/ModulePermissions.interface';

interface FormData {
  roleId: string;
  modulePermissions: ModulePermission[];
}

// Example static data for modules and permissions
const staticModules = [
  { _id: 'users', name: 'Users' },
  { _id: 'roles', name: 'Roles' },
  // Add other static modules here
];

const staticPermissions = [
  { _id: 'create', name: 'Create' },
  { _id: 'read', name: 'Read' },
  { _id: 'update', name: 'Update' },
  { _id: 'delete', name: 'Delete' },
  { _id: 'import', name: 'Import' },
  { _id: 'export', name: 'Export' },
  // Add other static permissions here
];

const AssignPermissionsToRole = () => {
  const location = useLocation();
  const roleId = location.state?.roleId;
  const [roleName, setRoleName] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      roleId: roleId || '',
      modulePermissions: [],
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const roleRes = await fetch(`http://localhost:4000/api/roles/${roleId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        if (!roleRes.ok) {
          throw new Error(`Failed to fetch role: ${roleRes.statusText}`);
        }

        const roleData = await roleRes.json();
        setRoleName(roleData.name);

        // Fetch existing module permissions for the role
        const modulePermissionsRes = await fetch(`http://localhost:4000/api/roles/${roleId}`, {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        if (!modulePermissionsRes.ok) {
          throw new Error(`Failed to fetch module permissions: ${modulePermissionsRes.statusText}`);
        }

        const modulePermissionsData = await modulePermissionsRes.json();
        setValue("modulePermissions", modulePermissionsData.modulePermissions || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRoleData();
  }, [roleId, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const modulePermissionsWithIds = data.modulePermissions.map(permission => ({
        ...permission,
        moduleId: staticModules.find(module => module.name === permission.moduleName)?._id,
        permissionId: staticPermissions.find(perm => perm.name === permission.permissionName)?._id,
      }));

      const response = await fetch('http://localhost:4000/api/assign-module-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          roleId: data.roleId,
          modulePermissions: modulePermissionsWithIds,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Server Error:', responseText);
        throw new Error(`Server responded with status ${response.status}`);
      }

      setSuccessMessage('Permissions assigned successfully! 👍');

      setTimeout(() => {
        navigate('/dashboard/roles');
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
        Assign Permissions to Role
      </h1>
      {successMessage && (
        <div className="flex flex-col items-center justify-center p-6 mb-6 text-center bg-green-50 border border-green-400 rounded-lg dark:bg-gray-800 dark:border-green-600 animate-bounce">
          <svg
            className="w-16 h-16 text-green-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m-4-4h8"
            />
          </svg>
          <p className="mt-4 text-2xl font-semibold text-green-800 dark:text-green-400">
            {successMessage}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            id="roleId"
            type="text"
            value={roleName || 'Loading...'}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled
          />
        </div>
        <Controller
          name="modulePermissions"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ModulePermissionsTable
              modules={staticModules}
              permissions={staticPermissions}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignPermissionsToRole;
