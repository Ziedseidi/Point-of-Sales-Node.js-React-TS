import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Role } from '../../../types_and_interfaces/role.interface';

const AssignRolePage: React.FC = () => {
  const { userName } = useParams<{ userName: string }>();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = Cookies.get('token');
        const response = await fetch('http://localhost:4000/api/roles', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const rolesData = await response.json();
          setRoles(rolesData);
        } else {
          console.error('Failed to fetch roles');
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleCheckboxChange = (roleName: string) => {
    setSelectedRoles(prevSelectedRoles => {
      const updatedRoles = new Set(prevSelectedRoles);
      if (updatedRoles.has(roleName)) {
        updatedRoles.delete(roleName);
      } else {
        updatedRoles.add(roleName);
      }
      return updatedRoles;
    });
  };

  const handleAssignRoles = async () => {
    if (userName && selectedRoles.size > 0) {
      try {
        const token = Cookies.get('token');
        const response = await fetch('http://localhost:4000/api/assign-roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userName: userName,
            roleNames: Array.from(selectedRoles),
          }),
        });

        if (response.ok) {
          navigate('/manage-users'); // Redirect to ManageUsers page after success
        } else {
          console.error('Failed to assign roles');
        }
      } catch (error) {
        console.error('Error assigning roles:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assign Roles to {userName}</h1>
      <div className="mb-4">
        {roles.length === 0 ? (
          <p>Loading roles...</p>
        ) : (
          <div>
            {roles.map(role => (
              <div key={role._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`role-${role._id}`}
                  name="roles"
                  value={role.name}
                  checked={selectedRoles.has(role.name)}
                  onChange={() => handleCheckboxChange(role.name)}
                  className="mr-2"
                />
                <label htmlFor={`role-${role._id}`} className="text-sm text-gray-700">{role.name}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={handleAssignRoles}
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
      >
        Assign Roles
      </button>
    </div>
  );
};

export default AssignRolePage;
