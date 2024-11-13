// src/views/Dash/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('token');

        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:4000/api/current-user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen mt-12" >
      {/* Profile Header */}
      <div className="bg-gray-800 text-white py-8">
        <div className="container mx-auto flex flex-col items-center">
          <img
            src={user.profileImage || '/default-profile.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-4xl font-bold mt-4">{user.userName}</h1>
          <p className="text-lg mt-2">{user.role?.name || 'Role not assigned'}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Phone:</span>
              <span className="text-gray-800">{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Date of Birth:</span>
              <span className="text-gray-800">{new Date(user.dateOfBirth).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
          <div className="flex space-x-4">
            <button className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
              Edit Profile
            </button>
            <button className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
            Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
