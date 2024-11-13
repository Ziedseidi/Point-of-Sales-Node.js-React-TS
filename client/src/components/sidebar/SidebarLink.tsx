import { NavLink, useLocation } from 'react-router-dom';

interface SidebarLinkProps {
  path: string;
  title: string;
  icon: React.ReactNode; // Update the type here
}

const SidebarLink = ({ path, title, icon }: SidebarLinkProps) => {
  const { pathname } = useLocation();
  const isActive = pathname.includes(path);

  return (
    <li>
      <NavLink
        to={path}
        className={`group relative flex items-center gap-3 rounded-sm py-2 px-4 font-medium text-white duration-300 ease-in-out hover:bg-gray-700 ${
          isActive ? 'bg-gray-700' : ''
        }`}
      >
        {icon} {/* Render the icon */}
        {title}
      </NavLink>
    </li>
  );
};

export default SidebarLink;
