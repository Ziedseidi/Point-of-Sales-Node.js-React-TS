import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

interface Module {
  _id: string;
  name: string;
}

interface Permission {
  _id: string;
  name: string;
}

interface ModulePermission {
  module: string;
  permissions: string[];
}

interface FormData {
  roleId: string;
  modulePermissions: ModulePermission[];
}

const AssignPermissionsToRole = () => {
  const location = useLocation();
  const roleId = location.state?.roleId;
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roleName, setRoleName] = useState<string>('');
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      roleId: roleId || '',
      modulePermissions: [],
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modulesRes = await fetch('http://localhost:4000/api/modules', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        if (!modulesRes.ok) {
          throw new Error(`Failed to fetch modules: ${modulesRes.statusText}`);
        }

        const modulesData = await modulesRes.json();
        setModules(modulesData);

        const permissionsRes = await fetch('http://localhost:4000/api/permissions', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
          },
        });

        if (!permissionsRes.ok) {
          throw new Error(`Failed to fetch permissions: ${permissionsRes.statusText}`);
        }

        const permissionsData = await permissionsRes.json();
        setPermissions(permissionsData);

        // Fetch role name
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

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [roleId]);

  useEffect(() => {
    if (modules.length && permissions.length) {
      const newModulePermissions = modules.map((module) => ({
        module: module._id,
        permissions: [],
      }));
      setValue("modulePermissions", newModulePermissions);
    }
  }, [modules, permissions, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('http://localhost:4000/api/module-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({ modulePermissions: data.modulePermissions }),
      });
  
      const responseText = await response.text();
  
      if (!response.ok) {
        console.error('Server Error:', responseText);
        throw new Error(`Server responded with status ${response.status}`);
      }
  
      const responseData = JSON.parse(responseText);
  
      const modulePermissionIds = responseData.map((mp: any) => mp._id);
  
      const assignPermissionsResponse = await fetch('http://localhost:4000/api/assign-module-permissionsToRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({ roleId: data.roleId, modulePermissionIds }),
      });
  
      if (!assignPermissionsResponse.ok) {
        const assignPermissionsText = await assignPermissionsResponse.text();
        console.error('Server Error:', assignPermissionsText);
        throw new Error(`Failed to assign permissions: ${assignPermissionsText}`);
      }
  
      navigate('/dashboard/roles');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 space-y-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
          Assign Permissions to Role
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
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

          <div className="col-span-1">
            <Controller
              name="modulePermissions"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="space-y-4">
                  {modules.length && permissions.length ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3">Module</th>
                            {permissions.map((perm) => (
                              <th key={perm._id} className="px-6 py-3">
                                {perm.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {modules.map((module) => (
                            <tr key={module._id}>
                              <td className="px-6 py-4">{module.name}</td>
                              {permissions.map((perm) => (
                                <td key={perm._id} className="px-6 py-4">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedPermissions = [...value];
                                      const index = updatedPermissions.findIndex(
                                        (mp: ModulePermission) => mp.module === module._id
                                      );

                                      if (index !== -1) {
                                        const permissions = updatedPermissions[index].permissions;
                                        if (permissions.includes(perm._id)) {
                                          updatedPermissions[index].permissions = permissions.filter(
                                            (p) => p !== perm._id
                                          );
                                        } else {
                                          updatedPermissions[index].permissions.push(perm._id);
                                        }
                                      } else {
                                        updatedPermissions.push({
                                          module: module._id,
                                          permissions: [perm._id],
                                        });
                                      }

                                      onChange(updatedPermissions);
                                    }}
                                    className={`p-2 rounded-md text-white font-bold ${
                                      value.find(
                                        (mp: ModulePermission) =>
                                          mp.module === module._id &&
                                          mp.permissions.includes(perm._id)
                                      )
                                        ? 'bg-blue-500'
                                        : 'bg-gray-500'
                                    }`}
                                  >
                                    {value.find(
                                      (mp: ModulePermission) =>
                                        mp.module === module._id &&
                                        mp.permissions.includes(perm._id)
                                    )
                                      ? 'On'
                                      : 'Off'}
                                  </button>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>Loading modules and permissions...</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AssignPermissionsToRole;
