import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/sidebar/adminsidebar';
import HeaderAdmin from '../../components/Header/AdminHeader';
import { Routes, Route } from "react-router-dom";
import AddUser from './Users/AddUser'; // Assurez-vous que le chemin est correct
import Cookies from 'js-cookie';
import AddRole from './Roles/addRole';
import ManageUsers from './Users/manageUsers';
import ManageRoles from './Roles/manageRoles';
import AssignPermissionsToRole from './Roles/AssignModulePermissions';
import ProfilePage from './Users/profile';
import ProtectedRoute from '../../components/routing/Private_route/AuthorizedRoute';
import { ModulePermission } from '../../types_and_interfaces/ModulePermissions.interface';
import Products from './Products/productslist';
import ProductCategoriesPage from './Products/product-categories';
import Variations from './Products/variations';
import Brands from './Products/brands';
import Units from './Products/units';
import BaseUnits from './Products/baseUnits';
import PrintBarcode from './Products/printBarcode';
import Adjustements from './Adjustements/adjustements';
import Quotations from './Quotations/quotations';
import AddProduct from './Products/addProduct';
import Purshases from './Purshases/purshases';
import PurshasesReturn from './Purshases/purshases_return';
import Sales from './Sales/sales';
import SalesReturn from './Sales/salesRetun';
import Transfers from './Transfers/transfers';
import Warehouse from './Warehouses/warhouses';
import Customers from './Customers/customer';
import CreateCustomer from './Customers/addCustomer';
import CreateSupplier from './Suppliers/addSupplier';
import Suppliers from './Suppliers/suppliers';





const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  

  return (
    <div className="flex h-screen">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex flex-col flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <HeaderAdmin />
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="py-4">
          <Routes>
            <Route path="adduser" element={<ProtectedRoute element={<AddUser />} moduleName="users" permission="create" redirectTo="/dashboard" />} />
            <Route path="addrole" element={<ProtectedRoute element={<AddRole />} moduleName="roles" permission="create" redirectTo="/dashboard" />} />
            <Route path="users" element={<ProtectedRoute element={<ManageUsers />} moduleName="users" permission="read" redirectTo="/dashboard" />} />
            <Route path="roles" element={<ProtectedRoute element={<ManageRoles />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="assignPermissions" element={<ProtectedRoute element={<AssignPermissionsToRole />} moduleName="roles" permission="update" redirectTo="/unauthorized" />} />
            <Route path="products" element={<Products />} />
            <Route path="product-categories" element={<ProductCategoriesPage />} />
            <Route path="variations" element={<ProtectedRoute element={<Variations />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="brands" element={<ProtectedRoute element={<Brands />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="units" element={<ProtectedRoute element={<Units />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="base-units" element={<ProtectedRoute element={<BaseUnits />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="print/barcode" element={<ProtectedRoute element={<PrintBarcode />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="adjustements" element={<ProtectedRoute element={<Adjustements />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="quotations" element={<ProtectedRoute element={<Quotations />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="addProduct" element={<ProtectedRoute element={<AddProduct />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="purshases" element={<ProtectedRoute element={<Purshases />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="purshases-return" element={<ProtectedRoute element={<PurshasesReturn />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="sales" element={<ProtectedRoute element={<Sales />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="sales-return" element={<ProtectedRoute element={<SalesReturn />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="transfers" element={<ProtectedRoute element={<Transfers />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="warehouses" element={<ProtectedRoute element={<Warehouse />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="customers" element={<ProtectedRoute element={<Customers />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="Addcustomer" element={<ProtectedRoute element={<CreateCustomer />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="Addsupplier" element={<ProtectedRoute element={<CreateSupplier />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>
            <Route path="suppliers" element={<ProtectedRoute element={<Suppliers />} moduleName="roles" permission="read" redirectTo="/dashboard" />}/>

</Routes>


          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;