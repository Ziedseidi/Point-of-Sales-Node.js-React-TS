import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarLink from './SidebarLink';

interface SidebarLinkGroupProps {
  path: string;
  icon: React.ReactNode; // Update the type here
  title: string;
  children: React.ReactNode;
}

const SidebarLinkGroup = ({ path, icon, title, children }: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  const isActive = location.pathname.includes(path);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li>
      <a
        href="#!"
        className={`group relative flex items-center gap-3 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out hover:bg-gray-700 ${
          isActive ? 'bg-gray-700' : ''
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {icon}
        {title}
        <svg
          className={`fill-current w-3 h-3 ml-auto transform ${
            open ? 'rotate-180' : ''
          }`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      {open && <ul className="mt-2 space-y-2 pl-4">{children}</ul>}
    </li>
  );
};

export default SidebarLinkGroup;
