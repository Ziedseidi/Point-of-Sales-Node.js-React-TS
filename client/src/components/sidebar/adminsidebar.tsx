import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarHeader from './SidebarHeader';
import SidebarLinkGroup from './SidebarLinkGroup';
import SidebarLink from './SidebarLink';
import { HomeIcon, UserGroupIcon, TagIcon, PlusIcon } from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface ModulePermission {
  module: string;
  permissions: string[];
}

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  modulePermissions: ModulePermission[];
}

// Hook to fetch the current user
const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

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
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched user data:', data); // Ajouté pour voir la réponse API
          setCurrentUser(data.user); // Modifié pour accéder à data.user
        } else {
          console.error('Failed to fetch current user:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching the current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser };
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const sidebar = useRef<HTMLDivElement>(null);

  const { currentUser } = useCurrentUser();

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const hasModuleAccess = (moduleName: string) => {
    return currentUser?.role?.modulePermissions?.some(
      (modulePermission) => modulePermission.module === moduleName
    );
  };

  const hasPermission = (moduleName: string, permission: string) => {
    return currentUser?.role?.modulePermissions?.some(
      (modulePermission) =>
        modulePermission.module === moduleName &&
        modulePermission.permissions.includes(permission)
    );
  };

  return (
    <aside
      ref={sidebar}
      className={`fixed left-0 top-0 z-9999 h-screen w-64 flex flex-col overflow-y-auto bg-gray-800 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <SidebarHeader setSidebarOpen={setSidebarOpen} />
      <nav className="mt-5 px-4">
        <ul className="space-y-2">
          <SidebarLinkGroup
            path="/dashboard"
            icon={<HomeIcon className="w-5 h-5" />}
            title="Identity and Access Management"
          >
            {hasModuleAccess('users') && (
              <SidebarLinkGroup
                path="/dashboard/manage-users"
                icon={<UserGroupIcon className="w-5 h-5" />}
                title="Manage Users"
              >
                {hasPermission('users', 'create') && (
                  <SidebarLink
                    path="/dashboard/adduser"
                    title="Add User"
                    icon={<PlusIcon className="w-5 h-5" />}
                  />
                )}
                {hasPermission('users', 'read') && (
                  <SidebarLink
                    path="/dashboard/users"
                    title="Users List"
                    icon={<UserGroupIcon className="w-5 h-5" />}
                  />
                )}
              </SidebarLinkGroup>
            )}
            {hasModuleAccess('roles') && (
              <SidebarLinkGroup
                path="/dashboard/manage-roles"
                icon={<TagIcon className="w-5 h-5" />}
                title="Manage Roles"
              >
                {hasPermission('roles', 'create') && (
                  <SidebarLink
                    path="/dashboard/addrole"
                    title="Add Role"
                    icon={<PlusIcon className="w-5 h-5" />}
                  />
                )}
                {hasPermission('roles', 'read') && (
                  <SidebarLink
                    path="/dashboard/roles"
                    title="Roles List"
                    icon={<TagIcon className="w-5 h-5" />}
                  />
                )}
              </SidebarLinkGroup>
            )}
          </SidebarLinkGroup>

          <SidebarLinkGroup
            path="/dashboard"
            icon={<HomeIcon className="w-5 h-5" />}
            title="Products"
          >
  
            {hasPermission('users', 'create') && (
              <SidebarLink
                path="/dashboard/products"
                title="Products list"
                icon={<PlusIcon className="w-5 h-5" />}
              />
            )}
            {hasPermission('users', 'read') && (
              <SidebarLink
                path="/dashboard/product-categories"
                title="Product categories"
                icon={<UserGroupIcon className="w-5 h-5" />}
              />
            )}
            {hasPermission('users', 'read') && (
              <SidebarLink
                path="/dashboard/variations"
                title="Variations"
                icon={<UserGroupIcon className="w-5 h-5" />}
              />
            )}
            {hasPermission('users', 'read') && (
              <SidebarLink
                path="/dashboard/brands"
                title="Brands"
                icon={<UserGroupIcon className="w-5 h-5" />}
              />
            )}
            {hasPermission('users', 'read') && (
              <SidebarLink
                path="/dashboard/units"
                title="Units"
                icon={<UserGroupIcon className="w-5 h-5" />}
              />
            )}
            {hasPermission('users', 'read') && (
              <SidebarLink
                path="/dashboard/base-units"
                title="Base units"
                icon={<UserGroupIcon className="w-5 h-5" />}
              />
            )}
            {hasPermission('users', 'read') && (
              <SidebarLink
                path="/dashboard/print/barcode"
                title="Print Barcode"
                icon={<UserGroupIcon className="w-5 h-5" />}
              />
            )}
          </SidebarLinkGroup>
          {hasPermission('users', 'read') && (
              <SidebarLink
                path="/dashboard/adjustements"
                title="Adjustements"
                icon={<UserGroupIcon className="w-5 h-5" />}
              />
            )}
          {hasPermission('users', 'read') && (
              <SidebarLink
                path="/dashboard/quotations"
                title="Quotations"
                icon={<UserGroupIcon className="w-5 h-5" />}
              />
            )}
            {hasModuleAccess('roles') && (
              <SidebarLinkGroup
                path="/dashboard"
                icon={<TagIcon className="w-5 h-5" />}
                title="Purshases"
              >
                {hasPermission('roles', 'create') && (
                  <SidebarLink
                    path="/dashboard/purshases"
                    title="Purshases list"
                    icon={<PlusIcon className="w-5 h-5" />}
                  />
                )}
                {hasPermission('roles', 'read') && (
                  <SidebarLink
                    path="/dashboard/purshases-return"
                    title="Purshases return"
                    icon={<TagIcon className="w-5 h-5" />}
                  />
                )}
              </SidebarLinkGroup>
            )}
            {hasModuleAccess('roles') && (
              <SidebarLinkGroup
                path="/dashboard"
                icon={<TagIcon className="w-5 h-5" />}
                title="Sales"
              >
                {hasPermission('roles', 'create') && (
                  <SidebarLink
                    path="/dashboard/sales"
                    title="Sales list"
                    icon={<PlusIcon className="w-5 h-5" />}
                  />
                )}
                {hasPermission('roles', 'read') && (
                  <SidebarLink
                    path="/dashboard/sales-return"
                    title="Sales return"
                    icon={<TagIcon className="w-5 h-5" />}
                  />
                )}
              </SidebarLinkGroup>
              
            )}
            {hasPermission('roles', 'create') && (
                <SidebarLink
                  path="/dashboard/transfers"
                  title="Transfers"
                  icon={<PlusIcon className="w-5 h-5" />}
                />
              )}
            {hasPermission('roles', 'create') && (
                <SidebarLink
                  path="/dashboard/warehouses"
                  title="Warehouses"
                  icon={<PlusIcon className="w-5 h-5" />}
                />
              )}
              {hasModuleAccess('roles') && (
              <SidebarLinkGroup
                path="/dashboard"
                icon={<TagIcon className="w-5 h-5" />}
                title="Peoples"
              >
                {hasPermission('roles', 'create') && (
                  <SidebarLink
                    path="/dashboard/customers"
                    title="Customers"
                    icon={<PlusIcon className="w-5 h-5" />}
                  />
                )}
                {hasPermission('roles', 'read') && (
                  <SidebarLink
                    path="/dashboard/suppliers"
                    title="Suppliers"
                    icon={<TagIcon className="w-5 h-5" />}
                  />
                )}
              </SidebarLinkGroup>
            )}

            
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
