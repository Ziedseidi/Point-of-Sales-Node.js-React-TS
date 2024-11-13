import React from 'react';
import { IModule } from '../../../types_and_interfaces/module.interface';
import { Permission } from '../../../types_and_interfaces/permission.interface';
import { ModulePermission } from '../../../types_and_interfaces/ModulePermissions.interface';

interface ModulePermissionsTableProps {
  modules: IModule[];
  permissions: Permission[];
  value: ModulePermission[];
  onChange: (updatedPermissions: ModulePermission[]) => void;
}

const ModulePermissionsTable: React.FC<ModulePermissionsTableProps> = ({ modules, permissions, value, onChange }) => {
  // Define the dependency rules between permissions
  const permissionRules: Record<string, string[]> = {
    'create': ['read'],
    'update': ['read'],
    'delete': ['read'],
    'import': ['read'],
    'export': ['read'],
  };

  const handleCheckboxChange = (moduleId: string, permissionId: string, checked: boolean) => {
    let updatedPermissions = [...value];
    let modulePermissions = updatedPermissions.find(mp => mp.module === moduleId);

    if (checked) {
      // Add permission to the module
      if (modulePermissions) {
        if (!modulePermissions.permissions.includes(permissionId)) {
          modulePermissions.permissions.push(permissionId);
        }
      } else {
        updatedPermissions.push({
          module: moduleId,
          permissions: [permissionId],
        });
        modulePermissions = updatedPermissions.find(mp => mp.module === moduleId);
      }

      // Automatically check dependent permissions
      if (permissionRules[permissionId]) {
        const dependencies = permissionRules[permissionId];
        dependencies.forEach(dependencyId => {
          if (!modulePermissions?.permissions.includes(dependencyId)) {
            modulePermissions.permissions.push(dependencyId);
          }
        });
      }
    } else {
      if (permissionId === 'read') {
        // If 'read' is unchecked, remove all permissions from the module
        updatedPermissions = updatedPermissions.filter(mp => mp.module !== moduleId);
      } else {
        if (modulePermissions) {
          modulePermissions.permissions = modulePermissions.permissions.filter(p => p !== permissionId);

          // If no other permissions are left, remove the module
          if (modulePermissions.permissions.length === 0 || !modulePermissions.permissions.includes('read')) {
            updatedPermissions = updatedPermissions.filter(mp => mp.module !== moduleId);
          }
        }
      }
    }

    // Ensure that if 'read' is unchecked, all other permissions are unchecked
    if (permissionId === 'read' && !checked) {
      updatedPermissions = updatedPermissions.filter(mp => mp.module !== moduleId);
    }

    onChange(updatedPermissions);
  };

  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left">ModuleTable</th>
            {permissions.map((perm) => (
              <th key={perm._id} className="px-6 py-3 text-center">
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
                <td key={perm._id} className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    id={`${module._id}-${perm._id}`}
                    checked={
                      value.find(
                        (mp) =>
                          mp.module === module._id &&
                          mp.permissions.includes(perm._id)
                      ) !== undefined
                    }
                    onChange={(e) => handleCheckboxChange(module._id, perm._id, e.target.checked)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModulePermissionsTable;