import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from './components/forms/Container';
import Authentication from './views/Authentication';
import IMSHome from './views/IMS/ImsHomePage'; 
import POSHome from './views/POS/PosHomePage'; 
import PrivateRoute from './components/routing/Private_route/PrivateRoute'; 
import AdminDashboard from './views/Dash/AdminDashboard';
import AddUser from './views/Dash/Users/AddUser';
import Confirmation from './views/shared/Confirmation';
import VerifyEmail from './views/Dash/verify-email'; 
import ResetPassword from './views/Dash/ResetPassword';
import AssignRolePage from './views/Dash/Users/assignRolePage';
import ProtectedRoute from './components/routing/Private_route/AuthorizedRoute';

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/login" element={<Authentication />} />
          <Route path="/" element={<Authentication />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/ims-home" element={<PrivateRoute element={<IMSHome />} path="/login" />} />
          <Route path="/pos-home" element={<PrivateRoute element={<POSHome />} path="/login" />} />

          {/* Route pour vérifier l'email pour la réinitialisation du mot de passe */}
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Route pour réinitialiser le mot de passe */}
          <Route path="/password/reset-password/:token" element={<ResetPassword />} />
          
          {/* Route principale pour le Dashboard */}
          <Route path="/dashboard/*" element={<PrivateRoute element={<AdminDashboard />} path="/login" />}>
            <Route path="adduser" element={<ProtectedRoute element={<AddUser />} moduleName="users" permission="create" redirectTo="/unauthorized" />} />

            <Route path="confirmation" element={<Confirmation />} />

            
            
            <Route path="assign-role/:userName" element={<AssignRolePage />} />
            
          </Route>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
