// DarkmodSwitch.js
import  { useState } from 'react';

const DarkmodSwitch = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="bg-gray-700 p-2 rounded-md flex items-center"
    >
      {darkMode ? (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v2m0 14v2m9-9h-2m-14 0H3m15.364-7.364l-1.414 1.414m-10.828 0L2.636 5.636m15.364 10.828l-1.414-1.414m-10.828 0L2.636 19.364"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v2m0 14v2m9-9h-2m-14 0H3m15.364-7.364l-1.414 1.414m-10.828 0L2.636 5.636m15.364 10.828l-1.414-1.414m-10.828 0L2.636 19.364"
          />
        </svg>
      )}
    </button>
  );
};

export default DarkmodSwitch;
