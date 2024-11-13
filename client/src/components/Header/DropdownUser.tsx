import React, { useState, useEffect } from 'react';
import LogoutButton from '../../components/forms/logoutBtn';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // Utilisé pour la navigation

const DropdownUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook de navigation

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
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.userName); // Assuming `data.user.userName` is the path to username
          setProfileImage(data.user.profileImage ? `/uploads/${data.user.profileImage}` : 'https://via.placeholder.com/150');
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const goToProfile = () => {
    navigate('/dashboard/profile'); // Redirige vers la page du profil
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-white text-black p-2 rounded-md flex items-center space-x-2"
      >
        {profileImage && (
          <img
            src={profileImage}
            alt={userName}
            className="w-8 h-8 object-cover rounded-full"
          />
        )}
        <span>{userName || 'User Name'}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
          <ul className="py-1">
            <li>
              <button
                onClick={goToProfile} // Redirection vers le profil
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l-2 2m0 0l-2-2m2 2V10a4 4 0 118 0v6m-6 6a9 9 0 11-9-9 9 9 0 019 9z"
                  />
                </svg>
                Profile
              </button>
            </li>
            <li>
              <a
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zM12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 6c-3.87 0-7-3.13-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2c0 3.87-3.13 7-7 7zm-5-7c0-.64.11-1.26.29-1.83L2.5 5.5 3.5 4.5l5.22 5.22C8.61 9.73 9 10.84 9 12s-.39 2.27-1.28 3.28L3.5 17.5l-1-1 4.8-4.8c.18-.57.29-1.19.29-1.83zM12 6c-2.76 0-5 2.24-5 5h-2c0-3.87 3.13-7 7-7s7 3.13 7 7h-2c0-2.76-2.24-5-5-5z"
                  />
                </svg>
                Settings
              </a>
            </li>
            <li>
              <div className="border-t border-gray-200">
                <LogoutButton />
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
